import React, { useEffect } from 'react'
import Time from '../components/Time';
import "../styles/More.css";
import { Link } from 'react-router-dom';

function More() {
    // const submitNumber = ()=>{
    //     console.log("submited");
    // }
    useEffect(() => {
        if(document.getElementsByClassName("active").length>0){
            document.getElementsByClassName("active")[0].classList.remove("active");
        }
        document.querySelector("#more").classList.add("active");
    }, [])
    return (
        <div className="More">
            <Time />
            {/* <div className="mobile-text">
                <h1 className="heading">Enable Text Messages</h1>
                <form method="POST">
                    <input type="tel" name="number" placeholder="Mobile Number" minLength="10" maxLength="10" autoComplete="off" required />
                    <button type="submit" onClick={submitNumber} >Done</button>
                </form>
            </div> */}
            <div className="container">
                <span style={{color: "white"}}>Submit suggestion or feedback</span> <Link style={{cursor:"pointer", color:"blue"}} to="/more/feedback">here</Link>
            </div>
        </div>
    )
}

export default More
