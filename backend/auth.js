require("dotenv").config();
const express = require("express");
const passport = require("passport");
const session = require("express-session");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");
const { Strategy } = require("passport-google-oauth20");
const User = require("./models/User");

const authRouter = express.Router();
const API_BASE_URL = process.env.NODE_ENV === 'development'
    ? "http://localhost:5000"
    : "http://51.21.86.220:5000";
console.log("auth.js", API_BASE_URL);
// 🔹 Session setup
if (process.env.NODE_ENV === 'production') {
    authRouter.use(session({
        secret: "yourSecretKey",
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: process.env.MONGO_URI, // Use your MongoDB connection string
            collectionName: "sessions",
        }),
        cookie: {
            secure: process.env.NODE_ENV === "production", // Only use secure cookies in production
            httpOnly: true,
            sameSite: "None", // Allow cross-origin cookies
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        }
    }));
} else {
    authRouter.use(session({
        secret: "yourSecretKey",
        resave: false,
        saveUninitialized: false,
    }));
}


authRouter.use(passport.initialize());
authRouter.use(passport.session());


// 🔹 Google OAuth Strategy
passport.use(new Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${API_BASE_URL}/auth/google/callback`
}, async (accessToken, refreshToken, profile, done) => {
    let user = await User.findOne({ googleId: profile.id });

    if (!user) {
        user = new User({

            _id: new mongoose.Types.ObjectId(),
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value
        });
        await user.save();
        console.log("New user created:", user);
    } else {
        console.log("Existing user found:", user);
    }

    return done(null, user);
}));

passport.serializeUser((user, done) => {
    console.log("Serializing user:", user);
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    console.log("Deserialized user:", user);
    done(null, user);
});

// 🔹 Google Auth Routes
authRouter.get("/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] }),
    (req, res) => {
        console.log("Redirecting to Google for authentication");
    }
);

authRouter.get("/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/" }),
    (req, res) => {
        console.log("User authenticated successfully");
        const user = req.user;
        if (process.env.NODE_ENV === 'development') {
            res.redirect("http://localhost:3000/");
        } else {
            res.redirect("https://call-journal.vercel.app/");
        }
    }
);

// 🔹 Logout Route
const CLIENT_URL = process.env.NODE_ENV === 'development'
    ? "http://localhost:3000"
    : "https://call-journal.vercel.app";
authRouter.get("/auth/logout", (req, res) => {
    req.logout(() => {
        res.redirect(CLIENT_URL);
    });
});

// 🔹 Get Logged-in User
authRouter.get("/auth/user", (req, res) => {
    console.log("User request received:", req.user);
    if (req.isAuthenticated()) {
        // console.log("user data from authentication", res.json(req.user));
        return res.json(req.user); // Send the authenticated user

    }
    res.status(401).json({ message: "User not authenticated" });

});

module.exports = authRouter; 