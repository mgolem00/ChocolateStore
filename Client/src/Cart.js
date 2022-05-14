import React, { useContext } from 'react';
import CartContext from "./CartContext";
import Header from "./Header";
import Footer from "./Footer";
import { Navigate } from 'react-router-dom';

const Cart = () =>{

    const state = useContext(CartContext);

    function Removebutton(item){
        state.removeItem(state.cart.indexOf(item));
    }

    function verifyAuth() {
        if(localStorage.getItem("token") && localStorage.getItem("user")) {
            return true;
        }
        else {
            return false;
        }
    }

    if(verifyAuth()){
        if(state.cartCount > 0){
            return ( 
            <div>
                <Header />
                <form onSubmit={
                    (e)=>{
                        e.preventDefault();
                    }
                }>
                {state.cart.map((item) => {return (
                    <div key={item.item_id} className="cart">
                        <p>
                            <img src={item.picture}/>
                            <b>{item.name}</b> <br/>
                            Jedinična cijena: {item.price} KN <br/>
                            Broj komada: {item.count} <br/>
                            Cijena:{item.count*item.price} KN
                        </p>
                        <button className="cartRemove" onClick={()=>Removebutton(item)}><i className="material-icons">remove_shopping_cart</i></button>
                    </div>
                )})}
                <p>
                    Ukupna cijena: {state.cartPrice} KN<br/>
                    <button className="cartBuy" onClick={()=>state.buyCart()}>Kupi</button>
                </p>
                </form>
                <Footer />
            </div>
            )
        } 
        else{
            return (
                <div>
                    <Header />
                    <h1>Cart is empty</h1>
                    <Footer />
                </div>
            )
        }
    } 
    else{
        return (
            <Navigate to="/login" replace={true} />
        );
    }
}

export default Cart;