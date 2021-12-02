<template>
  <div>
    Poll link: 
    <input type="text" v-model="pollId">
    <button v-on:click="createPoll">
      Create poll
    </button>
    <br>
    <button v-on:click="addWord">
      Add word
    </button>

    <div class="classInput">
      <div id="inputQuestion" >
      {{uiLabels.question}}:
<!--      <input type="text" v-model="question">-->


      <input  v-for="(_, i) in question"
             v-model="question[i]"
             v-bind:key="'question'+i">
      </div>
      <div id="inputAnswer">
        {{question[1]}}

        Answers:
<!--        <input type="text" v-model="answers">-->
    <input  v-for="(_, i) in answers"
               v-model="answers[i]"
               v-bind:key="'answer'+i">
        {{answers[1]}}
<!--       <button v-on:click="addAnswer">
          Add answer alternative
        </button>&ndash;&gt;-->
      </div>
    </div>
    <button v-on:click="addQuestion">
      Add question
    </button>
    <br>


    <input type="number" v-model="questionNumber">
    <button v-on:click="runQuestion">
      Run question
    </button>
    {{data}}
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
    },
    addQuestion: function () {
      socket.emit("addQuestion", {pollId: this.pollId, q: this.question, a: this.answers } )
      console.log(this.q)
      console.log(this.answer)
    },
    addAnswer: function () {
      this.answers.push("");
    },
    runQuestion: function () {
      socket.emit("runQuestion", {pollId: this.pollId, questionNumber: this.questionNumber})
    },
    addWord: function () {
      this.answers.push("");
      this.question.push("");
    }
  }
}
</script>


<style>
.classInput {
  display:grid;
  grid-template-columns: auto auto;
}
#inputQuestion{
background: aqua;
}

#inputAnswer{

}

</style>
