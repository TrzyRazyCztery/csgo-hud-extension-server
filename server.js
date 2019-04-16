const express = require("express");
const app = express();
const port = 3037;
const dataSource = {
  "76561197993506684" : 
    {steamid: "76561197993506684", personaname: "nerf xyp9x", avatar: "https://steamcdn-a.akamaihd.net/steamcommunity/pub…s/44/448818a1b37b199c0579a667e495ed5c40e675c9.jpg"}
  , token: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InN0ZWFtSWQiOiI3NjU2MTE5Nzk5MzUwNjY4NCJ9LCJpYXQiOjE1NTQ5MTI3OTksImV4cCI6MTU1NTUxNzU5OX0.OZqEhKuRZbsC_baSP1F07g4CtMSJQx5V6NkEolByEufSbo42mrRp-G3tSj7SyQKkhBwu8BdCUc3o3EjDcBCPtA"
};
const liveData = require("./liveData");
const auth = require("./auth");

app.all("/*", function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

app.use("/livedata", liveData.app(dataSource))

app.use((req, res, next) => {
  next();
});


//app.use("/livedata", liveData).app;
app.use("/auth", auth.app(dataSource));

app.listen(port, () => console.log(`app listen on ${port}`));
