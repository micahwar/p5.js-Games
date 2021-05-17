var express = require('express');
var app = express();
var server = app.listen(process.env.PORT || 5000);
var socket = require('socket.io');
var fs = require('fs');
var io = socket(server);
var NumOfConnectedClients = 0;
var Clients = [];
var points = [];
var Host;

app.use(express.static('PUBLIC_HTML'));




io.sockets.on('connection', newConnection);

function newConnection(socket) {
    console.log('New Connection: ' + socket.id);
    NumOfConnectedClients ++;
    Clients.push(socket);
    var index = Clients.indexOf(socket);
    if (NumOfConnectedClients == 1) {
      // give the client host controls if they're the first in the clients array
        Clients[0].emit('host');
        Host = socket.id;
      console.log('host');
    }

    // establish network events
    console.log('Number Of Connected Clients: ' + NumOfConnectedClients);
    socket.on('mouse', mouseMessage);
    socket.on('heart', heartMessage);
    socket.on('fill', fillMessage);
    socket.on('startup', loadPixels);
    socket.on('requestClients', returnClientData);
    socket.on('disconnect', disconnect);
    socket.on('reset', doReset);
    console.log('Sockets turned on');

    function doReset() {
      socket.broadcast.emit('resetOthers');
      points = [];
    }

    function returnClientData() {
      var data = {
        num: NumOfConnectedClients,
      };
      socket.emit('returnClientData', data);
    }

    function loadPixels() {
      for (i = 0; i < points.length; i ++) {
        socket.emit('mouse', points[i]);
      }
      console.log('Loaded Pixels');
    }

    function heartMessage(data) {
      console.log('Heart at: ' + data.x + ',' + data.y)
      socket.broadcast.emit('heart', data);
    }

    function fillMessage() {
      socket.broadcast.emit('fill', data);
    }

    function mouseMessage(data) {
      points.push(data);
      if (data) {
        if (data.x && data.y) {
          socket.broadcast.emit('mouse', data);
        }
      }
    }
    
    function disconnect() {
      console.log('Client Disconnected: ' + socket.id)
      NumOfConnectedClients --;

      var index = Clients.indexOf(socket);
      Clients.splice(index, 1);
      if (socket.id === Host) {
        Clients[0].emit('host');
        Host = Clients[0].id;
        console.log('Host Disconnected');
      }
      if (NumOfConnectedClients == 0) {
        points = [];
      }
      console.log('Number Of Connected Clients: ' + NumOfConnectedClients);
    }

}
