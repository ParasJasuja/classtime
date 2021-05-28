import React from 'react';
import "../styles/Loading.css";
import AutorenewIcon from '@material-ui/icons/Autorenew';

function Loading() {
    return (
        <div className="Loading">
            <AutorenewIcon fontSize="large" className="Loading-icon" />
        </div>
    )
}

export default Loading
