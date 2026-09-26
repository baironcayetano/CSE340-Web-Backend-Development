import { getProjectDetails, getUpcomingProjects } from "../models/projects.js";

/** Render Projects Page */
const showProjectsPage = async (req, res) => {
    const title = "Service Projects";
    const NUMBER_OF_UPCOMING_PROJECTS = 5;
    const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);

    res.render("projects", {title, projects});
};

/** Render Project Page */
const showProjectDetailsPage = async(req, res, next) => {
    const projectId = req.params.id ? Number(req.params.id) : null;
    
    //projectId validation
    if(!Number.isInteger(projectId) || projectId < 0){
        const err = new Error("Invalid id parameter");
        err.status = 404;
        return next(err);
    }

    const project = await getProjectDetails(projectId);

    //Not found
    if(!project){
        const err = new Error("Page Not Found");
        err.status = 404;
        return next(err);
    }

    const title = `${project.title} | Details`;
    
    return res.render("project", {title, project});
}

export { showProjectsPage, showProjectDetailsPage };