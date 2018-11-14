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
  Stack,
  Collapsible,
  Button,
} from '@shopify/polaris';

class Faq extends Component {
  constructor(props) {
    super();

    this.state = {
      save: false,
      faq: JSON.parse(JSON.stringify(props.faq)),
    };

    this.onSaveClicked = this.onSaveClicked.bind(this);
    this.onDiscardClicked = this.onDiscardClicked.bind(this);
    this.renderQuestions = this.renderQuestions.bind(this);
    this.handleFaqChange = this.handleFaqChange.bind(this);
    this.handleFaqStatusClick = this.handleFaqStatusClick.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      faq: JSON.parse(JSON.stringify(nextProps.faq)),
      save: false,
    });
  }

  onSaveClicked() {
    this.props.onUpdate({ faq: this.state.faq });
  }

  onDiscardClicked() {
    this.setState({
      faq: JSON.parse(JSON.stringify(this.props.faq)),
      save: false,
    });
  }

  handleFaqChange(value, id) {
    const faq = this.state.faq;
    let index = id.match(/\d+/)[0];
    faq.questions[index].answer = value;
    this.setState({ faq: faq, save: true });
  }

  handleFaqStatusClick(index) {
    const faq = this.state.faq;
    faq.questions[index].status = !faq.questions[index].status;
    this.setState({ faq: faq, save: true });
  }

  renderQuestions() {
    return this.state.faq.questions.map((ques, index) => {
      let ids = `ques-${index}`;
      return (
        <Card sectioned key={index}>
          <FormLayout>
            <Stack>
              <Stack.Item fill>
                <p>{ques.question}</p>
              </Stack.Item>
              <Stack.Item>
                <Button
                  onClick={() => this.handleFaqStatusClick(index)}
                  aria-expanded={this.state.faq.questions[index].status}
                  primary={!this.state.faq.questions[index].status}
                >
                  {this.state.faq.questions[index].status
                    ? 'Disable'
                    : 'Enable'}
                </Button>
              </Stack.Item>
            </Stack>
            <Collapsible
              open={this.state.faq.questions[index].status}
              id={`collapsible-${index}`}
            >
              <TextField
                id={ids}
                value={this.state.faq.questions[index].answer}
                onChange={this.handleFaqChange}
                multiline={2}
                maxLength={950}
              />
            </Collapsible>
          </FormLayout>
        </Card>
      );
    });
  }

  render() {
    if (this.state.faq) {
      return (
        <Page
          title="FAQ's"
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
              title="Frequently Asked Questions"
              description="Help your shoppers find answers to the most common questions, easily."
            >
              <FormLayout>{this.renderQuestions()}</FormLayout>
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

export default Faq;
