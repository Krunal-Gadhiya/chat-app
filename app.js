var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.use(express.static('public'));
app.set('view engine', 'ejs');

server.listen(process.env.PORT, process.env.IP, function(req, res){
  console.log("Server Started With Sockets ......");
});

app.get('/', function (req, res) {
  res.render('index');
});

var people = [];

io.on('connection', function (socket) {
  
  console.log("new Connection ID : " + socket.id);
  // io.clients( function(error, clients){
  //   console.log(clients);
  // });
  
  socket.on('hello', function(data){
    people.push({
      id : socket.id,
      name : data.personName
    });
    console.log(people);
    // console.log("Type(people.id) : "+typeof people[0].id);
    // console.log("Type(people.name) : "+typeof people[0].name);
    // console.log(data);
    // console.log("Just trying : " + Object.keys(io.sockets.sockets));
    socket.broadcast.emit('hello', data);
    io.emit('change status',people);
  });
  
  socket.on('msg', function(msgData){
    // console.log(msgData);
    socket.broadcast.emit('msg', msgData);
  });
  
  
  // socket.on('statusreq', function(data) {
  //   socket.emit(data.name, people);
  // });
  
  function findIndexOfObj(socket){
    for(var i=0;i<people.length;i++){
      if(people[i].id === socket.id){
        return i;
      }
    }
  }
  
  socket.on('disconnect', function(){
    
    people.splice(findIndexOfObj(socket),1);
    console.log("User Disconnected : "+socket.id);
    console.log(people);
    console.log("Real : " + Object.keys(io.sockets.sockets));
    console.log("Real(obj) : " + Object(io.sockets.sockets));
    // console.log("type(i.s.s): " + typeof io.sockets.sockets);
    io.emit('change status', people);
  });
});

// io.clients( function(error, clients){
//     clients.forEach(function(clnt){
//       console.log(clnt);
//       console.log(socket.id);
//     });
//   });

setInterval( function(){
  console.log("Real : " + Object.keys(io.sockets.sockets));
  console.log("people: "+people);
  // io.clients((error, clients) => {
  // if (error) throw error;
  // console.log("From Arrow: " +clients); // => [6em3d4TJP8Et9EMNAAAA, G5p55dHhGgUnLUctAAAB]
// }); 
},5000);