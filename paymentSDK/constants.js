
export const initiateURL = {
    "test":"https://dev-api.chaipay.io/api/",
    // "test":"https://593aac22f56b.ngrok.io/api/",
    "prod":"https://api.chaipay.io/api/"
}

export const api = {
    "initiatePayment":"initiatePayment"
}

export const bodyParams = {
    "chaipayKey":"key",
    "paymentChannel":"pmt_channel",
    "paymentMethod":"pmt_method",
    "merchantOrderId":"merchant_order_id",
    "amount":"amount",
    "currency":"currency",
    "billingAddress":"billing_details",
    "shippingAddress":"shipping_details",
    "orderDetails":"order_details",
    "successUrl":"success_url",
    "failureUrl":"failure_url",
    "signatureHash":"signature_hash",
    "redirectUrl":"redirect_url"
}

export const requiredParams = [
    "chaipayKey",
    "paymentChannel",
    "paymentMethod",
    "merchantOrderId",
    "amount",
    "currency",
    // "signatureHash",
    "orderDetails",
    "billingAddress",
    "shippingAddress",
    "redirectUrl",
    "failureUrl",
    "successUrl",
    "secretKey/fetchHashUrl"
]