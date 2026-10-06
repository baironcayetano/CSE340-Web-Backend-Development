import db from "./db.js";

/** Create a new category
 * @param {string} categoryName - Name of the category
 * @returns {number} categoryId
 */
const createCategory = async (categoryName) => {
    const query = `
          INSERT INTO category (name)
          VALUES($1)
          RETURNING category_id;
    `;
    const queryParams = [categoryName];
    const result = await db.query(query, queryParams);

    //db errors
    if(!result.rows || result.rows.length === 0){
        throw new Error("Failed to create category");
    }

    //logging category Id in Development mode
    if(process.env.ENABLE_SQL_LOGGING === "true"){
        console.log("Created new category with ID: ", result.rows[0].category_id);
    }

    const categoryId = result.rows[0].category_id;
    
    return (typeof categoryId === "number") ? categoryId : parseInt(categoryId);
}

/** Updates Category 
 * @param {number} categoryId - Id of the category
 * @param {string} categoryName - category name
 * @return {void}
*/
const updateCategory = async (categoryId, categoryName) => {
    const query =  `
        UPDATE category
        SET name = $2
        WHERE category_id = $1
        RETURNING category_id;
    `
    const queryParams = [categoryId, categoryName];
    const result = await db.query(query, queryParams);

    //Category not found
    if(result.rows.length === 0){
	    throw new Error("Category not found");
    }

    //success in DEV MODE
    if(process.env.ENABLE_SQL_LOGGING === "true"){
	    console.log("Updated category with ID:", categoryId);
    }

    return; 
}

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

export { createCategory, getAllCategories, 
         getCategoryById, getCategoriesByProjectId, 
         assignCategoryToProject, updateCategoryAssignments,
         updateCategory
};
