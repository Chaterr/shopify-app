import React, { Component } from 'react';

class PlanHeader extends Component {
  renderDescription(description) {
    return <span>{description}</span>;
  }

  renderPrice(plan, prevPlan) {
    if(prevPlan) {
      let style = (+plan.price == +prevPlan.price) ? {opacity: '0'} : {};
      return <div>
        <div className="prevPrice" style={style}>
          {/*<span className="currency">{prevPlan.currency}</span>*/}
          {prevPlan.price}
        </div>
        {/*<span className="currency">{plan.currency}</span>*/}
        {plan.price}
      </div>;
    } else {
      return <div>
        <span className="currency">{plan.currency}</span>
        {plan.price}
        </div>;
    }
  }

  render() {
    const plan = this.props.plan;
    const prevPlan = this.props.oldPlan;
    let index = this.props.planIndex;
    let disable = plan.name == this.props.planActive ? true : false;
    let text = this.props.planActive ? 'Get Started' : 'Start FREE Trial';
    let buttonText = disable ? 'Your Plan' : text;
    let buttonClass = disable ? 'btn-disable' : 'btn-color';
    let buttonStyle = {
      button: {
        backgroundColor: disable ? '' : plan.color,
      }
    };
    let ids = `${plan.name}-${index}`;

    return (
      <div className="plan-heading">
        <h4>{plan.title}</h4>
        <div className="plan-description">
          {this.renderDescription(plan.description)}
        </div>
        <button
          id={ids}
          className={buttonClass}
          disabled={disable}
          style={buttonStyle.button}
          onClick={this.props.planBtnClicked.bind(this)}
        >
          {buttonText}
        </button>
        <div className="plan-price">
          {this.renderPrice(plan, prevPlan)}
          <span className="time">{plan.currency}/{plan.time}</span>
          {/*<span className="fee">{plan.fee} fee for re-order</span>*/}
        </div>
      </div>
    );
  }
}

export default PlanHeader;
