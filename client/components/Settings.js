import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Page, Card, ResourceList, TextStyle, Banner, Layout, Select, Subheading} from "@shopify/polaris";
import IconNotification from './style/notification.svg';
import IconApp from './style/app.svg';
import IconAgent from './style/agent.svg';
import IconFeedback from './style/feedback.svg';
import IconFaq from './style/faq.svg';
import IconReturn from './style/return.svg';
import IconCoupon from './style/coupon.svg';
import IconHotDeal from './style/hotDeal.svg';
import { Chart } from "react-google-charts";

import IconToneNVoice from './style/tonevoice.svg';
import IconCurriers from './style/curriers.svg';
import axios from "axios";

let sallyticsCount = 0;

const pieOptions = {
  title: "",
  pieHole: 0.6,
  slices: [
    {
      color: "#47C1BF",
      offset: 0.1
    },
    {
      color: "#5C6AC4"
    },
    {
      color: "#7c87d0"
    },
    {
      color: "#8f98d6"
    }
  ],
  // is3D:true,
  legend: {
    position: 'bottom',
    alignment: "center",
    textStyle: {
      color: "233238",
      fontSize: 12
    }
  },
  chartArea: {left:'auto',top:20,width:'80%',height:'75%'},
  width: '100%',
  height: '250px',
  tooltip: {
    showColorCode: true
  },
  backgroundColor: { fill:'transparent' },
  sliceVisibilityThreshold: 0
};

class Settings extends Component {
  constructor() {
    super();

    this.state = {
      analytics: {},
      selectedInterval: '7d',
      pieData: [],
      popover_active: false
    };

    this.onAnalyticsSelectChange = this.onAnalyticsSelectChange.bind(this);
    this._loadAnalyticsData = this._loadAnalyticsData.bind(this);
  }

  componentDidMount() {
    this._loadAnalyticsData('7d');
  }

  _loadAnalyticsData(time) {
    let axInstance = axios.create({ withCredentials: true });
    axInstance
      .get(`/analytics/${time}`)
      .then(response => response.data)
      .then(json => {
        let shippingInfo = json.shippingStatusMessage + json.shippingStatusTitle;
        sallyticsCount = json.sentToAgent + shippingInfo + json.trackingInfo;
        let pieD = [["", ""], ["Agent", json.sentToAgent], ["Shipping Info", shippingInfo], ["Tracking Info", json.trackingInfo]];
        // let pieD = [
        //   {title: "agent", value: json.sentToAgent, color: "#22594e"},
        //   {title: "request", value: reques , color: "#22594e"}
        // ];
        this.setState({ analytics: json, pieData: pieD });
      })
      .catch(err => console.log(err));
  }


  handlePlanBtnClicked(ev) {
    this.props.onPlanSelected(ev.target.id);
  }

  shopPartnerFriendly() {
    if(this.props.shop_plan === 'affiliate') {
      return(
        <Layout.Section>
          <Banner
            title="Partner Friendly"
            status="info"
          >
            <p>Sally is partner-friendly! Enjoy FREE access to all of Sally's features while the store is in development mode.</p>
          </Banner>
          <Banner
            title="Sally sends notifications to your shoppers. "
            status="warning"
          >
            <p>Please check the <Link to = '/notifications' className="Polaris-Link">Notifications page</Link> to manage settings.</p>
          </Banner>
        </Layout.Section>
      );
    } else {
      return (
        <Layout.Section>
          <Banner
            title="Sally sends notifications to your shoppers. "
            status="warning"
          >
            <p>Please check the <Link to = '/notifications' className="Polaris-Link">Notifications page</Link> to manage settings.</p>
          </Banner>
        </Layout.Section>
        );
    }
  }

  onAnalyticsSelectChange(val){
    this._loadAnalyticsData(val);
    this.setState({selectedInterval: val});
  };

  renderSallyticsNoDataMessage(){
    if(sallyticsCount == 0) return(
      <div style={{paddingLeft: "42%"}}>
        <Subheading>Not enough data</Subheading>
      </div>
    );
  }

