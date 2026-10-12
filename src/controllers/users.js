import bcrypt from "bcrypt";
import { createUser, authenticateUser, getAllUsers } from "../models/users.js";

/** Shows registration form  */
const showUserRegistrationForm = (req, res) => {
    res.render("register", {title:"Register"});
}

/** Processes registration form */
const processUserRegistrationForm = async (req, res) => {
    const {name, email, password} = req.body;

    try {
        //hash the password before storing it
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        //create the user in the database
        const userId = await createUser(name, email, passwordHash, 1);
        //There is a problem here:
        // I need to retrive the user information to set the user
        // in the session to avoid the problem of making the user
        // log in with their new account after creating it.

        //redirect to the home page
        req.flash("success", "Registration successful! Please log in.");
        res.redirect("/");
    } catch (error) {
        console.error("Error registering user:", error);
        //If the error code is 234505 means that is an error from postgresSQL
        //thrown because there is a failed attempt to create a new entity  
        //with a duplicate value. In this case only email has the UNIQUE keyword
        //so if the error is about a duplicated email, I will display a message about
        //else I will display a default message.
        const errMessage = (error.code === "23505") ? "The email (username) is already taken. Please try again!" 
                                                  : "An error occurred during registration. Please try again!";
        req.flash("error", errMessage);
        res.redirect("/register");

    }
}

/** Shows login form **/
const showLoginForm = (req, res) => {
      res.render("login",{title:"Login"});
};

/** Processes login form **/
const processLoginForm = async (req, res) => {
     const {email, password} = req.body;
     try{
     	  const user = await authenticateUser(email, password);

	  //user not found -> Invalid credentials
	  if(!user){
		req.flash("error", "Invalid email or password");
		return res.redirect("/login");
	    }

	 //store user info in session
	 req.session.user = user;
	 req.flash("success", "Login successful!");

	 if(res.locals.NODE_ENV === "development"){
	 	console.log("User logged in: ", user);
	 }

	//redirecting to dashboard page
	res.redirect("/dashboard");

    }catch(error){
      	  console.error("Error during login:", error);
	  req.flash("error", "An error ocurred during login. Please, try again.");
	  res.redirect("/login");
    }
};

/** Processes log outs **/
const processLogout = async (req, res) => {
      //deletes existing session
      if(req.session.user){
	 delete req.session.user;
      }

      req.flash("success", "Logout successful!");
      res.redirect("/login");
};

/** show dashboard page */
const showDashboard = async (req, res) => {
    const {name, email} = req.session.user;
    res.render("dashboard",{title:"Dashboard", name, email});
};

/** show users page */
const showUsers = async (req, res) => {
    const users = await getAllUsers();
    res.render("users", {title:"Users", users});
}

/** Middleware to protect routes */
const requireLogin = async (req, res, next) => {
    //verifies the existance of user session
    if(!req.session || !req.session.user){
        req.flash("error", "You must be logged in to access that page.");
        //redirect to login page
        return res.redirect("/login");
    }

    //if the session exists, continue...
    next();
};

/**
 * Middleware factory to require specific role for route access
 * Returns middleware that checks if user has the required role
 * 
 * @param {string} role - The role name required (e.g., 'admin', 'user')
 * @returns {Function} Express middleware function
 */
const requireRole = (role) => {
    return (req, res, next) => {
        // Check if user is logged in first
        if (!req.session || !req.session.user) {
            req.flash('error', 'You must be logged in to access this page.');
            return res.redirect('/login');
        }

        // Check if user's role matches the required role
        if (req.session.user.role_name !== role) {
            req.flash('error', 'You do not have permission to access this page.');
            return res.redirect('/');
        }

        // User has required role, continue
        next();
    };
};

export { showUserRegistrationForm, processUserRegistrationForm,
	 showLoginForm, processLoginForm, processLogout,
     showDashboard, showUsers, requireLogin, requireRole };
