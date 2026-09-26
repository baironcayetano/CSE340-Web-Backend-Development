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

/**
 * Get Upcoming Projects
 * @param {number} numberOfProjects - The number of upcoming projects to retrieve (Default: 5)
 * @returns {Array<{project_id:string, title:string, description:string, date:Date, organization_id:number, organization_name:string}}
*/
const getUpcomingProjects = async(numberOfProjects=5) =>{
    const query = `
        SELECT p.project_id AS project_id, p.title AS title, p.description AS description, 
               p.date AS date, p.location AS location, p.organization_id AS organization_id, 
               o.name AS organization_name
        FROM service_project p
        JOIN organization o ON p.organization_id = o.organization_id
        WHERE p.date >= CURRENT_DATE
        ORDER BY p.date ASC
        LIMIT $1;`;
    
    const queryParms = [numberOfProjects];
    const result = await db.query(query,queryParms);
    return result.rows;
};

/**
 * Get Project Details by Id
 * @param {number} projectId
 * @returns {{project_id:string, title:string, description:string, date:Date, organization_id:number, organization_name:string}}
 */
const getProjectDetails = async (projectId) => {
    const query = `
        SELECT p.project_id AS project_id, p.title AS title, p.description AS description, 
               p.date AS date, p.location AS location, p.organization_id AS organization_id, 
               o.name AS organization_name
        FROM service_project p
        JOIN organization o ON p.organization_id = o.organization_id
        WHERE p.project_id = $1;
    `;

    const queryParams = [projectId];
    const result = await db.query(query, queryParams);
    return result.rows.length > 0 ? result.rows[0] : null;
}

export {getAllProjects, getProjectsByOrganizationId, getUpcomingProjects, getProjectDetails};