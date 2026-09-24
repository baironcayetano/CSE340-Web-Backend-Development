/* Render home page */
const showHomePage = (req, res) => {
    const title = "Home";
    res.render("home",{title});
};

export {showHomePage};