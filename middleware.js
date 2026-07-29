const Listing = require("./models/listing");
const Review = require("./models/review");
const { reviewSchema, listingSchema } = require("./schema");
const ExpressError = require("./utils/ExpressError");

const normalizeListingBody = (body = {}) => {
    if (!body) return {};

    if (body.listing && typeof body.listing === "object" && !Array.isArray(body.listing)) {
        return body.listing;
    }

    const normalized = {};

    Object.entries(body).forEach(([key, value]) => {
        if (key === "listing" && value && typeof value === "object") {
            Object.assign(normalized, value);
        } else if (key.startsWith("listing[")) {
            const match = key.match(/^listing\[(.+)\]$/);
            if (match) normalized[match[1]] = value;
        } else {
            normalized[key] = value;
        }
    });

    return normalized;
};

module.exports.normalizeListingBody = normalizeListingBody;

module.exports.isLoggedIn = (req,res,next)=>{
    
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","User must be logged in ")
        return res.redirect("/login")
    }
    next()
}

module.exports.saveRedirected = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl
    }
    next()
}

module.exports.isOwner = async (req,res,next) =>{
    let {id} = req.params;
    let listing = await  Listing.findById(id)
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","do not have permission to access this page")
        return res.redirect(`/listings/${id}`)
    }
    next()
}

module.exports.validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body)
    if(error){
        let errMsg = error.details.map((el) =>el.message).join(",")
        throw new ExpressError(402,errMsg)
    }else{
        next()
    }
}

module.exports.validateSchema = (req,res,next)=>{
    const listingData = normalizeListingBody(req.body);
    let {error} = listingSchema.validate({ listing: listingData })
    if(error){
        let errMsg = error.details.map((el) =>el.message).join(",")
        throw new ExpressError(402,errMsg)
    }else{
        req.normalizedListing = listingData;
        next()
    }
}

module.exports.isReviewAuthor = async (req,res,next) =>{
    let {id,reviewId} = req.params;
    let review = await  Review.findById(reviewId)
    if(!review.author._id.equals(res.locals.currUser._id)){
        req.flash("error","do not have permission to access this page")
        return res.redirect(`/listings/${id}`)
    }
    next()
}
