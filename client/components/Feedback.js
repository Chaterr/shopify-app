import React, { Component } from 'react';
import {
  Page,
  Layout,
  Select,
  Card,
  SkeletonPage,
  TextContainer,
  TextField,
  FormLayout,
  SkeletonDisplayText,
  SkeletonBodyText,
  Subheading,
} from '@shopify/polaris';

class Feedback extends Component {
  constructor(props) {
    super();

    this.state = {
      save: false,
      feedback: JSON.parse(JSON.stringify(props.feedback)),
    };

    this.onSaveClicked = this.onSaveClicked.bind(this);
    this.onDiscardClicked = this.onDiscardClicked.bind(this);
    this.handleFeedbackNotify = this.handleFeedbackNotify.bind(this);
    this.handleReviewLinkUrl = this.handleReviewLinkUrl.bind(this);
    this.handleReviewLinkTitle = this.handleReviewLinkTitle.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      feedback: JSON.parse(JSON.stringify(nextProps.feedback)),
      save: false,
    });
  }

  onSaveClicked() {
    const feedback = this.state.feedback;
    // feedback.review_links.forEach((review, index) => {
    //   bitly
    //     .shorten(review.url)
    //     .then(function(result) {
    //       console.log('shorten URL is: ', result);
    //       review.url = result;
    //     });
    // });

    this.props.onUpdate({ feedback: feedback });
  }

  onDiscardClicked() {
    this.setState({
      feedback: JSON.parse(JSON.stringify(this.props.feedback)),
      save: false,
    });
  }

  handleFeedbackNotify(value) {
    const feedback = this.state.feedback;
    feedback.notify_stars = value;
    this.setState({ feedback: feedback, save: true });
  }

  handleReviewLinkUrl(value, id) {
    const feedback = this.state.feedback;
    let index = id.match(/\d+/)[0];
    feedback.review_links[index].url = value;
    this.setState({ feedback: feedback, save: true });
  }

  handleReviewLinkTitle(value, id) {
    const feedback = this.state.feedback;
    let index = id.match(/\d+/)[0];
    feedback.review_links[index].title = value;
    this.setState({ feedback: feedback, save: true });
  }

  renderLink() {
    return this.state.feedback.review_links.map((feedback, index) => {
      let id_url = `review-${index}`;
      let id_title = `review-title-${index}`;
      return (
        <FormLayout.Group key={index} condensed>
          <TextField
            type={feedback.url}
            id={id_url}
            value={this.state.feedback.review_links[index].url}
            onChange={this.handleReviewLinkUrl}
          />
          <TextField
            id={id_title}
            value={this.state.feedback.review_links[index].title}
            onChange={this.handleReviewLinkTitle}
          />
        </FormLayout.Group>
      );
    });
  }

  render() {
    const star_options = [
      { label: '4 Stars or less', value: 4 },
      { label: '3 Stars or less', value: 3 },
      { label: '2 Stars or less', value: 2 },
      { label: '1 Star', value: 1 },
    ];

    if (this.state.feedback) {
      return (
        <Page
          title="Feedback & Reviews"
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
              title="Get notified about feedbacks via email"
              description="Here you can define the score on which you'd like to get notified about"
            >
              <Card sectioned>
                <Select
                  options={star_options}
                  onChange={this.handleFeedbackNotify}
                  value={this.state.feedback.notify_stars}
                />
              </Card>
            </Layout.AnnotatedSection>
            <Layout.AnnotatedSection
              title="Where would you like to get your review?"
              description="Insert links here:"
            >
              <Card sectioned>
                <FormLayout>
                  <FormLayout.Group condensed>
                    <Subheading>URL</Subheading>
                    <Subheading>Title</Subheading>
                  </FormLayout.Group>
                  {this.renderLink()}
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
          </Layout>
        </SkeletonPage>
      );
    }
  }
}

export default Feedback;
