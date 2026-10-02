import express from "express";

import { showHomePage } from "./controllers/index.js";
import { showOrganizationDetailsPage, showOrganizationsPage, 
         showNewOrganizationForm, processNewOrganizationForm,
         organizationValidation, showEditOrganizationForm,
         processEditOrganizationForm
} from "./controllers/organizations.js";
import { showProjectDetailsPage, showProjectsPage } from "./controllers/projects.js";
import { showCategoriesPage, showCategoryDetailsPage} from "./controllers/categories.js";
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
router.post("/edit-organization/:id", processEditOrganizationForm);

export default router;
