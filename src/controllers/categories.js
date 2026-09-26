import { getAllCategories, getCategoryById } from "../models/categories.js";
import { getAllProjectsByCategoryId } from "../models/projects.js";

/** Render Categories Page */
const showCategoriesPage = async (req, res, next) => {
    const title = "Categories";
    try {
        const categories = await getAllCategories();
        res.render("categories", {title, categories});   
    } catch (error) {
        const err = error;
        err.status = 500;
        next(err);
    }
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

    try{
        const category = await getCategoryById(categoryId);

        //Not found
        if(!category){
            const err = new Error("Page Not Found");
            err.status = 404;
            next(err);
        }

        //retrieves all the projects with that category
        const projects = await getAllProjectsByCategoryId(categoryId);
        const title = `${category.name} | Details`;

        res.render("category", {title, category, projects});
        
    }catch(error){
        const err = error;
        err.status = 500;
        next(err);
    }
    
}

export { showCategoriesPage, showCategoryDetailsPage};