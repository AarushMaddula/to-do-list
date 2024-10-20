import "./styles.css";
import { generateProjectPage } from "./project-page";
import DOMController from "./DOMController"; 
import projectController from "./projectController";
import taskController from "./taskController";

let currentTaskID = 0;
let currentProjectID = 0;

function createTask(projectID, task, description, date, priority) {
    const id = currentTaskID++;

    let checked = false;
    let checkedTime = "none";

    const toggleCheckbox = function() {
        if (checked) {
            checkedTime = "none";
        } else {
            checkedTime = Date.now();
        }
        
        checked = !checked;
    }

    const isChecked = function() {
        return checked;
    }

    const getCheckedTime = function() {
        return checkedTime;
    }

    return {id, projectID, task, description, date, priority, isChecked, getCheckedTime, toggleCheckbox}
}

const createProjectObj = function(name) {
    this.id = currentProjectID++;
    this.name = name;

    return {id, name};
}

const dialog = document.querySelector('#add-task-dialog');
const dialogForm = document.querySelector('#add-task-dialog > form');

const addTaskButton = document.querySelector('.add-task');

addTaskButton.addEventListener('click', (e) => {
    dialog.showModal();
})

const addTaskCancelButton = document.getElementById('add-task-cancel');
const addTaskSubmitButton = document.getElementById('add-task-submit');

addTaskCancelButton.addEventListener('click', (e) => {
    dialogForm.reset();
    dialog.close();
})

addTaskSubmitButton.addEventListener('click', (e) => {
    e.preventDefault();

    const task = document.querySelector('#add-task-dialog input[type="text"]').value;
    const description = document.querySelector('#add-task-dialog textarea').value;
    const date = document.querySelector('#add-task-dialog input[type="date"]').value;
    const priority = document.querySelector('#add-task-dialog select').value;

    const newTask = createTask(1, task, description, date, priority);
    taskController.addTask(newTask);

    DOMController.loadTasks(taskController.getTasksByProject(1));

    dialogForm.reset();
    dialog.close();
})
