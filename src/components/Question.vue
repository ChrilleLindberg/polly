<template>

  <div class="container">
<h2 style="display:flex;margin-right:20%;text-decoration: underline;" >{{uiLabels.userWord}}</h2><h2 style="display:flex; margin-right:10%;text-decoration: underline;">{{uiLabels.translation }}</h2>
  </div>
  <div v-for="(q, i) in question.q" :key="q">
   <div class="container">
   <div id="answer"><span style="padding-top:0.5em;">  {{ q }}</span></div>
    <div id="picture"><img src="https://icon-library.com/images/equal-icon/equal-icon-7.jpg"  >
    </div>
    <input id="input" style="display: flex" type="string" class="answers" v-model="myAnswers[i]" placeholder={{uiLabels.answer}} autocomplete="off">
  </div>
  </div>





<!--<button v-for="a in question.a" v-on:click="answer(a)" v-bind:key="a">
  {{ a }}
</button>-->
</template>
<script>
import io from "socket.io-client";

const socket = io();
export default {
  name: 'Bars',
  props: {
    question: Object
  },

  data: function () {
    return {
      myAnswers: [],
      uiLabels:{}
    }
  },
  created: function () {
    socket.on("init", (labels) => {
      this.uiLabels = labels
    })

      this.$emit("answer", {answer: this.myAnswers});

  }
}
</script>
<style scoped>
.container {
  display:flex;
  margin-bottom: 1em;
  justify-content: flex-end;
  flex-direction: row;
  align-items: end;
  width:auto;
  margin-right: 30%;

}
#picture{
  height:2em;
  width:2em;
  display:flex;


}
#answer{
  display:flex;
  cursor:default;

  border-style: solid;
  padding:0em 1em 0 1em;
  height: 2em;
  width:auto;
  height:2em;
  border-radius: 0.5em;
  border-color: #EF8584;
  border-width: 0.2em;
  background-color: gray;
}
#input {
  text-align: center;
  border-style: solid;
  height: 2em;
  width:15em;
  height:2em;

  left:50em;
  border-radius: 0.5em;
  border-color: #EF8584;
  border-width: 0.2em;
}
.rubrik{
  display:flex;
  margin-bottom: 1em;
  justify-content: flex-end;
  flex-direction: row;
  align-items: end;
  width:auto;
  margin-right: 35%;
}

</style>