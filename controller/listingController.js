const Listing = require("../models/listing")


module.exports.index = async(req,res)=>{
   
    const { category } = req.query;

    let allListings;

    if (category) {
        allListings = await Listing.find({ category });
    } else {
        allListings = await Listing.find({});
    }

    res.render("listing/index.ejs", {
        allListings,
        selectedCategory: category
    });
}

module.exports.new = (req,res)=>{
    res.render("listing/new.ejs")
}

module.exports.showListing = async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path : "reviews", populate: {path : "author"}}).populate("owner");
    if(!listing){
        req.flash("error","Listing you requested for does not exists")
        return res.redirect("/listings")
    }
    console.log(listing)
    res.render("listing/show.ejs",{listing})
}

module.exports.createListing = async (req,res) =>{
         console.log(req.body)
         console.log(req.file)
         
        let url = req.file.path
        let filename = req.file.filename
    
        let newlisting =  new Listing(req.body.listing)
        newlisting.owner = req.user._id
        newlisting.image = {url,filename}
        console.log(newlisting)
        await newlisting.save();
        req.flash("success","new listing added successfully ")
        res.redirect("/listings")
}

module.exports.editListing = async(req,res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("arror","listing you requested for does not exists ")
        res.redirect("/listings")
    }

    let newOriginalUrl = listing.image.url;
    newOriginalUrl = newOriginalUrl.replace("/upload","/upload/h_250,w_250")
    res.render("listing/edit.ejs",{listing,newOriginalUrl})

}

module.exports.updateListing = async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing})

    if(req.file){
        let url = req.file.path
        let filename = req.file.filename
        listing.image = {url,filename}
        await listing.save();
    }
    req.flash("success","listing updated successfully ")
    res.redirect(`/listings/${id}`)
}

module.exports.destroyListing = async(req,res)=>{
    let {id} =  req.params;
    let deletedListing = await Listing.findByIdAndDelete(id)
    console.log(deletedListing)
    req.flash("success","listing deleted successfully ")
    res.redirect("/listings")
}

module.exports.searchListing =  async (req, res) => {
    const { country } = req.query;

    const listings = await Listing.find({
        country: { $regex: country, $options: "i" }
    });

     if (listings.length === 0) {
        req.flash("error", "No destinations found.");
        return res.redirect("/listings");
     }

    res.render("listing/index.ejs", { allListings: listings });
}



//
// const Listing = require("../models/listing")


// module.exports.index = async(req,res)=>{
   
//     const { category } = req.query;

//     let allListings;

//     if (category) {
//         allListings = await Listing.find({ category });
//     } else {
//         allListings = await Listing.find({});
//     }

//     res.render("listing/index.ejs", {
//         allListings,
//         selectedCategory: category
//     });
// }

// module.exports.new = (req,res)=>{
//     res.render("listing/new.ejs")
// }

// module.exports.showListing = async (req,res)=>{
//     let {id} = req.params;
//     const listing = await Listing.findById(id).populate({path : "reviews", populate: {path : "author"}}).populate("owner");
//     if(!listing){
//         req.flash("error","Listing you requested for does not exists")
//         return res.redirect("/listings")
//     }
//     console.log(listing)
//     res.render("listing/show.ejs",{listing})
// }

// module.exports.createListing = async (req,res) =>{
//         const listingData = req.normalizedListing || req.body.listing;
//         if (!req.file) {
//             throw new Error("Image upload failed. Please select a valid image.");
//         }

//         const url = req.file.path;
//         const filename = req.file.filename;

//         const newlisting = new Listing(listingData);
//         newlisting.owner = req.user._id;
//         newlisting.image = {url, filename};
//         await newlisting.save();
//         req.flash("success","new listing added successfully ");
//         res.redirect("/listings");
// }

// module.exports.editListing = async(req,res) =>{
//     let {id} = req.params;
//     const listing = await Listing.findById(id);
//     if(!listing){
//         req.flash("arror","listing you requested for does not exists ")
//         res.redirect("/listings")
//     }

//     let newOriginalUrl = listing.image.url;
//     newOriginalUrl = newOriginalUrl.replace("/upload","/upload/h_250,w_250")
//     res.render("listing/edit.ejs",{listing,newOriginalUrl})

// }

// module.exports.updateListing = async (req,res)=>{
//     let {id} = req.params;
//     let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing})

//     if(req.file){
//         let url = req.file.path
//         let filename = req.file.filename
//         listing.image = {url,filename}
//         await listing.save();
//     }
//     req.flash("success","listing updated successfully ")
//     res.redirect(`/listings/${id}`)
// }

// module.exports.destroyListing = async(req,res)=>{
//     let {id} =  req.params;
//     let deletedListing = await Listing.findByIdAndDelete(id)
//     console.log(deletedListing)
//     req.flash("success","listing deleted successfully ")
//     res.redirect("/listings")
// }

// module.exports.searchListing =  async (req, res) => {
//     const { country } = req.query;

//     const listings = await Listing.find({
//         country: { $regex: country, $options: "i" }
//     });

//      if (listings.length === 0) {
//         req.flash("error", "No destinations found.");
//         return res.redirect("/listings");
//      }

//     res.render("listing/index.ejs", { allListings: listings });
// }