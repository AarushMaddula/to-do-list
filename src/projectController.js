
const projectController = (function() {
    const projectList = [];

    const addProject = function(projectObj) {
        projectList.push(projectObj);
    }

    const getProjectByID = function(id) {
        projectList.forEach((project) => {
            if (project.id === id) return project;
        })
        return null;
    }
}) (); 

export default projectController;