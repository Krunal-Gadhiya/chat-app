var submitBtn = document.getElementById('sub');
var nameTag = document.getElementById('nametag');
var sendBtn = document.getElementById('send');
var msgElement = document.getElementById('msgElem');
var inRoom = false;
var socket = io.connect();

function clearStatusList(){
  var element = document.querySelector("#statusList");
  
  while (element.hasChildNodes()) {
    element.removeChild(element.lastChild);
  }
}

function addPeopleStatus(data){
  // console.log("Type(data-name): "+typeof data.name);
  // console.log("Type(nameTag-value): "+typeof nameTag.value);
  if(data.name !== nameTag.value){
    var para = document.createElement("li");
    var node = document.createTextNode(data.name + " id: " + data.id);
    para.appendChild(node);
  
    var element = document.getElementById("statusList");
    element.appendChild(para);
  }
  else{console.log("addPeople Not working");}
}

socket.on('change status', function(people){
  console.log(people);
  clearStatusList();
  people.forEach(function(peopleData){
    addPeopleStatus(peopleData);
  });
});

function createNewElem(data, self){
  var para = document.createElement("p");
  var node;
  if(self){
    node = document.createTextNode(data.msgText);
    para.appendChild(node);
    para.style.backgroundColor = '#99ccff';
    para.style.textAlign = 'right';
  }
  else{
    node = document.createTextNode(data.msgText + ' - ' + data.sender);
    para.appendChild(node);
    para.style.backgroundColor = '#cccccc';
    para.style.textAlign = 'left';
  }
  
  var element = document.getElementById("msgBox");
  element.appendChild(para);
}

sendBtn.onclick = function(){
  if(inRoom){
    var msgData = {
      msgText : msgElement.value,
      sender : nameTag.value
    };
    socket.emit('msg', msgData);
    msgElement.value = '';
    createNewElem(msgData, true);
  }
}

socket.on('msg', function(data){
  if(inRoom){
    createNewElem(data, false);
  }
});

submitBtn.onclick = function(){
  if(!inRoom){
    var name = nameTag.value;
    console.log(name);
    socket.emit('hello', {personName:name});
    inRoom = true;
  }
}
socket.on('hello', function(data){
  if(inRoom){
    var para = document.createElement("p");
    var node = document.createTextNode(data.personName + " is now connected");
    para.appendChild(node);
  
    var element = document.getElementById("conn");
    element.appendChild(para);
    
    setTimeout(function(){
      element.removeChild(para);
    },6000);
  }
});