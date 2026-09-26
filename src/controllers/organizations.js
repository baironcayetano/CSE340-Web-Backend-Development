import { getAllOrganizations, getOrganizationDetails } from "../models/organizations.js";
import { getProjectsByOrganizationId } from "../models/projects.js";

/* Render Organizations Page */
const showOrganizationsPage = async (req, res) => {
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

export { showOrganizationsPage, showOrganizationDetailsPage };
