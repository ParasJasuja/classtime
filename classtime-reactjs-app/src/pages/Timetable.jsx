import React, { useEffect, useState } from 'react';


import "../styles/Timetable.css";

import Time from "../components/Time";
import Loading from '../components/Loading';


function Timetable(props) {

    const timeTableData = props.timeTable;
    const [timeTable, setTimeTable] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if(document.getElementsByClassName("active").length>0){
            document.getElementsByClassName("active")[0].classList.remove("active");
        }
        document.querySelector("#timetable").classList.add("active");
        if(timeTableData.class!=="0" && timeTableData.semester!=="0" && timeTableData.group!=="0"){
            setLoading(true);
            fetch(`https://calm-mountain-47420.herokuapp.com/timetables/all?class=${timeTableData.class}&semester=${timeTableData.semester}&group=${timeTableData.group}`)
            .then((response)=>{
                if(!response.ok){
                    throw(new Error("error occured at timeTableData"));
                }
                return response.json();
            }).then((data)=>{
                setTimeTable(data);
                setLoading(false);
            }
            ).catch((err)=>{
                console.log(err);
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    return (
        <div className="Timetable-container">
            <Time />
            <div className="Timetable">
            { timeTable ?<>
            <h1 className="heading">Timetable</h1>
            
            <table>
                <colgroup>
                    <col span="5" />
                    <col span="1" />
                    <col span="4" />
                </colgroup>
                    <thead>
                        <tr>
                            <th scope="col">Day</th>
                            {
                                timeTable.monday.map((lec)=>{
                                    return (
                                        <th key={lec._id} scope="col">{lec.starttime}-{lec.endtime}</th>
                                    )
                                })
                            }
                            
                        </tr>
                    </thead>
                    <tbody>

                        <tr>
                            <th>Monday</th>
                            {
                                timeTable.monday.map((lec)=>{
                                    return <td key={lec._id}><a href={lec.url}>{lec.Lname + "\n"} {lec.Tname}</a></td>
                                })
                            }
                            
                        </tr>
                        <tr>
                            <th>Tuesday</th>
                            {
                                timeTable.tuesday.map((lec)=>{
                                    return <td key={lec._id}><a href={lec.url}>{lec.Lname + "\n"} {lec.Tname}</a></td>
                                })
                            }
                        </tr>
                        <tr>
                            <th>Wednesday</th>
                            {
                                timeTable.wednesday.map((lec)=>{
                                    return <td key={lec._id}><a href={lec.url}>{lec.Lname + "\n"} {lec.Tname}</a></td>
                                })
                            }
                        </tr>
                        <tr>
                            <th>Thursday</th>
                            {
                                timeTable.thursday.map((lec)=>{
                                    return <td key={lec._id}><a href={lec.url}>{lec.Lname + "\n"} {lec.Tname}</a></td>
                                })
                            }
                        </tr>
                        <tr>
                            <th>Friday</th>
                            {
                                timeTable.friday.map((lec)=>{
                                    return <td key={lec._id}><a href={lec.url}>{lec.Lname + "\n"} {lec.Tname}</a></td>
                                })
                            }
                        </tr>
                    </tbody>
                </table>
            
            </>
            : (loading ? <Loading /> :<h1 className="heading">timeTableData Not Available</h1>)
            }
                
            </div>
        </div>
    )
}

export default Timetable;
