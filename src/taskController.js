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

            const aDate = a.getDate();
            const bDate = b.getDate();
            
            if (bDate !== aDate) return bDate < aDate ? 1 : -1;
            
            let bValue = 0;
            switch (b.getPriority()) {
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
            switch (a.getPriority()) {
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

            return a.getTaskName() > b.getTaskName() ? 1 : -1;
        }

        return list.sort(sortTask);
    }

    const deleteTask = function(id) {
        taskList.forEach((task, i) => {
            if (task.id === id) {
                taskList.splice(i, 1);
                return;
            }
        });
    }

    return {addTask, getTaskByID, getTasksByProject, deleteTask};
}) ()

export default taskController;