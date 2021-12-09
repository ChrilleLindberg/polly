<template>
  <div>
    {{question}}
  </div>
  <Bars v-bind:data="data"/>
  {{data}}
  <button v-on:click="getResults"> Get Results </button>
  {{myAnswers}}
</template>

<script>
// @ is an alias to /src
import Bars from '@/components/Bars.vue';
import io from 'socket.io-client';
const socket = io();

export default {
  name: 'Result',
  components: {
    Bars
  },
  data: function () {
    return {
      question: "",
      data: {
      },
      myAnswers:[""]
    }
  },
  created: function () {
    this.pollId = this.$route.params.id

    socket.emit('joinPoll', this.pollId)
    socket.on("dataUpdate", (update) => {
      this.data = update.a;
      this.question = update.q;
    });
    socket.on("newQuestion", update => {
      this.question = update.q;
      this.data = {};
    })
  },
  methods: {
  getResults: function(){
    socket.emit('getResults', this.pollId)
    socket.on("dataGetResults", update =>{
      this.myAnswers=update
      console.log("update test, getResult",update)
    })
  }
  }
}
</script>
