import axios from 'axios';
import React, { Component } from 'react';
import {
  Card,
  Page,
  Layout,
  SkeletonPage,
  SkeletonBodyText,
  TextContainer,
  SkeletonDisplayText,
  TextStyle,
  ResourceList,
  Avatar,
  ResourcePicker
} from "@shopify/polaris";

// import {ResourcePicker} from '@shopify/polaris/embedded'

class Coupons extends Component {
  constructor(props) {
    super();

    this.state = {
      save: false,
      discount: JSON.parse(JSON.stringify(props.discount)),
      deals: JSON.parse(JSON.stringify(props.deals)),
      open: false
    };

    this._isMounted = false;

    this.onSaveClicked = this.onSaveClicked.bind(this);
    this.onDiscardClicked = this.onDiscardClicked.bind(this);
    this.onFreeShippingClicked = this.onFreeShippingClicked.bind(this);
    this.onPercentageClicked = this.onPercentageClicked.bind(this);
    this.onResourcePickerOpen = this.onResourcePickerOpen.bind(this);
    this.onProductAdd = this.onProductAdd.bind(this);
    this.handleSelectionChange = this.handleSelectionChange.bind(this);
    this.renderHotDeals = this.renderHotDeals.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this._isMounted) {
      this.setState({
        discount: JSON.parse(JSON.stringify(nextProps.discount)),
        deals: JSON.parse(JSON.stringify(nextProps.deals)),
        selectedItems: [],
        save: false,
      });
    }
  }

  componentDidMount(){
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  onSaveClicked() {
    const deals = this.state.deals;
    this.props.onUpdate({ deals: deals });
  }

  onDiscardClicked() {
    if (this._isMounted) {
      this.setState({
        deals: JSON.parse(JSON.stringify(this.props.deals)),
        save: false,
      });
    }
  }

  onResourcePickerOpen() {
    if (this._isMounted) {
      this.setState({ open: true });
    }
  }

  onProductAdd({selection}) {
    let { deals } = this.state;

    // console.log(selection);
    let data = selection.map((res) => {
      return {
        id: (+res.id.substring(res.id.lastIndexOf('/')+1)),
        graphId: res.id,
        image: res.images ? res.images[0].originalSrc : '',
        title: res.title,
        vendor: res.vendor,
        variants: res.variants
      }
    });

    deals.products = [...deals.products, ...data];
    deals.products = deals.products.map((prod) => JSON.stringify(prod));
    deals.products = Array.from(new Set(deals.products)).map((prod) => JSON.parse(prod));

    // console.log("products: ", deals.products);

    if(this._isMounted) this.setState({deals: deals, open: false, save: true});
  }

  handleSelectionChange(selectedItems) {
    // console.log(selectedItems);
    if(this._isMounted) this.setState({selectedItems});
  };

  renderItem(item){

    const { id, title, image, vendor } = item;
    const media = <Avatar customer size="large" name={vendor} source={image} />;
    return (
      <ResourceList.Item
        id={id}
        url={''}
        media={media}
      >
        <h3>
          <TextStyle variation="strong">{title}</TextStyle>
        </h3>
        <div>{vendor}</div>
      </ResourceList.Item>
    );
  };


  onFreeShippingClicked() {
    if(this.state.discount.free_shipping.id) {
      window.open(`https://${window.shopOrigin}/admin/discounts/${this.state.discount.free_shipping.id}`, '_parent');
    } else {
      axios.post('/createDiscount', {discount_type: 'free_shipping'})
        .then((data) => {
          // console.log(data);
          if(this._isMounted) {
            // console.log('got discount: ', data.data);
            this.setState({discount: data.data.discount});
          }
        })
        .catch((err) => console.log(err));
    }
  }

  onPercentageClicked() {
    if(this.state.discount.percentage.id) {
      window.open(`https://${window.shopOrigin}/admin/discounts/${this.state.discount.percentage.id}`, '_parent');
    } else {
      axios.post('/createDiscount', {discount_type: 'percentage', data: {value: '-10'}})
        .then((data) => {
          console.log(data);
          if(this._isMounted) {
            console.log('got discount: ', data.data);
            this.setState({discount: data.data.discount});
          }
        })
        .catch((err) => console.log(err));
    }
  }

  renderHotDeals() {
    if(this.state.deals.sally_collection) {
      const resourceName = {
        singular: 'product',
        plural: 'products',
      };

      const promotedBulkActions = [
        {
          content: 'Remove Product',
          onAction: () => console.log('Todo: implement "remove product', this.state.selectedItems),
        },
      ];

      return(
        <Layout.AnnotatedSection
          title="Hot Deals"
          description="Sally use the Collection model of Shopify. Simply add products to ‘Sally Collection’, so Sally can start to sell them after every positive conversation."
        >
          <ResourcePicker
            resourceType="Product"
            showVariants={true}
            allowMultiple={true}
            open={this.state.open}
            onSelection={this.onProductAdd}
            onCancel={() => {
              if (this._isMounted) {
                this.setState({open: false});
              }
            }}
          />
          <Card title="Sally Hot Deals Collection" primaryFooterAction={{content: 'Add products', onAction: this.onResourcePickerOpen}}>
            <Card.Section>
              <p>
                Collection of products that Sally will offer to customers
              </p>
            </Card.Section>
            <Card.Section>
              <ResourceList
                resourceName={resourceName}
                items={this.state.deals.products}
                renderItem={this.renderItem}
                selectedItems={this.state.selectedItems}
                onSelectionChange={this.handleSelectionChange}
                promotedBulkActions={promotedBulkActions}
              />
            </Card.Section>
          </Card>
        </Layout.AnnotatedSection>
      );
    }
  }

  render() {

    let shippingBtnText = this.state.discount.free_shipping.id ? "Manage Price-Rule" : "Activate Price-Rule";
    let percentageBtnText = this.state.discount.percentage.id ? "Manage Price-Rule" : "Activate Price-Rule";

    if (this.state.discount) {
      return(
        <Page
          title="Coupons"
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
              title="Discount Codes"
              description="Keep the love of your loyal customers with Sally promo codes! Provide discount codes & free shipping coupons, and see them returning again and again."
            >
              <Card sectioned title="Sally free shipping"
                    primaryFooterAction={{content: shippingBtnText, onAction: this.onFreeShippingClicked}}>
                <p>
                  Reward your customers with free shipping
                </p>
              </Card>
              <Card sectioned title="Sally Sale" primaryFooterAction={{content: percentageBtnText, onAction: this.onPercentageClicked}}>
                <p>
                  Reward your customers with customized promo codes
                </p>
              </Card>
            </Layout.AnnotatedSection>
            {this.renderHotDeals()}
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

export default Coupons;
