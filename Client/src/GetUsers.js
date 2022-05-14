import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";

const GetUsers = () =>{

    const [allUsers, setAllUsers] = useState([]);

    const options = {headers:{
        Authorization: "Bearer " + localStorage.getItem("token")
    }};

    useEffect(()=>{
        fetch(`http://localhost:4000/api/getUsers`, options)
        .then((response)=>response.json())
        .then((users)=>{
            setAllUsers(users);
        }).catch((err)=>(console.log(err)));
    }, []);


    return(
        <div>
            <Header />
            <div>
                {allUsers.map((user)=>(<label>{user.username}<br/></label>))}
            </div>
            <Footer />
        </div>
    );
}

export default GetUsers;