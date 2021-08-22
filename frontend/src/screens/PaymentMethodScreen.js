import React, { useState } from "react";
import CheckOutNavigation from "../components/CheckOutNavigation";
import { useDispatch, useSelector } from "react-redux";
import { savePaymentMethod } from "../actions/cartActions";
export default function PaymentMethodScreen(props) {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;
  if (!shippingAddress.address) {
    props.history.push("/shipping");
  }
  const [paymentMethod, setPaymentMethod] = useState("Paytm");
  const dispatch = useDispatch();
  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    props.history.push("/placeorder");
  };
  return (
    <div>
      <CheckOutNavigation step1 step2 step3></CheckOutNavigation>
      <form className="form" onSubmit={submitHandler}>
        <div>
          <h1>Choose Your Payment Method</h1>
        </div>

        <div>
          <div>
            <input
              type="radio"
              name="paymentMethod"
              value="Paytm"
              id="paytm"
              required
              checked
              onChange={(e) => setPaymentMethod(e.target.value)}
            ></input>
            <label htmlFor="paytm"> Paytm </label>
          </div>
        </div>

        <div>
          <div>
            <input
              type="radio"
              name="paymentMethod"
              value="PayPal"
              id="paypal"
              required
              onChange={(e) => setPaymentMethod(e.target.value)}
            ></input>
            <label htmlFor="paypal"> PayPal </label>
          </div>
        </div>

        <div>
          <div>
            <input
              type="radio"
              name="paymentMethod"
              value="Stripe"
              id="stripe"
              required
              onChange={(e) => setPaymentMethod(e.target.value)}
            ></input>
            <label htmlFor="stripe"> Stripe </label>
          </div>
        </div>
        <div>
          <button className="primary" type="submit">
            Proceed
          </button>
        </div>
      </form>
    </div>
  );
}
