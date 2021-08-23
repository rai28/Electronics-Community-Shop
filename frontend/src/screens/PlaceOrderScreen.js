import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import CheckOutNavigation from "../components/CheckOutNavigation";
import { createOrder } from "../actions/orderActions";
import { ORDER_CREATE_RESET } from "../constants/orderConstants";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
export default function PlaceOrderScreen(props) {
  const cart = useSelector((state) => state.cart);
  if (!cart.paymentMethod) {
    props.history.push("/checkout");
  }
  const orderCreate = useSelector((state) => state.orderCreate);
  const { loading, success, error, order } = orderCreate;
  const toPrice = (num) => Number(num.toFixed(2));
  cart.itemsPrice = toPrice(
    cart.cartItems.reduce((acm, com) => acm + com.qty * com.price, 0)
  );
  // shipping price --> to be implemented here we have fixed shipping price
  const shippingPrice = cart.itemsPrice > 500 ? 0 : 50;
  cart.shippingPrice = shippingPrice;
  cart.totalPrice = toPrice(cart.itemsPrice + shippingPrice);
  const dispatch = useDispatch();
  const PlaceOrderHandler = () => {
    dispatch(createOrder({ ...cart, orderItems: cart.cartItems }));
  };
  useEffect(() => {
    if (success) {
      props.history.push(`/order/${order._id}`);
      dispatch({ type: ORDER_CREATE_RESET });
    }
  }, [dispatch, props.history, order, success]);
  return (
    <div>
      <CheckOutNavigation step1 step2 step3 step4></CheckOutNavigation>
      <div className="row top">
        <div className="col-2">
          <ul>
            {/* Shipping Address Details  */}
            <li>
              <div className="card card-body">
                <h2>Shipping</h2>
                <p>
                  <strong>Name: </strong> {cart.shippingAddress.fullName} <br />
                  <strong>Address: </strong> {cart.shippingAddress.address},
                  {cart.shippingAddress.postalCode},{cart.shippingAddress.city},{" "}
                  {cart.shippingAddress.state}, {cart.shippingAddress.country}
                </p>
              </div>
            </li>
            {/* Payment Method  */}
            <li>
              <div className="card card-body">
                <h2>Payment</h2>
                <p>
                  <strong>Payment Method: </strong> {cart.paymentMethod}
                </p>
              </div>
            </li>
            {/*  Order Items */}
            <li>
              <div className="card card-body">
                <h2>Order Items</h2>
                <ul>
                  {cart.cartItems.map((item) => (
                    <li key={item.product}>
                      <div className="row">
                        <div>
                          <img
                            src={item.image}
                            alt={item.product}
                            className="small"
                          />
                        </div>
                        <div className="min-30">
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </div>
                        <div>
                          {item.qty} x Rs {item.price} = {item.qty * item.price}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          </ul>
        </div>
        <div className="col-1">
          <div className="card card-body">
            <ul>
              <li>
                <h2>Order Summary</h2>
              </li>
              <li>
                <div className="row">
                  <div>Items</div>
                  <div>Rs {cart.itemsPrice.toFixed(2)}</div>
                </div>
              </li>
              <li>
                <div className="row">
                  <div>Shipping</div>
                  <div>Rs {shippingPrice}</div>
                </div>
              </li>
              <li>
                <div className="row">
                  <div>order Total</div>
                  <div>Rs {cart.totalPrice.toFixed(2)}</div>
                </div>
                <li>
                  <button
                    type="button"
                    onClick={PlaceOrderHandler}
                    className="primary block"
                    disabled={cart.cartItems.length === 0}
                  >
                    Place Order
                  </button>
                </li>
              </li>
              {loading && <LoadingBox></LoadingBox>}
              {error && <MessageBox variant="danger">{error}</MessageBox>}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
