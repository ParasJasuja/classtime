import React, { useState, useEffect } from 'react'
import "../styles/Home.css";
import Time from "../components/Time";
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import EmojiEmotionsIcon from '@material-ui/icons/EmojiEmotions';
import Loading from '../components/Loading';
import RefreshIcon from '@material-ui/icons/Refresh';

function Home(props) {

    const [currentLecture, setCurrentLecture] = useState(null);
    const [upcomingLectures, setUpcomingLectures] = useState(null);
    const [loading, setLoading] = useState(null);
    const [category, setCategory] = useState([]);
    const [semCat, setSemCat] = useState([]);

    const [selectClass, setSelectClass] = useState(props.timeTable.class);
    const [selectSemester, setSelectSemester] = useState(props.timeTable.semester);
    const [selectGroup, setSelectGroup] = useState(props.timeTable.group);

    const refresh = ()=>{
        getLecture();
        fetchData();
    }

    const getLecture = ()=>{
        setSelectSemester(props.timeTable.semester);
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
            if(sems){
                setSemCat(sems);
            }
        }
        if((selectClass !== "0" && selectSemester !== "0") && selectGroup !=="0"){
            var date = new Date();
            const time = date.getTime();
            const url = `https://calm-mountain-47420.herokuapp.com/timetables/?class=${selectClass}&semester=${selectSemester}&group=${selectGroup}&date=${time}`;
            setLoading(1);
            fetch(url).then((res)=>{
                if(!res.ok){
                    throw (new Error("Error Occured"));
                }
                return (res.json());
            })
            .then((data)=>{
                setCurrentLecture(data.currentLecture);
                setUpcomingLectures(data.upcomingLectures);
                setLoading(null);
                
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
        if(document.getElementsByClassName("active").length>0){
            document.getElementsByClassName("active")[0].classList.remove("active");
        }
        
        setSelectClass(props.timeTable.class);
        document.querySelector("#home").classList.add("active");
        getLecture();
        fetchData();
        props.getTimetable({
            class: selectClass,
            semester: selectSemester,
            group: selectGroup
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectClass,selectSemester,selectGroup]);
    

    return (
        <div className="home">
                <Time/>
                <div className="container" >
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
                        currentLecture &&( (currentLecture.url !== "") ?   <a href={currentLecture.url} target="_blank" rel="noreferrer" ><h3 className="link">{currentLecture.Lname}  <OpenInNewIcon className="open-in-new-icon" fontSize="small" /></h3></a> :
                        <h3 className="link">{currentLecture.Lname}</h3>)
                        
                    }
                </div>
                {
                    upcomingLectures ?
                    <div className="container upcoming">
                        
                        <h1 className="heading">Upcoming Lectures</h1>
                        <div className="links-container">
                        {
                            upcomingLectures.length !== 0 ? upcomingLectures.map((lec,index)=>(
                            <div key={index} className="link-box-container">
                                <h4 className="box" >{lec.starttime}</h4>
                                {lec.url!=="" ?
                                    <a href={lec.url} className="box" target="_blank" rel="noreferrer" ><h4 className=" link next-link" >{lec.Lname}    <OpenInNewIcon className="open-in-new-icon" fontSize="small" /> </h4></a> :
                                    <span href={lec.url} className="box disabled"><h4 className=" link next-link " >{lec.Lname}</h4></span>
                                }
                            </div>
                        )):
                        <><h2 style={{textAlign:'center'}}>No More Lecture Available for today. Have a Good Day <EmojiEmotionsIcon style={{marginBottom:"-8px"}} fontSize="large" /> </h2></>
                        }
                        </div>
                    </div>:
                    loading && <Loading />
                }
        </div>
    )
}

export default Home;