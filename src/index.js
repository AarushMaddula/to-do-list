import "./styles.css";
import { generateProjectPage } from "./project-page";
import DOMController from "./DOMController"; 
import projectController from "./projectController";
import taskController from "./taskController";
import createTask from "./task.js";
import createProject from "./project.js";


const tasks = [
    {task: "Finish 3.1 Math Homework", description: "Do problems 1 - 31 eoo, 68, 69, 70", date: "2024-10-20", priority: "high"},
    {task: "Finish AP Gov Homework", description: "Do the webquest", date: "2024-10-23", priority: "medium"},
    {task: "Finish discussion post", description: "Talk about why it is good to be a person", date: "2024-10-19", priority: "low"},
    {task: "Submit AP Stats Project", description: "bruh", date: "2024-10-27", priority: "medium"},
    {task: "Get rizz", description: "e", date: "2024-10-23", priority: "high"},
    {task: "Finish Engineering project", description: "Complete Task 2", date: "2024-10-19", priority: "high"}
]

const projects = [
    {name: "School"},
    {name: "Work"},
    {name: "Personal"},
]


tasks.forEach(task => {
    const newTask = createTask(0, task.task, task.description, task.date, task.priority);
    taskController.addTask(newTask);
});

projects.forEach(project => {
    const newProject = createProject(project.name);
    projectController.addProject(newProject);
})

DOMController.loadProjectContainer(projectController.getProjects())
DOMController.loadProject(0)





