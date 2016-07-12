var socket;
 
$("#connect").click(function(event){
    socket = new WebSocket("ws://127.0.0.1:9091/websocket");
 
    socket.onopen = function(){
        alert("Socket has been opened");
    }
 
    socket.onmessage = function(msg){
        var old = $("#content").val()
        var d = eval("("+msg.data+")");
        $("#content").val(old +"\r\n"+ d.From+" :"+d.Content)
    }
 
    socket.onclose = function() {
        alert("Socket has been closed");
    }
});
 
$("#send").click(function(event){
    var data = {Id:"0",From:window.UserId,GroupId:"1",Content:$("#input").val(),Type:"msg"}
    socket.send("2"+JSON.stringify(data));
});
 
$("#close").click(function(event){
    socket.close();
})
