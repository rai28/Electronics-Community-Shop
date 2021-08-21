import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { register } from "../actions/userActions";
export default function RegisterScreen(props) {
  // set email and password to empty string
  const [userName, setuserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const redirect = props.location.search
    ? props.location.search.split("=")[1]
    : "/";

  const userRegister = useSelector((state) => state.userRegister);
  const { userInfo, loading, error } = userRegister;

  const dispatch = useDispatch();
  // submit handler for signin form
  function submitHandler(e) {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
    } else {
      // dispatch signin action
      dispatch(register(userName, email, password));
    }
  }
  // if user is signed in, redirect to redirect variable
  useEffect(() => {
    if (userInfo) {
      props.history.push(redirect);
    }
  }, [props.history, redirect, userInfo]);
  return (
    <div>
      <form className="form-signin" onSubmit={submitHandler}>
        <div>
          <h1>Register Here</h1>
        </div>
        {loading && <LoadingBox></LoadingBox>}
        {error && <MessageBox variant="danger">{error}</MessageBox>}

        {/* userName field */}

        <div>
          <label htmlFor="userName">Name</label>
          <input
            type="text"
            id="userName"
            placeholder="Enter your Name"
            required
            onChange={(e) => setuserName(e.target.value)}
          />
        </div>

        {/* Email address field */}

        <div>
          <label htmlFor="inputEmail">Email address</label>
          <input
            type="email"
            id="email"
            placeholder="Email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* password */}

        <div>
          <label htmlFor="inputEmail">Password</label>
          <input
            type="password"
            id="password"
            placeholder="****"
            autoComplete="on"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Confirm Password Field */}

        <div>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            placeholder="****"
            autoComplete="on"
            required
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <div>
          <label />
          <button className="primary" type="submit">
            Register
          </button>
        </div>
        <div>
          <label />
          <div>
            Already a user ?{" "}
            <Link to={`/signin?redirect=${redirect}`}>Login Here</Link>
          </div>
        </div>
      </form>
    </div>
  );
}
