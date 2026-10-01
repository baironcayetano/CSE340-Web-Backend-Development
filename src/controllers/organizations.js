import { getAllOrganizations, getOrganizationDetails, createOrganization } from "../models/organizations.js";
import { getProjectsByOrganizationId } from "../models/projects.js";

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
    const {name, description, contactEmail}  = req.body;
    const logoFilename = "placeholder-logo.png"; //Use the placeholder logo for all new organizations

    const organizationId = await createOrganization(name, description, contactEmail, logoFilename);
    res.redirect(`/organization/${organizationId}`);
}

export { showOrganizationsPage, showOrganizationDetailsPage, showNewOrganizationForm, processNewOrganizationForm};
