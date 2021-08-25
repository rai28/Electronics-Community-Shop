import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { detailsUser } from "../actions/userActions";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
export default function ProfileScreen() {
  const userSignIn = useSelector((state) => state.userSignIn);
  const { userInfo } = userSignIn;
  const userDetails = useSelector((state) => state.userDetails);
  const { loading, error, user } = userDetails;
  const dispatch = useDispatch();
  // ger user information from redux store
  useEffect(() => {
    dispatch(detailsUser(userInfo._id));
  }, [dispatch, userInfo._id]);
  const submitHandler = (e) => {
    e.preventDefault();
    // to do
  };
  return (
    <div>
      <form className="form" onSubmit={submitHandler}>
        <div>
          <h1>Profile</h1>
        </div>
        {loading ? (
          <LoadingBox></LoadingBox>
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <>
            <div>
              <label htmlFor="name">Name</label>
              <input type="text" id="name" value={user.userName} />
            </div>

            <div>
              <label htmlFor="email">Email</label>
              <input type="text" id="email" value={user.email} />
            </div>

            <div>
              <label htmlFor="password">Password</label>
              <input type="password" id="password" />
            </div>

            <div>
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input type="password" id="confirmPassword" />
            </div>

            <div>
              <label />
              <button type="submit" className="primary">
                Update
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}
