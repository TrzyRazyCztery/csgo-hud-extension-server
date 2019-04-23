const express = require("express");
const passport = require("passport");
const SteamStrategy = require("passport-steam").Strategy;
const path = require("path");
const lodash = require("lodash");
const keys = require("./.keys");
const jwt = require("jsonwebtoken");

const createJWT = steamId =>
  jwt.sign(
    {
      user: {
        steamId: steamId
      }
    },
    keys.private,
    {
      algorithm: "RS256",
      expiresIn: "7d"
    }
  );

const withDataSource = dataSource => {
  const app = express();

  passport.serializeUser((user, done) => {
    done(null, user._json);
  });

  passport.deserializeUser((obj, done) => {
    done(null, obj);
  });

  passport.use(
    new SteamStrategy(
      {
        returnURL: "http://localhost:3037/auth/steam",
        realm: "http://localhost:3037/",
        apiKey: "958A147348803DFE39EA678D6089376D"
      },
      (identifier, profile, done) => {
        return done(null, profile);
      }
    )
  );

  app.use(passport.initialize());

  app.get(
    /^\/steam(\/return)?$/,
    passport.authenticate("steam", {
      failureRedirect: "http://localhost:3000/login_failed"
    }),
    (req, res) => {
      if (req.user) {
        console.log("get steam/return", req.user);
        const { steamid, personaname, avatarmedium } = req.user._json;
        if (steamid) {
          dataSource[steamid] = {
            ...dataSource[steamid],
            steamid,
            personaname,
            avatar: avatarmedium
          };
          res.redirect(
            "http://localhost:3000/login_success?" +
              `token=${createJWT(steamid)}`
          );
        }
      }
    }
  );

  app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
  });

  app.get("/user", authorizeMiddleware(dataSource), (req, res) => {
    console.log("verified user", req.user);
    res.status(200).json(req.user);
  });

  return app;
};

const authorizeMiddleware = dataSource => (req, res, next) => {
  if (
    !req.headers.authorization ||
    req.headers.authorization.indexOf("Bearer ") === -1
  ) {
    return res.status(401).send("Missing Authorization Header");
  }
  const token = req.headers.authorization.split(" ")[1];
  const authorizedUser = jwt.verify(token, keys.public, {
    algorithms: ["RS256"]
  });
  console.log("verified token: ", JSON.stringify(authorizedUser));
  if (
    authorizedUser &&
    authorizedUser.user &&
    dataSource[authorizedUser.user.steamId]
  ) {
    req.user = dataSource[authorizedUser.user.steamId];
  } else {
    return res.status(401).send("Unauthorized");
  }

  next();
};

module.exports = { authorizeMiddleware, app: withDataSource };
