import checkboxBlank from "./radiobox-blank.svg";
import checkboxMarked from  "./radiobox-marked.svg";
import pencil from "./pencil.svg";
import trashcan from  "./trash-can.svg";

import taskController from "./taskController";

const DOMController = (function() {
    const loadTasks = function(taskList) {
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

    return {loadTasks}
}) ()

export default DOMController;