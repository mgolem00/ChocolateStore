import React from 'react';
import { Link } from "react-router-dom";
import ItemBlock from "./ItemBlock";

const ManufacturerBlock = ({manufacturer}) => {
    return(
        <div className="manufacturers">
            <Link to={`/${manufacturer.id}`}>
                <button className="manufacturerName">{manufacturer.name}</button>
            </Link>
            <div className="items">
                {manufacturer.items.map((i)=>(<ItemBlock key={i.item_id} item={i} manufacturerID={manufacturer.id}/>))}
            </div>
        </div>
    )
}

export default ManufacturerBlock;