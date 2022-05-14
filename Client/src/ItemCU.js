import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import Header from "./Header";
import Footer from "./Footer";
import { useNavigate } from 'react-router-dom';

const ItemCU = () =>{

    const navigate = useNavigate();
    
    const { manufacturerID, itemID, action } = useParams();

    const [item_name, setName] = useState("");
    const [weight, setWeight] = useState(0);
    const [price, setPrice] = useState(0);
    const [carbs, setCarbs] = useState(0);
    const [picture, setPicture] = useState("");

    function onChangeName(e) {
        setName(e.target.value);
    }
    function onChangeWeight(e) {
        setWeight(e.target.value);
    }
    function onChangePrice(e) {
        setPrice(e.target.value);
    }
    function onChangeCarbs(e) {
        setCarbs(e.target.value);
    }
    function onChangePicture(e) {
        setPicture(e.target.value);
    }

    function handleAction(e) {
        e.preventDefault();
        
        fetch(`http://localhost:4000/api/${action}Item`, {
            method: "POST",
            body: JSON.stringify({
                manufacturerID: manufacturerID,
                itemID: itemID,
                itemName: item_name,
                itemWeight: weight,
                itemPrice: price,
                itemCarbs: carbs,
                itemPicture: picture
            }),
            headers: {"Content-type": "application/json;charset=UTF-8", Authorization: "Bearer " + localStorage.getItem("token")}
        })
        .then((resp)=>resp.json())
        .then((data)=>{
            console.log(data);
            navigate('/');
        })
        .catch((err)=>console.log(err));
    }
    
    if(action === "update"){

        const options = {headers:{
            Authorization: "Bearer " + localStorage.getItem("token")
        }};

        useEffect(()=>{
            fetch(`http://localhost:4000/api/findItem?manufacturerID=${manufacturerID}&itemID=${itemID}`, options)
            .then((response)=>response.json())
            .then((item)=>{
                setName(item.item_name);
                setWeight(item.weight);
                setPrice(item.price);
                setCarbs(item.carbs);
                setPicture(item.picture);
            }).catch((err)=>(console.log(err)));
        }, []);
    }

    return(
        <div>
            <Header />
            <div className="CRUD">
                <div className="CRUDBlock">
                    <label htmlFor="item_name">Name</label>
                    <input
                        type="text"
                        value={item_name}
                        onChange={onChangeName}
                        onBlur={onChangeName}
                    ></input>
                </div>
                
                <div className="CRUDBlock">
                    <label htmlFor="weight">Weight</label>
                    <input
                        type="number"
                        value={weight}
                        onChange={onChangeWeight}
                        onBlur={onChangeWeight}
                    ></input>
                </div>
                
                <div className="CRUDBlock">
                    <label htmlFor="price">Price</label>
                    <input
                        type="number"
                        value={price}
                        onChange={onChangePrice}
                        onBlur={onChangePrice}
                    ></input>
                </div>
                
                <div className="CRUDBlock">
                    <label htmlFor="carbs">Carbs</label>
                    <input
                        type="number"
                        value={carbs}
                        onChange={onChangeCarbs}
                        onBlur={onChangeCarbs}
                    ></input>
                </div>

                <div className="CRUDBlock">
                    <label htmlFor="picture">Picture URL</label>
                    <input
                        type="text"
                        value={picture}
                        onChange={onChangePicture}
                        onBlur={onChangePicture}
                    ></input>
                </div>
                
                <div>
                    <button className="CRUDApply" onClick={(e) => {handleAction(e);}}>Apply</button>
                    <button className="CRUDCancel" onClick={(e) => {e.preventDefault(); navigate('/');}}>Cancel</button>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default ItemCU;