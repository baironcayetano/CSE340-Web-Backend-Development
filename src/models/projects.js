import db from "./db.js";
/** Returns all the service projects */
const getAllProjects = async() =>{
    const query = `SELECT o.name AS organization_name, p.title, p.date 
                   FROM service_project p
                   JOIN organization o ON p.organization_id = o.organization_id
                   ORDER BY o.name, p.date;           
    `;
    const result = await db.query(query);
    return result.rows;
}

/** Returns the projects of an organization using it's organization id */
const getProjectsByOrganizationId = async (organizationId) => {
    const query = `
        SELECT project_id, organization_id, title, description, location, date
        FROM service_project
        WHERE organization_id = $1
        ORDER BY date;
    `;
    
    const queryParams = [organizationId];
    const result  = await db.query(query,queryParams);
    return result.rows;
}

export {getAllProjects, getProjectsByOrganizationId};