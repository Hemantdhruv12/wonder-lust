if(process.env.NODE_ENV !="production"){
require('dotenv').config()
}

const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = 3000;
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/expressError.js");
const listingsRoute = require("./routes/listing.js");
const reviewsRoute = require("./routes/review.js");
const userRoute = require("./routes/user.js");
const path = require("path");
// const Mongo_Url = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.MONGODB_URL;
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require('passport-local')
const User = require('./models/user.js');
const wrapAsync = require("./utils/wrapAsync.js");
const { MongoStore } = require('connect-mongo');

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

  const store = MongoStore.create({
    
    mongoUrl:dbUrl,
    crypto:{
      secret:process.env.SECRET
    },
    touchAfter: 24*3600,
    
  })

  store.on("error", (err)=>{
    console.log("mongostore error" , err)
  })

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

async function main() {
  await mongoose.connect(dbUrl);
}

app.set("views", path.join(__dirname, "views"));

app.engine("ejs", ejsMate);
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));
app.use(session(sessionOptions));

app.use(flash());




// app.get("/demouser", wrapAsync( async(req,res)=>{
//   let fakeUser= new User({
//     email:"coding@gmail.com",
//     username:"coding"
//   });
//   let registeredUser = await User.register(fakeUser, "hello");
//   res.send("/demouser");
// console.log(registeredUser)
// }))








// 1. Initialize passport and session middleware (Ensure these are already there)
app.use(passport.initialize());
app.use(passport.session());

// 2. Configure the local strategy
passport.use(new LocalStrategy(User.authenticate()));

// 3. ADD THESE TWO LINES TO FIX THE SERIALIZATION ERROR:
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

app.use("/listings", listingsRoute);
app.use("/listings/:id/reviews", reviewsRoute);
app.use("/", userRoute)




app.use((err, req, res, next) => {
  let { statusCode = 500, message = "something went wrong" } = err;
  res.status(statusCode).render("error.ejs", { message });
});

app.listen(port, () => {
  console.log("app is listning ");
});
