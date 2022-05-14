import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import Header from "./Header";
import Footer from "./Footer";
import { useNavigate, Navigate } from 'react-router-dom';

const ManufacturerDetails = () => {
    const { manufacturerID } = useParams();
    
    const [manufacturerState, setManufacturer] = useState({});

    const navigate = useNavigate();

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
                fetch(`http://localhost:4000/api/findManufacturer?manufacturerID=${manufacturerID}`, options)
                .then((response)=>response.json())
                .then((manufacturer)=>{
                    setManufacturer(manufacturer);
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
        
        fetch("http://localhost:4000/api/deleteManufacturer", {
            method: "DELETE",
            body: JSON.stringify({
                manufacturerID: manufacturerID
            }),
            headers: {"Content-type": "application/json;charset=UTF-8", Authorization: "Bearer " + localStorage.getItem("token")}
        })
        .then((resp)=>{
            console.log(resp);
            navigate('/');
        })
        .catch((err)=>console.log(err));
    }

    if(verifyAuth()){
        return(
            <div>
                <Header />
                <div className="manufacturerDetails">
                    <img src={manufacturerState.logo}/>
                    <p>
                        <b>Ime proizvođača: </b>{manufacturerState.name} <br/><br/>
                        <b>Godina osnutka: </b>{manufacturerState.yearFounded} <br/><br/>
                        <b>O proizvođaču: </b>{manufacturerState.desc} <br/><br/>
                    </p>
                </div>
                {
                verifyRole() ? (
                    <div className="CRUDActions">
                        <button onClick={(e) => {e.preventDefault(); navigate(`/${manufacturerID}/${"create"}`);}}><i className="material-icons">add</i> Proizvođač</button>
                        <button onClick={(e) => {e.preventDefault(); navigate(`/${manufacturerID}/item/${"create"}`);}}><i className="material-icons">add</i> Proizvod</button>
                        <button onClick={(e) => {e.preventDefault(); navigate(`/${manufacturerID}/${"update"}`);}}><i className="material-icons">edit</i> Proizvođač</button>
                        <button onClick={(e) => {handleDelete(e);}}><i className="material-icons">delete_forever</i> Proizvođač</button>
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
export default ManufacturerDetails;