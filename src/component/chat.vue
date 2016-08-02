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


var to
var isGroup
var content
var ipAddrs
window.SendMsg = function() {
    if (to == undefined) {
        return
    }
    console.log("test send!")
    sendMessage(to, isGroup, content)
}
window.SendMsg()
window.OpenSocket = function() {
    if (socket == undefined) {
        return
    }
    socket = new WebSocket("ws://" + ipAddrs + "/websocket")
    socket.binaryType = 'arraybuffer'
    socket.onopen = function() {
        console.log("open")
        socket.close()
    }
    socket.onclose = function() {
        setTimeout('OpenSocket()', 1000)
        console.log("closed")
    }
}
window.OpenSocket()
export default {
    data() {
            return {
                ipAddr: "127.0.0.1:9093",
                messages: [],
                input: "",
                group: {},
                groupMembers: [],
                member: {},
                circleSend: false,
                circleLogin: false,
            }
        },
        methods: {
            connect: function(circleSend, circleLogin) {
                this.circleSend = circleSend
                this.circleLogin = circleLogin
                ipAddrs = this.ipAddr
                socket = new WebSocket("ws://" + this.ipAddr + "/websocket")
                socket.binaryType = 'arraybuffer'
                socket.onopen = function() {
                    console.log("open")
                    if (circleLogin) {
                        socket.close()
                    }
                }
                var that = this
                socket.onmessage = function(msg) {
                    var array = new Uint8Array(msg.data)
                    console.log(array)
                    if (array[0] == constant.messageType.GROUP) {
                        var d = message.GroupReq.deserializeBinary(array.slice(1))
                        var groups = d.getGroupsList()
                        that.group = groups[0]
                        that.groupMembers = groups[0].getMembersList()
                        return
                    } else if (array[0] == constant.messageType.MESSAGE) {
                        var d = message.MessageReq.deserializeBinary(array.slice(1))
                        var msgPb = d.getMessagesList()[0]
                        var msg = {
                            From: msgPb.getFrom(),
                            Content: msgPb.getContent()
                        }
                        that.messages.push(msg)
                        if (msgPb.getIsgroupmessage()) {
                            to = msgPb.getTo()
                            isGroup = true
                        } else {
                            isGroup = false
                            to = msgPb.getFrom()
                        }
                        content = msg.Content
                        if (circleSend) {
                            setTimeout('SendMsg()', 1000)
                        }
                    }

                }
                socket.onclose = function() {
                    console.log("closed")
                    if (that.circleLogin) {
                        setTimeout('OpenSocket()', 1000)
                    }
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
            <button class="chat_btn" @click="connect(false,false)">connect</button>
            <button class="chat_btn" @click="connect(true,false)">connect&testSend</button>
            <button class="chat_btn" @click="connect(false,true)">connect&testOpenClose</button>
            <button class="chat_btn" @click="close">close</button>
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
<style>
.chat_btn {
    margin-left: 1rem;
}
</style>
