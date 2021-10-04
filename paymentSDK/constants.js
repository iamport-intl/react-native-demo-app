export const initiateURL = {
  dev: 'https://dev-api.chaipay.io/api/',
  staging: 'https://staging-api.chaipay.io/api/',
  prod: 'https://api.chaipay.io/api/',
};

export const fetchMerchantsURL = {
  dev: 'https://dev-api.chaipay.io/',
  staging: 'https://staging-api.chaipay.io/',
  prod: 'https://api.chaipay.io/',
};

export const api = {
  initiatePayment: 'initiatePayment',
};

export const bodyParams = {
  chaipayKey: 'key',
  paymentChannel: 'pmt_channel',
  paymentMethod: 'pmt_method',
  merchantOrderId: 'merchant_order_id',
  amount: 'amount',
  currency: 'currency',
  billingAddress: 'billing_details',
  shippingAddress: 'shipping_details',
  orderDetails: 'order_details',
  successUrl: 'success_url',
  failureUrl: 'failure_url',
  signatureHash: 'signature_hash',
  redirectUrl: 'redirect_url',
};

export const requiredParams = [
  'chaipayKey',
  'paymentChannel',
  'paymentMethod',
  'merchantOrderId',
  'amount',
  'currency',
  // "signatureHash",
  'orderDetails',
  'billingAddress',
  'shippingAddress',
  'redirectUrl',
  'failureUrl',
  'successUrl',
  'secretKey/fetchHashUrl',
];

export const webBodyParams = {
  chaipayKey: 'chaipay_key',
  merchantOrderId: 'merchant_order_id',
  amount: 'amount',
  currency: 'currency',
  billingAddress: 'billing_details',
  shippingAddress: 'shipping_details',
  orderDetails: 'order_details',
  successUrl: 'success_url',
  failureUrl: 'failure_url',
  signatureHash: 'signature_hash',
  mobileRedirectUrl: 'mobile_redirect_url',
  merchantDetails: 'merchant_details',
  countryCode: 'country_code',
  expiryHours: 'expiry_hours',
  source: 'source',
  description: 'description',
  showShippingDetails: 'show_shipping_details',
  showBackButton: 'show_back_button',
  defaultGuestCheckout: 'default_guest_checkout',
  isCheckoutEmbed: 'is_checkout_embed',
};

export const webRequiredParams = [
  'chaipayKey',
  'merchantOrderId',
  'amount',
  'currency',
  'billingAddress',
  'shippingAddress',
  'orderDetails',
  'successUrl',
  'failureUrl',
  'signatureHash',
  'mobileRedirectUrl',
  'merchantDetails',
  'countryCode',
  'expiryHours',
  'source',
  'description',
  'showShippingDetails',
  'showBackButton',
  'defaultGuestCheckout',
  'isCheckoutEmbed',
];
