<template>

  <header>
    <h1>Glossary creator</h1>
  </header>
  <body>
  <div>
    Glossary ID:
    <input type="text" v-model="pollId">
    <br>

    <div class="classInput">
      <div id="inputQuestion">
        {{ uiLabels.question }}:
      </div>
      <div id="inputAnswer">
        {{ question[0] }}

        Answers:

        {{ answers[0] }}
      </div>
      <div class="qInputClass">
        <input v-for="(_, i) in question"
               v-model="question[i]"
               v-bind:key="'question'+i"
               id="qInput">
      </div>
      <div class="aInputClass">
        <input v-for="(_, i) in answers"
               v-model="answers[i]"
               v-bind:key="'answer'+i"
               id="aInput">
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
    {{ data }}
    <br>
    <p v-if="willShow">
      {{uiLabels.congratulations}} {{this.pollId}}
    </p>
    <button @click="copyToClipboard"> <!-- har ej kopplat denna knapp till en fungerande metod än-->
      {{uiLabels.copy}}
    </button>
    <br>
    <router-link v-bind:to="'/result/'+pollId">Check result</router-link>
  </div>
  </body>
  <footer>
    <p>
      Footer
    </p>
  </footer>
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
      uiLabels: {},
      willShow: false

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
      socket.emit("createPoll", {pollId: this.pollId, lang: this.lang})
      socket.emit("addQuestion", {pollId: this.pollId, q: this.question, a: this.answers})
      console.log(this.q)
      console.log(this.answer)
      socket.emit("createPoll", {pollId: this.pollId, lang: this.lang})
      this.willShow = true

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
    copyToClipboard: function () {

    }
  }
}
</script>


<style>
.classInput {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: repeat(auto-fit,4em);
}

body {
  background: linear-gradient(90deg, #CEEDE8 0%, #EBEFFB 45%, #CAD2F9 100%);
}

.qInputClass {
  border-radius: 1em;
  grid-column: 1;
  text-align: center;
  display: grid;
}

#qInput {
  text-align: center;
}

.aInputClass {
  grid-column: 2;
  text-align: center;
  display: grid;
}

#aInput {
  text-align: center;
}

</style>
