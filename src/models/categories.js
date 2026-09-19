import db from "./db.js";

export const getAllCategories = async() => {
    const query = `SELECT name FROM category;`;
    const result = await db.query(query);
    return result.rows; 
}