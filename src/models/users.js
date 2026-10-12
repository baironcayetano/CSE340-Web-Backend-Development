import bcrypt from "bcrypt"
import db from "./db.js";

/** Creates a new user 
 * @param {string} name - user's name
 * @param {string} email - user's email
 * @param {string} passwordHash - hashed password
 * @param {number} roleId - user's role
 * @returns {Promise<number | null>} userId
*/
const createUser = async (name, email, passwordHash, roleId) => {
    const query = `
        INSERT INTO users (name, email, password_hash, role_id)
        VALUES ($1, $2, $3, $4)
        RETURNING user_id;`;
    const queryParams = [name, email, passwordHash, roleId];
    const result = await db.query(query, queryParams);

    //error while creating user
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

/** Finds a user by email 
 * @param {string} email - user's email
 * @returns {Promise<{
 *               user_id:string, 
 *               name:string, 
 *               email:string,
 *               password_hash:string,
 *               role_id:string,
 *            } | null>}
*/
const findUserByEmail = async (email) => {
    const query = `
        SELECT user_id, name, email, password_hash, role_id
        FROM users
        WHERE email = $1;`;
    const queryParams = [email];
    const result = await db.query(query, queryParams);

    //user not found
    if(result.rows.length === 0){
        return null;
    }

    return result.rows[0];
};

/** Verifies user's password 
 * @param {string} password 
 * @param {string} passwordHash
 * @returns {Promise<boolean>}
*/
const verifyPassword = async (password, passwordHash) => {
    return await bcrypt.compare(password, passwordHash) 
};  

/** Authenticates user 
 * @param {string} email - user's email
 * @param {string} password - user's password
 * @returns {Promise<{
 *              user_id:string, 
 *              name:string,
 *              email:string,
 *              role_id:string,
 *          } | null> }
*/
const authenticateUser = async (email, password) => {
    const user = await findUserByEmail(email);
    if(!user) return null;

    const isValidPassword = await verifyPassword(password, user.password_hash);
    //invalid password:
    if(!isValidPassword) { return null };
    //valid:
    delete user.password_hash; //removes the password hash from the object
    return user;
};

export {createUser, authenticateUser};