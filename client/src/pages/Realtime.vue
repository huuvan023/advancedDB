<template>
  <div style="height: 90vh" class="q-ma-md full-height row col-12">
   <div style="height: 90vh" class="relative-position col-8 q-mx-auto shadow-4 q-pa-md">
     <div ref="chatRef" style="height: 80vh" class="overflow-auto q-pa-md">
       <q-chat-message
         v-for="item in data"
         :name="item.sent ? 'Me' : 'Peer'"
         :text="[item.message]"
         :sent="item.sent"
         :stamp="`${new Date(item.time).getDate()}/${new Date(item.time).getMonth()} ${new Date(item.time).getHours()}:${new Date(item.time).getMinutes()}`"
       />
     </div>
     <div class="absolute-bottom col-12 bg-white row">
       <div class="col-11">
         <q-input v-model="message" class="q-ma-sm" placeholder="Message" outlined/>
       </div>
       <div class="col-1 flex justify-center items-center">
         <q-btn @click="sendMessage" round color="secondary" icon="send" />
       </div>
     </div>
   </div>
  </div>
</template>

<script>
import {myFirebase} from "boot/firebase";
const jwt = require('jsonwebtoken')

export default {
  name: "Realtime",
  data:() => ({
    message: '',
    id: localStorage.getItem('userID'),
    data: []
  }),
  methods: {
    test() {
      var token = jwt.decode(localStorage.getItem('firebaseToken'))
      console.log(parseInt(token.email))
    },
    async loadSnapShot() {

    },
    async sendMessage() {
      this.$q.loading.show()
      let dataArray = [];
      await myFirebase.database().ref(`/messages`)
      .push({
        id: this.id,
        message: this.message,
        time: (new Date()).toString()
      })
      .then(() => {
        this.message = ''
        var messageDisplay = this.$refs.chatRef
        messageDisplay.scrollTop = messageDisplay.scrollHeight;
        return
      })
      .catch(err => {
        console.log(err)
        this.$q.loading.hide()
      })
      this.$q.loading.hide()
    }
  },
  async mounted() {
    this.$q.loading.show()
    const itemsRef = myFirebase.database().ref("messages");
    itemsRef.on("value", async snapShots => {
      let dataArray = [];
      snapShots.forEach((childSnapshot) => {
        dataArray.push(childSnapshot.val())
      });
      this.data = await dataArray.map(item => {
        if (item.id === this.id) {
          return  {...item, sent: true}
        }
        else {
          return {...item, sent: false}
        }
        var messageDisplay = this.$refs.chatRef
        messageDisplay.scrollTop = messageDisplay.scrollHeight;
      })
    });

    this.$q.loading.hide()
  }
}
</script>

<style scoped>

</style>
