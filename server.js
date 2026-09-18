import {fileURLToPath} from 'url';
import path from 'path';
import { testConnection } from './src/models/db.js';
import express from "express";
import { getAllOrganizations} from "./src/models/organizations.js";
import { getAllProjects } from './src/models/projects.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Define the application enviroment
const NODE_ENV = process.env.NODE_ENV?.toLocaleLowerCase() || 'production';
//Define the port number the server will listen on
const PORT = process.env.PORT || 3000;

const app = express();

/**
  * Configure Express middleware
  */

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));


//Set EJS as the templating engine
app.set('view engine','ejs');

//Tell Express where to find your templates
app.set('views', path.join(__dirname,'src/views'));

/**
  * Routes
  */
app.get('/', (req, res) => {
    const title = "Home";
    res.render('home',{title});
});

app.get('/organizations', async (req, res) => {
    const organizations = await getAllOrganizations();
    const title = "Our Partner Organizations";
    res.render('organizations',{title, organizations})
});

app.get('/projects', async (req, res) => {
    const projects = await getAllProjects();
    const title = "Service Projects";
    res.render('projects', {title, projects});
});

app.get("/categories",(req, res)=>{
    const title = "Categories";
    res.render('categories',{title});
})

app.listen(PORT, async () =>{
    try{
        await testConnection();
        console.log(`Server is running at http://127.0.0.1:${PORT}`);
        console.log(`Enviroment: ${NODE_ENV}`);
    } catch (error) {
        console.error("Error connecting to the database", error);
    }
});