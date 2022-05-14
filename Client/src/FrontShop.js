import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import ManufacturerBlock from "./ManufacturerBlock";
import { Navigate } from 'react-router-dom';

const FrontShop = () =>{
    const [manufacturersAndItems, setManufacturersAndItems] = useState([]);

    function verifyAuth() {
        if(localStorage.getItem("token") && localStorage.getItem("user")) {
            const options = {headers:{
                Authorization: "Bearer " + localStorage.getItem("token")
            }};
            useEffect(()=>{
                fetch("http://localhost:4000/api/manufacturersAndItems", options)
                .then((response)=>response.json())
                .then((manufacturers)=>{
                    sortedManufacturers = manufacturers.sort(function(a, b) {
                        var nameA = a.name.toUpperCase();
                        var nameB = b.name.toUpperCase();
                        if (nameA < nameB) {
                          return -1;
                        }
                        if (nameA > nameB) {
                          return 1;
                        }
                        return 0;
                      });
                    setManufacturersAndItems(sortedManufacturers);
                });
            }, []);

            return true;
        }
        else {
            return false;
        }
    }

    if(verifyAuth()){
        return(
            <div>
                <Header />
                <form onSubmit={
                    (e)=>{
                        e.preventDefault();
                    }
                }>
                    <div>
                        {manufacturersAndItems.map((item)=>(<ManufacturerBlock key={item.id} manufacturer = {item}/>))}
                    </div>
                </form>
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

export default FrontShop;