  render() {
    const menu = [
      // {
      //   id: 'getstarted',
      //   title: 'Get Started',
      //   linkto: '/getStarted',
      //   description:
      //     'Personalizes the text on the “Thank you” page, and the order confirmation you send',
      //   icon: <i className="material-icons">code</i>,
      // },
      {
        id: 'notifications',
        title: 'Notifications',
        linkto: '/notifications',
        description: 'Manage notifications sent by Sally',
        icon: <IconNotification style={{ fill: '#454F5B' }} />,
      },
      {
        id: 'agent',
        title: 'Agent Escalation',
        linkto: '/agent',
        description:
          'Set the way your customers contact your live representatives',
        icon: <IconAgent style={{ fill: '#43467F' }} />,
      },
      {
        id: 'feedback',
        title: 'Feedback & Reviews',
        linkto: '/feedback',
        description:
          'Set the time Sally will send the survey and the place you like your customer to leave their review at',
        icon: <IconFeedback style={{ fill: '#50248F' }} />,
      },
      {
        id: 'returns',
        title: 'Returns',
        linkto: '/returns',
        description:
          'Help your clients with return policy & notify a live agent if any help needed with the return process',
        icon: <IconReturn style={{ fill: '#9C6ADE' }} />,
      },
      {
        id: 'faq',
        title: 'FAQ’s',
        linkto: '/faq',
        description: 'Answer your customers’ questions via customized FAQ’s',
        icon: <IconFaq style={{ fill: '#5C6AC4' }} />,
      },
      {
        id: 'plan',
        title: 'Choose your plan',
        linkto: '/plan',
        description: 'Upgrade or downgrade your plan of SallyBot',
        icon: <IconApp style={{ fill: '#007ACE' }} />,
      },
      {
        id: 'coupons',
        title: 'Coupons',
        linkto: '/coupons',
        description: 'Add promo codes & coupons here!',
        icon: <IconCoupon style={{ fill: '#47C1BF' }} />,
      },
      // {
      //   id: 'hotDeals',
      //   title: 'Hot Deals | Coming Soon',
      //   linkto: '/hot-deals',
      //   description:
      //     'Boost your best sellers with Sally! Here you can set the deals you’d like to promote.',
      //   icon: <IconHotDeal style={{ fill: '#00848E' }} />,
      // },
      // {
      //   id: 'toneNvoice',
      //   title: 'Tone & Voice | Coming Soon',
      //   linkto: '/tone-voice',
      //   description:
      //     'Make sally look & feel one with your brand. In Chatbot slang we call it “Tone&Voice”',
      //   icon: <IconToneNVoice style={{ fill: '#108043' }} />,
      // },
      // {
      //   id: 'curriers',
      //   title: 'Curriers | Coming Soon',
      //   linkto: '/curriers',
      //   description:
      //     'Set the curriers you work with and notify your clients on the shipping process live!',
      //   icon: <IconCurriers style={{ fill: '#173630' }} />,
      // },
    ];

    if(this.props.shop_plan === 'affiliate') {
      // menu.splice(5,1);
    }

    const options = [
      {label: '24 hours', value: '24h'},
      {label: '7 days', value: '7d'},
      {label: '14 days', value: '14d'},
      {label: '30 days', value: '30d'},
    ];

    return (
      <Page title="Home">
        <Layout>
          {this.shopPartnerFriendly()}
          <Layout.Section>
            <Card>
              <Card.Header title={'Sallytics - Sally vs Agent: customer requests handling'}>
                <Select
                  label={'Interval'}
                  labelInline={true}
                  options={options}
                  onChange={this.onAnalyticsSelectChange}
                  value={this.state.selectedInterval}
                />
              </Card.Header>
              <Card.Section>
                {this.renderSallyticsNoDataMessage()}
                <Chart
                  chartType="PieChart"
                  data={this.state.pieData}
                  options={pieOptions}
                  graph_id="PieChart"
                  width={'100%'}
                  legend_toggle
                />
              </Card.Section>
            </Card>
          </Layout.Section>
          <Layout.Section>
            <Card>
              <ResourceList
                items={menu}
                renderItem={(item) => {
                  const { id, title, linkto, description } = item;
                  const media = <span className={'backdrop'}>{item.icon}</span>;
                  return (
                    <Link
                      to={linkto}
                      style={{ textDecoration: 'none', color: 'black' }}
                    >
                      <ResourceList.Item id={id} media={media}>
                        <h3>
                          <TextStyle variation="strong">{title}</TextStyle>
                        </h3>
                        <div>{description}</div>
                      </ResourceList.Item>
                    </Link>
                  );
                }}
              />
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    );
  }
}

export default Settings;
