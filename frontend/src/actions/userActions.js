import {
  USER_PROFILE_REQUEST,
  USER_REGISTER_FAILURE,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_SIGNIN_FAILURE,
  USER_SIGNIN_REQUEST,
  USER_SIGNIN_SUCCESS,
  USER_SIGNOUT_SUCCESS,
  USER_PROFILE_SUCCESS,
  USER_PROFILE_FAILURE,
} from "../constants/userConstants";
import axios from "axios";
export const signin = (email, password) => async (dispatch) => {
  dispatch({ type: USER_SIGNIN_REQUEST, payload: { email, password } });

  try {
    const { data } = await axios.post("/api/login", { email, password });
    dispatch({ type: USER_SIGNIN_SUCCESS, payload: data });
    localStorage.setItem("userInfo", JSON.stringify(data));
  } catch (error) {
    dispatch({
      type: USER_SIGNIN_FAILURE,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const register = (userName, email, password) => async (dispatch) => {
  dispatch({
    type: USER_REGISTER_REQUEST,
    payload: { userName, email, password },
  });

  try {
    const { data } = await axios.post("/api/register", {
      userName,
      email,
      password,
    });
    dispatch({ type: USER_REGISTER_SUCCESS, payload: data });
    dispatch({ type: USER_SIGNIN_SUCCESS, payload: data });
    localStorage.setItem("userInfo", JSON.stringify(data));
  } catch (error) {
    dispatch({
      type: USER_REGISTER_FAILURE,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
export const detailsUser = (userId) => async (dispatch, getState) => {
  dispatch({ type: USER_PROFILE_REQUEST, payload: userId });
  const {
    userSignIn: { userInfo },
  } = getState();
  try {
    const { data } = await axios.get(`/api/user/${userId}`, {
      headers: { Authorization: `Bearer ${userInfo.data}` },
    });
    dispatch({ type: USER_PROFILE_SUCCESS, payload: data });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    dispatch({ USER_PROFILE_FAILURE, payload: message });
  }
};

export const signout = () => (dispatch) => {
  localStorage.removeItem("userInfo");
  localStorage.removeItem("cartItems");
  localStorage.removeItem("shippingAddress");
  dispatch({ type: USER_SIGNOUT_SUCCESS });
};
