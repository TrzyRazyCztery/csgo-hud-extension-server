const fs = require('fs')
const express = require('express')
const bodyParser = require('body-parser')
const app = express();
const debug = require('debug')('http')
const port = 3030;
//app.use(bodyParser.json());

var responseSSE = {write: ()=> {}};
app.get('/', (req, res) => res.send('Hello World'))
app.get('/events', (req, res) =>  {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    console.log(req.headers)
    res.writeHead(200,{
        Connection:"keep-alive",
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache"})
    responseSSE = res;
})



app.post('/livedata', (req, res) => {

    var body = '';
    
    req.on('data', function (data) {
        body += data
    });
    req.on('end', function () {
        responseSSE.write(`data:${JSON.stringify(body)}`);
        responseSSE.write("\n\n")
        res.end( '' );
    });
    


})



// app.post('/livedata', (req, res) => {
//     res.writeHead(200, {'Content-Type': 'application/json'});


//     console.log(req.body.player.weapons.weapon_2.ammo_clip)
//     responseSSE.write(`data: ${req.body}`);
//     responseSSE.write("\n\n")


// })
app.listen(port, () => console.log(`app listen on ${port}`))

