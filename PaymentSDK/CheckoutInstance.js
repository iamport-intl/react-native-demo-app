export default class CheckoutInstance {
  static instance = null;
  _state = {};

  static get inst() {
    if (CheckoutInstance.instance == null) {
      CheckoutInstance.instance = new CheckoutInstance();
    }
    return this.instance;
  }
  static get state() {
    return CheckoutInstance.inst._state;
  }
  static set state(state) {
    CheckoutInstance.inst._state = state;
  }
  static setState(state) {
    CheckoutInstance.inst._state = {
      ...CheckoutInstance.inst._state,
      ...state,
    };
  }
}
