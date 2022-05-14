import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import Header from "./Header";
import Footer from "./Footer";
import { useNavigate } from 'react-router-dom';

const ManufacturerCU = () =>{

    const navigate = useNavigate();
    
    const { manufacturerID, action } = useParams();

    const [name, setName] = useState("");
    const [yearFounded, setYearFounded] = useState(0);
    const [logo, setLogo] = useState("");
    const [desc, setDesc] = useState("");

    function onChangeName(e) {
        setName(e.target.value);
    }
    function onChangeYearFounded(e) {
        setYearFounded(e.target.value);
    }
    function onChangeLogo(e) {
        setLogo(e.target.value);
    }
    function onChangeDesc(e) {
        setDesc(e.target.value);
    }

    function handleAction(e) {
        e.preventDefault();
        
        fetch(`http://localhost:4000/api/${action}Manufacturer`, {
            method: "POST",
            body: JSON.stringify({
                manufacturerID: manufacturerID,
                name: name,
                yearFounded: yearFounded,
                logo: logo,
                desc: desc
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
            fetch(`http://localhost:4000/api/findManufacturer?manufacturerID=${manufacturerID}`, options)
            .then((response)=>response.json())
            .then((manufacturer)=>{
                setName(manufacturer.name);
                setYearFounded(manufacturer.yearFounded);
                setLogo(manufacturer.logo);
                setDesc(manufacturer.desc);
            }).catch((err)=>(console.log(err)));
        }, []);
    }

    return(
        <div>
            <Header />
            <div className="CRUD">
                <div className="CRUDBlock">
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={onChangeName}
                        onBlur={onChangeName}
                    ></input>
                </div>
                
                <div className="CRUDBlock">
                    <label htmlFor="yearFounded">Year founded</label>
                    <input
                        type="number"
                        value={yearFounded}
                        onChange={onChangeYearFounded}
                        onBlur={onChangeYearFounded}
                    ></input>
                </div>
                
                <div className="CRUDBlock">
                    <label htmlFor="logo">Logo URL</label>
                    <input
                        type="text"
                        value={logo}
                        onChange={onChangeLogo}
                        onBlur={onChangeLogo}
                    ></input>
                </div>
                
                <div className="CRUDBlock">
                    <label htmlFor="desc">Description</label>
                    <input
                        type="text"
                        value={desc}
                        onChange={onChangeDesc}
                        onBlur={onChangeDesc}
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

export default ManufacturerCU;