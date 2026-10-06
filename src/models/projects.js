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

/**
 * Get projects by thier associated organization id
 * @param {number} organizationId - organization id
 * @returns {Array<{ 
 *                  project_id:string,
 *                  organization_id:string, 
 *                  title:string,
 *                  description:string,
 *                  location:string,
 *                  date:Date, 
 * }> } - organization projects
 */
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
 * @returns {Array<{ 
 *                    project_id:string,
 *                    title:string,
 *                    description:string,
 *                    date:Date,
 *                    organization_id:number,
 *                    organization_name:string
 * }} - upcoming projects
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
 * @returns {{project_id:string, title:string, description:string, date:Date, organization_id:number, organization_name:string} | null}
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
};

/** Get all service projects by category_id 
 * @param {number} categoryId
 * @return {Array<{ project_id:string, title:string }>}
*/
const getAllProjectsByCategoryId = async (categoryId) => {
    const query = `
    SELECT p.project_id, p.title
    FROM service_project p
    JOIN has_category h ON h.project_id = p.project_id
    WHERE h.category_id = $1;`;

    const queryParams = [categoryId];
    const result = await db.query(query, queryParams);
    return result.rows;
};

/**
 * Creates a new project
 * @param {string} title - project's title
 * @param {string} description - project's description
 * @param {string} location - project's location
 * @param {Date} date - project's date
 * @param {number} organizationId - organization id
 * @returns {number} - new project id
 */
const createProject = async (title, description, location, date, organizationId) => {
    const query = `
        INSERT INTO service_project (title, description, location, date, organization_id)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING project_id;
    `;

    const queryParams = [title, description, location, date, organizationId];
    const result = await db.query(query, queryParams);

    //db errors
    if(!result.rows || result.rows.length === 0){
        throw new Error("Failed to create project");
    }

    //logging new project ID
    if(process.env.ENABLE_SQL_LOGGING === "true"){
        console.log("Created new project with ID: ", result.rows[0].project_id);
    }

    const newProjectId = result.rows[0].project_id; 

    return (typeof newProjectId !== "number") ? parseInt(newProjectId) : newProjectId;
}

/** Updates a project 
 * @param {number} projectId - project id
 * @param {number} organizationId - project's owner 
 * @param {string} title - project title
 * @param {string} description - project's description
 * @param {string} location - project's location 
 * @param {Date} date - project's date
 * @returns {void}
*/
const updateProject = async(projectId,organizationId,title, description, location, date) => {
    const query = `
        UPDATE service_project
        SET organization_id = $2,
            title = $3,
            description = $4,
            location = $5,
            date = $6
        WHERE project_id = $1
        RETURNING project_id;`;

    const queryParams = [projectId, organizationId, title, description, location, date];
    const result = await db.query(query, queryParams);
    
    //not found
    if(result.rows.length === 0){
        throw new Error("Failed to update project");
    }

    //log
    if(process.env.ENABLE_SQL_LOGGING === "true"){
        console.log("Updated project with ID: ", projectId);
    }

}

export { getAllProjects, getProjectsByOrganizationId, 
         getUpcomingProjects, getProjectDetails,
         getAllProjectsByCategoryId, createProject,
         updateProject
        };