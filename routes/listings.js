const express = require("express")
const router = express.Router()

const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js")
const {listingSchema , reviewSchema} = require("../schema.js")
const Review = require("../models/review.js")
const Listing = require("../models/listing.js")
const {isLoggedIn, isOwner,validateSchema} = require("../middleware.js")

const listingController = require("../controller/listingController.js")
const multer  = require('multer')
const {storage} = require("../cloudConfig.js")
const upload = multer({storage})

router
    .route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn,upload.single('listing[image]'),validateSchema, wrapAsync(listingController.createListing))

// New route
router.get("/new",isLoggedIn,listingController.new)

// search request

router
.route("/search")
.get(wrapAsync(listingController.searchListing))
module.exports = router;


router
    .route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isOwner,validateSchema,upload.single('listing[image]'), wrapAsync(listingController.updateListing))
    .delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing))


// Edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.editListing))

