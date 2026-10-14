const User = require("../models/user")
module.exports.renderSignup=(req, res) => {
    res.render("users/signup.ejs");
}

module.exports.signUp=async (req, res, next) => { // Added next here
    try {
        let { username, email, password } = req.body;
        let newUser = new User({ email, username });
        let registerUser = await User.register(newUser, password);
        
        
        
        req.login(registerUser, (err) => {
            if (err) {
                return next(err); // Return to prevent execution
            }
            req.flash("success", "User registered successfully!");
            res.redirect("/listings");
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }}


    module.exports.renderlogin=(req, res) => {
    res.render("users/login.ejs");
}

// Handle Login Logic

    module.exports.login=async (req, res) => {
        
        req.flash("success", "Welcome back to Wanderlust!");
        let url = res.locals.redirectUrl || "/listings";
        res.redirect(url);
    }

    module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You are logged out!");
        res.redirect("/listings");
    });
}