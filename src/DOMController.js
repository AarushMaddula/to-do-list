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

    const listTableBody = document.querySelector('.list-table-body');

    function addTaskDialogSubmit(e) {
        e.preventDefault();

        const task = document.querySelector('#task-dialog input[type="text"]').value;
        const description = document.querySelector('#task-dialog textarea').value;
        const date = document.querySelector('#task-dialog input[type="date"]').value;
        const priority = document.querySelector('#task-dialog select').value;

        const newTask = createTask(1, task, description, date, priority);
        taskController.addTask(newTask);

        const newTaskElement = createTaskElement(newTask);
        const position = taskController.getTaskPosition(1, newTask.id);

        if (position === 1) {
            listTableBody.insertBefore(newTaskElement, listTableBody.children[0]);
        } else {
            listTableBody.children[position - 2].after(newTaskElement);
        }

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

        updateTaskPosition(task.id)

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

    const initAddTaskDialog = function () {
        dialogHeader.textContent = "Create Task";

        taskDialogSubmitButton.textContent = "Add";

        resetButtons()

        taskDialogSubmitButton.addEventListener('click', addTaskDialogSubmit);
        taskDialogCancelButton.addEventListener('click', taskDialogCancel);

        dialog.showModal();
    }

    const initEditTaskDialog = function (task) {
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

    addTaskButton.addEventListener('click', initAddTaskDialog);

    const loadTasks = function (taskList) {
        listTableBody.innerHTML = "";

        taskList.forEach(task => {
            listTableBody.appendChild(createTaskElement(task));
        });
    }

    const updateTaskPosition = function (taskID) {
        const currentElement = document.querySelector(`.list-table-body > tr[data-taskid="${taskID}"]`);

        const position = taskController.getTaskPosition(1, taskID);
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

    const createTaskElement = function (task) {

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
        tdTask.textContent = task.getTaskName();
        tdTask.addEventListener('click', () => {
            const e = tdTask.children[0];
            e.classList.toggle("description-visible");
        })

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
        editButton.addEventListener('click', initEditTaskDialog.bind(null, task))

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

    return { initAddTaskDialog, initEditTaskDialog, loadTasks, createTaskElement, deleteTaskElement, updateTaskPosition }
})()

export default DOMController;