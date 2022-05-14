import React, { useState, useEffect } from 'react';
import Header from "./Header";
import Footer from "./Footer";
import ItemBlock from "./ItemBlock";
import { Navigate } from 'react-router-dom';

const Favorites = () =>{

    let manufacturerID;
    const [items, setItems] = useState([]);

    function verifyAuth() {
        if(localStorage.getItem("token") && localStorage.getItem("user")) {
            let user = JSON.parse(localStorage.getItem("user"));

            useEffect(()=>{
                let newItems = [];
                let counter = 0;
                user.favorites.map((i) => {
                    //manufacturerID = i.slice(0,1);
                    manufacturerID = i.substring(0, i.indexOf("_"));
                    let itemID = i;

                    const options = {headers:{
                        Authorization: "Bearer " + localStorage.getItem("token")
                    }};
        
                    fetch(`http://localhost:4000/api/findItem?manufacturerID=${manufacturerID}&itemID=${itemID}`, options)
                    .then((response)=>response.json())
                    .then((item)=>{
                        newItems.push(item);
                        counter++;
                        if(counter === user.favorites.length) {
                            setItems([...newItems]);
                        }
                    }).catch((err)=>(console.log(err)));
                })
            }, []);
            
            return true;
        }
        else {
            return false;
        }
    }

    if(verifyAuth()){
        return (
            <div>
                <Header />
                <div className="items">
                    {
                        items.map((i) => {
                            //manufacturerID = i.item_id.slice(0,1);
                            manufacturerID = i.item_id.substring(0, i.item_id.indexOf("_"));
                            return <ItemBlock key={i.item_id} item={i} manufacturerID={manufacturerID}/>
                        })
                    }
                </div>
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

export default Favorites;