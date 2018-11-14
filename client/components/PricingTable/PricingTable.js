import React, { Component } from 'react';
import PlanHeader from './PlanHeader';
import PlanBody from './PlanBody';
import { Page, Banner, DisplayText, Layout } from '@shopify/polaris';
import '../style/style.scss';
import Discount, { DiscountType } from '../../../public/discount.js';
import ReactGA from 'react-ga';

let isDiscountAplly = false;
let couponDiscount = [];

class PricingTable extends Component {
  constructor(props) {
    super();

    this.state = {
      redirect: false,
      discount: '',
      plans: JSON.parse(JSON.stringify(props.plans)),
    };

    this.handlePlanBtnClicked = this.handlePlanBtnClicked.bind(this);
    this.handleDiscountChange = this.handleDiscountChange.bind(this);
    this.validateDiscount = this.validateDiscount.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      plan: JSON.parse(JSON.stringify(nextProps.plans)),
    });
  }

  handlePlanBtnClicked(ev) {
    let index = ev.target.id.match(/\d+/)[0];
    let plan = this.state.plans[index];

    if(!this.props.active) {
      ReactGA.event({
        category: 'Shopify App Store',
        action: 'Select plan',
        label: plan.name
      }, ['installation']);
    }

    this.props
      .onPlanCharge(plan)
      .then(confirm => {
        // console.log(confirm);
        window.open(confirm.confirmation_url, '_parent');
      })
      .catch(err => console.log(err));
  }

  validateDiscount(shop) {
    let found = true;
    if (!shop) {
      return false;
    }

    Discount.forEach(discount => {
      if((discount.shops.indexOf(shop) !== -1) || (discount.shops[0] === 'all')) {
        if(couponDiscount.indexOf(discount) === -1) couponDiscount.push(discount);
        // console.log(discount);
        found = false;
        isDiscountAplly = true;
      }
    });

    // console.log(couponDiscount);
    this.updateDiscounts();

    if(found && isDiscountAplly) {
      this.setState({plans: JSON.parse(JSON.stringify(this.props.plans))});
      isDiscountAplly = false;
    }

    return found;
  }

  updateDiscounts() {
    // console.log("Lucky You: ", discount);
    const {plans} = this.state;

    plans.forEach((plan, i) => {
      let price = +plan.price;

      couponDiscount.forEach((discount) => {
        if(discount.plans.find((p) => p === plan.name)) {

          if(discount.discount_type === DiscountType.FIXED_AMOUNT) {
            price = Math.min(price, +discount.discount_value);
          } else if(discount.discount_type === DiscountType.PERCENTAGE){
            if(Number.isInteger(+plan.price)) {
              let val = Math.round(plan.price - (+plan.price * (+discount.discount_value/100)).toFixed(2));
              price = Math.min(price, val);
            } else {
              let val = plan.price - (+plan.price * (+discount.discount_value/100)).toFixed(2);
              price = Math.min(price, val);
            }
          } else if(discount.discount_type === DiscountType.TEST) {
            price = Math.min(price, +discount.discount_value);
            plans[i].test = true;
          }
        }
      });

      // console.log(`best price for plan ${plan.name} is ${price}`);
      plan.price = price;
    });
  }

  handleDiscountChange(discount) {
    this.setState({discount});
  };

  renderRecurringMessage() {
    if (this.props.recurring && this.props.recurring.confirmation_url) {
      return (
        <Banner
          title="Approve charge"
          status="warning"
          action={{
            content: 'Confirm Now',
            url: this.props.recurring.confirmation_url,
            external: true
          }}
        >
          <p>
            <b>Please note:</b> Your {this.props.trialDaysLeft} days free of charge trail will start the
            moment you click on "Approve Charge"
          </p>
        </Banner>
      );
    }
  }

  renderPlans() {
    return this.state.plans.map((plan, index) => {
      var border = { borderTop: `9px solid ${plan.color}` };
      var recommend = plan.recommended ? 'plan-active' : '';
      const img_x_pos = {
        left: `${plan.img_x_pos}px`,
      };

      return (
        <div key={index} className="col-xs-12 col-sm-4 col-md-4 text-center">
          <div className="thumbnail">
            <img src={plan.img} alt="Image" style={img_x_pos} />
          </div>
          <div className={`plan-box ${recommend}`} style={border}>
            <PlanHeader plan={plan} planIndex={index} planActive={this.props.active} oldPlan={couponDiscount.length ? this.props.plans[index] : null} isDiscount={isDiscountAplly} planBtnClicked={this.handlePlanBtnClicked}/>
            <div className="plan-body">
              <PlanBody planList={plan.planList} />
            </div>
          </div>
        </div>
      );
    });
  }

  renderCouponMessages() {
    if(couponDiscount.length > 1) {
      return couponDiscount.map((coupon) => {
        return(<p> &bull; {coupon.message}</p>);
      });
    } else {
      return <p>{couponDiscount[0].message}</p>;
    }
  }

  renderCoupon() {
    const isInvalid = this.validateDiscount(this.props.shop);
    // console.log(couponDiscount);
      if(!isInvalid && couponDiscount.length) {
        return (
          <Banner
            title="Lucky you! You got a coupon from my Boss"
            status="info"
          >
            <div>
              {this.renderCouponMessages()}
            </div>
          </Banner>
        );
      }
  }

  render() {
    return (
      <Page title="Pricing Table">
          <Layout>
            <Layout.Section>
              <DisplayText size="extraLarge">Choose your plan</DisplayText>
            </Layout.Section>
            <Layout.Section>
            {this.renderCoupon()}
            </Layout.Section>
            <Layout.Section>
              {this.renderRecurringMessage()}
            </Layout.Section>
            <Layout.Section>
              <div className="row">{this.renderPlans()}</div>
            </Layout.Section>
          </Layout>
      </Page>
    );
  }
}

export default PricingTable;
