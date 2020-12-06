import React, { useState } from "react";
import TaskPopup from "./TaskPopup";

// *****************The code below has been refactored to css **********************
// import {Paper} from '@material-ui/core';
// import { makeStyles } from "@material-ui/core/styles";

// const useStyle = makeStyles((theme) => ({
//     card: {
//         padding: theme.spacing(1,1,1,2),
//             margin: theme.spacing(1),
//           },
// }));

// eslint-disable-next-line react/prop-types
export default function TaskCard({ task, deleteTask, updateTask }) {
    // const classes = useStyle();
    const [popupIsOpen, setPopupIsOpen] = useState(false);
    //const [taskMembers, setTaskMembers] = useState([]);

    const onDeleteTask = () => {
        // eslint-disable-next-line react/prop-types
        if (window.confirm(`Do you want to delete task ${task.id}?\n**Redesign this to a popup later**`)) {

            // eslint-disable-next-line react/prop-types
            deleteTask(task.id);
        }
    }

    const openPopup = () => {
        setPopupIsOpen(true);

    }

    return (
        <div>
            <div className="task-card">
                <div className="flex-between">
                    <div className="flex-grow" onClick={openPopup}>
                        {/* eslint-disable-next-line react/prop-types*/}
                        <p className="task-title">{task.title}</p>
                        {/* <Paper className={classes.card}>{task.title}</Paper> */}
                    </div>

                    <button id="delete-task" className="flex-ungrow"
                        onClick={onDeleteTask}>
                        <i className="fas fa-times"></i>
                    </button>
                </div>
                <div className="task-member">

                    
                </div>

            </div>

            <TaskPopup isOpen={popupIsOpen}
                currentTask={task}
                deleteTask={deleteTask}
                updateTask={updateTask}
                onClose={(v) => setPopupIsOpen(v)} />
        </div>
    );
}