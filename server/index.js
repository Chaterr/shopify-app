require('isomorphic-fetch');
require('dotenv').config();

const express = require('express');
const session = require('express-session');

const RedisStore = require('connect-redis')(session);
const path = require('path');
const logger = require('morgan');

const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
// const config = require('../config/webpack.prod.js');
const config = require('../config/webpack.config.js');

const bodyParser = require('body-parser');
const Shopify = require('shopify-prime');

const cookieParser = require('cookie-parser');

let ua = require('universal-analytics');

const {
  SHOPIFY_APP_KEY,
  SHOPIFY_APP_HOST,
  SHOPIFY_APP_SECRET,
  CHATERR_API_URL,
  GA_INSTALLATION,
  NODE_ENV,
} = process.env;

let visitor = ua(GA_INSTALLATION);

const redirectUrl = `${SHOPIFY_APP_HOST}/shopify/auth/callback`;

const permissions = ["read_products", "read_orders", "read_customers", "read_fulfillments", "read_script_tags", "write_script_tags", "read_all_orders", "read_price_rules", "write_price_rules"];

const app = express();
const isDevelopment = NODE_ENV !== 'production';

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(logger('dev'));
app.use(cookieParser());
app.use(
  session({
    store: isDevelopment ? undefined : new RedisStore(),
    secret: SHOPIFY_APP_SECRET,
    resave: true,
    saveUninitialized: false,
  })
);

// Run webpack hot reloading in dev
if (isDevelopment) {
  const compiler = webpack(config);
  const middleware = webpackMiddleware(compiler, {
    hot: true,
    inline: true,
    publicPath: config.output.publicPath,
    contentBase: 'src',
    stats: {
      colors: true,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false,
      modules: false,
    },
  });

  app.use(middleware);
  app.use(webpackHotMiddleware(compiler));
} else {
  const staticPath = path.resolve(__dirname, '../assets');
  app.use('/assets', express.static(staticPath));
}

const staticPublicPath = path.resolve(__dirname, '../public');
app.use('/public', express.static(staticPublicPath));

// Install
app.get('/dev/install', (req, res) => res.render('install'));

app.get('/shopify/auth', async (req, res) => {
  try {
    const usersShopifyUrl = `https://${req.query.shop}`;
    let isValidUrl = await Shopify.Auth.isValidShopifyDomain(usersShopifyUrl);

    req.session['shop'] = req.query.shop;
    if(isValidUrl) {
      const authUrl = await Shopify.Auth.buildAuthorizationUrl(permissions, usersShopifyUrl, SHOPIFY_APP_KEY, redirectUrl);

      res.render('shopifyRedirect', {redirectURL: authUrl});
    } else {
      throw "URL is not valid";
    }
  } catch (err) {
    console.log(err);
    res.render('error', {title: 'Oauth Error', message: err});
  }
});

