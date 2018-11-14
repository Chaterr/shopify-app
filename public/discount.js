import { PlanName } from "../client/sallyPlans";

export const DiscountType = {
  FIXED_AMOUNT: "fixed_amount",
  PERCENTAGE: "percentage",
  TEST: "test",
};

Object.freeze(DiscountType);
export default [
  {
    shops: ['all'],
    discount_code: 'DiscountAll',
    discount_type: DiscountType.PERCENTAGE,
    discount_value: '70',
    plans: [PlanName.PRO, PlanName.SUPER],
    message: 'Enjoy 70% off "Sally Pro" and "Super Sally" plans'
  },
  {
    shops: ['sally-demo-store.myshopify.com'],
    discount_type: DiscountType.TEST,
    discount_value: '9.99',
    plans: [PlanName.BASIC, PlanName.PRO, PlanName.SUPER],
    message: 'This is a TEST shop, You will not be billed for this test charge :)'
  }
];