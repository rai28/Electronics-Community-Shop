import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { signin } from "../actions/userActions";
export default function SigninScreen(props) {
  // set email and password to empty string
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const redirect = props.location.search
    ? props.location.search.split("=")[1]
    : "/";

  const userSignIn = useSelector((state) => state.userSignIn);
  const { userInfo, loading, error } = userSignIn;

  const dispatch = useDispatch();
  // submit handler for signin form
  function submitHandler(e) {
    e.preventDefault();
    // dispatch signin action
    dispatch(signin(email, password));
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
          <h1>Sign In</h1>
        </div>
        {loading && <LoadingBox></LoadingBox>}
        {error && <MessageBox variant="danger">{error}</MessageBox>}
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
        <div>
          <label />
          <button className="primary" type="submit">
            Sign In
          </button>
        </div>
        <div>
          <label />
          <div>
            New to our site?{" "}
            <Link to={`/register?redirect=${redirect}`}>Register Here</Link>
          </div>
        </div>
      </form>
    </div>
  );
}
