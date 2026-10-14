const Review = require("../models/review")
const Listing = require("../models/listing")



module.exports.createReview =async (req, res) => {
   
    let listing = await Listing.findById(req.params.id); 
    
    
    // 2. Create the new review
    let newReview = new Review(req.body.review); 
    
    newReview.author = req.user._id;
    // 3. Push the review directly into the listing's reviews array
    listing.reviews.push(newReview); 
    
    // 4. Save both documents independently
    let result = await newReview.save();
    
    await listing.save(); 
    req.flash("success", "New review saved!");
    res.redirect(`/listings/${listing._id}`)
   
}

module.exports.destroyReview =async(req,res)=>{
    let { id, reviewId } = req.params;
    
    // 1. Remove the review reference ID from the Listing's reviews array
    await Listing.findByIdAndUpdate(id, {$pull: { reviews: reviewId } });
    
    // 2. Delete the actual review document from the reviews collection
    await Review.findByIdAndDelete(reviewId);

    // 3. Trigger success flash alert
    req.flash("success", "Review deleted successfully!");

    res.redirect(`/listings/${id}`);
}