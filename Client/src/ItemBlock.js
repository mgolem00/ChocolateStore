import React from 'react';
import { Link } from "react-router-dom";

const ItemBlock = ({item, manufacturerID}) => {
    return(
        <div>
            <Link to={`/${manufacturerID}/details/${item.item_id}`}>
                <button >
                    <img src={item.picture}></img>
                    <p>{item.item_name}: <br/><br/>{item.price} KN</p>
                </button>
            </Link>
        </div>
    )
}

export default ItemBlock;