app.get('/shopify/auth/callback', async (req, res, next) => {
  const qs = req.query;
  const code = qs.code;
  const shop = qs.shop;
  const hmac = qs.hmac;

  const isAuthentic = await Shopify.Auth.isAuthenticRequest(qs, SHOPIFY_APP_SECRET);
  if (isAuthentic) {
    // console.log("Authentic");
  } else {
    const err = new Error('Authentication failed.');
    err.status = 404;
    next(err);
  }

  const accessToken = await Shopify.Auth.authorize(code, shop, SHOPIFY_APP_KEY, SHOPIFY_APP_SECRET);

  req.session['shop'] = shop;
  req.session['accessToken'] = accessToken;

  visitor.event('Shopify App Store', 'Install confirmation', shop).send();

  // console.log('after auth shop is: ', shop);

  const myscript = new Shopify.ScriptTags(shop, accessToken);
  let tags = await myscript.list({src: `${SHOPIFY_APP_HOST}/public/getStartedScript.js`});
  if(!tags.length) {
    let tag = {
      event: "onload",
      src: `${SHOPIFY_APP_HOST}/public/getStartedScript.js`,
      display_scope: "order_status"
    };

    myscript.create(tag)
      .then(scriptId => {
        // console.log('script id: ', scriptId);
      })
      .catch(err => console.log("Script tag error: ", err));
  }

  await fetch(`${CHATERR_API_URL}/shopify/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      auth: {
        token: accessToken,
        hmac: hmac,
      },
      shop: shop,
    }),
  })
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(err => console.log(err));

  res.redirect('/');
});

// Client
app.get('/', async function(request, response) {
  if (request.query.shop) request.session.shop = request.query.shop;
  // console.log(request.headers);

  const { session: { accessToken, shop } } = request;
  console.log(`session for shop "${shop}" | access token: ${accessToken}`);
  let shopStatus = false;
  let first_install = true;
  if(shop) {
    await fetch(`${CHATERR_API_URL}/shops/${shop}/status`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then(res => res.json())
      .then(data => {
        shopStatus = data.is_active;
        first_install = data.first_install;
      })
      .catch(err => console.log(err));

    if(first_install) {
      visitor.event('Shopify App Store', 'Request install', shop).send();
      response.cookie('first_install', true);
    } else {
      response.cookie('first_install', false);
    }

    console.log(`access_token: ${accessToken} | shop_status: ${shopStatus}`);
    if(accessToken && shopStatus) {
      response.render('app', {
        title: 'Shopify Node App',
        apiKey: SHOPIFY_APP_KEY,
        shop: shop,
      });

    } else {
      response.redirect(`/shopify/auth?shop=${shop}`);
    }
  } else {
    throw 'shop not found';
  }
});

app.get('/charge-declined', function(request, response) {

  const { session: { shop } } = request;

  response.render('charge_declined', {
    shop: shop,
  });
});

app.get('/get-orders', function(request, response) {
  const { session: { shop } } = request;

  // console.log(request.session);

  // console.log('getAllOrders for shop: ', shop);
  fetch(`${CHATERR_API_URL}/shops/${shop}/orders`)
    .then(res => res.json())
    .then(data => response.json(data))
    .catch(err => response.json(err));
});

const postSettings = function(data, shop) {
  if (shop) {
    if (data.recurring) {
      let recurring = data.recurring;
      delete data.recurring;
      fetch(`${CHATERR_API_URL}/settings/${shop}/plan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recurring),
      })
        .then(res => res.json())
        .catch(err => console.log(err));
    }

    return fetch(`${CHATERR_API_URL}/settings/${shop}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(res => res.json())
      .catch(err => console.log(err));
  }
};

app.post('/settings', function(request, response) {
  const { session: { shop } } = request;

  console.log("cookies: ", request.cookies, request.cookies.first_install);
  fetch(`${CHATERR_API_URL}/settings/${shop}`)
    .then(res => res.json())
    .then(data => response.json({
      data: data,
      first_install: request.cookies.first_install
    }))
    .catch(err => response.json(err));
});

app.post('/settings/update', function(request, response) {
  const { session: { shop } } = request;
  const data = request.body;
  response.send('OK');
  postSettings(data, shop)
    .then(res => {})
    .catch(err => console.log(err));
});

app.get('/get-store', function(request, response) {
  const { session: { shop } } = request;

  // console.log(request.session);

  fetch(`${CHATERR_API_URL}/shops/${shop}`)
    .then(res => res.json())
    .then(data => response.json(data))
    .catch(err => response.json(err));
});

app.post('/plan-charge', async function(request, response) {
  const { session: { shop, accessToken } } = request;
  const plan = request.body;
  const returnUrl = plan.isNewPlan
    ? `${SHOPIFY_APP_HOST}/activate-plan`
    : `${SHOPIFY_APP_HOST}/change-plan`;
  const service = new Shopify.RecurringCharges(shop, accessToken);

  // console.log('plan-charge - plan: ', plan);

  service
    .create({
      name: `SallyBot - ${plan.name} plan`,
      price: plan.price,
      test: plan.test,
      return_url: returnUrl,
      trial_days: plan.trial_days,
    })
    .then(res => {
      if (plan.isNewPlan) {
        let data = {
          recurring: res,
        };

        postSettings(data, shop);
      }

      return response.json(res);
    })
    .catch(err => console.log(err));
});

app.get('/change-plan', function(request, response) {
  const { session: { shop, accessToken } } = request;
  let charge_id = request.query.charge_id;

  const service = new Shopify.RecurringCharges(shop, accessToken);

  service
    .get(charge_id)
    .then(plan => {
      if ('declined' !== plan.status) {
        service.activate(charge_id).then(value => {
          visitor.event('Shopify App Store', 'Billing confirmation', plan.price.toString()).send();
          let data = {
            recurring: value.recurring_application_charge,
          };

          postSettings(data, shop);
        });
      }

      response.redirect('/');
    })
    .catch(err => console.log(err));
});

app.get('/activate-plan', function(request, response) {
  const { session: { shop, accessToken } } = request;
  let charge_id = request.query.charge_id;

  const service = new Shopify.RecurringCharges(shop, accessToken);

  service
    .get(charge_id)
    .then(plan => {
      if (plan.status == 'declined') {
        let data = {
          recurring: plan,
        };

        postSettings(data, shop);
        response.redirect('/charge-declined');
      } else {
        service.activate(charge_id).then(value => {
          visitor.event('Shopify App Store', 'Billing confirmation', plan.price.toString()).send();
          let data = {
            recurring: value.recurring_application_charge,
          };

          postSettings(data, shop);
          response.redirect('/');
        });
      }
    })
    .catch(err => console.log(err));
});

app.get('/analytics/:time', async function(request, response) {
  const { session: { shop } } = request;
  let time = request.params.time;

  console.log('analytics for shop: ', shop);
  await fetch(`${CHATERR_API_URL}/qbot/analytics`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(
      {
        shop: shop,
        time_period: time
      }
    ),
  })
    .then((ret) => ret.json())
    .then((data) => {
    response.json(data)
  })
    .catch((err) => {
      console.log(err);
      response.status(404).send();
    });
});

app.post('/createDiscount', async function(request, response) {
  const { session: { shop, accessToken } } = request;

  let { discount_type, data } = request.body;
  fetch(`${CHATERR_API_URL}/shopify/createDiscount`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(
      {
        shop: shop,
        token: accessToken,
        discount_type: discount_type,
        discount_data: data
      }
    ),
  }).then((res) => res.json())
    .then((data) => response.send(data))
    .catch((err) => {
      console.log(err);
      response.status(404).send();
    });
});

// Error Handlers
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function(error, request, response, next) {
  response.locals.message = error.message;
  response.locals.error = request.app.get('env') === 'development' ? error : {};

  response.status(error.status || 500);
  response.render('error', {title: 'Error :(', message: error});
});

module.exports = app;
