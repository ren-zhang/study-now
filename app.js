const express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    StudySpot  = require("./models/studySpot"),
    Comment     = require("./models/comment"),
    User        = require("./models/user"),
    seedDB      = require("./seeds");

// Requiring routes
const commentRoutes = require("./routes/comments"),
      spotRoutes = require("./routes/spots"),
      indexRoutes = require("./routes/index");

mongoose.connect("mongodb://localhost/study-now", {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
// seedDB();

// PASSPORT CONFIG
app.use(require("express-session")({
    secret: "boundless",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   next();
});

app.use(indexRoutes);
app.use("/spots/:id/comments", commentRoutes);
app.use("/spots", spotRoutes);

app.listen(3000, function(){
   console.log("The StudyNow Server Has Started!");
});
