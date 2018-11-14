export const PlanName = {
  BASIC: "basic",
  PRO: "pro",
  SUPER: "super",
  ALL: 'all'
};

Object.freeze(PlanName);

export default [
  {
    name: 'basic',
    recommended: false,
    color: '#B3BCF5',
    img: './public/sallyPriceTableIcons.png',
    img_x_pos: '34',
    price: '9',
    currency: 'USD',
    title: 'Sally Basic',
    time: 'Month',
    description: 'For new and small shops with a low volume of purchases',
    fee: '3%',
    planList: [
      { feature: '500 monthly users', tooltip: null },
      {
        feature: 'Push notifications',
        tooltip:
          'After the order is placed, Sally will provide your shoppers with order confirmation and fulfillment update, once the goods are received, Sally will send them satisfaction survey and even ask for a social review (via designated link).',
      },
      {
        feature: 'Customer support',
        tooltip:
          'Sally will receive and handle your customers’ queries with built-in NLP & customized FAQs, if the issue is too complex, she will redirect it to your live representatives. Sally will also provide your returns policy to help with returns matters.',
      },
    ],
  },
  {
    name: 'pro',
    recommended: true,
    color: '#5C6AC4',
    img: './public/sallyPriceTableIcons.png',
    img_x_pos: '-100',
    price: '149',
    currency: 'USD',
    title: 'Sally Pro',
    time: 'Month',
    description:
      'For medium-size shops that want to provide better service and WISMO updates',
    fee: '2%',
    planList: [
      { feature: '2,000 monthly users', tooltip: null },
      { feature: 'Sally Basic features', tooltip: null },
      {
        feature: 'Shipping alerts (via Aftership)',
        tooltip:
          'Sally will alert your shoppers, via push notifications on FB messenger, about every step of the way throughout the shipping process (i.e shipping status with AfterShip)',
      },
    ],
  },
  {
    name: 'super',
    recommended: false,
    color: '#202E78',
    img: './public/sallyPriceTableIcons.png',
    img_x_pos: '-237',
    price: '449',
    currency: 'USD',
    title: 'Super Sally',
    time: 'Month',
    description: 'For shops who want Sally branded in their own tone of voice',
    fee: '1%',
    planList: [
      { feature: '10,000 monthly users', tooltip: null },
      {
        feature: 'Sally Pro features',
        tooltip:
          'SuperSally will integrate to your currier if you don’t use AfterShip',
      },
      {
        feature: 'Branded Sally',
        tooltip:
          'You call it “Look&Feel”, we call it “Tone&Voice” - SuperSally will tailor herself to your brand! By using your own FB page, bot name, customized photos and tone&voice, Sally will transform into the perfect in-house post-purchase assistant!',
      },
    ],
  },
];
