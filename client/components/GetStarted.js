import React, { Component } from 'react';
import {
  Page,
  Layout,
  Card,
  TextStyle,
  FormLayout,
  Button,
  Scrollable,
  Banner
} from '@shopify/polaris';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Highlight from 'react-highlight';

const checkout = `<body>
  <style type='text/css'>
  .button {
    display: inline-block;
    border-radius: 4px;
    background-color: #ccc;
    border: none;
    color: #FFFFFF;
    text-align: center;
    padding: 15px 40px;
    transition: all 0.5s;
    cursor: pointer;
    margin: 5px;
  }
  .button-blue {
    display: inline-block;
    border-radius: 4px;
    background-color: #337ab7;
    border: 1px;
    color: #FFFFFF;
    text-align: center;
    padding: 15px 50px;
    margin: 5px;
  }
  </style>
  <div class="content-box" style="margin-top: 20px;">
    <div class="container" style="padding: 15px 25px; display: inline-block;">
      <div style="float: left;">
        <img src="https://cdn.shopify.com/s/files/1/2698/3700/files/sally_fb_icon_white.png?9133779576256027821" width="15%" />
      </div>
      <div style="float: right;">
        <h2 class="os-step__title">Hi, I’m Sally!</h2>
        <P>I can give you full support with shipping status, personal updates and much more. Please choose your channel:</P>
      </div>
    </div>
    <div class="container" style="text-align: center; padding: 0px 0px 15px 0px;">
        <div>
          <a href="https://m.me/SallyTheChatbot?ref=RefFlag_SHOP__Project_{{ shop.name }}__Episode_GET_STARTED__OrderID_{{ order_id }}" class="button-blue" target="_blank">Messenger</a>
          <a href="https://gateway.prd-c4.chaterr.me?topic=register_gateway&PFN=AFTER_SALE.SALLY_BOT&order_id={{ order_id }}&phone={{ customer.phone }}&email={{ customer.email }}&gateway=email&redirect_url=sallybot.com/pages/sally4u" target="_blank" class="button">Email</a>
          <a href="https://gateway.prd-c4.chaterr.me?topic=register_gateway&PFN=AFTER_SALE.SALLY_BOT&order_id={{ order_id }}&phone={{ customer.phone }}&email={{ customer.email }}&gateway=sms&redirect_url=sallybot.com/pages/sally4u" target="_blank"  class="button">SMS</a>
        </div>
    </div>
  </div>
</body>
`;

