const express = require("express");
const auth = require("./auth");
const uuidv4 = require("uuid/v4");
const live = require("./live");
const withSourceData = sourceData => {
  const app = express();

  var responseSSE = { write: () => {} };
  app.get("/", auth.authorizeMiddleware(sourceData), (req, res) => {
    console.log(sourceData);
    if (sourceData[req.user.steamid].connectionToken) {
      return res.status(200).send(uuid);
    }
    uuid = uuidv4();
    sourceData[req.user.steamid].connectionToken = uuid;
    console.log(uuid);
    app.get(`/${uuid}`, (req, res) => {
      console.log("sd");
      res.writeHead(200, {
        Connection: "keep-alive",
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache"
      });
      responseSSE = res;

      let index = 0;

      setInterval(() => {
        res.write(`data: ${JSON.stringify(live[index])}`);
        index = index + 1;
        if (index === live.length) {
          index = 0;
        }
        res.write("\n\n");
      }, 5000);
    });
    res.status(200).send(uuid);
  });

  app.post("/livedata", (req, res) => {
    var body = "";

    req.on("data", function(data) {
      body += data;
    });
    req.on("end", function() {
      responseSSE.write(`data:${JSON.stringify(body)}`);
      responseSSE.write("\n\n");
      res.end("");
    });
  });
  return app;
};

module.exports = { app: withSourceData };
