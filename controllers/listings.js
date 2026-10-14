
const Listing = require('../models/listing')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN
const geocodingClient = mbxGeocoding({ accessToken: mapToken});


 

module.exports.index=  async (req, res) => {
  const allListing = await Listing.find({});
  

  res.render("index.ejs", { allListing });
}

module.exports.renderNewForm=(req, res) => {
  res.render("new.ejs");
}



module.exports.showListing=async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id)
    .populate({
        path: "reviews",
        populate: {
          path: "author" 
        }
      })
      .populate("owner");
    if (!listing) {
      req.flash("error", "listing doesnt exist");
      res.redirect("/listings");
    }
    
    res.render("show.ejs", { listing });
  }

  module.exports.createListing=async (req, res, next) => {

    let responce = await geocodingClient.forwardGeocode({
  query: req.body.listing.location,
  limit: 1
 })
    .send()
    
    
   

    let url =req.file.path;
    let filename= req.file.filename;
    

      let listing = new Listing(req.body.listing);
      listing.owner = req.user._id;
     listing.image = {url,filename}
     listing.geometry = responce.body.features[0].geometry;

      let savedListing = await listing.save();
      console.log(savedListing)
  
      req.flash("success", "New listing saved!");
      res.redirect("/listings");
    }

    module.exports.editListing=async (req, res) => {
      let { id } = req.params;
      const listing = await Listing.findById(id);
      if (!listing) {
        req.flash("error", "listing does not exist");
      }
let originalUrl = listing.image.url
originalUrl=originalUrl.replace("/upload", "/upload/w_250")

      res.render("edit.ejs", { listing, originalUrl});
    }

    module.exports.updateListing=async (req, res) => {
    let { id } = req.params;

    const listing = await Listing.findById(id)


    if(!listing.owner._id.equals(res.locals.currUser._id)){
      req.flash("error", "Assess Denied")
      return res.redirect("`/listing/${id}`")
    }

    await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if(typeof req.file !=="undefined"){
      let url = req.file.path;
      let filename = req.file.filename;
listing.image = {url,filename};
listing.save();


    }

    req.flash("success", "listing saved!");

    res.redirect(`/listings/${id}`);
  }

  module.exports.destroyListing=async (req, res) => {
    let { id } = req.params;
    const deleteListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "deleted!");
    res.redirect("/listings");
  }