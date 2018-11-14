import React, { Component } from 'react';
import axios from 'axios';
import { Route, Switch } from 'react-router-dom';

import plans from './sallyPlans';
import PricingTable from './components/PricingTable/PricingTable';
import Settings from './components/Settings';
import Notification from './components/Notification';
import Agent from './components/Agent';
import Feedback from './components/Feedback';
import Returns from './components/Returns';
import Faq from './components/Faq';
import GetStarted from './components/GetStarted';
import HotDeals from './components/HotDeal';
import Coupons from './components/Coupons';
import ToneNVoice from './components/ToneNVoice';
import ReactGA from 'react-ga';
import {
  FooterHelp,
  SkeletonPage,
  SkeletonBodyText,
  SkeletonDisplayText,
  Layout,
  Card,
  TextContainer,
} from '@shopify/polaris';
import Currier from './components/Currier';

ReactGA.initialize([{
  trackingId: 'UA-127043362-1',
  gaOptions: { name: 'general' }
}, {
  trackingId: 'UA-88801486-7',
  gaOptions: { name: 'installation' }
}], { alwaysSendToDefaultTracker: false });

const footerIcon = {
  margin: '0 auto -20px',
  display: 'block',
  justifyContent: 'center',
  height: '70px',
  width: '70px',
};

class App extends Component {
  constructor() {
    super();

    this.state = {
      ready: false,
      settings: null,
    };

    this.getStore = this.getStore.bind(this);
    this._updateSettings = this._updateSettings.bind(this);
    this.onPlanCharge = this.onPlanCharge.bind(this);
  }

  componentDidMount() {
    this._loadSettingsData();
  }

  onPlanCharge(plan) {
    plan.trial_days = this.state.settings.trial_days_left;

    // console.log("Got Plan: ", plan);

    plan.isNewPlan = this.state.settings.plan_name ? false : true;

    return axios
      .post('/plan-charge', plan, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      })
      .then(response => response.data)
      .then(data => {
        return data;
      });
  }

  _loadSettingsData() {
    let axInstance = axios.create({ withCredentials: true });
    axInstance
      .post('/settings')
      .then(response => response.data)
      .then(json => {
        // console.log(json.data);
        this.setState({
          settings: json.data,
          isRecurringActive:
            (json.data.shop_plan === 'affiliate')
            ||
            (json.data.recurring.length > 0 && json.data.recurring[0].status === 'active')
              ? true
              : false,
          ready: true,
          showFirstPopup: (json.first_install === 'true')
        });
      })
      .catch(err => console.log(err));
  }

  _updateSettings(data) {
    return axios
      .post('/settings/update', data, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      })
      .then(response => response.data)
      .then(() =>
        this.setState({ settings: Object.assign(this.state.settings, data) })
      )
      .catch(error => {
        console.log(error);
      });
  }

  getStore(prop) {
    axios
      .post('/settings')
      .then(response => response.data)
      .then(json => {
        if (json.data.recurring.length > 0) {
        }
        this.setState({
          settings: json.data,
          ready: true,
        });
      });
  }

  render() {
    if (this.state.settings) {
      let pathname = location ? location.pathname : history.location.pathname;
      ReactGA.pageview(pathname, ['general']);

      return (
        <div>
          <main>
            <Switch>
              <Route
                exact
                path="/"
                render={() => {
                  return this.state.isRecurringActive ? (
                    <Settings shop_plan={this.state.settings.shop_plan}/>
                  ) : (
                    <PricingTable
                      plans={plans}
                      onPlanCharge={this.onPlanCharge}
                      recurring={
                        this.state.settings.recurring.length > 0
                          ? this.state.settings.recurring[0]
                          : null
                      }
                      shop={this.state.settings.shop_domain}
                      shopPlan={this.state.settings.shop_plan}
                      trialDaysLeft={this.state.settings.trial_days_left}
                    />
                  );
                }}
              />
              <Route
                path="/plan-confirm"
                component={() => (window.location = this.state.planConfirmUrl)}
              />
              <Route path="/getStarted" render={() => <GetStarted />} />
              <Route
                path="/notifications"
                render={() => (
                  <Notification
                    notifications={this.state.settings.notifications}
                    onUpdate={this._updateSettings}
                  />
                )}
              />
              <Route
                path="/agent"
                render={() => (
                  <Agent
                    agent={this.state.settings.agent}
                    onUpdate={this._updateSettings}
                  />
                )}
              />
              <Route
                path="/feedback"
                render={() => (
                  <Feedback
                    feedback={this.state.settings.feedback}
                    onUpdate={this._updateSettings}
                  />
                )}
              />
              <Route
                path="/returns"
                render={() => (
                  <Returns
                    returns={this.state.settings.returns}
                    onUpdate={this._updateSettings}
                  />
                )}
              />
              <Route
                path="/faq"
                render={() => (
                  <Faq
                    faq={this.state.settings.faq}
                    onUpdate={this._updateSettings}
                  />
                )}
              />
              <Route
                path="/plan"
                render={() => (
                  <PricingTable
                    plans={plans}
                    onPlanCharge={this.onPlanCharge}
                    active={this.state.settings.plan_name}
                    shopPlan={this.state.settings.shop_plan}
                    shop={this.state.settings.shop_domain}
                  />
                )}
              />
              <Route path="/hot-deals" render={() => <HotDeals />} />
              <Route path="/coupons" render={() => <Coupons discount={this.state.settings.discount} deals={this.state.settings.deals} onUpdate={this._updateSettings} />} />
              <Route path="/tone-voice" render={() => <ToneNVoice />} />
              <Route path="/curriers" render={() => <Currier />} />
            </Switch>
          </main>
          <img style={footerIcon} src="/public/SallyBot.png" alt="sally-icon" />
          <FooterHelp>
            Learn more about{' '}
            <a href={'https://sallybot.com/blogs/sallyblog'} className="Polaris-Link" target="_blank">
              automated customer care
            </a>{' '}or{' '}
            <a href={'http://m.me/181845442518594'} className="Polaris-Link" target="_blank">
              contact us
            </a>
            {' '}if you need help.
          </FooterHelp>
        </div>
      );
    } else {
      return (
        <SkeletonPage secondaryActions={2}>
          <Layout>
            <Layout.Section>
              <Card sectioned>
                <SkeletonBodyText />
              </Card>
              <Card sectioned>
                <TextContainer>
                  <SkeletonDisplayText size="small" />
                  <SkeletonBodyText />
                </TextContainer>
              </Card>
              <Card sectioned>
                <TextContainer>
                  <SkeletonDisplayText size="small" />
                  <SkeletonBodyText />
                </TextContainer>
              </Card>
            </Layout.Section>
          </Layout>
        </SkeletonPage>
      );
    }
  }
}

export default App;
