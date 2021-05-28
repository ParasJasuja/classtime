import React, { useState } from 'react';
import "../styles/AddLec.css";
import Time from './Time';
import EditAdd from './EditAdd';

function AddLec(props) {
    const [stream, setStream] = useState({
        class: "",
        sem: 0
    });

    const changeStream = (e)=>{
        const value = e.target.value;
        const keyName = e.target.name;
        setStream((prvs)=>{
            if(keyName === "sem"){
                return {
                    ...prvs,
                    [keyName]: Number(value)
                }
            }
            return {
                ...prvs,
                [keyName]: value
            }
        })
    }
    

    return (<>
        <Time />
        <div className="container add-new-class">
            <h2 className="heading" >Add New Class</h2>
            <span>
                <input className="write-input" type="text" name="class" value={stream.class} placeholder="Class" onChange={changeStream} autoComplete="off" required />
                <input className="write-input" type="number" min="1" max="8" name="sem" value={stream.sem} placeholder="Semester" onChange={changeStream} required />
            </span>
        </div>
        {stream.class!=="" && stream.sem !== 0 && <EditAdd controles={true} pageNo = {props.pageNo} stream={stream.class.toLocaleUpperCase()} semester={stream.sem} />}
    </>
    )
}

export default AddLec
