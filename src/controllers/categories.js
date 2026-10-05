import { getAllCategories, getCategoryById, 
         getCategoriesByProjectId,
         updateCategoryAssignments,
         createCategory
	} from "../models/categories.js";
import { getAllProjectsByCategoryId, getProjectDetails } from "../models/projects.js";
import {body, validationResult} from "express-validator";


//Define validation and sanitazion rules for organization form
//Define validation rules for category form
const categoryValidation = [
    body("name")
                .trim()
                .notEmpty()
                .withMessage("Category name required")
                .isLength({min:3, max:100})
                .withMessage("Category name must be between 3 and 100 characters"),
];

/** Render Categories Page */
const showCategoriesPage = async (req, res, next) => {
    const title = "Categories";
    
    const categories = await getAllCategories();
    res.render("categories", {title, categories});   
}

/** Render category details Page */
const showCategoryDetailsPage = async (req, res, next) => {
    const categoryId = req.params.id ? Number(req.params.id) : null;

    //categoryId validation
    if(!categoryId || !Number.isInteger(categoryId)){
        const err = new Error("Page Not Found");
        err.status = 404;
        next(err);
    }

    
    const category = await getCategoryById(categoryId);

    //Not found
    if(!category){
        const err = new Error("Page Not Found");
        err.status = 404;
        return next(err);
    }

    //retrieves all the projects with that category
    const projects = await getAllProjectsByCategoryId(categoryId);
    const title = `${category.name} | Details`;

    res.render("category", {title, category, projects});
}

/** Render new-Category Page */
const showNewCategoryForm = async (req, res, next) => {
    const title = "New Category";
    res.render("new-category", {title});    
}

/** Process the new-category form */
const processNewCategoryForm = async (req, res, next) => {
    //check for validation errors
    const results = validationResult(req);
    console.log(results.isEmpty());
     if(!results.isEmpty()){
        //validation failed - looping through errors
        results.array().forEach((err) => {
	        req.flash("error", err.msg);
        });
       
       //redirect back to the edit-organization form
       return res.redirect("/new-category");
    }
    
    const {name} = req.body;
    const categoryId = await createCategory(name);

    //okay
    req.flash("success", "Category created successfully!");
    res.redirect(`/category/${categoryId}`);
}

/** Render show assignation categories form **/
const showAssignCategoriesForm = async (req, res, next) => {
    const projectId = req.params.id ? parseInt(req.params.id) : null;

    //id param validation
    if(!projectId || Number.isNaN(projectId) || projectId < 0){
	    const err = new Error("Page Not Found");
	    err.status = 404;
	    return next(err);
    }

   //project details
   const projectDetails = await getProjectDetails(projectId);
   //get assigned categories
   const assignedCategories = await getCategoriesByProjectId(projectId);
   //get all categories
   const categories = await getAllCategories();

   const title = "Assign Categories to Project";

   res.render("assign-categories",{ title, projectId, projectDetails, categories, assignedCategories});
};

/** Process categories assignations */
const processAssignCategoriesForm = async (req, res, next) => {
    const projectId = req.params.id ? parseInt(req.params.id) : null;

    //id validation
    if(!projectId || Number.isNaN(projectId)|| projectId < 0){
        const err = new Error("Page Not Found");
        err.status = 404;
        return next(err);
    }

    const selectedCategoryIds = req.body.categoryIds || [];
    //Ensure selectedCategoryIds is an array
    const categoryIdsArray = Array.isArray(selectedCategoryIds) ? selectedCategoryIds.map(categoryId => parseInt(categoryId)) : [selectedCategoryIds];
    await updateCategoryAssignments(projectId, categoryIdsArray);
    
    //Okay
    req.flash("success", "Categories updated successfully!");
    res.redirect(`/project/${projectId}`);

};

export { showCategoriesPage, showCategoryDetailsPage,
         showNewCategoryForm, processNewCategoryForm,
	     showAssignCategoriesForm, processAssignCategoriesForm,
         categoryValidation
	};
