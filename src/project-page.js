import checkboxBlank from "./radiobox-blank.svg";
import checkboxMarked from  "./radiobox-marked.svg";
import pencil from "./pencil.svg";
import trashcan from  "./trash-can.svg";

const generateProjectPage = function() {
    const content = document.querySelector('#content');

    const listHeader = document.createElement('h1');
    listHeader.classList.add('list-header');
    listHeader.textContent = "Project: School";
    content.appendChild(listHeader);

    const listTable = document.createElement('table');
    listTable.classList.add('list-table');

    const thead = document.createElement('thead');
    thead.classList.add('list-table-header');

    const tr = document.createElement('tr');

    const theadLabels = ["", "Name", "Date", "Priority", ""]

    theadLabels.forEach((value) => {
        const td = document.createElement('td');
        td.textContent = value;
        tr.appendChild(td);
    })

    thead.appendChild(tr);
    listTable.appendChild(thead);

    const tbody = document.createElement('tbody');
    tbody.classList.add('list-table-body');

    const tasks = [{name: "Finish Math Homework", date: "12/12/2024", priority: "High"}]

    tasks.forEach((task) => {
        const tr = document.createElement('tr');

        const tdCheckbox = document.createElement('td');
        tdCheckbox.classList.add('task-checkbox');

        const buttonCheckbox = document.createElement('button');
        const ImgCheckbox = document.createElement('img');
        ImgCheckbox.src = checkboxBlank;
        ImgCheckbox.alt = "icon";

        buttonCheckbox.appendChild(ImgCheckbox);
        tdCheckbox.appendChild(buttonCheckbox);
        tr.appendChild(tdCheckbox)

        const tdName = document.createElement('td');
        tdName.textContent = task.name;
        tr.appendChild(tdName);

        const tdDate = document.createElement('td');
        tdDate.textContent = task.date;
        tr.appendChild(tdDate);

        const tdPriority = document.createElement('td');
        tdPriority.textContent = task.priority;
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
        const deleteImage = document.createElement('img');
        deleteImage.src = trashcan;
        deleteImage.alt = "delete";
        deleteButton.appendChild(deleteImage);
        tdAction.appendChild(deleteButton);

        tr.appendChild(tdAction);

        tbody.appendChild(tr);
    })

    listTable.appendChild(tbody);
    content.appendChild(listTable);

    const addTaskButton = document.createElement('button');
    addTaskButton.classList.add('add-task');
    addTaskButton.textContent = "+";
    content.appendChild(addTaskButton);
}

export {generateProjectPage};