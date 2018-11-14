let messangerUrl;
let emailUrl = `https://gateway.prd-c4.chaterr.me?topic=register_gateway&PFN=AFTER_SALE.SALLY_BOT&order_id=${Shopify.checkout.order_id}&phone=${Shopify.checkout.billing_address.phone}&email=${Shopify.checkout.email}&gateway=email&redirect_url=sallybot.com/pages/sally4u`;
let smsUrl = `https://gateway.prd-c4.chaterr.me?topic=register_gateway&PFN=AFTER_SALE.SALLY_BOT&order_id=${Shopify.checkout.order_id}&phone=${Shopify.checkout.billing_address.phone}&email=${Shopify.checkout.email}&gateway=sms&redirect_url=sallybot.com/pages/sally4u`;

if(Shopify.shop === 'sally-demo-store.myshopify.com') {
  messangerUrl = `https://m.me/SallyDemoBot?ref=RefFlag_SHOP__Project_${Shopify.shop}__Episode_GET_STARTED__OrderID_${Shopify.checkout.order_id}`;
} else {
  messangerUrl = `https://m.me/SallyTheChatbot?ref=RefFlag_SHOP__Project_${Shopify.shop}__Episode_GET_STARTED__OrderID_${Shopify.checkout.order_id}`;
}

  let sally = `
<body>
  <style type='text/css'>
  .button {
    display: inline-block;
    border-radius: 4px;
    background-color: #ccc;
    border: none;
    color: #FFFFFF;
    text-align: center;
    padding: 15px 40px;
    transition: all 0.5s;
    cursor: pointer;
    margin: 5px;
  }
  .button-blue {
    display: inline-block;
    border-radius: 4px;
    background-color: #337ab7;
    border: 1px;
    color: #FFFFFF;
    text-align: center;
    padding: 15px 50px;
    margin: 5px;
  }
  
  .container {
      width: inherit;
      display: inline-block;
      padding: 15px;
  }
  
  .sally-communication {
    text-align: center;
    padding-top: 15px;
  }
  </style>
  <script>
    document.getElementById("messengerId").setAttribute("href", messangerUrl);
    document.getElementById("emailId").setAttribute("href", emailUrl);
    document.getElementById("smsId").setAttribute("href", smsUrl);
  </script>
    <div class="container">
      <div>
        <div class="sally-img">
            <img src="https://cdn.shopify.com/s/files/1/2698/3700/files/sally_fb_icon_white.png?9133779576256027821" width="15%" />
        </div>
        <div class="sally-text">
          <h2 class="os-step__title">Hi, I’m Sally!</h2>
          <P>I can give you full support with shipping status, personal updates and much more. Please choose your channel:</P>
        </div>
      </div>
      <div class="sally-communication">
          <a id="messengerId" class="button-blue" target="_blank">Messenger</a>
          <a id="emailId" target="_blank" class="button">Email</a>
          <a id="smsId" target="_blank"  class="button">SMS</a>
      </div>
   </div>
</body>
`;
Shopify.Checkout.OrderStatus.addContentBox(sally);