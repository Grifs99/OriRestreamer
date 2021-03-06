var express = require('express');
var app = express();
var fs = require('fs');
var server = require('http').createServer(app);

var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

// app.use(express.static(__dirname + '/node_modules'));
var distDir = __dirname + "/dist/";
app.use(express.static(distDir));
app.get('/', function(req, res,next) {
    //res.sendFile(__dirname + '/index.html');
});

function writeToFile(matches){
    fs.writeFile('matches.json', JSON.stringify(matches), function(err) {
        if(err) return console.log(err);
    });
}

io.on('connection', function(client) {
    client.on('data', function(data){
        io.emit('data', data);
    });

    client.on('tracker', function(data){
        io.emit('tracker', data);
    });

    client.on('timer', function(start, data){
        io.emit('timer', start, data);
    });

    client.on('timer1', function(finished, data){
        io.emit('timer1', finished, data);
    });

    client.on('timer2', function(finished, data){
        io.emit('timer2', finished, data);
    });

    client.on('timer-set', function(ticks, data){
        io.emit('timer-set', ticks, data);
    });

    client.on('p1Stats', function(data, text){
        io.emit('p1Stats', data, text);
    });

    client.on('p2Stats', function(data, text){
        io.emit('p2Stats', data, text);
    });

    client.on('freeTextStats', function(data, text){
        io.emit('freeTextStats', data, text);
    });

    client.on('swissPlayerSelected', function(data, playerId){
        io.emit('swissPlayerSelected', data, playerId);
    });

    client.on('swissTeamSelected', function(data, teamId){
        io.emit('swissTeamSelected', data, teamId);
    });

    client.on('resetSwiss', function(data){
        io.emit('resetSwiss', data);
    });

    client.on('undoSwissSingles', function(data){
        io.emit('undoSwissSingles', data);
    });

    client.on('undoSwissDoubles', function(data){
        io.emit('undoSwissDoubles', data);
    });
});

server.listen(port);
console.log('Server listening on port ' + port)
