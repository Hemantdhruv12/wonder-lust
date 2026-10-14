const Listing = require("./models/listing")
const ExpressError = require("./utils/expressError.js");
const Review = require("./models/review.js");

module.exports.isLoggedIn = (req, res, next) => {
    
    if (!req.isAuthenticated()) { 
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "user must be logged in");
        return res.redirect("/login");
    }
    next();
};


module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl
    }
    next()
}

module.exports.isOwner = async(req,res,next)=>{
 let {id} = req.params;
 let listing = await Listing.findById(id)
 if(!listing.owner._id.equals(res.locals.currUser._id)){;
 req.flash("error", "assess denied");
 res.redirect(`/listings${id}`)
}
next()
}


module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;

    let review = await Review.findById(reviewId);
    
    
   

    // Check if the current logged-in user is the author of this review
   if (!review.author || !review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You do not have permission to delete this review");
        return res.redirect(`/listings/${id}`); // Fixed: Added missing slash and return
    }

    next(); 
};
