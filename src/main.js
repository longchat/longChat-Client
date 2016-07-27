import message from  "./message_pb.js";

var mList= new message.MessageReq()
var msg = new message.MessageReq.Message()
msg.setFrom(123)
msg.setTo(44444)
msg.setType(message.MessageReq.Message.ContentType.EMOTION)
msg.setIsgroupmessage(true)
mList.setMessagesList([msg])
var bytes = mList.serializeBinary()
console.log(mList)
var de = message.MessageReq.deserializeBinary(bytes)
console.log(de.getMessagesList()[0].getType())