const email = `{% capture email_title %}{% endcapture %}

{% capture email_body %}
Hi {{ customer.first_name }},<br/>
Thank you for your purchase. 
{% if requires_shipping %}Your order is ready to be shipped.{% endif %}
{% endcapture %}

{% capture messenger_title %}Introducing Sally, our chatbot. Email is so 2017... {% endcapture %}
{% capture messenger_body %}
{{ customer.first_name }}, we don't want to load your inbox. <br />Let's chat over Facebook Messenger for better and faster communication. 
{% endcapture %}
{% capture messenger_url %}https://m.me/SallyTheChatbot?ref=RefFlag_SHOP__Project_{{ shop.name }}__Episode_GET_STARTED__OrderID_{{ order_id }}{% endcapture %}

<!DOCTYPE html>
  <html lang="en">
    <head>
      <title>{{ email_title }}</title>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
      <meta name="viewport" content="width=device-width">
      <link rel="stylesheet" type="text/css" href="/assets/notifications/styles.css">
      <style>
        .button__cell { background: {{ shop.email_accent_color }}; }
        a, a:hover, a:active, a:visited { color: {{ shop.email_accent_color }}; }
      </style>
    </head>

    <body>
      <table class="body">
        <tr>
          <td align="center" bgcolor="#2F836C"><img src="https://cdn.shopify.com/s/files/1/2698/3700/files/checkout_bunner_500px.jpg?14213472543973906552" alt="Sally Demo Store"></td>
        </tr>
        <tr>
          <td>
            <table class="header row">
              <tr>
                <td class="header__cell">
                  <center>
                    <table class="container">
                      <tr>
                        <td>
                          <table class="row">
                            <tr>
                              <td class="shop-name__cell">
                                {%- if shop.email_logo_url %}
                                <img src="{{shop.email_logo_url}}" alt="{{ shop.name }}" width="{{ shop.email_logo_width }}">
                                  {%- else %}
                                <h1 class="shop-name__text">
                                  <a href="{{shop.url}}">{{ shop.name }}</a>
                                </h1>
                                  {%- endif %}
                              </td>
                              <td class="order-number__cell">
                                <span class="order-number__text">Order {{ order_name }}</span>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </center>
                </td>
              </tr>
            </table>
            <table class="row content">
              <tr>
                <td class="content__cell">
                  <center>
                    <table class="container">
                      <tr>
                        <td>            
                          <h2>{{ email_title }}</h2>
                          <p>{{ email_body }}</p>
                          <hr /><br />
                          <h2>{{ messenger_title }}</h2>
                          <p>{{ messenger_body }}</p>
                          <!--p>{{ order_name }} {{ order_id }} {{ customer_name }}</p-->
                          {% if order_status_url %}
                          <table class="row actions">
                            <tr>
                              <td class="actions__cell">
                                <table class="button main-action-cell">
                                  <tr>
                                    <td class="button__cell"><a href="{{ messenger_url }}" class="button__text">Start chatting with Sally!</a></td>
                                  </tr>
                                </table>
                                {% if shop.url %}
                                <table class="link secondary-action-cell">
                                  <tr>
                                    <td class="link__cell"><a href="{{ shop.url }}" class="link__text"><span class='or'>or</span> Visit our store</a></td>
                                  </tr>
                                </table>
                                {% endif %}
                              </td>
                            </tr>
                          </table>
                        {% endif %}
                      </td>
                    </tr>
                  </table>
                </center>
              </td>
            </tr>
          </table>
          <table class="row footer">
            <tr>
              <td class="footer__cell">
                <center>
                  <table class="container">
                    <tr>
                      <td>
                        <p class="disclaimer__subtext">If you have any questions, reply to this email or contact us at <a href="mailto:{{ shop.email }}">{{ shop.email }}</a></p>
                      </td>
                    </tr>
                  </table>
                </center>
              </td>
            </tr>
          </table>
          <img src="{{ 'notifications/spacer.png' | shopify_asset_url }}" class="spacer" height="1" />
        </td>
      </tr>
    </table>
  </body>
</html>
`;

const sms = `Hi{% unless order.customer.first_name == blank %} {{ order.customer.first_name }}{% endunless %}, thanks for your purchase ({{ order.name }}) from {{shop.name}}! 

Say 'Hi' to Sally, and let's chat over Facebook Messenger for better and faster status updates and other communications:
https://m.me/SallyTheChatbot?ref=RefFlag_SHOP__Project_{{ shop.name }}__Episode_GET_STARTED__OrderID_{{ order_id }}

{% if order.order_status_url %}You can also check the status web page: {{ order.order_status_url }}{% endif %}
`;

class GetStarted extends Component {
  constructor() {
    super();

    this.state = {
      pageText: checkout,
      emailText: email,
      smsText: sms,
    };
  }

