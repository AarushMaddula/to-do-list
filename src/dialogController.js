import localStorageController from "./localStorageController";
import DOMController from "./DOMController";
import taskController from "./taskController";
import projectController from "./projectController";

import createTask from "./task";
import createProject from "./project";

const dialogController = (function () {

    const taskDialog = document.querySelector('#task-dialog');
    const taskDialogForm = document.querySelector('#task-dialog > form');
    const taskDialogHeader = document.querySelector('#task-dialog > form > h2');

    let taskDialogCancelButton = document.getElementById('task-dialog-cancel');
    let taskDialogSubmitButton = document.getElementById('task-dialog-submit');

    const projectDialog = document.querySelector('#project-dialog');
    const projectDialogForm = document.querySelector('#project-dialog > form');
    const projectDialogHeader = document.querySelector('#project-dialog > form > h2');

    let projectDialogCancelButton = document.getElementById('project-dialog-cancel');
    let projectDialogSubmitButton = document.getElementById('project-dialog-submit');

    function dialogCancel(dialogForm, dialog) {
        dialogForm.reset();
        dialog.close();
    }

    function resetDialogButtons(submitButton, cancelButton) {
        const newSubmit = submitButton.cloneNode(true);
        submitButton.parentNode.replaceChild(newSubmit, submitButton);

        const newCancel = cancelButton.cloneNode(true);
        cancelButton.parentNode.replaceChild(newCancel, cancelButton);
        
        return {newSubmit, newCancel}
    }

    function populateProjectInputDialog() {
        const projectInput = document.querySelector('#project');
        const projects = projectController.getProjects();

        const displayedProjectID = DOMController.getDisplayedProjectID(); 

        projectInput.innerHTML = "";

        projects.forEach(project => {
            const option = document.createElement('option');
            option.value = project.name;
            option.textContent = project.name;
            option.setAttribute('data-projectid', project.id)

            if (project.id === displayedProjectID) {
                option.setAttribute('selected', true);
            }

            projectInput.appendChild(option);
        });
    }
    
    function addTaskDialogSubmit(e) {
        e.preventDefault();

        if (!taskDialogForm.checkValidity()) {
            taskDialogForm.reportValidity();
            return;
        }

        const taskName = document.querySelector('#taskName').value;
        const description = document.querySelector('#description').value;
        const date = document.querySelector('#date').value.replace(/-/g, "/");
        const priority = document.querySelector('#priority').value;

        const optionElement = document.querySelector('#project');
        const projectID = +optionElement.options[optionElement.selectedIndex].dataset.projectid;

        const newTask = createTask(projectID, taskName, description, date, priority);
        taskController.addTask(newTask);
        DOMController.addTaskElement(newTask.id);

        localStorageController.storeTaskList();

        taskDialogForm.reset();
        taskDialog.close();
    }

    const initAddTaskDialog = function () {
        taskDialogHeader.textContent = "Create Task";

        taskDialogSubmitButton.textContent = "Add";

        populateProjectInputDialog();
        
        let buttons = resetDialogButtons(taskDialogSubmitButton, taskDialogCancelButton);
        
        taskDialogSubmitButton = buttons["newSubmit"];
        taskDialogCancelButton = buttons["newCancel"];
        
        taskDialogSubmitButton.addEventListener('click', addTaskDialogSubmit);
        taskDialogCancelButton.addEventListener('click', dialogCancel.bind(null, taskDialogForm, taskDialog));

        taskDialog.showModal();
    }

    function editTaskDialogSubmit(taskID, e) {
        e.preventDefault();
        
        if (!taskDialogForm.checkValidity()) {
            taskDialogForm.reportValidity();
            return;
        }

        const task = taskController.getTaskByID(taskID);
        
        const taskName = document.querySelector('#taskName').value;
        const description = document.querySelector('#description').value;
        const date = document.querySelector('#date').value.replace(/-/g, "/");
        const priority = document.querySelector('#priority').value;

        const optionElement = document.querySelector('#project');
        const projectID = +optionElement.options[optionElement.selectedIndex].dataset.projectid;

        task.setTaskName(taskName);
        task.setDescription(description);
        task.setDate(date);
        task.setPriority(priority);
        task.setProjectID(projectID);

        DOMController.updateTaskInfo(taskID);
        DOMController.updateTaskPosition(taskID);

        localStorageController.storeTaskList();

        taskDialogForm.reset();
        taskDialog.close();
    }
  
    const initEditTaskDialog = function (taskID) {
        const task = taskController.getTaskByID(taskID);

        taskDialogHeader.textContent = "Edit Task";
        taskDialogSubmitButton.textContent = "Save";

        populateProjectInputDialog();

        const taskName = document.querySelector('#taskName');
        taskName.value = task.getTaskName();

        const description = document.querySelector('#description');
        description.value = task.getDescription();

        const date = document.querySelector('#date');
        date.value = task.getDate().replace(/\//g, "-");;

        const priority = document.querySelector('#priority');
        priority.value = task.getPriority();

        const projectID = document.querySelector('#project');
        projectID.value = projectController.getProjectByID(task.getProjectID()).name;

        const buttons = resetDialogButtons(taskDialogSubmitButton, taskDialogCancelButton);
        
        taskDialogSubmitButton = buttons["newSubmit"];
        taskDialogCancelButton = buttons["newCancel"];

        taskDialogSubmitButton.addEventListener('click', editTaskDialogSubmit.bind(null, taskID));
        taskDialogCancelButton.addEventListener('click', dialogCancel.bind(null, taskDialogForm, taskDialog));

        taskDialog.showModal();
    }

    function addProjectDialogSubmit(e) {
        e.preventDefault();

        if (!projectDialogForm.checkValidity()) {
            projectDialogForm.reportValidity();
            return;
        }

        const name = document.querySelector('#name').value;

        const newProject = createProject(name);
        projectController.addProject(newProject);
        DOMController.addProjectElement(newProject.id);

        localStorageController.storeProjectList();

        projectDialogForm.reset();
        projectDialog.close();
    }

    const initAddProjectDialog = function () {
        projectDialogHeader.textContent = "Create Project";

        projectDialogSubmitButton.textContent = "Add";

        const buttons = resetDialogButtons(projectDialogSubmitButton, projectDialogCancelButton);

        projectDialogSubmitButton = buttons["newSubmit"];
        projectDialogCancelButton = buttons["newCancel"];

        projectDialogSubmitButton.addEventListener('click', addProjectDialogSubmit);
        projectDialogCancelButton.addEventListener('click', dialogCancel.bind(null, projectDialogForm, projectDialog));

        projectDialog.showModal();
    }

    return { 
        initAddProjectDialog, 
        initAddTaskDialog, 
        initEditTaskDialog 
    };
})();

export default dialogController;