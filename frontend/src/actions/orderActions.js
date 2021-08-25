import {
  ORDER_CREATE_FAILURE,
  ORDER_CREATE_REQUEST,
  ORDER_CREATE_SUCCESS,
  ORDER_DETAILS_REQUEST,
  ORDER_DETAILS_FAILURE,
  ORDER_DETAILS_SUCCESS,
  ORDER_PAY_REQUEST,
  ORDER_PAY_FAILURE,
  ORDER_PAY_SUCCESS,
} from "../constants/orderConstants";
import axios from "axios";
import { CLEAR_CART_ITEMS } from "../constants/cartConstants";
export const createOrder = (order) => async (dispatch, getState) => {
  dispatch({ type: ORDER_CREATE_REQUEST, payload: order });
  try {
    const {
      userSignIn: { userInfo },
    } = getState();
    const { data } = await axios.post("/api/orders", order, {
      headers: { Authorization: `Bearer ${userInfo.data}` },
    });
    dispatch({ type: ORDER_CREATE_SUCCESS, payload: data.order });
    dispatch({ type: CLEAR_CART_ITEMS });
    localStorage.removeItem("cartItems");
  } catch (err) {
    dispatch({
      type: ORDER_CREATE_FAILURE,
      payload:
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message,
    });
  }
};

export const detailsOrder = (orderId) => async (dispatch, getState) => {
  dispatch({ type: ORDER_DETAILS_REQUEST, payload: orderId });
  const {
    userSignIn: { userInfo },
  } = getState();
  try {
    const { data } = await axios.get(`/api/orders/${orderId}`, {
      headers: { Authorization: `Bearer ${userInfo.data}` },
    });
    dispatch({ type: ORDER_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    dispatch({ type: ORDER_DETAILS_FAILURE, payload: message });
  }
};

export const payOrder =
  (order, paymentResult) => async (dispatch, getState) => {
    dispatch({ type: ORDER_PAY_REQUEST, payload: { order, paymentResult } });
    const {
      userSignIn: { userInfo },
    } = getState();
    try {
      const { data } = axios.put(
        `/api/orders/${order._id}/pay`,
        paymentResult,
        {
          headers: { Authorization: `Bearer ${userInfo.data}` },
        }
      );
      dispatch({ type: ORDER_PAY_SUCCESS, payload: data });
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      dispatch({ type: ORDER_PAY_FAILURE, payload: message });
    }
  };
