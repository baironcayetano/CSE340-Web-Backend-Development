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
 *               role_name:string,
 *            } | null>}
*/
const findUserByEmail = async (email) => {
    const query = `
        SELECT u.user_id, u.name, u.email, u.password_hash, r.role_name 
        FROM users u
        JOIN roles r ON u.role_id = r.role_id
        WHERE u.email = $1;`;

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
 *              role_name:string,
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

/** Get all users 
 * @return {Promise<{
 *                          user_id:string,
 *                          name:string,
 *                          email:string, 
 *                          role_name:string
 * }[]>}
*/
const getAllUsers = async () => {
    const query = `
        SELECT u.user_id, u.name, u.email, r.role_name 
        FROM users u
        JOIN roles r ON u.role_id = r.role_id;`;

    const result = await db.query(query);
    return result.rows;
}

/** -------------------------------
 * USER SUSCRIPTIONS TO PROJECTS 
 * -------------------------------- */

/** Get all user's suscriptions to projects 
 * @param {number} userId - user's id
 * @returns {Promise<{ project_id:string, 
 *                     title:string, 
 *                     date:Date }[] 
 *                     | null>
 * }
*/
const getAllUserProjectVolunteers = async (userId) => {
    const query = `
        SELECT p.joined_at, s.project_id, s.title, s.date
        FROM service_project s
        JOIN project_volunteers p 
        ON p.project_id = s.project_id
        WHERE p.user_id = $1;
    `;
    const queryParams = [userId];
    const result = await db.query(query,queryParams);

    //projects not found
    if(result.rows.length === 0){
        return null;
    }

    return result.rows;
};

/** Get suscription status using the project Id and user Id
*  @param {number} userId - User Id
*  @param {number} projectId - Proje            <p>But you can still signup to one of them </p> ct Id
*  @returns {Promise<boolean>}
*/
const getUserProjectVolunteerStatus = async (userId, projectId) => {
    const query = `
        SELECT s.project_id
        FROM service_project s
        JOIN project_volunteers p 
        ON p.project_id = s.project_id
        WHERE p.user_id = $1 AND p.project_id = $2;
    `;

    const queryParams = [userId, projectId]
    const result = await db.query(query, queryParams);

    //if the results includes the project_id
    //it means that the user is signed up to it
    const projectVolunteerStatus = (result.rows.length === 0) ? false : true;
    return projectVolunteerStatus;
};            

/** Signup user to a service project 
 * @param {number} userId - user's ID
 * @param {number} projectId - project's ID
 * @returns {Promise<void>}
*/
const signupUserToProject = async(userId, projectId) => {
    const query = `
        INSERT INTO project_volunteers (user_id, project_id)
        VALUES ($1, $2)
        RETURNING user_id;`;
    const queryParams = [userId, projectId];
    const result = await db.query(query, queryParams);
    
    //If the result does not include de user_id
    //it means that something went wrong
    if(result.rows.length === 0){
        throw new Error("Failed to sign up user for this project");
    }

    if(process.env.ENABLE_SQL_LOGGING === "true"){
        console.log(`Suscribed user with ID: ${userId} to service project: ${projectId}!`);
    }

};

/** withdraw user from a service project
 * @param {number} userId - user's id
 * @param {number} projectId - project's id
 * @returns {Promise<void>}
 *  */
const withdrawUserFromProject = async(userId, projectId) => {
    const query = `DELETE FROM project_volunteers 
                   WHERE user_id = $1 AND project_id = $2
                   RETURNING project_id`;
    const queryParams = [userId, projectId];
    const result = await db.query(query, queryParams);

    //Error deleting
    if(result.rows.length === 0){
        throw new Error("Failed to unsuscribe user from service_project");
    }

    if(process.env.ENABLE_SQL_LOGGING === "true"){
        console.log(`Unsuscribed user with ID: ${userId} from service project: ${projectId}!`);
    }

};

export {createUser, authenticateUser, getAllUsers,
        getAllUserProjectVolunteers, getUserProjectVolunteerStatus,
        signupUserToProject, withdrawUserFromProject
};