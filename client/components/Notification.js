import React, { Component } from 'react';
import {
  Page,
  Layout,
  SettingToggle,
  Card,
  SkeletonPage,
  TextContainer,
  TextField,
  FormLayout,
  SkeletonDisplayText,
  SkeletonBodyText,
  Banner
} from '@shopify/polaris';

class Notification extends Component {
  constructor(props) {
    super();

    this.state = {
      save: false,
      notifications: JSON.parse(JSON.stringify(props.notifications)),
    };

    this.onSaveClicked = this.onSaveClicked.bind(this);
    this.onDiscardClicked = this.onDiscardClicked.bind(this);
    this.renderSurvey = this.renderSurvey.bind(this);
    this.handleToggleChange = this.handleToggleChange.bind(this);
    this.handleSurveyCollect = this.handleSurveyCollect.bind(this);
    this.handleSurveyFulfillment = this.handleSurveyFulfillment.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      notifications: JSON.parse(JSON.stringify(nextProps.notifications)),
      save: false,
    });
  }

  onSaveClicked() {
    this.props.onUpdate({ notifications: this.state.notifications });
  }

  onDiscardClicked() {
    this.setState({
      notifications: JSON.parse(JSON.stringify(this.props.notifications)),
      save: false,
    });
  }

  handleToggleChange(field, id) {
    const notifications = this.state.notifications;
    notifications[field][id] = !notifications[field][id];
    this.setState({ notifications: notifications, save: true });
  }

  handleSurveyCollect(value) {
    const notifications = this.state.notifications;
    notifications.satisfaction_survey.after_collect = value;
    this.setState({ notifications: notifications, save: true });
  }

  handleSurveyFulfillment(value) {
    const notifications = this.state.notifications;
    notifications.satisfaction_survey.after_fulfillment = value;
    this.setState({ notifications: notifications, save: true });
  }

  renderSurvey() {
    if (this.state.notifications.satisfaction_survey.status) {
      return (
        <Card title="When?" sectioned>
          <FormLayout>
            <FormLayout.Group>
              <TextField
                label="Days after collection"
                type="number"
                value={
                  this.state.notifications.satisfaction_survey.after_collect
                }
                onChange={this.handleSurveyCollect}
                minLength={-1}
                min={0}
                max={30}
              />
              <TextField
                label="Days after fulfillment"
                type="number"
                value={
                  this.state.notifications.satisfaction_survey.after_fulfillment
                }
                onChange={this.handleSurveyFulfillment}
                minLength={-1}
                min={0}
                max={30}
              />
            </FormLayout.Group>
          </FormLayout>
        </Card>
      );
    } else {
      return;
    }
  }

  render() {
    if (this.state.notifications) {
      return (
        <Page title="Notifications"
              breadcrumbs={[{content: 'Home', url: '/settings', target: 'APP'}]}
          primaryAction={{
            content: 'Save',
            disabled: !this.state.save,
            onAction: this.onSaveClicked,
          }}
          secondaryActions={[
            {
              content: 'Discard',
              disabled: !this.state.save,
              onAction: this.onDiscardClicked,
            },
          ]}
        >
          <Layout sectioned={true}>
        


            <Layout.Section>
          <Banner
            title="Sally sends notifications to your shoppers. "
            status="warning"
          >
            <p>Sally sends messages via Messenger, Email or SMS, according to the shoppers' choices. Use this page to control your shop’s outgoing messages.</p>
          </Banner>
          <Banner
            title="Time Zone Protected"
            status="info"
            icon="notification"
          >
            <p>Sally will let your shoppers sleep like a baby. All messages are added to a queue, and sent according to the shoppers time-zone.</p>
          </Banner>
            </Layout.Section>


            <Layout.AnnotatedSection
              title="Say ‘Hi’ to Sally!"
              description="Sally will introduce herself to your shoppers, and help them use her service instead of bothering a live agent."
            >
              <SettingToggle
                action={{
                  content: this.state.notifications.welcome
                    ? 'Disable'
                    : 'Enable',
                  onAction: () => {
                    const notifications = this.state.notifications;
                    notifications.welcome = !notifications.welcome;
                    this.setState({ notifications: notifications, save: true });
                  },
                }}
                enabled={this.state.notifications.welcome}
              >
                Introduction messages is now {this.state.notifications.welcome ? 'enabled' : 'disabled'}
              </SettingToggle>
            </Layout.AnnotatedSection>


            <Layout.AnnotatedSection
              title="Order Confirmation"
              description="For Shopify Plus users only. If not Shopify Plus - Leave &quot;Disable&quot;"
            >
              <SettingToggle
                action={{
                  content: this.state.notifications.order_confirmation
                    ? 'Disable'
                    : 'Enable',
                  onAction: () => {
                    const notifications = this.state.notifications;
                    notifications.order_confirmation = !notifications.order_confirmation;
                    this.setState({ notifications: notifications, save: true });
                  },
                }}
                enabled={this.state.notifications.order_confirmation}
              >
                Order confirmation messages is now {this.state.notifications.order_confirmation ? 'enabled' : 'disabled'}
              </SettingToggle>
            </Layout.AnnotatedSection>




            <Layout.AnnotatedSection
              title="Shipping Alerts"
              description="Notify your shoppers on the estimated shipping status of their goods."
            >
              <SettingToggle
                action={{
                  content: this.state.notifications.shipping_alert.fulfillment
                    ? 'Disable'
                    : 'Enable',
                  onAction: () =>
                    this.handleToggleChange('shipping_alert', 'fulfillment'),
                }}
                enabled={this.state.notifications.shipping_alert.fulfillment}
              >
                On fulfillment messages is now {this.state.notifications.shipping_alert.fulfillment ? 'enabled' : 'disabled'}
              </SettingToggle>
              <SettingToggle
                action={{
                  content: this.state.notifications.shipping_alert.currier
                    ? 'Disable'
                    : 'Enable',
                  onAction: () =>
                    this.handleToggleChange('shipping_alert', 'currier'),
                }}
                enabled={this.state.notifications.shipping_alert.currier}
              >
                When leaving currier storage messages is now {this.state.notifications.shipping_alert.currier ? 'enabled' : 'disabled'}
              </SettingToggle>
              <SettingToggle
                action={{
                  content: this.state.notifications.shipping_alert.collect
                    ? 'Disable'
                    : 'Enable',
                  onAction: () =>
                    this.handleToggleChange('shipping_alert', 'collect'),
                }}
                enabled={this.state.notifications.shipping_alert.collect}
              >
                When waiting for collection messages is now {this.state.notifications.shipping_alert.collect ? 'enabled' : 'disabled'}
              </SettingToggle>
            </Layout.AnnotatedSection>

            <Layout.AnnotatedSection
              title="Satisfaction Survey"
              description="Ask your shoppers for their feedback on the experience they got at your shop. Control this conversation on “Feedback & Review” page."
            >
              <SettingToggle
                action={{
                  content: this.state.notifications.satisfaction_survey.status
                    ? 'Disable'
                    : 'Enable',
                  onAction: () =>
                    this.handleToggleChange('satisfaction_survey', 'status'),
                }}
                enabled={this.state.notifications.satisfaction_survey.status}
              >
                Ask for satisfaction survey  is now {this.state.notifications.satisfaction_survey.status ? 'enabled' : 'disabled'}
              </SettingToggle>
              {this.renderSurvey()}
            </Layout.AnnotatedSection>
          </Layout>
        </Page>
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
            <Layout.Section secondary>
              <Card>
                <Card.Section>
                  <TextContainer>
                    <SkeletonDisplayText size="small" />
                    <SkeletonBodyText lines={2} />
                  </TextContainer>
                </Card.Section>
                <Card.Section>
                  <SkeletonBodyText lines={1} />
                </Card.Section>
              </Card>
              <Card subdued>
                <Card.Section>
                  <TextContainer>
                    <SkeletonDisplayText size="small" />
                    <SkeletonBodyText lines={2} />
                  </TextContainer>
                </Card.Section>
                <Card.Section>
                  <SkeletonBodyText lines={2} />
                </Card.Section>
              </Card>
            </Layout.Section>
          </Layout>
        </SkeletonPage>
      );
    }
  }
}

export default Notification;
