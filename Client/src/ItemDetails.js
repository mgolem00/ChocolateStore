import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router";
import CartContext from "./CartContext";
import Header from "./Header";
import Footer from "./Footer";
import { Navigate, useNavigate } from 'react-router-dom';

const ItemDetails = () => {
    const cart = useContext(CartContext);
    
    const { manufacturerID, itemID } = useParams();

    const navigate = useNavigate();
    
    const [itemState, setItem] = useState({});

    function verifyRole() {
        let user = JSON.parse(localStorage.getItem("user"));
        let isAdmin = user.admin;

        if(isAdmin) {
            return true;
        }
        else {
            return false;
        }
    }

    function verifyAuth() {
        if(localStorage.getItem("token") && localStorage.getItem("user")) {

            const options = {headers:{
                Authorization: "Bearer " + localStorage.getItem("token")
            }};

            useEffect(()=>{
                fetch(`http://localhost:4000/api/findItem?manufacturerID=${manufacturerID}&itemID=${itemID}`, options)
                .then((response)=>response.json())
                .then((item)=>{
                    setItem(item);
                }).catch((err)=>(console.log(err)));
            }, []);

            return true;
        }
        else {
            return false;
        }
    }

    function handleDelete(e) {
        e.preventDefault();
        
        fetch("http://localhost:4000/api/deleteItem", {
            method: "DELETE",
            body: JSON.stringify({
                manufacturerID: manufacturerID,
                itemID: itemID
            }),
            headers: {"Content-type": "application/json;charset=UTF-8", Authorization: "Bearer " + localStorage.getItem("token")}
        })
        .then((resp)=>{
            console.log(resp);
            navigate('/');
        })
        .catch((err)=>console.log(err));
    }

    function addFavorite(e) {
        e.preventDefault();

        let user = JSON.parse(localStorage.getItem("user"));
        
        fetch("http://localhost:4000/api/addToFavorite", {
            method: "POST",
            body: JSON.stringify({
                username: user.username,
                itemID: itemID
            }),
            headers: {"Content-type": "application/json;charset=UTF-8", Authorization: "Bearer " + localStorage.getItem("token")}
        })
        .then((resp)=>{
            console.log(resp);
        })
        .catch((err)=>console.log(err));

        let isInArrayIndex = user.favorites.findIndex((i) => {return i===itemID});
        if(isInArrayIndex === -1) {
            user.favorites.push(itemID);
        }
        else {
            user.favorites.splice(isInArrayIndex, 1);
        }

        localStorage.removeItem("user");
        localStorage.setItem("user", JSON.stringify(user));
    }

    if(verifyAuth()){
        return(
            <div>
                <Header />
                <div className="manufacturerDetails">
                    <img src={itemState.picture} className="itemImg"/>
                    <div>
                        <h1>{itemState.item_name}</h1> <br/><br/>
                        <p>
                            <b>Težina: </b>{itemState.weight} g<br/><br/>
                            <b>Ugljikohidrati: </b>{itemState.carbs} g<br/><br/>
                            <b>Cijena: </b>{itemState.price} KN<br/><br/>
                            <button className="cartBuy" onClick={()=>(cart.addItem(itemState.item_name, itemState.picture, itemState.price))}><i className="material-icons">add_shopping_cart</i></button>
                            <button className="cartBuy" onClick={(e) => {addFavorite(e);}}><i className="material-icons">favorite</i></button>
                        </p>
                    </div>
                </div>
                {
                verifyRole() ? (
                    <div className="CRUDActions">
                        <button onClick={(e) => {e.preventDefault(); navigate(`/${manufacturerID}/details/${itemID}/${"update"}`);}}><i className="material-icons">edit</i></button>
                        <button onClick={(e) => {handleDelete(e);}}><i className="material-icons">delete_forever</i></button>
                    </div>
                ):null
                }
                <Footer />
            </div>
        );
    } 
    else{
        return (
            <Navigate to="/login" replace={true} />
        );
    }
}
export default ItemDetails;