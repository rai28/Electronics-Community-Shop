import React from "react";
import { BrowserRouter, Link, Route } from "react-router-dom";
import HomeScreen from "./screens/HomeScreen";
import ProductScreen from "./screens/ProductScreen";
import CartScreen from "./screens/CartScreen";
import { useSelector } from "react-redux";
import SigninScreen from "./screens/SigninScreen";

function App() {
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  return (
    <BrowserRouter>
      <div className="grid-container">
        <header className="row">
          <div>
            <Link className="brand-logo" to="/">
              ECS Shop
            </Link>
          </div>
          <div>
            <Link to="/cart">
              {/* get cart badge from font-awesome */}
              <span>
                <i className="fa fa-shopping-cart" />
              </span>
              {cartItems.length > 0 && (
                <span className="badge badge-success">{cartItems.length}</span>
              )}
            </Link>
            <Link to="/signin">
              <i className="fa fa-user" />
            </Link>
          </div>
        </header>
        <main>
          <Route path="/cart/:id?" component={CartScreen}></Route>
          <Route path="/product/:id" component={ProductScreen}></Route>
          <Route path="/signin" component={SigninScreen}></Route>
          <Route path="/" component={HomeScreen} exact></Route>
        </main>
        <footer className="row center">Copyright &copy; ECS Shop</footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
