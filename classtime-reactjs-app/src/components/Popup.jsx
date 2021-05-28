import React from 'react';
import CloseIcon from '@material-ui/icons/Close';
import "../styles/Popup.css";

function Popup(props) {

    const closePopup = ()=>{
        props.close(null);
    }

    return (
        <div className="Popup">
        <div className="container">
            {props.children}
            {props.btn && <button className="cancel-btn add-btn" onClick={closePopup} ><CloseIcon /></button>}
        </div>
            
        </div>
    )
}

export default Popup
