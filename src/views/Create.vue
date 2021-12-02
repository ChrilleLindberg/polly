<template>
  <header>
    <h1>Glossary creator</h1>
  </header>
  <div>
    Glossary ID:
    <input type="text" v-model="pollId">
    <br>

    <div class="classInput">
      <div id="inputQuestion" >
      {{uiLabels.question}}:

      <input v-for="(_, i) in question"
             v-model="question[i]"
             v-bind:key="'question'+i">
      </div>
      <div id="inputAnswer">
        {{question[0]}}

        Answers:
    <input  v-for="(_, i) in answers"
               v-model="answers[i]"
               v-bind:key="'answer'+i">
        {{answers[0]}}
      </div>
    </div>
    <button v-on:click="addWord">
      +
    </button>
    <br>
    <button v-on:click="createPoll">
      Create poll
    </button>
    <br>
    {{data}}
    <br>
    <router-link v-bind:to="'/result/'+pollId">Check result</router-link>
  </div>
</template>

<script>
import io from 'socket.io-client';
const socket = io();

export default {
  name: 'Create',
  data: function () {
    return {
      lang: "",
      pollId: "",
      question: [""],
      answers: [""],
      questionNumber: 0,
      data: {},
      uiLabels: {}

    }
  },
  created: function () {
    this.lang = this.$route.params.lang;
    socket.emit("pageLoaded", this.lang);
    socket.on("init", (labels) => {
      this.uiLabels = labels
    })
    socket.on("dataUpdate", (data) =>
      this.data = data
    )
    socket.on("pollCreated", (data) =>
      this.data = data)
  },
  methods: {
    createPoll: function () {
      socket.emit("createPoll", {pollId: this.pollId, lang: this.lang })
      socket.emit("addQuestion", {pollId: this.pollId, q: this.question, a: this.answers } )
      console.log(this.q)
      console.log(this.answer)
      socket.emit("createPoll", {pollId: this.pollId, lang: this.lang })

    },
//    addQuestion: function () {
//      socket.emit("addQuestion", {pollId: this.pollId, q: this.question, a: this.answers } )
//      console.log(this.q)
//      console.log(this.answer)
//    },
//    addAnswer: function () {
//      this.answers.push("");
//    },
//    runQuestion: function () {
//      socket.emit("runQuestion", {pollId: this.pollId, questionNumber: this.questionNumber})
//    },
    addWord: function () {
      this.answers.push("");
      this.question.push("");
    },
  }
}
</script>


<style>
.classInput {
  display:grid;
  grid-template-columns: auto auto;
}
#inputQuestion{
background: burlywood;
}
#inputAnswer{
  background: blanchedalmond;
}

template{
  background: linear-gradient(#e66465, #9198e5);
}

</style>
