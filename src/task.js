let currentTaskID = 0;

function createTask(projectID, taskName, description, date, priority) {
    const id = currentTaskID++;

    let checked = false;
    let checkedTime = "none";

    const toggleCheckbox = function () {
        if (checked) {
            checkedTime = "none";
        } else {
            checkedTime = Date.now();
        }

        checked = !checked;
    }

    const isChecked = function () {
        return checked;
    }

    const getCheckedTime = function () {
        return checkedTime;
    }

    const setTaskName = function (input) {
        taskName = input;
    }

    const getTaskName = function () {
        return taskName;
    }

    const setDescription = function (input) {
        description = input;
    }

    const getDescription = function () {
        return description;
    }

    const setDate = function (input) {
        date = input;
    }

    const getDate = function () {
        return date;
    }

    const setPriority = function (input) {
        priority = input;
    }

    const getPriority = function () {
        return priority;
    }

    return { id, projectID, getTaskName, setTaskName, getDescription, setDescription, getDate, setDate, getPriority, setPriority, isChecked, getCheckedTime, toggleCheckbox }
}

export default createTask;