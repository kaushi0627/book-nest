const User = require("../models/user")

module.exports.renderSignupFrom = (req,res)=>{
    res.render("users/signup.ejs")
}

module.exports.signup = async (req,res)=>{
    try{
        let {username,email,password} = req.body;
        const newUser = new User({username,email})
        let registeredUser =await User.register(newUser,password)

        req.login(registeredUser,(err)=>{
            if(err){
                next(err)
            }else{
                console.log(registeredUser)
                req.flash("success","welcome to wanderlust")
                res.redirect("/listings")
            }
        })
        
    }catch(e){
        req.flash("error",e.message)
        res.redirect("/signup")
    }
}

module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login.ejs")
}

module.exports.login = async (req,res)=>{
    req.flash("success","You are logged in")
    if(res.locals.redirectUrl){
        return res.redirect(res.locals.redirectUrl)
    }
    res.redirect("/listings")
}

module.exports.logout = (req,res,next) =>{
    req.logout((err) =>{
        if(err){
            return next(err)
        }
        req.flash("success" , "You have been logged out")
        res.redirect("/listings")
    })
}