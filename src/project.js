let currentProjectID = 0;

const createProject = function(name) {
    const id = currentProjectID++;
    const name = name;

    return {id, name};
}

export default createProject;