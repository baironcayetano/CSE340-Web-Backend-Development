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

/** Assign a category to a project
* @param {number} projectId - Id of the project
* @param {number} categoryId - Id of the category
* @returns {void}
**/
const assignCategoryToProject = async (projectId, categoryId) => {
    const query = `
    INSERT INTO has_category (project_id, category_id)
    VALUES($1, $2);`;
    
    const queryParams = [projectId, categoryId];
    await db.query(query, queryParams);
};

/** Update category assignments 
* @param {number} projectId - Id of the project
* @param {Array<number>} categoryIds - Ids assigned to the given project
**/
const updateCategoryAssignments = async (projectId, categoryIds) => {
     //Remove any category assigned to the project 
     const deleteQuery = `
     	DELETE FROM has_category
	WHERE project_id = $1;`;
     const deleteQueryParams = [projectId];
     await db.query(deleteQuery, deleteQueryParams);

    //Add the new assignments
    for(const categoryId of categoryIds){
	await assignCategoryToProject(projectId, categoryId);
    }
};

export { getAllCategories, getCategoryById, 
	 getCategoriesByProjectId, assignCategoryToProject,
	 updateCategoryAssignments
};
