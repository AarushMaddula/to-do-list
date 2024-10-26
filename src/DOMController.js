import checkboxBlank from "./radiobox-blank.svg";
import checkboxMarked from "./radiobox-marked.svg";
import pencil from "./pencil.svg";
import trashcan from "./trash-can.svg";

import list from "./format-list-checkbox.svg";

import taskController from "./taskController";
import projectController from "./projectController";
import dialogController from "./dialogController";

import { format, isSameISOWeek, isToday } from "date-fns"; 
import localStorageController from "./localStorageController";

const DOMController = (function () {

    const listTableBody = document.querySelector('.list-table-body');

    const projectContainer = document.querySelector('.project-container');
    const pageHeader = document.querySelector('.list-header');

    const addTaskButton = document.querySelector('.add-task');
    const addProjectButton = document.querySelector('.project-header > button');

    const dayProject = document.querySelector('.default-projects li:nth-child(1)');
    const weekProject = document.querySelector('.default-projects li:nth-child(2)');
    const allTasksProject = document.querySelector('.default-projects li:nth-child(3)');
    
    let displayedProjectID;

    const loadDayProject = function() {
        pageHeader.textContent = "Today's Tasks";

        displayedProjectID = -1;

        const tasks = taskController.getTodayTasks();
        loadTasks(tasks);
    }
    
    const loadWeekProject = function() {
        pageHeader.textContent = "Week Tasks";

        displayedProjectID = -2;

        const tasks = taskController.getWeekTasks();
        loadTasks(tasks);
    }

    const loadAllTasksProject = function() {
        pageHeader.textContent = "All Tasks";

        displayedProjectID = -3;

        const tasks = taskController.getAllTasks();
        loadTasks(tasks);
    }

    const getDisplayedProjectID = function () {
        return displayedProjectID;
    }

    const loadTasks = function (taskList) {
        listTableBody.innerHTML = "";

        taskList.forEach(task => {
            listTableBody.appendChild(createTaskElement(task.id));
        });
    }

    const updateTaskPosition = function (taskID) {
        const currentElement = document.querySelector(`.list-table-body > tr[data-taskid="${taskID}"]`);

        if (displayedProjectID >= 0 && taskController.getTaskByID(taskID).getProjectID() !== displayedProjectID) {
            listTableBody.removeChild(currentElement);
            return;
        }

        if (displayedProjectID === -1 && !isToday(taskController.getTaskByID(taskID).getDate())) {
            listTableBody.removeChild(currentElement);
            return;
        }

        if (displayedProjectID === -2 && !isSameISOWeek(taskController.getTaskByID(taskID).getDate(), Date.now())) {
            listTableBody.removeChild(currentElement);
            return;
        }

        const position = taskController.getTaskPosition(displayedProjectID, taskID);

        const previousPosition = Array.prototype.indexOf.call(listTableBody.children, currentElement) + 1;

        if (previousPosition > position) {
            listTableBody.insertBefore(currentElement, listTableBody.children[position - 1]);
        } else if (previousPosition < position) {
            listTableBody.children[position - 1].after(currentElement);
        }
    }

    const deleteTaskElement = function (taskID) {
        const element = document.querySelector(`.list-table-body > tr[data-taskid="${taskID}"]`);
        listTableBody.removeChild(element);
    }

    const createTaskElement = function (taskID) {
        const task = taskController.getTaskByID(taskID);

        //checkbox
        const tdCheckbox = document.createElement('td');
        tdCheckbox.classList.add('task-checkbox');
        
        const buttonCheckbox = document.createElement('button');
        buttonCheckbox.addEventListener('click', e => {
            task.toggleCheckbox();

            tr.classList.toggle('task-marked');
            ImgCheckbox.src = task.isChecked() ? checkboxMarked : checkboxBlank;
            updateTaskPosition(task.id);
        })
        
        const ImgCheckbox = document.createElement('img');
        ImgCheckbox.src = task.isChecked() ? checkboxMarked : checkboxBlank;
        ImgCheckbox.alt = "icon";

        //task name
        const tdTask = document.createElement('td');
        
        const tdTaskButton = document.createElement('button');
        tdTaskButton.addEventListener('click', () => {
            tdTaskDescription.classList.toggle("description-visible");
        })
        
        const tdTaskName = document.createElement('p');
        tdTaskName.textContent = task.getTaskName();
        
        const tdTaskDescription = document.createElement('p');
        tdTaskDescription.textContent = task.getDescription();
        tdTaskDescription.style.display = "none";
        
        //task date
        const tdDate = document.createElement('td');
        tdDate.textContent = format(task.getDate(), 'MM/dd/yyyy');

        //task priority
        const tdPriority = document.createElement('td');
        const priorityText = task.getPriority();
        tdPriority.textContent = priorityText.charAt(0).toUpperCase() + priorityText.substring(1).toLowerCase();

        //edit button
        const editButton = document.createElement('button');
        editButton.addEventListener('click', dialogController.initEditTaskDialog.bind(null, task.id))

        const editImage = document.createElement('img');
        editImage.src = pencil;
        editImage.alt = "edit";

        //delete button
        const deleteButton = document.createElement('button');
        deleteButton.addEventListener('click', e => {
            taskController.deleteTask(+task.id);
            deleteTaskElement(+task.id);
            localStorageController.storeTaskList();
        })

        const deleteImage = document.createElement('img');
        deleteImage.src = trashcan;
        deleteImage.alt = "delete";

        //containers
        const tdAction = document.createElement('td');
        tdAction.classList.add('action-buttons');
        
        buttonCheckbox.appendChild(ImgCheckbox);
        tdCheckbox.appendChild(buttonCheckbox);
        tdTaskButton.appendChild(tdTaskName);
        tdTaskButton.appendChild(tdTaskDescription);
        tdTask.appendChild(tdTaskButton);
        editButton.appendChild(editImage);
        tdAction.appendChild(editButton);
        deleteButton.appendChild(deleteImage);
        tdAction.appendChild(deleteButton);
        
        const tr = document.createElement('tr');
        tr.setAttribute('data-taskid', task.id);

        if (task.isChecked()) tr.classList.add('task-marked');
        
        tr.appendChild(tdCheckbox)
        tr.appendChild(tdTask);
        tr.appendChild(tdDate);
        tr.appendChild(tdPriority);
        tr.appendChild(tdAction);

        return tr;
    }

    const updateTaskInfo = function(taskID) {
        const task = taskController.getTaskByID(taskID);
        const currentElement = document.querySelector(`.list-table-body > tr[data-taskid="${taskID}"]`);
        const priorityText = task.getPriority();

        currentElement.children[1].children[0].children[0].textContent = task.getTaskName();
        currentElement.children[1].children[0].children[1].textContent = task.getDescription();
        currentElement.children[2].textContent = format(task.getDate(), 'MM/dd/yyyy');
        currentElement.children[3].textContent = priorityText.charAt(0).toUpperCase() + priorityText.substring(1).toLowerCase();;
    }

    const addTaskElement = function (taskID) {
        if (taskController.getTaskByID(taskID).getProjectID() !== displayedProjectID && displayedProjectID >= 0) return;

        const newTaskElement = DOMController.createTaskElement(taskID);
        const position = taskController.getTaskPosition(displayedProjectID, taskID);

        if (position === 1) {
            listTableBody.insertBefore(newTaskElement, listTableBody.children[0]);
        } else  {
            listTableBody.children[position - 2].after(newTaskElement);
        }
    }

    const loadProject = function (projectID) {
        const project = projectController.getProjectByID(projectID);
        displayedProjectID = projectID;

        pageHeader.textContent = `Project: ${project.name}`;
        
        const projectTasks = taskController.getTasksByProject(projectID);
        loadTasks(projectTasks);
    }

    const loadProjectContainer = function (projectList) {
        projectContainer.innerHTML = "";

        projectList.forEach((project) => {
            projectContainer.appendChild(createProjectElement(project.id));
        })
    }

    const deleteProjectElement = function (projectID) {
        const element = document.querySelector(`.project-container > li[data-projectid="${projectID}"]`);
        projectContainer.removeChild(element);
        localStorageController.storeProjectList();
        localStorageController.storeTaskList();
        loadDayProject();
    }

    const createProjectElement = function (projectID) {
        const project = projectController.getProjectByID(projectID);

        const img = document.createElement('img');
        img.src = list;
        img.alt = "icon";

        const button = document.createElement('button');
        const text = document.createTextNode(project.name);

        button.appendChild(img);
        button.appendChild(text);
        button.addEventListener('click', () => {
            loadProject(projectID);
        })

        const deleteButton = document.createElement('button');
        deleteButton.addEventListener('click', e => {
            projectController.deleteProject(+projectID);
            deleteProjectElement(+projectID);
        })

        const deleteImage = document.createElement('img');
        deleteImage.src = trashcan;
        deleteImage.alt = "delete";

        deleteButton.appendChild(deleteImage);

        const li = document.createElement('li');
        li.setAttribute('data-projectid', projectID);
        li.appendChild(button);
        li.appendChild(deleteButton);


        return li;
    }

    const addProjectElement = function (projectID) {
        const newProjectElement = DOMController.createProjectElement(projectID);
        const position = projectController.getProjectPosition(projectID);

        if (position === 1) {
            projectContainer.insertBefore(newProjectElement, projectContainer.children[0]);
        } else {
            projectContainer.children[position - 2].after(newProjectElement);
        }
    }

    addTaskButton.addEventListener('click', dialogController.initAddTaskDialog);
    addProjectButton.addEventListener('click', dialogController.initAddProjectDialog);

    dayProject.addEventListener('click', loadDayProject);
    weekProject.addEventListener('click', loadWeekProject);
    allTasksProject.addEventListener('click', loadAllTasksProject);

    loadProjectContainer(projectController.getProjects());
    loadDayProject();

    return {
            loadDayProject, 
            loadWeekProject,
            loadAllTasksProject, 
            getDisplayedProjectID,
            loadTasks, 
            createTaskElement, 
            deleteTaskElement, 
            updateTaskInfo,
            addTaskElement,
            updateTaskPosition, 
            createProjectElement, 
            loadProjectContainer, 
            loadProject,
            addProjectElement,
            deleteProjectElement
        }
})()

export default DOMController;