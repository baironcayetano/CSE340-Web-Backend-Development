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
        let err = null;
        //if organizationId is not a number
        if(!Number.isInteger(organizationId)) err = new Error("Invalid parameter Id. Expected an integer");
        //if organizationId is lower than 0
        else err = new Error("Invalid parameter Id. Expected Id > 0");
        err.status = 404;
        return next(err);
    }

    const organizationDetails = await getOrganizationDetails(organizationId);
    const projects = await getProjectsByOrganizationId(organizationId);
    const title = "Organization Details";

    res.render("organization", {title, organizationDetails, projects});
}

export { showOrganizationsPage, showOrganizationDetailsPage };
