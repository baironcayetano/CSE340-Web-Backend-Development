import express from "express";

import { showHomePage } from "./controllers/index.js";
import { showOrganizationDetailsPage, showOrganizationsPage, showNewOrganizationForm, 
         processNewOrganizationForm, organizationValidation, showEditOrganizationForm,
         processEditOrganizationForm }
         from "./controllers/organizations.js";
import { processNewProjectForm, showNewProjectForm, showProjectDetailsPage,
         showProjectsPage, showEditProjectForm, processEditProjectForm,
         projectValidation } 
         from "./controllers/projects.js";
import { showCategoriesPage, showCategoryDetailsPage, showAssignCategoriesForm, 
         processAssignCategoriesForm, showNewCategoryForm, processNewCategoryForm,
         showEditCategoryForm, processEditCategoryForm, categoryValidation } 
         from "./controllers/categories.js";
import { showUserRegistrationForm, processUserRegistrationForm, showLoginForm,
	     processLoginForm, processLogout, requireLogin,
         showDashboard, requireRole, 
         showUsers}  
         from "./controllers/users.js";
import { testErrorPage } from "./controllers/errors.js";

const router = express.Router();

/** ---------------------
 *  PUBLIC ROUTES
 * ---------------------- */
router.get("/", showHomePage);
router.get("/organizations", showOrganizationsPage);
router.get("/projects", showProjectsPage);
router.get("/categories", showCategoriesPage);
//route for organization details page
router.get("/organization/:id", showOrganizationDetailsPage);
//route for project details page
router.get("/project/:id", showProjectDetailsPage);
//route for category details page
router.get("/category/:id", showCategoryDetailsPage);

//error-handling routes
router.get("/test-error", testErrorPage);


/** ---------------------
* User Registration Routes
* ----------------------*/
router.get("/register", showUserRegistrationForm);
router.post("/register", processUserRegistrationForm);

/** ---------------------
* User Login Routes
* ---------------------- */
router.get("/login", showLoginForm);
router.post("/login", processLoginForm);
router.get("/logout", processLogout);

/** ----------------------
 *  Dashboard 
 * ----------------------- */
router.get("/dashboard", requireLogin, showDashboard);

/** ------------------------- 
 *  ADMIN ROUTES
 * -------------------------- */

//route to display users
router.get("/users", requireRole("admin"), showUsers);

//route for new orgazanization page
router.get("/new-organization", requireRole("admin"), showNewOrganizationForm);

//route to handle new organization form submission
router.post("/new-organization", requireRole("admin") ,organizationValidation, processNewOrganizationForm);

//route for edit organization page
router.get("/edit-organization/:id", requireRole("admin") ,showEditOrganizationForm);

//route to handle edit organization form submission
router.post("/edit-organization/:id", requireRole("admin"), organizationValidation, processEditOrganizationForm);

//route for the new project form page
router.get("/new-project", requireRole("admin"), showNewProjectForm);

//route to handle new project form submission
router.post("/new-project", requireRole("admin"), projectValidation ,processNewProjectForm);

//route for the edit project form page
router.get("/edit-project/:id", requireRole("admin"), showEditProjectForm);

//route to process edit project form page
router.post("/edit-project/:id", requireRole("admin"), projectValidation, processEditProjectForm);

//route for the new category form page
router.get("/new-category", requireRole("admin"), showNewCategoryForm);

//route to handle the submission of the new category form 
router.post("/new-category", requireRole("admin"), categoryValidation, processNewCategoryForm);

//route for the edit category form page
router.get("/edit-category/:id", requireRole("admin"), showEditCategoryForm);

//route to handle the form submission of the category form
router.post("/edit-category/:id", requireRole("admin"), categoryValidation, processEditCategoryForm);

//route for form page to the category assigments
router.get("/assign-categories/:id", requireRole("admin"), showAssignCategoriesForm);

//route to handle the form submission of the category assigments
router.post("/assign-categories/:id", requireRole("admin"), processAssignCategoriesForm);

export default router;