  render() {
    return (
      <Page title="Get Started"> 
      
        <Layout sectioned={true}>

            <Layout.Section>
          <Banner
            title="Help Sally and you shoppers know each other better!"
            status="warning"
          >
            <p>Use the "Thank You Page" and the "Order Confirmation" Email & SMS to introduce Sally to your shoppers.
</p>
          </Banner>
            </Layout.Section>


          <Layout.AnnotatedSection
            title="Order status PAGE"
            description="This code enables you to implement Sally on your post purchase “Thank you” page"
          >
            <Card sectioned>
              <FormLayout>
                <Scrollable
                  shadow={false}
                  style={{ height: '200px' }}
                  vertical={true}
                >
                  <Highlight language="html">{this.state.pageText}</Highlight>
                </Scrollable>
                <CopyToClipboard
                  text={this.state.pageText}
                  onCopy={() => this.setState({ copied: true })}
                >
                  <span>
                    <FormLayout>
                      <Button fullWidth primary={true}>
                        COPY
                      </Button>
                      <TextStyle>
                        <p>
                        Simply copy & paste the cody above to the 'Additional scripts' section on 
                        <a
                          target="_blank"
                          href={`https://${
                            window.shopOrigin
                          }/admin/settings/checkout#shop_checkout_configuration_content`}
                        >
                          {' '}
                          Settings > Checkout
                        </a> page.
                        </p>
                        <p>
                          <strong>DEMO:</strong> See Sally-Demo-Store's <a target="_blank" href="https://checkout.shopify.com/26983700/orders/5a90dd1301c10826256865154ce488df">thank-you page</a>.
                        </p>
                      </TextStyle>
                      
                    </FormLayout>
                  </span>
                </CopyToClipboard>
              </FormLayout>
            </Card>
          </Layout.AnnotatedSection>

          <Layout.AnnotatedSection
            title="Order confirmation EMAIL"
            description="This code enables you to add Sally to the emails sent automatically to the customer after they place their order"
          >
            <Card sectioned>
              <FormLayout>
                <Scrollable
                  shadow={false}
                  style={{ height: '200px' }}
                  vertical={true}
                >
                  <Highlight language="html">{this.state.emailText}</Highlight>
                </Scrollable>
                <CopyToClipboard
                  text={this.state.emailText}
                  onCopy={() => this.setState({ copied: true })}
                >
                  <span>
                    <FormLayout>
                      <Button fullWidth primary={true}>
                        COPY
                      </Button>
                      <TextStyle>
                         <p>
                          Simply copy & paste the cody above to
                          <a
                            target="_blank"
                            href={`https://${
                              window.shopOrigin
                            }/admin/email_templates/order_confirmation/edit`}
                          >
                            {' '}
                            Notifications > Order confirmation > email
                          </a>
                        </p>
                        <p>
                            <strong>DEMO:</strong> Complete the Sally-Demo-Store's <a target="_blank" href="https://sallybot.com/26983700/checkouts/3406b95e71f8abd28a1ad5901e70956b">checkout process</a> using your email.
                        </p>
                      </TextStyle>
                    </FormLayout>
                  </span>
                </CopyToClipboard>
              </FormLayout>
            </Card>
          </Layout.AnnotatedSection>

          <Layout.AnnotatedSection
            title="Order confirmation SMS"
            description="This code enables you to add Sally to the SMS sent automatically to the customer after they place their order."
          >
            <Card sectioned>
              <FormLayout>
                <Scrollable
                  shadow={false}
                  style={{ height: '150px' }}
                  vertical={true}
                >
                  <Highlight language="html">{this.state.smsText}</Highlight>
                </Scrollable>
                <CopyToClipboard
                  text={this.state.smsText}
                  onCopy={() => this.setState({ copied: true })}
                >
                  <span>
                    <FormLayout>
                      <Button fullWidth primary={true}>
                        COPY
                      </Button>
                      <TextStyle>
                        <p>
                          Simply copy & paste the cody above to
                          <a
                            target="_blank"
                            href={`https://${
                              window.shopOrigin
                            }/admin/sms_templates/order_confirmation/edit`}
                          >
                            {' '}
                            Notifications > Order confirmation > sms
                          </a>
                        </p>
                        <p>
                            <strong>DEMO:</strong> Complete the Sally-Demo-Store's <a target="_blank" href="https://sallybot.com/26983700/checkouts/3406b95e71f8abd28a1ad5901e70956b">checkout process</a> using your phone number.
                        </p>
                      </TextStyle>
                    </FormLayout>
                  </span>
                </CopyToClipboard>
              </FormLayout>
            </Card>
          </Layout.AnnotatedSection>
        </Layout>
      </Page>
    );
  }
}

export default GetStarted;
