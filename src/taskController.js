const taskController = (function() {
    const taskList = [];

    const addTask = function(taskObj) {
        taskList.push(taskObj);
    }

    const getTaskByID = function(id) {
        let taskSelected = null;

        taskList.forEach((task) => {
            if (task.id === id) taskSelected = task;
        })
        return taskSelected;
    }

    const getTasksByProject = function(projectID) {   
        const tasks = [];

        taskList.forEach((task) => {
            if (task.projectID === projectID) tasks.push(task);
        })

        return sortTaskList(tasks);
    }

    const sortTaskList = function(list) {
        function sortTask(a, b) {
            const aChecked = a.isChecked();
            const bChecked = b.isChecked();

            if (aChecked && bChecked) {
                const aCheckedTime = a.getCheckedTime();
                const bCheckedTime = b.getCheckedTime();

                if (bCheckedTime === aCheckedTime) return 0;

                return bCheckedTime > aCheckedTime ? 1 : -1;
            }

            if (aChecked || bChecked) return aChecked ? 1 : -1;

            if (b.date !== a.date) return b.date < a.date ? 1 : -1;
            
            let bValue = 0;
            switch (b.priority) {
                case "high":
                    bValue = 3;
                    break;
                case "medium":
                    bValue = 2;
                    break;
                case "low":
                    bValue = 1;
                    break;    
            }

            let aValue = 0;
            switch (a.priority) {
                case "high":
                    aValue = 3;
                    break;
                case "medium":
                    aValue = 2;
                    break;
                case "low":
                    aValue = 1;
                    break;    
            }
            
            if (aValue !== bValue) return aValue > bValue ? -1 : 1;

            return a.task > b.task ? 1 : -1;
        }

        return list.sort(sortTask);
    }

    return {addTask, getTaskByID, getTasksByProject};
}) ()

export default taskController;