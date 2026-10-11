import db from "./db.js";

/** Creates a new user 
 * @param {string} name - user's name
 * @param {string} email - user's email
 * @param {string} passwordHash - hashed password
 * @param {number} roleId - user's role
 * @returns {number | null} userId
*/
const createUser = async (name, email, passwordHash, roleId) => {
    const query = `
        INSERT INTO users (name, email, password_hash, role_id)
        VALUES ($1, $2, $3, $4)
        RETURNING user_id;`;
    const queryParams = [name, email, passwordHash, roleId];
    const result = await db.query(query, queryParams);

    //creation error
    if(result.rows.length === 0){
        throw new Error("Failed to create user");
    }

    //user Id: number | NaN only if the user_id is not a number.
    const userId = !Number.isNaN(parseInt(result.rows[0].user_id)) ? parseInt(result.rows[0].user_id) : null;
    
    if(process.env.ENABLE_SQL_LOGGING === "true"){
        console.log("Created new user with ID: ", userId);
    }

    return userId;
}

export {createUser};