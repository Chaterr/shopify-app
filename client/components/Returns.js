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
} from '@shopify/polaris';

class Returns extends Component {
  constructor(props) {
    super();

    this.state = {
      save: false,
      returns: JSON.parse(JSON.stringify(props.returns)),
    };

    this.onSaveClicked = this.onSaveClicked.bind(this);
    this.onDiscardClicked = this.onDiscardClicked.bind(this);
    this.handleReturnsPolicy = this.handleReturnsPolicy.bind(this);
    this.handleAgentQuestions = this.handleAgentQuestions.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      returns: JSON.parse(JSON.stringify(nextProps.returns)),
      save: false,
    });
  }

  onSaveClicked() {
    this.props.onUpdate({ returns: this.state.returns });
  }

  onDiscardClicked() {
    this.setState({
      returns: JSON.parse(JSON.stringify(this.props.returns)),
      save: false,
    });
  }

  handleReturnsPolicy(value, id) {
    const returns = this.state.returns;
    returns.terms[id] = value;
    this.setState({ returns: returns, save: true });
  }

  handleAgentQuestions(value, id) {
    const returns = this.state.returns;
    returns.agent[id] = value;
    this.setState({ returns: returns, save: true });
  }

  handleAgentRequest(id) {
    console.log('Got id ', id);
    const returns = this.state.returns;
    returns.agent[id] = !returns.agent[id];
    this.setState({ returns: returns, save: true });
  }

  render() {
    if (this.state.returns) {
      return (
        <Page
          title="Returns"
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
              title="Terms and conditions"
              description="Please insert your returns policy here:"
            >
              <Card sectioned>
                <FormLayout>
                  <TextField
                    label="First Paragraph"
                    id="first_para"
                    value={this.state.returns.terms.first_para}
                    onChange={this.handleReturnsPolicy}
                    multiline={3}
                  />
                  <TextField
                    label="Second Paragraph"
                    id="second_para"
                    value={this.state.returns.terms.second_para}
                    onChange={this.handleReturnsPolicy}
                    multiline={3}
                  />
                  <TextField
                    label="Third Paragraph"
                    id="third_para"
                    value={this.state.returns.terms.third_para}
                    onChange={this.handleReturnsPolicy}
                    multiline={3}
                  />
                  <TextField
                    label="Full Document"
                    id="doc_url"
                    value={this.state.returns.terms.doc_url}
                    onChange={this.handleReturnsPolicy}
                  />
                </FormLayout>
              </Card>
            </Layout.AnnotatedSection>
            <Layout.AnnotatedSection
              title="Agent Escalation / Ask for details"
              description="Here you can customize questions to ask your customers about the reason of return:"
            >
              <Card sectioned>
                <FormLayout>
                  <TextField
                    lable="First Question"
                    id={'first_question'}
                    placeholder="Example: “Please add a photo of the item”"
                    value={this.state.returns.agent.first_question}
                    onChange={this.handleAgentQuestions}
                  />
                  <TextField
                    lable="Second Question"
                    id={'second_question'}
                    value={this.state.returns.agent.second_question}
                    onChange={this.handleAgentQuestions}
                  />
                  <TextField
                    lable="Third Question"
                    id={'third_question'}
                    value={this.state.returns.agent.third_question}
                    onChange={this.handleAgentQuestions}
                  />
                </FormLayout>
              </Card>
              <SettingToggle
                action={{
                  id: 'request_photo',
                  content: this.state.returns.agent.request_photo
                    ? 'OFF'
                    : 'ON',
                  onAction: () => this.handleAgentRequest('request_photo'),
                }}
                enabled={this.state.returns.agent.request_photo}
              >
                Request a photo is now {this.state.returns.agent.request_photo ? 'On' : 'Off'}
              </SettingToggle>

              <SettingToggle
                action={{
                  id: 'request_email',
                  content: this.state.returns.agent.request_email
                    ? 'OFF'
                    : 'ON',
                  onAction: () => this.handleAgentRequest('request_email'),
                }}
                enabled={this.state.returns.agent.request_email}
              >
                Request an email is now {this.state.returns.agent.request_email ? 'On' : 'Off'}
              </SettingToggle>

              <SettingToggle
                action={{
                  id: 'request_phone',
                  content: this.state.returns.agent.request_phone
                    ? 'OFF'
                    : 'ON',
                  onAction: () => this.handleAgentRequest('request_phone'),
                }}
                enabled={this.state.returns.agent.request_phone}
              >
                Request a phone number is now {this.state.returns.agent.request_phone ? 'On' : 'Off'}
              </SettingToggle>
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
          </Layout>
        </SkeletonPage>
      );
    }
  }
}

export default Returns;
