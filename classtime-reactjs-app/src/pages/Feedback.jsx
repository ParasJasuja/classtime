import React, { useState } from 'react'
import Time from '../components/Time'
import "../styles/feedback.css";
import Loading from '../components/Loading';
import Popup from '../components/Popup';

function Feedback() {

    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState({
        name: "",
        feedback: "",
        email: ""
    });

    const close = (value) =>{
        setResponse(value);
    }

    const submitFeedback = (e)=>{
        e.preventDefault();
        setLoading(true);
        fetch("https://calm-mountain-47420.herokuapp.com/more/feedback",{
            method: "POST",
            headers : {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(feedback),
        }).then((res)=>{
            if(!res.ok){
                throw (new Error("Unable to submit"));
            }
            return res.json();
        }).then((data)=>{
            setResponse(data.response);
            setLoading(false);
        }).catch((err)=>{
            setResponse(err);
            setLoading(false);
        });
    }
    const changeFeedback = (e)=>{
        const value = e.target.value;
        const fild = e.target.name;
        setFeedback((prvs)=>{
            return ({
                ...prvs,
                [fild]: value 
            })
        });
    }

    return (
        <div className="feedback-container">
            <Time />
            <div className="container">
            <h3 className="heading">Feedback / Suggestion</h3>
                <form className="feedback" onSubmit={submitFeedback} >
                    <span><label style={{flex: "1"}}>Name</label><input  className="write-input" style={{flex: "1"}} name="name" value={feedback.name} type="text" placeholder="Name" autoComplete="off" onChange={changeFeedback} required /></span>
                    <span style={{marginTop: "10px"}}><label style={{flex: "1"}}>Email</label><input  className="write-input" style={{flex: "1"}} name="email" value={feedback.email} type="email" placeholder="Name" autoComplete="off" onChange={changeFeedback} required /></span>
                    <span><label style={{flex: "1"}}>Feedback</label><textarea className="write-input" style={{flex: "1"}} name="feedback" value={feedback.feedback} placeholder="Feedback" onChange={changeFeedback} /></span>
                    <button className="btn" >Submit</button>
                </form>
            </div>
            {loading ? <Loading /> : (response && <Popup btn={true} close={close}><h3>{response}</h3></Popup>) }
        </div>
    )
}

export default Feedback;
