
const projectController = (function() {
    const projectList = [];

    const addProject = function(projectObj) {
        projectList.push(projectObj);
    }

    const getProjectByID = function(id) {
        let projectSelected = null
        projectList.forEach((project) => {
            if (project.id === id) projectSelected = project;
        })
        return projectSelected;
    }

    const getProjects = function() {
        return sortProjectList(projectList);
    }

    const sortProjectList = function(list) {
        function sortProject(a, b) {
            return a.name > b.name ? 1 : -1;
        }

        return list.sort(sortProject);
    }

    const getProjectPosition = function(projectID) {
        const projects = getProjects();

        let index = 0;

        projects.forEach((project, i) => {
            if (project.id === projectID) index = i;
        }) 

        return index + 1;
    }

    return {addProject, getProjectByID, getProjects, sortProjectList, getProjectPosition}
}) (); 

export default projectController;