import createTask from "./task.js";
import createProject from "./project.js";

import projectController from "./projectController";
import taskController from "./taskController";

const localStorageController = (function () {

    const retrieveProjectList = function() {
        const projects = JSON.parse(localStorage.getItem("projects"));
        
        projects.forEach(project => {
            const newProject = createProject(project.name);
            projectController.addProject(newProject);
        });
    }

    const storeProjectList = function() {
        localStorage.setItem("projects", JSON.stringify(projectController.getProjects()));
    }

    const retrieveTaskList = function() {
        const tasks = JSON.parse(localStorage.getItem("tasks"));
        
        tasks.forEach(task => {
            const newTask = createTask(task.projectID, task.taskName, task.description, task.date, task.priority);
            taskController.addTask(newTask); 
        });
    }

    const storeTaskList = function() {
        const tasks = taskController.getAllTasks();

        const tasksObj = tasks.map((task) => {
            const obj = {
                projectID: task.getProjectID(), 
                taskName: task.getTaskName(), 
                description: task.getDescription(), 
                date: task.getDate(), 
                priority: task.getPriority()
            };

            return obj;
        })

        localStorage.setItem("tasks", JSON.stringify(tasksObj));
    }

    if (localStorage.getItem("projects")) retrieveProjectList();
    if (localStorage.getItem("tasks")) retrieveTaskList();

    return {
        retrieveProjectList,
        storeProjectList,
        retrieveTaskList,
        storeTaskList
    }

}) ()

export default localStorageController;