import React, { useState } from "react";
import { render } from "react-dom";
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Cart from "./Cart";
import CartContext from "./CartContext";
import ManufacturerDetails from "./ManufacturerDetails";
import ManufacturerCU from "./ManufacturerCU";
import ItemDetails from "./ItemDetails";
import ItemCU from "./ItemCU";
import FrontShop from "./FrontShop";
import Favorites from "./Favorites";
import GetUsers from "./GetUsers";

const App = () => {
  const initialState = { 
    cart:[],
    cartCount:0,
    cartPrice:0,
    addItem: addItem,
    removeItem: removeFromCart,
    buyCart: buyCartItems
  }

  const [ appstate, setState ] = useState(initialState);

  function addItem(name, picture, price){
    let newList = appstate.cart;

    const newItem = {
        count:1,
        name:name,
        price:price,
        picture: picture
    }

    const filtered = newList.filter(i =>{
        return i.name === name;
    });

    if(filtered.length > 0){
        const pos = newList.map(i => { return i.name; }).indexOf(name);
        newList[pos].count += 1;
    }
    else{
        newList.push(newItem);
    }
    setState({...appstate, cart:newList, cartPrice:getCartPrice(), cartCount:getCartCount()});
  }

  function removeFromCart(item){
    const cartList = appstate.cart;

    cartList.splice(item,1);

    setState({...appstate, cart:cartList, cartPrice:getCartPrice(), cartCount:getCartCount()});
  }

  function buyCartItems(){
    setState({...appstate, cart:[], cartPrice:0, cartCount:0});
  }

  function getCartCount(){
    let count = 0;

    if(appstate.cart.length > 0){
        appstate.cart.forEach(i => {
        count += i.count;
      });
    }
    
    return count;
  }

  function getCartPrice(){
    let price = 0;

    if(appstate.cart.length > 0){
        appstate.cart.forEach(i => {
          price += (i.price*i.count);
      });
    }
    
    return price;
  }

  return (
    <div>
        <CartContext.Provider value={appstate}>
          <Router>
            <Routes>
              <Route path="/getAllUsers" element={<GetUsers />} />
              <Route path="/:manufacturerID/item/:action" element={<ItemCU />} />
              <Route path="/:manufacturerID/details/:itemID/:action" element={<ItemCU />} />
              <Route path="/:manufacturerID/details/:itemID" element={<ItemDetails />} />
              <Route path="/:manufacturerID/:action" element={<ManufacturerCU />} />
              <Route path="/:manufacturerID" element={<ManufacturerDetails />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<FrontShop />} exact />
            </Routes>
          </Router>
        </CartContext.Provider>
    </div>
  );
};

render(<App />, document.getElementById("root"));