import {
  ORDER_CREATE_FAILURE,
  ORDER_CREATE_REQUEST,
  ORDER_CREATE_SUCCESS,
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
