import db from "./db.js";

/** Get all categories 
 * @returns {Array<{category_id:number, name:string}>}
*/
const getAllCategories = async() => {
    const query = `SELECT category_id, name FROM category;`;
    const result = await db.query(query);
    return result.rows; 
};

/** Get a category by Id 
 * @param {number} categoryId
 * @returns {{name:string}}
*/
const getCategoryById = async (categoryId) => {
    const query = `
        SELECT name FROM category
        WHERE category.category_id = $1; 
    `
    const queryParams = [categoryId];
    const result = await db.query(query, queryParams);

    return result.rows.length > 0 ? result.rows[0] : null;
};

/** Get categories of a service project 
 * @param {number} projectId
 * @returns {Array<{category_id:string, name:string}>}
*/
const getCategoriesByProjectId = async (projectId) => {
    const query = `
        SELECT c.category_id, c.name
        FROM category c
        JOIN has_category h ON h.category_id = c.category_id
        WHERE h.project_id = $1;`;
    const queryParams = [projectId];
    const result = await db.query(query, queryParams);
    return result.rows;
};

export { getAllCategories, getCategoryById, getCategoriesByProjectId };