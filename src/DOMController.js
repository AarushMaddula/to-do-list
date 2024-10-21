import checkboxBlank from "./radiobox-blank.svg";
import checkboxMarked from "./radiobox-marked.svg";
import pencil from "./pencil.svg";
import trashcan from "./trash-can.svg";

import taskController from "./taskController";
import createTask from "./task";

const DOMController = (function () {

    const dialog = document.querySelector('#task-dialog');
    const dialogForm = document.querySelector('#task-dialog > form');

    const addTaskButton = document.querySelector('.add-task');

    let taskDialogCancelButton = document.getElementById('task-dialog-cancel');
    let taskDialogSubmitButton = document.getElementById('task-dialog-submit');

    const dialogHeader = document.querySelector('#task-dialog > form > h2');    
    
    function addTaskDialogSubmit(e) {
        e.preventDefault();
                
        const task = document.querySelector('#task-dialog input[type="text"]').value;
        const description = document.querySelector('#task-dialog textarea').value;
        const date = document.querySelector('#task-dialog input[type="date"]').value;
        const priority = document.querySelector('#task-dialog select').value;
        
        const newTask = createTask(1, task, description, date, priority);
        taskController.addTask(newTask);
        
        loadTasks(taskController.getTasksByProject(1));
        
        dialogForm.reset();
        dialog.close();
    }

    function editTaskDialogSubmit(task, e) {
        e.preventDefault();
        
        const taskName = document.querySelector('#task-dialog input[type="text"]').value;
        const description = document.querySelector('#task-dialog textarea').value;
        const date = document.querySelector('#task-dialog input[type="date"]').value;
        const priority = document.querySelector('#task-dialog select').value;

        task.setTaskName(taskName);
        task.setDescription(description);
        task.setDate(date);
        task.setPriority(priority);
        
        loadTasks(taskController.getTasksByProject(1));
        
        dialogForm.reset();
        dialog.close();
    }

    function taskDialogCancel(e) {
        dialogForm.reset();
        dialog.close();
    }

    function resetButtons() {
        const newSubmit = taskDialogSubmitButton.cloneNode(true);
        taskDialogSubmitButton.parentNode.replaceChild(newSubmit, taskDialogSubmitButton); 
        taskDialogSubmitButton = newSubmit;

        const newCancel = taskDialogCancelButton.cloneNode(true);
        taskDialogCancelButton.parentNode.replaceChild(newCancel, taskDialogCancelButton); 
        taskDialogCancelButton = newCancel;
    }
    
    const initAddTaskDialog = function() {
        dialogHeader.textContent = "Create Task";

        taskDialogSubmitButton.textContent = "Add";
       
        resetButtons() 

        taskDialogSubmitButton.addEventListener('click', addTaskDialogSubmit);
        taskDialogCancelButton.addEventListener('click', taskDialogCancel);

        dialog.showModal();
    }

    const initEditTaskDialog = function(task) {
        dialogHeader.textContent = "Edit Task";
        taskDialogSubmitButton.textContent = "Save";

        const taskName = document.querySelector('#task-dialog input[type="text"]');
        taskName.value = task.getTaskName();

        const description = document.querySelector('#task-dialog textarea');
        description.value = task.getDescription();

        const date = document.querySelector('#task-dialog input[type="date"]');
        date.value = task.getDate();

        const priority = document.querySelector('#task-dialog select');
        priority.value = task.getPriority();

        resetButtons() 

        taskDialogSubmitButton.addEventListener('click', editTaskDialogSubmit.bind(null, task));
        taskDialogCancelButton.addEventListener('click', taskDialogCancel);

        dialog.showModal();
    }

    addTaskButton.addEventListener('click', initAddTaskDialog)

    const loadTasks = function (taskList) {
        const tbody = document.querySelector('.list-table-body');
        tbody.innerHTML = "";

        taskList.forEach(task => {
            const tr = document.createElement('tr');
            tr.setAttribute('data-taskid', task.id);

            if (task.isChecked()) tr.classList.add('task-marked');

            const tdCheckbox = document.createElement('td');
            tdCheckbox.classList.add('task-checkbox');
            tdCheckbox.addEventListener('click', e => {
                const taskID = +tdCheckbox.parentElement.dataset.taskid;
                const task = taskController.getTaskByID(taskID);
                task.toggleCheckbox();

                loadTasks(taskController.getTasksByProject(task.projectID));
            })

            const buttonCheckbox = document.createElement('button');
            const ImgCheckbox = document.createElement('img');
            ImgCheckbox.src = task.isChecked() ? checkboxMarked : checkboxBlank;
            ImgCheckbox.alt = "icon";

            buttonCheckbox.appendChild(ImgCheckbox);
            tdCheckbox.appendChild(buttonCheckbox);
            tr.appendChild(tdCheckbox)

            const tdtask = document.createElement('td');
            tdtask.textContent = task.getTaskName();
            tr.appendChild(tdtask);

            const tdDate = document.createElement('td');
            tdDate.textContent = task.getDate();
            tr.appendChild(tdDate);

            const tdPriority = document.createElement('td');
            tdPriority.textContent = task.getPriority();
            tr.appendChild(tdPriority);

            const tdAction = document.createElement('td');
            tdAction.classList.add('action-buttons');

            const editButton = document.createElement('button');
            editButton.addEventListener('click', initEditTaskDialog.bind(null, task))

            const editImage = document.createElement('img');
            editImage.src = pencil;
            editImage.alt = "edit";
            editButton.appendChild(editImage);
            tdAction.appendChild(editButton);

            const deleteButton = document.createElement('button');
            deleteButton.addEventListener('click', e => {
                const taskID = +deleteButton.parentElement.parentElement.dataset.taskid;
                taskController.deleteTask(taskID);

                loadTasks(taskController.getTasksByProject(1));
            })

            const deleteImage = document.createElement('img');
            deleteImage.src = trashcan;
            deleteImage.alt = "delete";
            deleteButton.appendChild(deleteImage);
            tdAction.appendChild(deleteButton);

            tr.appendChild(tdAction);

            tbody.appendChild(tr);
        });
    }

    return { initAddTaskDialog, initEditTaskDialog, loadTasks }
})()

export default DOMController;