import React from "react";

export default function CheckOutNavigation(props) {
  return (
    <div className="row checkout-steps">
      <div className={props.step1 ? "active" : ""}>1. Sign-In</div>
      <div className={props.step2 ? "active" : ""}>2. Shipping</div>
      <div className={props.step3 ? "active" : ""}>3. Payment</div>
      <div className={props.step4 ? "active" : ""}>4. Order</div>
    </div>
  );
}
