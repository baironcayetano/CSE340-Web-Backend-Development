import { getAllOrganizations, getOrganizationDetails, createOrganization } from "../models/organizations.js";
import { getProjectsByOrganizationId } from "../models/projects.js";
import {body, validationResult} from "express-validator";

//Define validation and sanitazion rules for organization form
//Define validation rules for organization form
const organizationValidation = [
    body("name")
                .trim()
                .notEmpty()
                .withMessage("Organization name is required")
                .isLength({min:3,max:150})
                .withMessage("Organization name must be between 3 and 150 characters"),
    body("description")
                .trim()
                .notEmpty()
                .withMessage("Organization description is required")
                .isLength({max:500})
                .withMessage("Organization description cannot exceed 500 characters"),
    body("contactEmail")
                .normalizeEmail()
                .notEmpty()
                .withMessage("Contact Email is required")
                .isEmail()
                .withMessage("Please provide a valid email address")
];

/* Render Organizations Page */
const showOrganizationsPage = async (req, res, next) => {
    const title = "Our Partner Organizations";
    const organizations = await getAllOrganizations();

    res.render("organizations", {title, organizations});
};

/** Render Organization Details Page */
const showOrganizationDetailsPage = async (req, res, next) => {
    const organizationId = req.params.id ? Number(req.params.id) : null;
    
    //organizationId validation
    if(!Number.isInteger(organizationId) || organizationId < 0){
        const err = new Error("Invalid id parameter");
        err.status = 404;
        return next(err);
    }

    
    const organization = await getOrganizationDetails(organizationId);

    //Not Found
    if(!organization){
        const err = new Error("Page Not Found");
        err.status = 404;
        return next(err);
    }

    const projects = await getProjectsByOrganizationId(organizationId);
    const title = "Organization Details";

    res.render("organization", {title, organization, projects});
    
}

/** Render a form to add new organizations */
const showNewOrganizationForm = async (req, res) => {
    const title = "Add New Organization";
    res.render("new-organization",{title});
}

/** Processes the "new organization" form and redirects the user to the new organization page*/
const processNewOrganizationForm = async(req, res) =>{

    //Check for validation errors
    const results = validationResult(req);
    if(!results.isEmpty()){
        //validation failed - loop through errors
        results.array().forEach((error) => {
            req.flash("error", error.msg);
        });

        //redirect back to the new organization form
        return res.redirect("/new-organization");
    }

    const {name, description, contactEmail}  = req.body;
    const logoFilename = "placeholder-logo.png"; //Use the placeholder logo for all new organizations

    const organizationId = await createOrganization(name, description, contactEmail, logoFilename);

    req.flash("success", "Organization added successfully!");
    res.redirect(`/organization/${organizationId}`);
}

export { showOrganizationsPage, showOrganizationDetailsPage, 
         showNewOrganizationForm, processNewOrganizationForm,
         organizationValidation
        };
