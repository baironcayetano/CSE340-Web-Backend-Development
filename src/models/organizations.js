import db from "./db.js";

/* Returns all the organizations */
const getAllOrganizations = async () => {
    const query = `
        SELECT organization_id, name, description, contact_email, logo_filename
        FROM organization;`;
    const result = await db.query(query);
    return result.rows;
}

/** Returns the details about an organization */
const getOrganizationDetails = async (organizationId) => {
    const query = `
        SELECT organization_id, name, description, contact_email, logo_filename
        FROM public.organization
        WHERE organization_id = $1;
    `
    const queryParams = [organizationId];
    const result = await db.query(query, queryParams);

    //return the first row of the result set, or null if no rows are found
    return result.rows.length > 0 ? result.rows[0] : null;
}

export { getAllOrganizations, getOrganizationDetails}