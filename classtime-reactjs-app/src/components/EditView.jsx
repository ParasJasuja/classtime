import React from 'react';
import {useEffect, useState} from "react";
import EditAdd from './EditAdd';
import Loading from './Loading';
import Popup from './Popup';
import Time from './Time';
import RefreshIcon from '@material-ui/icons/Refresh';

function EditView(props) {
    const [currentLecture, setCurrentLecture] = useState(null);
    const [timetable, setTimetable] = useState(null);
    const [loading, setLoading] = useState(null);
    const [edit, setEdit] = useState(false);
    const [category, setCategory] = useState([]);
    const [semCat, setSemCat] = useState([]);


    const [selectClass, setSelectClass] = useState("0");
    const [selectSemester, setSelectSemester] = useState("0");
    const [selectGroup, setSelectGroup] = useState("0");
    

    const handleEdit = ()=>{
        setEdit(true);
    }

    const cancelEdit = (value)=>{
        setEdit(value);
    }

    const refresh = ()=>{
        getLecture();
        fetchData();
    }

    const getLecture = ()=>{
        setSelectClass(document.querySelector("#select-class").value);
        setSelectSemester(document.querySelector("#semester").value);
        setSelectGroup(document.querySelector("#group").value);
    }
    const fetchData = ()=>{
        if(selectClass !== "0" ){
            var sems;
            for(var i=0;i<category.length;i++){
                if(category[i].class === selectClass){
                    sems = category[i].sems;
                    break;
                }
            }
            setSemCat(sems);
        }
        if(selectClass !== "0" && selectSemester !== "0"){
            setLoading(true);
            fetch(`https://calm-mountain-47420.herokuapp.com/timetables/all?class=${selectClass}&semester=${selectSemester}`)
            .then((res=>{
                if(!res.ok){
                    throw (new Error("Error Occured while fetching all lec"));
                }
                return (res.json());
            })).then((data)=>{
                setTimetable(data);
                setLoading(false);
            }).catch((err)=>{
                console.log(err);
            });
        }
        if((selectClass !== "0" && selectSemester !== "0") && selectGroup !=="0"){
            const url = `https://calm-mountain-47420.herokuapp.com/timetables/?class=${selectClass}&semester=${selectSemester}&group=${selectGroup}`;
            setLoading(true);
            fetch(url).then((res)=>{
                if(!res.ok){
                    throw (new Error("Error Occured"));
                }
                return (res.json());
            })
            .then((data)=>{
                setCurrentLecture(data.currentLecture);
                setLoading(false);
                return data;
            })
            .catch((err)=>{
                console.log(err);
            });
        }
        
    }
    useEffect(() => {
        setLoading(true);
        fetch("https://calm-mountain-47420.herokuapp.com/timetables/getcategory")
        .then((res)=>{
            if(!res.ok){
                throw (new Error("Error"));
            }
            return res.json();
        })
        .then((data)=>{
            setCategory(data);
            setLoading(false);
        }).catch((err)=>{
            console.log(err);
            setLoading(false);
        });
        getLecture();
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectClass,selectSemester,selectGroup]);


    return (
        <div className="edit-view">
        <Time />
            <div className="current container" >
                    <h1 className="heading">Current Lecture <button className="refresh-btn" onClick={refresh} ><RefreshIcon /></button></h1>
                    <div className="filter">
                        <select name="class" id="select-class" value={selectClass} onChange={getLecture}>
                            <option value="0">Class</option>
                            {
                                category.length!==0 && category.map((cl,index)=>{return <option key={index} value={cl.class}>{cl.class}</option>})
                            }
                        </select>
                        <select name="semester" id="semester" value={selectSemester} onChange={getLecture}>
                            <option value="0">Semester</option>
                            {semCat.length !==0 && semCat.map((s,index)=>(<option key={index} value={s}>{s}</option>)) }
                        </select>
                        <select name="group" id="group" value={selectGroup} onChange={getLecture}>
                            <option value="0">Group</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                        </select>
                    </div>
                        {
                            currentLecture && 
                            <span className="crr-lec"><a href={currentLecture.url} target="_blank" rel="noreferrer" ><h3 className="link">{currentLecture.Lname} </h3></a><button className="edit-button" onClick={handleEdit} >Edit</button></span>
                        }
                        { edit && <Popup btn={true}  close={cancelEdit} ><EditAdd class= {selectClass} sem= {selectSemester} lec={currentLecture} /></Popup> }
                </div>
                {timetable ? <EditAdd id={timetable._id} controles={true} aClass={timetable} pageNo={props.pageNo} /> : loading && <Loading />}
        </div>
    )
}

export default EditView
