import db from "./db.js";

export const getAllProjects = async() =>{
    const query = `SELECT o.name AS organization_name, p.title, p.date 
                   FROM service_project p
                   JOIN organization o ON p.organization_id = o.organization_id
                   ORDER BY o.name, p.date;           
    `;
    const result = await db.query(query);
    return result.rows;
}