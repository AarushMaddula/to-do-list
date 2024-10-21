import "./styles.css";
import { generateProjectPage } from "./project-page";
import DOMController from "./DOMController"; 
import projectController from "./projectController";
import taskController from "./taskController";
import createTask from "./task.js";


const newTask = createTask(1, "Finish 3.1 Math Homework", "Do problems 1 - 31 eoo, 68, 69, 70", "2024-10-20", "high");

taskController.addTask(newTask);
DOMController.loadTasks(taskController.getTasksByProject(1));




