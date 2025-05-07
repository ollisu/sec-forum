require('dotenv').config();
var express = require("express");
var router = express.Router();
var User = require("../models/User");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { create } = require('../models/ForumTopic');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

const ACCESS_TOKEN_SECRET = process.env.ACCESS_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_SECRET;
const MAX_SESSION_CNT = process.env.MAX_SESSION_CNT;

const sessionLimitHit = (user) => {
  return user.refreshTokens.length >= MAX_SESSION_CNT; // Limit to 5 refresh tokens per user.
}
  
const hashJti = (jti) => {
  return crypto.createHash('sha256').update(jti).digest('hex'); 
}

const createAccessToken = (user) => jwt.sign({ id: user.id, username: user.username, role: user.type }, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
const createRefreshToken = (user, jti) => jwt.sign({ id: user.id, username: user.username, role: user.type  }, REFRESH_TOKEN_SECRET, { expiresIn: '7d', jwtid: jti });


// ROUTE 1:
router.post("/signup", async (req, res) => {
  try {
    let user = await User.create({
      username: req.body.username,
      email: req.body.email,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      password: req.body.password,
    });
    res.json({ user });
    
  } catch (err) {
    if(err.code === 11000)
      {return res.status(400).json({ error: "Username or email already exists" });
  } 
    res.status(500).json({ error: "An error occurred while creating the user" });

  }

});

// ROUTE 2:
router.post("/login", async (req, res) => {
  try {
    let user = await User.findOne({ username: req.body.username});
    if(!user){
      return res.status(400).json({error: 'Unable to log in with given username!'})
    }
    const correctPassword = await bcrypt.compare(req.body.password + process.env.PEPPER, user.password);

    if(!correctPassword) return res.status(400).json({error: 'Invalid password!'})

    // Generate a unique identifier (jti) for the refresh token.
    const jti = uuidv4(); // Generate a unique identifier (UUID v4)

    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user, jti);

    // Check if the user has reached the maximum number of refresh tokens.
    if(sessionLimitHit(user)){
      user.refreshTokens.shift(); // Remove the first element (oldest token).
    }

    // Hash the jti and store it in the database.
    const hashedJti = hashJti(jti);

    // Store the refresh token in the database.
    user.refreshTokens.push(hashedJti);
    await user.save();
    
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path:"/api/auth/refresh_token",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days.
    }).json({accessToken});

    
  } catch (err) {

    res.status(500).json({ error: "An error occurred while login in the user" });

  }

});

router.post("/refresh_token", async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if(!refreshToken) return res.sendStatus(401);

  // Check if the refresh token is in the database.
  try {
    const decoded_jwt = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded_jwt.id);
    
    // Check if the user exists and if the refresh token is in the user's list of refresh tokens.
    // If not, send a 403 Forbidden status.
    if(!user) return res.status(403).json({error: 'User not found!'});

    const hashedJti = hashJti(decoded_jwt.jti);
    if(!user.refreshTokens.includes(hashedJti)){
      // Token reused or invalidated, so remove it from the user's list of refresh tokens.
      // This is a security measure to prevent token reuse attacks.
      user.refreshTokens = [];
      await user.save();
      return res.status(403).json({error: 'Invalid refresh token! Possibly reused!'});
    } 
    // If the old refresh token is valid, create a refresh token.
    // Refresh tokens are being rotated, so the old refresh token is invalidated and a new one is created.
    const newJti = uuidv4(); // Generate a new unique identifier (UUID v4) and hash it.
    const newFreshToken = createRefreshToken(user, newJti);
    const newHashedJti = hashJti(newJti); // Hash the new jti.
    user.refreshTokens = user.refreshTokens.filter(token => token !== decoded_jwt.jti); // Remove the old refresh token from the user's list of refresh tokens.
    // Check if the user has reached the maximum number of refresh tokens.
    if(sessionLimitHit(user)){
      user.refreshTokens.shift(); // Remove the first element (oldest token).
    }
    user.refreshTokens.push(newHashedJti); // Add the new refresh token to the user's list of refresh tokens.
    await user.save();

    // Create a new access token.
    const newAccessToken = createAccessToken(user);

    res.cookie("refreshToken", newFreshToken, {
      httpOnly: true, // Set the cookie to HTTP-only to prevent client-side access (document.cookie).
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path:"/api/auth/refresh_token",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days.
    }).json({accessToken: newAccessToken});
    
  } catch (err) {
    return res.sendStatus(403);
  }
})

router.post("/logout", async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if(!refreshToken) return res.sendStatus(204); // No content.

  try {
    const decoded_jwt = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded_jwt.id);

    if(user){
      const hashedJti = hashJti(decoded.jti);
      user.refreshTokens = user.refreshTokens.filter(jti => jti !== hashedJti); // Remove the refresh token jti from the user's list of refresh tokens.
      await user.save();
    }
  }catch (err) {
    console.error(err); 
  }

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path:"/api/auth/refresh_token",
  }).sendStatus(200); // No content.
});

module.exports = router;