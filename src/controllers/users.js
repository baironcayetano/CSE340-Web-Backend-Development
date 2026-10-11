import bycript from "bcrypt";
import { createUser } from "../models/users.js";

/** Shows registration form  */
const showUserRegistrationForm = (req, res) => {
    res.render("register", {title:"Register"});
}

/** Processes registration form */
const processUserRegistrationForm = async (req, res) => {
    const {name, email, password} = req.body;

    try {
        //hash the password before storing it
        const salt = await bycript.genSalt(10);
        const passwordHash = await bycript.hash(password, salt);

        //create the user in the database
        const userId = await createUser(name, email, passwordHash, 1);

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

export { showUserRegistrationForm, processUserRegistrationForm};