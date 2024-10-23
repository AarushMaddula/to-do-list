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

    function addTaskDialogSubmit(e) {
        e.preventDefault();

        const task = document.querySelector('#task-dialog input[type="text"]').value;
        const description = document.querySelector('#task-dialog textarea').value;
        const date = document.querySelector('#task-dialog input[type="date"]').value;
        const priority = document.querySelector('#task-dialog select').value;

        const newTask = createTask(DOMController.getDisplayedProjectID(), task, description, date, priority);
        taskController.addTask(newTask);
        DOMController.addTaskElement(newTask.id);

        taskDialogForm.reset();
        taskDialog.close();
    }

    const initAddTaskDialog = function () {
        taskDialogHeader.textContent = "Create Task";

        taskDialogSubmitButton.textContent = "Add";
        
        let buttons = resetDialogButtons(taskDialogSubmitButton, taskDialogCancelButton);
        
        taskDialogSubmitButton = buttons["newSubmit"];
        taskDialogCancelButton = buttons["newCancel"];
        
        taskDialogSubmitButton.addEventListener('click', addTaskDialogSubmit);
        taskDialogCancelButton.addEventListener('click', dialogCancel.bind(null, taskDialogForm, taskDialog));

        taskDialog.showModal();
    }

    function editTaskDialogSubmit(taskID, e) {
        e.preventDefault();
        
        const task = taskController.getTaskByID(taskID);
        
        const taskName = document.querySelector('#task-dialog input[type="text"]').value;
        const description = document.querySelector('#task-dialog textarea').value;
        const date = document.querySelector('#task-dialog input[type="date"]').value;
        const priority = document.querySelector('#task-dialog select').value;

        task.setTaskName(taskName);
        task.setDescription(description);
        task.setDate(date);
        task.setPriority(priority);

        DOMController.updateTaskPosition(taskID);
        DOMController.updateTaskInfo(taskID);

        taskDialogForm.reset();
        taskDialog.close();
    }
  
    const initEditTaskDialog = function (taskID) {
        const task = taskController.getTaskByID(taskID);

        taskDialogHeader.textContent = "Edit Task";
        taskDialogSubmitButton.textContent = "Save";

        const taskName = document.querySelector('#task-dialog input[type="text"]');
        taskName.value = task.getTaskName();

        const description = document.querySelector('#task-dialog textarea');
        description.value = task.getDescription();

        const date = document.querySelector('#task-dialog input[type="date"]');
        date.value = task.getDate();

        const priority = document.querySelector('#task-dialog select');
        priority.value = task.getPriority();

        const buttons = resetDialogButtons(taskDialogSubmitButton, taskDialogCancelButton);
        
        taskDialogSubmitButton = buttons["newSubmit"];
        taskDialogCancelButton = buttons["newCancel"];

        taskDialogSubmitButton.addEventListener('click', editTaskDialogSubmit.bind(null, taskID));
        taskDialogCancelButton.addEventListener('click', dialogCancel.bind(null, taskDialogForm, taskDialog));

        taskDialog.showModal();
    }

    function addProjectDialogSubmit(e) {
        e.preventDefault();

        const name = document.querySelector('#project-dialog input[type="text"]').value;

        const newProject = createProject(name);
        projectController.addProject(newProject);
        DOMController.addProjectElement(newProject.id);

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

    return { initAddProjectDialog, initAddTaskDialog, initEditTaskDialog };
})();

export default dialogController;