var socket;
 
$("#connect").click(function(event){
    socket = new WebSocket("ws://127.0.0.1:9091/websocket");
 
    socket.onopen = function(){
        alert("Socket has been opened");
        socket.send(window.token)
    }
 
    socket.onmessage = function(msg){
        alert(msg.data);
    }
 
    socket.onclose = function() {
        alert("Socket has been closed");
    }
});
 
$("#send").click(function(event){
    socket.send("sending data to server!");
});
 
$("#close").click(function(event){
    socket.close();
})
