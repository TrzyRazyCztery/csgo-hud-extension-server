const express = require("express");
const auth =  require("./auth")
const uuidv4 = require('uuid/v4');
const withSourceData = sourceData =>{
    const app = express();
    app.get('/establish',auth.authorizeMiddleware(sourceData), (req, res) => {
      console.log(sourceData)
      if(sourceData[req.user.steamid].connectionToken){
        return res.status(200).send(uuid) 
      }
      uuid = uuidv4();
      sourceData[req.user.steamid].connectionToken = uuid;
      console.log('user', req.user.steamid,uuid)
      app.get(`/${uuid}`, (req, res) => {
        res.writeHead(200, {
          Connection: "keep-alive",
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache"
        });
        sourceData['76561197993506684'].eventSource = res;
        setInterval(() => {
          res.write(
            'data: {"provider":{"name":"Counter-Strike: Global Offensive","appid":730,"version":13687,"steamid":"76561197993506684","timestamp":1554324628},"map":{"mode":"competitive","name":"de_mirage","phase":"live","round":16,"team_ct":{"score":8,"consecutive_round_losses":2,"timeouts_remaining":1,"matches_won_this_series":0},"team_t":{"score":8,"consecutive_round_losses":0,"timeouts_remaining":1,"matches_won_this_series":0},"num_matches_to_win_series":0,"current_spectators":0,"souvenirs_total":0},"round":{"phase":"live"},"player":{"steamid":"76561197993506684","name":"nerf xyp9x","observer_slot":6,"team":"CT","activity":"playing","state":{"health":100,"armor":0,"helmet":false,"flashed":0,"smoked":0,"burning":0,"money":450,"round_kills":0,"round_killhs":0,"equip_value":2450},"weapons":{"weapon_0":{"name":"weapon_knife","paintkit":"default","type":"Knife","state":"holstered"},"weapon_1":{"name":"weapon_usp_silencer","paintkit":"cu_kaiman","type":"Pistol","ammo_clip":12,"ammo_clip_max":12,"ammo_reserve":24,"state":"holstered"},"weapon_2":{"name":"weapon_famas","paintkit":"cu_famas_lenta","type":"Rifle","ammo_clip":25,"ammo_clip_max":25,"ammo_reserve":90,"state":"active"}},"match_stats":{"kills":8,"assists":0,"deaths":0,"mvps":1,"score":28}},"previously":{"player":{"state":{"money":2700,"equip_value":200},"weapons":{"weapon_1":{"state":"active"}}}},"added":{"player":{"weapons":{"weapon_2":true}}},"auth":{"token":"CCWJu64ZV3JHDT8hZc"}}'
          );
          res.write("\n\n");
        }, 5000);
      });
      res.status(200).send(uuid)     
    })


    

    app.post("/", (req, res) => {
    var body = "";
    req.on("data", function(data) {
      body += data;
    });
    req.on("end", function() {
      if(sourceData['76561197993506684'].eventSource){
        sourceData['76561197993506684'].eventSource.write(`data:${JSON.stringify(body)}`);
        sourceData['76561197993506684'].eventSource.write("\n\n");
      res.end("");
      }
    });
  });
  return app;
}

module.exports = { app: withSourceData };
