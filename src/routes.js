import express from "express";

import { showHomePage } from "./controllers/index.js";
import { showOrganizationDetailsPage, showOrganizationsPage, 
         showNewOrganizationForm, processNewOrganizationForm,
         organizationValidation, showEditOrganizationForm,
         processEditOrganizationForm
} from "./controllers/organizations.js";
import { processNewProjectForm, showNewProjectForm, 
         showProjectDetailsPage, showProjectsPage,
         projectValidation
} from "./controllers/projects.js";
import { showCategoriesPage, showCategoryDetailsPage,
         showAssignCategoriesForm, processAssignCategoriesForm,
         showNewCategoryForm, processNewCategoryForm,
         showEditCategoryForm, categoryValidation
} from "./controllers/categories.js";
import { testErrorPage } from "./controllers/errors.js";

const router = express.Router();

router.get("/", showHomePage);
router.get("/organizations", showOrganizationsPage);
router.get("/projects", showProjectsPage);
router.get("/categories", showCategoriesPage);

//error-handling routes
router.get("/test-error", testErrorPage);

//route for organization details page
router.get("/organization/:id", showOrganizationDetailsPage);
//route for project details page
router.get("/project/:id", showProjectDetailsPage);
//route for category details page
router.get("/category/:id", showCategoryDetailsPage);

//route for new orgazanization page
router.get("/new-organization", showNewOrganizationForm);

//route to handle new organization form submission
router.post("/new-organization",organizationValidation, processNewOrganizationForm);

//route for edit organization page
router.get("/edit-organization/:id",showEditOrganizationForm);

//route to handle edit organization form submission
router.post("/edit-organization/:id", organizationValidation, processEditOrganizationForm);

//route for the new project form page
router.get("/new-project",showNewProjectForm);

//route to handle new project form submission
router.post("/new-project", projectValidation ,processNewProjectForm);

//route for the new category form page
router.get("/new-category", showNewCategoryForm);

//route to handle the submission of the new category form 
router.post("/new-category", categoryValidation, processNewCategoryForm);

//route for the edit category form page
router.get("/edit-category/:id", showEditCategoryForm);

//route for form page to the category assigments
router.get("/assign-categories/:id", showAssignCategoriesForm);

//route to handle the form submission of the category assigments
router.post("/assign-categories/:id", processAssignCategoriesForm);

export default router;
