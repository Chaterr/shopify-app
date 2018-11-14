import React, { Component } from 'react';
import {
  Page,
  Layout,
  Card,
  SkeletonPage,
  TextContainer,
  TextField,
  FormLayout,
  SkeletonDisplayText,
  SkeletonBodyText,
} from '@shopify/polaris';

class Agent extends Component {
  constructor(props) {
    super();
    this.state = {
      agent: Object.assign({}, props.agent),
      save: false,
    };

    this.handleLiveAgentEmail = this.handleLiveAgentEmail.bind(this);
    this.onSaveClicked = this.onSaveClicked.bind(this);
    this.onDiscardClicked = this.onDiscardClicked.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ agent: Object.assign({}, nextProps.agent), save: false });
  }

  handleLiveAgentEmail(value) {
    const agent = this.state.agent;
    agent.email = value;
    this.setState({ agent: agent, save: true });
  }

  onSaveClicked() {
    this.props.onUpdate({ agent: this.state.agent });
  }

  onDiscardClicked() {
    this.setState({ agent: Object.assign({}, this.props.agent), save: false });
  }

  render() {
    if (this.state.agent) {
      return (
        <Page
          title="Agent Escalation"
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
            <Layout.AnnotatedSection
              title="Live agent email"
              description="When Sally can’t help / understand your customer needs - she sends the question to your agents -
Here you can configure to which email address the queries will be sent.
(If left empty - email will be sent to the “Support” mailbox)
"
            >
              <Card sectioned>
                <FormLayout>
                  <FormLayout.Group>
                    <p>Live agent email</p>
                    <TextField
                      type="email"
                      value={this.state.agent.email}
                      placeholder="your.mail@example.com"
                      onChange={this.handleLiveAgentEmail}
                    />
                  </FormLayout.Group>
                </FormLayout>
              </Card>
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

export default Agent;
