import { getAllOrganizations } from "../models/organizations.js";

/* Render Organizations Page */
const showOrganizationsPage = async (req, res) => {
    const title = "Our Partner Organizations";
    const organizations = await getAllOrganizations();

    res.render("organizations", {title, organizations});
};

export { showOrganizationsPage };
