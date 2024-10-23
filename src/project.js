let currentProjectID = 0;

const createProject = function(name) {
    const id = currentProjectID++;

    return {id, name};
}

export default createProject;