import { getCategoriesByProjectId } from "../models/categories.js";
import { getProjectDetails, getUpcomingProjects, createProject, updateProject } from "../models/projects.js";
import { getAllOrganizations } from "../models/organizations.js";
import { body, validationResult } from "express-validator";

//Define validation and sanitazion rules for organization form
//Define validation rules for organization form
const projectValidation = [
    body("title")
                .trim()
                .notEmpty()
                .withMessage("The project name is required")
                .isLength({min:3, max:150})
                .withMessage("The project name must be between 3 and 150 characters"),
    body("description")
                .trim()
                .notEmpty()
                .withMessage("A description is required")
                .isLength({min:3, max: 500})
                .withMessage("The description must be between 3 and 500 characters"),
    body("location")
                .trim()
                .notEmpty()
                .withMessage("A location is required")
                .isLength({max:255})
                .withMessage("The location must be less than 255 characters"),
    body("date")
                .notEmpty()
                .withMessage("A date is required")
                .isISO8601()
                .withMessage("The date must be a valid date format"),
    body("organizationId")
                .notEmpty()
                .withMessage("Organization required")
                .isInt()
                .withMessage("Invalid organization") //this message avoids attacker to add a random int
];

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

    const categories = await getCategoriesByProjectId(projectId);
    const title = `${project.title} | Details`;
    
    return res.render("project", {title, project, categories});    
}

/** Render new project form page */
const showNewProjectForm = async (req, res) => {
    const title = "Add New Project";
    const organizations = await getAllOrganizations();
    return res.render("new-project",{title, organizations});
}

/** Processes the form for new projects */
const processNewProjectForm = async (req, res) => {
    //check for validation errors
    const results = validationResult(req);
    if(!results.isEmpty()){
        //validation failed - loop through errors
        results.array().forEach((error) => {
            req.flash("error", error.msg);
        });

        //redirect back to the new organization form
        return res.redirect("/new-project");
    }

    const {organizationId, title, description, location, date} = req.body;
    //We catch the error because we don't want the user to receive the 500 error page after submitting the form
    try{
        const newProjectId = await createProject(title,description,location,date,organizationId);
        //Success flash message
        req.flash("success", "Organization updated successfully!");
        //project details page
        res.redirect(`/project/${newProjectId}`);
    }catch(error){
        console.error("Error creating new project:", error);
        req.flash("error", "There was an error creating the service project");
        res.redirect("/new project");
    }
}

const showEditProjectForm = async (req, res, next) => {
    const projectId = req.params.id ? parseInt(req.params.id) : null;

    //invalid id
    if(!projectId || Number.isNaN(projectId) || projectId < 0){
        const err = new Error("Page Not Found");
        err.status = 404;
        return next(err);
    }

    const title = "Edit Project";
    
    const organizations = await getAllOrganizations();
    const projectDetails = await getProjectDetails(projectId);

    if(!projectDetails){
        const err = new Error("Page Not Found");
        err.status = 404;
        return next(err);
    }
    
    res.render("edit-project", {title, projectDetails, organizations});
    
}

const processEditProjectForm = async (req, res) => {
    const projectId = req.params.id ? parseInt(req.params.id) : null;

    //invalid id
    if(!projectId || Number.isNaN(projectId) || projectId < 0){
        const err = new Error("Page Not Found");
        err.status = 404;
        return next(err);
    }
    
    //check for validation errors
    const results = validationResult(req);
    if(!results.isEmpty()){
        //validation failed - loop through errors
        results.array().forEach((error) => {
            req.flash("error", error.msg);
        });

        //redirect back to the new organization form
        return res.redirect(`/edit-project/${projectId}`);
    }

    const {organizationId, title, description, location, date} = req.body;
    //We catch the error because we don't want the user to receive the 500 error page after submitting the form
    try{
        await updateProject(projectId, organizationId, title, description, location, date); 
        //Success flash message
        req.flash("success", "Organization updated successfully!");
        //project details page
        res.redirect(`/project/${projectId}`);
    }catch(error){
        console.error("Error creating new project:", error);
        req.flash("error", "There was an error creating the service project");
        res.redirect("/projects");
    }
}

export { showProjectsPage, showProjectDetailsPage,
         showNewProjectForm, processNewProjectForm,
         showEditProjectForm, processEditProjectForm,
         projectValidation
 };