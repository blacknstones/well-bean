import React, { useState, useEffect, useContext } from "react";
import ProjectHeader from "../layout/ProjectHeader";
import CategoryApi from "../../api/CategoryApi";
import { useParams, useHistory } from "react-router-dom";
import ProjectApi from "../../api/ProjectApi";
import ProjectBoard from "./ProjectBoard";
import ProjectMenu from "./ProjectMenu";
import UserContext from "../../UserContext";
import MemberMenu from "./MemberMenu";
import { EventSourcePolyfill } from 'event-source-polyfill';
import ConfirmDialog from "../projects/ConfirmDialog";


let eventSource;
function ProjectPage() {
    const history = useHistory();
    const user = useContext(UserContext);
    const userId = user.id;
    console.log("on project page. User id:" + userId);

    const { projectId } = useParams();
    console.log("project id:" + projectId);

    const [currentProject, setCurrentProject] = useState({});
    const [categories, setCategories] = useState([]);
    const [members, setMembers] = useState([]);
    const [incomingChanges, setIncomingChanges] = useState(0);
    

    useEffect(() => {
            init();
    }, [])

    const init = ()  => {
            eventSource = new EventSourcePolyfill('http://localhost:8080/sse/category', 
                {
                    headers: {
                        "Accept": "text/event-stream",
                        "Authorization": window.sessionStorage.getItem("_token"),
                        "Cache-Control": "no-cache",
                        "Connection": "keep-alive",
                        "X-Accel-Buffering": "no"
                    }
                }
            );
            eventSource.onopen = (event) => {
                console.log("connection opened!", event);
            }
            eventSource.onmessage = (event) => {
                console.log("data received", event);
                getCurrentProject();
                getAllCategories(projectId);
                getAllMembers(projectId);
                setIncomingChanges(incomingChanges + 1);
            }

            eventSource.onerror = (err) => {
                console.error("Event source failed:", err);
                eventSource.close();
            }
    }

    function getCurrentProject() {
        return ProjectApi.getProjectById(projectId)
            .then(response => setCurrentProject(response.data))
            .then(console.log("current project:" + JSON.stringify(currentProject)))
            //.then(setCategoriesPositioning(currentProject.categoriesPositioning))
            //.then(console.log("categories positioning: " + categoriesPositioning))
            .catch(err => console.log(`error on get project ${err}`));
    }

    const updateProject = (updatedProject) => {
        return ProjectApi.updateProject(updatedProject)
            .then(response => setCurrentProject(response.data))
            .then(response => console.log("updated project: " + JSON.stringify(response.data)))
            .catch(err => console.log(`error on update project: ${err}`));
    }

    const onDeleteProject = () => {
   ({
            ...ConfirmDialog,
            isOpen: false
        })
            if (userId === currentProject.creator.id) {
                deleteCurrentProject();
                history.push("/home");
                window.location.reload();
            } else {
                alert("you are not the creator of the project, deleting project is not allowed");
            }
        
    };

    const getAllMembers = (projectId) => {
        return ProjectApi.getProjectById(projectId)
            .then(response => setMembers(response.data.users))
            .then(console.log("members: " + JSON.stringify(members)));
    }

    const onDeleteMember = (memberId) => {
        if (window.confirm("Do you want to remove this member?")) {
            if (userId === currentProject.creator.id && userId !== memberId) {
                console.log("on deleteMember. creator: " + currentProject.creator.id + ", delete member: " + memberId);
                deleteMember(projectId, memberId);
                getAllMembers(projectId);
            } else if (userId !== currentProject.creator.id) {
                alert("you are not allowed to remove member.");
            } else {
                alert("Are you sure you want to remove yourself from this project?");
            }
        }
    }

    function deleteCurrentProject() {
        return ProjectApi.deleteProject(projectId)
            .then(console.log(`Deleting project ${projectId}`))
            .catch(err => console.log(`error on delete project: ${err}`));
    }

    const addMemberByEmail = (userEmail) => {
        ProjectApi.addMemberByEmail(projectId, userEmail)
            // .then(alert(`add user: ${userEmail} to project ${projectId}`))
            .then(() => getAllMembers(projectId))
            .catch(err => console.log(`error on add member: ${err}`));
    };

    function deleteMember(projectId, memberId) {
        ProjectApi.removeMemberById(projectId, memberId)
            .then(() => getAllMembers(projectId))
            .catch(err => console.log(`error on delete member: ${err}`));
    }

    const getAllCategories = (projectId) => {
        return CategoryApi.getAllCategories(projectId)
            .then(response => setCategories(response.data))
            .catch(err => console.log(`error on get all categories: ${err}`));
    };

    const createCategory = (projectId, categoryData) => {
        return CategoryApi.createCategory(projectId, categoryData)
            .then(response => setCategories([...categories, response.data]))
            .then(console.log(`new category: ${categoryData.title} is added`))
            .catch(err => console.log(`error on create new category: ${err}`));
    };

<<<<<<< HEAD
    // const updateCategoriesPositioning = (newCategoriesPositioning) => {
    //     const {
    //         id, 
    //         title,
    //         categoriesPositioning,
    //         teamBeanScore
    //     } = currentProject;

    //     const newProject = {
    //         id,
    //         title,
    //         categoriesPositioning: newCategoriesPositioning,
    //         teamBeanScore
    //     }
    //     updateProject(newProject);
    // }

    const updateCategory = (newCategoryData) => {
        return CategoryApi.updateCategory(newCategoryData)
            .then(response => console.log(JSON.stringify(response.data)))
            .then(response => setCategories(categories.map((item) => item.id == newCategoryData.id ? response.data : item)))
=======
    const updateCategory = (projectId, newCategoryData) => {
        return CategoryApi.updateCategory(projectId, newCategoryData)
            .then(getCurrentProject())
>>>>>>> master
            .catch(err => console.log(`error on update category: ${err}`));
    };

    const deleteCategory = (categoryId) => {
        return CategoryApi.deleteCategory(categoryId)
            .then(console.log(`Deleting category: ${categoryId}`))
            .then(setCategories(categories.filter(c => c.id !== categoryId)))
            //.then(setCategoriesPositioning(categoriesPositioning.filter(item => item != categoryId)))
            .catch(err => console.log(`error on delete category: ${err}`));
    };

    useEffect(() => {
        getCurrentProject();
        getAllCategories(projectId);
        getAllMembers(projectId);
    }, [projectId, incomingChanges]);

    return (
        <div className="project-page">
            <div className="fixed-header">
<<<<<<< HEAD
                <ProjectHeader project={currentProject} />
=======
                <ProjectHeader />
>>>>>>> master

                <div className="project-menu flex-start ">
                    <ProjectMenu
                        currentProject={currentProject}
                        onDeleteProject={onDeleteProject}
                        updateProject={updateProject}
                    />

                    <MemberMenu
                        currentProject={currentProject}
                        members={members}
                        addMemberByEmail={addMemberByEmail}
                        onDeleteMember={onDeleteMember} />
                </div>
            </div>



            <ProjectBoard
                currentProject={currentProject}
                categories={categories}
                createCategory={createCategory}
                updateCategory={updateCategory}
                deleteCategory={deleteCategory} />

                
        </div>
    );
}

export default ProjectPage;