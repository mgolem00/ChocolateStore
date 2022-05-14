import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import CartContext from './CartContext';

const Header = () =>{

    const { cartCount } = useContext(CartContext);

    //const [user, setUser] = useState({});
    let user = {};

    const verifyAuth = () => {
        if(localStorage.getItem("token")) {
            //console.log(localStorage.getItem("token"))
            //setUser(JSON.parse(localStorage.getItem("user")));
            user = JSON.parse(localStorage.getItem("user"));
            return true;
        }
        else {
            return false;
        }
    }

    return (
        <div>
            <div className="header">
                <h1>ČokoCraft</h1>
                <p>Dućan za craft čokolade</p>
            </div>

            <div className="navbar">
                <Link to='/'>
                    Shop
                </Link>

                {
                verifyAuth() ? (
                <div>
                    Dobrodošli, {user.username}!
                    <Link to='/cart'>
                        <i className="material-icons">shopping_cart</i> {'('+cartCount+')'}
                    </Link>
                    <Link to='/favorites'>
                        <i className="material-icons">favorite</i>
                    </Link>
                    <Link to='/login' onClick={()=>{
                        localStorage.removeItem("token");
                        localStorage.removeItem("user");
                    }}>
                        <i className="material-icons">exit_to_app</i>
                    </Link>
                </div>
                ):(
                <div>
                    <Link to='/cart'>
                        <i className="material-icons">shopping_cart</i> {'('+cartCount+')'}
                    </Link>
                    <Link to='/login'>Log in</Link>
                </div>
                )}
            </div>
        </div>
    );
}

export default Header;