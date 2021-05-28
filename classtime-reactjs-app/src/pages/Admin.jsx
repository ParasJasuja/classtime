import React, { useState } from 'react';
import "../styles/Admin.css";
import AddLec from '../components/AddLec';
import EditView from '../components/EditView';
import Loading from '../components/Loading';




function Admin() {
    const [pass, setPass] = useState("");
    const [pageNo, setPageNo] = useState("1");
    const [correct, setCorrect] = useState(false);
    const [feedbacks, setFeedbacks] = useState(null);
    const [loading, setLoading] = useState(false);

    const colapseFeedbacks = ()=>{
        setFeedbacks(null);
    }

    const setPassword = (e)=>{
        const password = e.target.value;
        setPass(password);
    }

    const getFeedbacks = (e) =>{
        e.preventDefault();
        setLoading(true);
        fetch("https://calm-mountain-47420.herokuapp.com/more/feedback")
        .then((res)=>{
            if(!res.ok){
                throw (new Error("Error occured"));
            }
            return res.json();
        })
        .then((data)=>{
            setFeedbacks(data);
            setLoading(false);
        })
        .catch((err)=>{
            setFeedbacks(null);
            console.log(err);
        })
    }

    const changePage = (e)=>{
        setPageNo(e.target.value);
    }

    const unlock = (e)=>{
        e.preventDefault();
        fetch("https://calm-mountain-47420.herokuapp.com/admin/login",{
            method: "POST",
            headers:{
                "Content-Type": "application/json",
            },
            body: JSON.stringify({pass: pass}),
        }).then((res)=>{
            if(!res.ok){
                throw (new Error("Someting Went Wrong Try again Later"));
            }
            return res.json();
        }).then((data)=>{
            if(data.response){
                setCorrect(false);
                document.querySelector("#adminPass").classList.add("disable");
            }else{
                setCorrect(true);
            }
        })
    }

    return (
        <div className="admin">
            <div className="container admin-control-bar">
                <button className="btn" value="1" style={pageNo === "1" ?{backgroundColor: "var(--active-color)"}:{backgroundColor: "var(--secondary-color)"}} onClick={changePage} >View/Edit</button>
                <button className="btn" value="2" style={pageNo ==="2" ?{backgroundColor: "var(--active-color)"}:{backgroundColor: "var(--secondary-color)"}} onClick={changePage} >Add New Class</button>
            </div>
            {pageNo === "1" ? <EditView pageNo={"1"} />  : (pageNo ==="2") && <AddLec pageNo={"2"} />  }
                <div id="adminPass" className="admin-password">
                    <form className="require-password" onSubmit={unlock} >
                        <h2>Enter Password</h2>
                        <span>
                            { correct && <p style={{color: "red", textAlign:"center", margin: "0 0 10px 0"}} >Incorrect Password</p>}
                            <input type="password" value={pass} id="pass" placeholder="Enter Password" onChange={setPassword} required />
                            <button type="submit" className="btn submit-button"  >Enter</button>
                        </span>
                    </form>
                </div>
                <div className="container" style={{marginBottom: "10px"}} >
                    <button className="btn" onClick={getFeedbacks} >Show Feedbacks</button>
                    {feedbacks && <button className="btn" onClick={colapseFeedbacks} >Close</button>}
                    {
                        feedbacks ? (feedbacks.length === 0 ? <h3 className="heading" >No Feedbacks Available</h3> : feedbacks.map((feed)=>{
                            return(<div key={feed._id} className="container" >
                                <h4>Name: {feed.name}</h4>
                                <h4>Email: {feed.email}</h4>
                                <h4>Feedback: {feed.feedback}</h4>
                            </div>)
                        }) ): (loading && <Loading /> )
                    }
                </div>
        </div>
    )
}

export default Admin;
