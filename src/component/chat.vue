<script>
import message from "../js/message_pb.js"

var constant = {
	MESSAGE:1 
}
var socket

export default {
    data() {
            return {
                ipAddr: "127.0.0.1:9093"
            }
        },
        methods: {
            connect: function() {
                socket = new WebSocket("ws://" + this.ipAddr + "/websocket")
                socket.binaryType = 'arraybuffer'
                socket.onopen = function() {
                    alert("Socket has been opened")
                }
                socket.onmessage = function(msg) {
                    var array  = new Uint8Array(msg.data)
                    console.log(array)
                    var d = message.MessageReq.deserializeBinary(array.slice(1))
                    console.log(d)

                }
                socket.onclose = function() {
                    alert("Socket has been closed")
                }
            },
            close: function() {
                socket.close()
            },
            sendPub: function() {
                var mList = new message.MessageReq()
                var msg = new message.MessageReq.Message()
                msg.setTo(1)
                msg.setType(message.MessageReq.Message.ContentType.TEXT)
                msg.setIsgroupmessage(true)
                msg.setContent("wowowoowhhhhh")
                mList.setMessagesList([msg])
                var bytes = mList.serializeBinary()
                var rb = new Uint8Array(bytes.length+1)
                rb[0] = 1
                for (var i = 1; i <= bytes.length; i++) {
                	rb[i] = bytes[i-1]
                }
                socket.send(rb)
            },
            sendPri: function() {

            }
        }

}
</script>
<template>
    <div>
        <div>IP ADDRESS:
            <input type="text" v-model="ipAddr">
        </div>
        <div>
            <button @click="connect">connect</button>
            <button @click="sendPub">send public</button>
            <button @click="sendPri">send private</button>
            <button @click="close">close</button>
        </div>
    </div>
</template>
