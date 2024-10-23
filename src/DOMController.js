import checkboxBlank from "./radiobox-blank.svg";
import checkboxMarked from "./radiobox-marked.svg";
import pencil from "./pencil.svg";
import trashcan from "./trash-can.svg";

import list from "./format-list-checkbox.svg";

import taskController from "./taskController";
import projectController from "./projectController";
import dialogController from "./dialogController";

const DOMController = (function () {

    const listTableBody = document.querySelector('.list-table-body');

    const projectContainer = document.querySelector('.project-container');
    const pageHeader = document.querySelector('.list-header');

    const addTaskButton = document.querySelector('.add-task');
    const addProjectButton = document.querySelector('.project-header > button');
    
    let displayedProjectID;

    addTaskButton.addEventListener('click', dialogController.initAddTaskDialog);
    addProjectButton.addEventListener('click', dialogController.initAddProjectDialog);

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
        tdCheckbox.addEventListener('click', e => {
            task.toggleCheckbox();

            tr.classList.toggle('task-marked');
            ImgCheckbox.src = task.isChecked() ? checkboxMarked : checkboxBlank;
            updateTaskPosition(task.id);
        })

        const buttonCheckbox = document.createElement('button');

        const ImgCheckbox = document.createElement('img');
        ImgCheckbox.src = task.isChecked() ? checkboxMarked : checkboxBlank;
        ImgCheckbox.alt = "icon";

        //task name
        const tdTask = document.createElement('td');
        tdTask.addEventListener('click', () => {
            tdTaskDescription.classList.toggle("description-visible");
        })

        const tdTaskName = document.createElement('p');
        tdTaskName.textContent = task.getTaskName();

        const tdTaskDescription = document.createElement('p');
        tdTaskDescription.textContent = task.getDescription();
        tdTaskDescription.style.display = "none";
        
        //task date
        const tdDate = document.createElement('td');
        tdDate.textContent = task.getDate();

        //task priority
        const tdPriority = document.createElement('td');
        tdPriority.textContent = task.getPriority();

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
        })

        const deleteImage = document.createElement('img');
        deleteImage.src = trashcan;
        deleteImage.alt = "delete";

        //containers
        const tdAction = document.createElement('td');
        tdAction.classList.add('action-buttons');
        
        buttonCheckbox.appendChild(ImgCheckbox);
        tdCheckbox.appendChild(buttonCheckbox);
        tdTask.appendChild(tdTaskName);
        tdTask.appendChild(tdTaskDescription);
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
        
        currentElement.children[1].children[0].textContent = task.getTaskName();
        currentElement.children[1].children[1].textContent = task.getDescription();
        currentElement.children[2].textContent = task.getDate();
        currentElement.children[3].textContent = task.getPriority();
    }

    const addTaskElement = function (taskID) {
        const newTaskElement = DOMController.createTaskElement(taskID);
        const position = taskController.getTaskPosition(displayedProjectID, taskID);

        if (position === 1) {
            listTableBody.insertBefore(newTaskElement, listTableBody.children[0]);
        } else {
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

    const createProjectElement = function (projectID) {
        const project = projectController.getProjectByID(projectID);

        const img = document.createElement('img');
        img.src = list;
        img.alt = "icon";

        const text = document.createTextNode(project.name);

        const li = document.createElement('li');
        li.appendChild(img);
        li.appendChild(text);
        li.addEventListener('click', () => {
            loadProject(projectID);
        })

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

    return { 
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
            addProjectElement
        }
})()

export default DOMController;