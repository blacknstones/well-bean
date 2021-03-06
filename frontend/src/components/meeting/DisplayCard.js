import React, { useEffect, useState } from "react"
//import { Link } from "react-router-dom";
import UserApi from "../../api/UserApi"
import MeetingApi from "../../api/MeetingApi";

export default function DisplayCard({data, fetchdata}) {

    const [isHost, setHost] = useState(false);
    //const [members, setMembers] = useState([]);
    const {
        id,
        topic,
        agenda,
        startTime,
        duration,
        start_url,
        host,
        //join_url,
    } = data

    useEffect(  () => {
         userdata();
    }, []);
    const userdata = async() => {
        await  UserApi.getCurrentUser()
            .then(response => {const data = response.data;
                 if(data.name.toLocaleString() === host.name.toLocaleString())
                {
                setHost(true);
            }
        })
    }; 
    const cancelMeeting = () => {
        return MeetingApi.cancelMeeting(id)
            .then(response => {const data = response.data;
                fetchdata();
                console.log(data);
            })       
    };
    

    return (
        <div className="meeting">
            <table id = "meeting_table">
               <tr><td>{topic}</td> <td>{agenda} </td><td> {startTime}</td>
                <td> {duration}</td> 
                {isHost ? 
                <td>
                   <div className="link">
                        <a href={start_url} target="_blank" rel="noopener noreferrer">Click to start</a>    
                </div> </td>   
                :  
                <td>
                    <div className="link">
                        <a href={start_url} target="_blank" rel="noopener noreferrer">Click to Join</a>
                        </div> 
                     </td>  
                }  
                <td> {host.name}</td>
                {isHost ? 
                <td> <button className="button" disabled={!isHost} id="Add-member" onClick={cancelMeeting}>
                Cancel 
                </button></td>
                : null}
                
                </tr>
                
                
            </table>

        </div>
    );
}