import React, { Component } from 'react';
import { Page } from '@shopify/polaris';

class HotDeals extends Component {
  constructor() {
    super();

    this.state = {};
  }

  render() {
    return (
      <Page title="Hot Deals">
        <div className="Polaris-EmptyState">
          <div className="Polaris-EmptyState__Section">
            <div className="Polaris-EmptyState__DetailsContainer">
              <div className="Polaris-EmptyState__Details">
                <div className="Polaris-TextContainer">
                  <p className="Polaris-DisplayText Polaris-DisplayText--sizeMedium">
                    Coming Soon...
                  </p>
                  <div className="Polaris-EmptyState__Content">
                    <p>Sally will boost the products you’d like to promote!</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="Polaris-EmptyState__ImageContainer">
              <img
                src="../../public/HotDealsEmptyState.png"
                role="presentation"
                alt=""
                className="Polaris-EmptyState__Image"
              />
            </div>
          </div>
        </div>
      </Page>
    );
  }
}

export default HotDeals;
