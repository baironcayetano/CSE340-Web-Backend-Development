import bcrypt from "bcrypt";
import { createUser, authenticateUser } from "../models/users.js";

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
        const passwordHash = await bcrypt.hash(password, salt);

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

	//redirecting to home page
	res.redirect("/");

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

export { showUserRegistrationForm, processUserRegistrationForm,
	 showLoginForm, processLoginForm, processLogout };
