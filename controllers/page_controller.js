function index(req, res) {
    req.session.views = req.session.views ? req.session.views + 1 : 1; 
    res.json(req.session.views);
}

function dashboard(req, res) {
    const email = req.session.user.email;
    console.log("yes");
    res.render("pages/dashboard", { email });
}

module.exports = {
    index,
    dashboard
}