<script>
import message from "../js/message_pb.js"

var constant = {
    messageType: {
        MESSAGE: 1,
        ONLINE: 2,
        GROUP: 3,
    },
}
var socket

export default {
    data() {
            return {
                ipAddr: "127.0.0.1:9093",
                messages: [],
                input: "",
                group: {},
                groupMembers: [],
                member: {},
            }
        },
        methods: {
            connect: function() {
                socket = new WebSocket("ws://" + this.ipAddr + "/websocket")
                socket.binaryType = 'arraybuffer'
                socket.onopen = function() {
                    alert("Socket has been opened")
                }
                var that = this
                socket.onmessage = function(msg) {
                    var array = new Uint8Array(msg.data)
                    if (array[0] == constant.messageType.GROUP) {
                        var d = message.GroupReq.deserializeBinary(array.slice(1))
                        var groups = d.getGroupsList()
                        that.group = groups[0]
                        that.groupMembers = groups[0].getMembersList()
                        return
                    }
                    var d = message.MessageReq.deserializeBinary(array.slice(1))
                    var msg = {
                        From: d.getMessagesList()[0].getFrom(),
                        Content: d.getMessagesList()[0].getContent()
                    }
                    that.messages.push(msg)
                }
                socket.onclose = function() {
                    alert("Socket has been closed")
                }
            },
            close: function() {
                socket.close()
            },
            sendPub: function() {
                sendMessage(this.group.getId(), true, this.input)
            },
            sendPri: function() {
                sendMessage(this.member, false, this.input)
            },
            chooseMember: function(idx) {
                this.member = this.groupMembers[idx]
            }
        }
}

function sendMessage(to, isGroup, Content) {
    console.log("to" + to)
    var mList = new message.MessageReq()
    var msg = new message.MessageReq.Message()
    msg.setTo(to)
    msg.setType(message.MessageReq.Message.ContentType.TEXT)
    msg.setIsgroupmessage(isGroup)
    msg.setContent(Content)
    mList.setMessagesList([msg])
    var bytes = mList.serializeBinary()
    var rb = new Uint8Array(bytes.length + 1)
    rb[0] = 1
    for (var i = 1; i <= bytes.length; i++) {
        rb[i] = bytes[i - 1]
    }
    socket.send(rb)
}
</script>
<template>
    <div>
        <div>IP ADDRESS:
            <input type="text" v-model="ipAddr">
        </div>
        <div>
            <button @click="connect">connect</button>
            <button @click="close">close</button>
        </div>
        <div class="am-g">
            <div class="am-u-sm-8">
                <ul>
                    <li v-for="message in messages">
                        <div>{{message.From}}</div>
                        <div>{{message.Content}}</div>
                    </li>
                </ul>
            </div>
            <div class="am-u-sm-4">
                <li v-for="message in groupMembers">
                    <div @click="chooseMember($index)">{{message}}</div>
                </li>
            </div>
        </div>
        <div>
            <input type="text" v-model="input">
            <button @click="sendPub">send</button>
            <button @click="sendPri">send private</button>
        </div>
    </div>
</template>
