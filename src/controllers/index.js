/* Render home page */
const showHomePage = (req, res) => {
    const title = "Home";
    res.render("Home",{title});
};

export {showHomePage};