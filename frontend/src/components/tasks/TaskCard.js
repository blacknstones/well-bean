import React, { useState } from "react";
import TaskPopup from "./TaskPopup";
import TaskActions from "./TaskActions";
import MemberCard from "../projects/MemberCard";

export default function TaskCard({ task, deleteTask, updateTask, addMemberToTask, deleteMemberFromTask, addCommentToTask, updateCommentTask, deleteCommentTask, categories }) {
    const [popupIsOpen, setPopupIsOpen] = useState(false);
    //const [taskMembers, setTaskMembers] = useState([]);

    const {
        members,
        comments
    } = task;

    console.log("commnet", JSON.stringify(comments));
    console.log(comments.length);

    const onDeleteTask = () => {
        deleteTask(task.id);

    }

    const onUpdateTask = () => {
        setPopupIsOpen(true);
    }

    const onClosePopup = () => {
        setPopupIsOpen(false);
    }

    return (
        <div className="task-card">
            <div className="flex-between flex-align-start">
                <p className="task-title" onClick={onUpdateTask}>{task.title}</p>
                <TaskActions
                    onDeleteTask={onDeleteTask}
                    onUpdateTask={onUpdateTask} />
            </div>

            <div className="flex-between">
                <div className="member-list flex-start">
                    {members && members.map(member => (
                        <MemberCard
                            key={member.id}
                            member={member}
                        />
                    ))}
                </div>
                <div className="comment-icon">
                    {comments.length == 0 ? null : (<i className="far fa-comment"></i>)}
                </div>




            </div>





            <TaskPopup isOpen={popupIsOpen}
                currentTask={task}
                updateTask={updateTask}
                addMemberToTask={addMemberToTask}
                deleteMemberFromTask={deleteMemberFromTask}
                addComment={addCommentToTask}
                updateComment={updateCommentTask}
                deleteComment={deleteCommentTask}
                categories={categories}
                onClose={onClosePopup} />
        </div>

    );
}