import React, { useEffect, useState } from 'react';
import AddIcon from '@material-ui/icons/Add';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import DeleteIcon from '@material-ui/icons/Delete';
import Popup from './Popup';
import Loading from './Loading';

function EditAdd(props) {

    const newId = props.id;
    const tempData = {
        class: props.stream,
        sem: props.semester,
        session: [],
        timetable: {
            monday: [{
                starttime: "",
                endtime: "",
                Lname: "",
                Tname: "",
                url: "",
                group: []
            }],
            tuesday: [{
                starttime: "",
                endtime: "",
                Lname: "",
                Tname: "",
                url: "",
                group: []
            }],
            wednesday: [{
                starttime: "",
                endtime: "",
                Lname: "",
                Tname: "",
                url: "",
                group: []
            }],
            thursday: [{
                starttime: "",
                endtime: "",
                Lname: "",
                Tname: "",
                url: "",
                group: []
            }],
            friday: [{
                starttime: "",
                endtime: "",
                Lname: "",
                Tname: "",
                url: "",
                group: []
            }]
        }}
    const [index,setIndex] = useState(0);
    const [id, setId] = useState("0");
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(false);
    const days = ['monday','tuesday','wednesday','thursday','friday'];
    const [selectDay, setSelectDay] = useState(days[0]);
    const [aClass, setAclass] = useState(props.aClass && props.aClass.class ? props.aClass : tempData );
    const [lec, setLec] = useState(
        {
        starttime: "",
        endtime: "",
        Lname: "",
        Tname: "",
        url: "",
        group: []
    });
    const [gp, setgp] = useState(
        {
            gp1 : false,
            gp2 : false,
            gp3 : false
        }
    )
// To change the value of all inputs with text
    const handleChange = (e)=>{
        const value = e.target.value;
        const lecKey = e.target.id;
        setLec((previousValue)=>{
            return ({
                ...previousValue,
                [lecKey]: value
            })
        })
    }


    const handelGroupChange = (e)=>{
        const checked = e.target.checked;
        const name = e.target.name;
        const value = Number(e.target.value);
        if(checked){
            setLec((prvs)=>{
                return ({
                    ...prvs,
                    group: [...prvs.group, value].sort(),
                });
            });
            setgp((prvs)=>{
                return({
                    ...prvs,
                    [name]: checked
                })
            })
        }else{
            setLec((prvs)=>{
                for(var i=0;i<prvs.group.length;i++){
                    if(prvs.group[i] === value){
                        prvs.group.splice(i,1);
                    }
                }
                return prvs;
            });
            setgp({
                gp1 : (lec.group.includes(1)),
                gp2 : (lec.group.includes(2)),
                gp3 : (lec.group.includes(3))
            });
        }
    }

    // perform changes when day value changes
    const changeDay = (e)=>{
        const value = e.target.value;
        setAclass((prvs)=>{
            if(lec.starttime !== "" && lec.endtime !== "" ){
                prvs.timetable[selectDay][index] = lec;
            }
            return prvs;
        });
        setSelectDay(value);
        setIndex(0); 
            
    }
    // To add new Lecture to the timetable
    const addIn = ()=>{
            setAclass((prvs)=>{
                if(lec.starttime !== "" && lec.endtime !== "" ){
                    prvs.timetable[selectDay][index] = lec;
                }
                return prvs;
            });
            setAclass((prvs)=>{
                prvs.timetable[selectDay].splice(index+1, 0, {
                    starttime: "",
                    endtime: "",
                    Lname: "",
                    Tname: "",
                    url: "",
                    group: []
                });
                return(prvs);
            });
            setIndex((prvs)=> prvs+1);
        
    }

    // delete lecture at index
    const delLec = ()=>{
        const end = aClass.timetable[selectDay].length;
        if(window.confirm("Are you sure you want to delete this lecture")){
            if(index !== 0){
                aClass.timetable[selectDay].splice(index,1);
            }
            if(index === 0){
                aClass.timetable[selectDay][index] = {
                    starttime: "",
                    endtime: "",
                    Lname: "",
                    Tname: "",
                    url: "",
                    group: []
                };
            }
            setIndex((prvs)=> {
                if(prvs !== 0){
                    return prvs-1;
                }
                if(prvs !== end-1){
                    return prvs+1;
                }
                return 0;
            });
        }
    }
    const changeCurrentLec = (e)=>{
        e.preventDefault();
        if(window.confirm("Are you sure you want to change Current Lecture")){
            const session = {
                stream: {
                    class: props.class,
                    sem: props.sem
                },
                lec: lec
            }
            setLoading(true);
            fetch("https://calm-mountain-47420.herokuapp.com/admin/edit/timetables/addsession",{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(session),
            }).then((res)=>{
                if(!res.ok){
                    throw (new Error("Unable to update"));
                }
                return res.json();
            }).then((data)=>{
                setLoading(false);
                if(data.err){
                    setResponse("Error Occured");
                }else{
                    setResponse(data.response);
                }
            }).catch((err)=>{
                console.log(err);
                setLoading(false);
                setResponse("Error Occured");
            });
        }
    }

    const sendFinal = (e)=>{
        e.preventDefault();
        if(window.confirm('Are you Sure you want to Submit ?')){
            setAclass((prvs)=>{
                if(lec.starttime !== "" && lec.endtime !== "" ){
                    prvs.timetable[selectDay][index] = lec;
                }
                return prvs;
            });
            setLoading(true);
            fetch("https://calm-mountain-47420.herokuapp.com/admin/edit/timetables",{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(aClass),
            }).then((res)=>{
                if(!res.ok){
                    throw (new Error("unable to post"));
                }
                return res.json();
            }).then((data)=>{
                setLoading(false);
                if(data.err){
                    setResponse("Error Occured");
                }else{
                    setResponse(data.response);
                }
            })
            .catch((err)=>{
                console.log(err);
            })
            
        }
    }

    const prev = (e)=>{
        setAclass((prvs)=>{
            if(lec.starttime !== "" && lec.endtime !== "" ){
                prvs.timetable[selectDay][index] = lec;
            }
            return prvs;
        });
        if(index !== 0 ){
            setIndex((prvs)=>(prvs-1));
            setLec(aClass.timetable[selectDay][index]);
        }
    }
    const next = (e)=>{
        const end = aClass.timetable[selectDay].length;
        setAclass((prvs)=>{
            if(lec.starttime !== "" && lec.endtime !== "" ){
                prvs.timetable[selectDay][index] = lec;
            }
            return prvs;
        });
        if(index < end-1){
            setIndex((prvs)=>(prvs+1));
        }
    }

    const closePopup = (val) => {
        setResponse(val);
    }

    if(newId !== id && props.aClass  ){
        setAclass(props.aClass.class ? props.aClass : tempData);
        setId(newId);
    }

    useEffect(() => {
            setLec(aClass.timetable[selectDay][index]);
            setgp({
                gp1 : (aClass.timetable[selectDay][index].group.includes(1)),
                gp2 : (aClass.timetable[selectDay][index].group.includes(2)),
                gp3 : (aClass.timetable[selectDay][index].group.includes(3))
            });
        
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [index, selectDay,id]);
    
    useEffect(()=>{
        if(props.lec){
            setLec(props.lec);
            setgp({
                gp1 : (props.lec.group.includes(1)),
                gp2 : (props.lec.group.includes(2)),
                gp3 : (props.lec.group.includes(3))
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    return (
    <div key={id}>
        <div  className="edit-lecture" >
            {props.controles && <> <h2 className="heading" >Edit Timetable</h2>
            <span style={{width:"100%",display:"flex",justifyContent:"space-between", padding:"0 16px", flexWrap: "wrap"}}>
                <select className="select-day" value={selectDay} onChange={changeDay}>
                    {days.map((day,index) => (
                        <option key={index} value={day}>{day.toLocaleUpperCase()}</option>
                    ))}
                </select>
                <span>
                    <button className="add-btn" onClick={prev} ><NavigateBeforeIcon /></button>
                    <button className="add-btn" onClick={next} ><NavigateNextIcon /></button>
                </span>
                <span>
                    <button className="add-btn" onClick={addIn} ><AddIcon /></button>
                    <button className="add-btn" onClick={delLec} ><DeleteIcon /></button>
                </span>
            </span></>}
            <form className="edit-form">
                <span>
                    <label>Start Time</label>
                    <input id="starttime" autoComplete="off" placeholder="Start Time" type="text" value={lec["starttime"]} onChange={handleChange} />
                </span>
                <span>
                    <label>End Time</label>
                    <input id="endtime" autoComplete="off" placeholder="End Time" type="text" value={lec.endtime} onChange={handleChange} />
                </span>
                <span>
                    <label>Lecture Name</label>
                    <input id="Lname" autoComplete="off"  placeholder="Lecture Name" type="text" value={lec.Lname} onChange={handleChange} />
                </span>
                <span>
                    <label>Teacher Name</label>
                    <input id="Tname" autoComplete="off" placeholder="Teacher Name" type="text" value={lec.Tname} onChange={handleChange} />
                </span>
                <span>
                    <label>URL</label>
                    <input id="url" autoComplete="off" placeholder="URL" type="url" value={lec.url} onChange={handleChange} />
                    
                </span>
                <span>
                    <label>Group</label>
                    <span className="group-select">
                        <label><input type="checkbox" name="gp1" value="1" checked={gp.gp1} onChange={handelGroupChange} /> 1</label>
                        <label><input type="checkbox" name="gp2" value="2" checked={gp.gp2}  onChange={handelGroupChange} /> 2</label>
                        <label><input type="checkbox" name="gp3" value="3" checked={gp.gp3} onChange={handelGroupChange}  /> 3</label>
                    </span>
                </span>
                {props.controles ? <button style={{width:"50%"}} type="submit" className="submit-button btn" onClick={sendFinal} >Done</button>:
                <button style={{width:"50%"}} type="submit" className="submit-button btn" onClick={changeCurrentLec} >Done</button>}
            </form>
        </div>
            {loading ? <Popup><Loading /></Popup> : response && <Popup btn={true} close={closePopup} ><span>{response}</span></Popup> }
            </div>
    )
}

export default EditAdd
