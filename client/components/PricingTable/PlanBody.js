import React, { Component } from 'react';

class PlanBody extends Component {
  render() {
    // console.log(this.props.planList);
    const ro = this.props.planList.map((prop, i) => {
      if (prop.tooltip) {
        return (
          <li
            key={i}
            className="pricingtable-tooltip swing"
            data-title={prop.tooltip}
          >
            {prop.feature}
          </li>
        );
      } else {
        return <li key={i}>{prop.feature}</li>;
      }
    });
    return <ul className="plan-list">{ro}</ul>;
  }
}

export default PlanBody;
