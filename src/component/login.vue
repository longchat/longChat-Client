<script>
import superReq from "superagent"

export default {
    data() {
            return {
                username: "",
                password: ""
            }
        },
        methods: {
            login: function() {
            	var router = this.$router
                superReq.post('/login')
                    .send({
                        UserName: this.username,
                        PassWord: this.password
                    })
                    .set('ContentType', 'application/json;')
                    .end(function(err, res) {
                        if (res.body.StatusCode == 0) {
                        	window.UserId = res.body.Data.User.Id
                        	router.go({name:'chat'})
                        }else{
                        	alert("您输入的用户民或密码有误！")
                        }
                    });
            }
        }
}
</script>

<template>
    <div>
        UserName:
        <input type="text" name="username" v-model="username"> Password:
        <input type="password" name="password" v-model="password">
        <button @click="login">login</button>
    </div>
</template>
