<template>

  <header>
    <h1>{{uiLabels.glossaryCreator}}</h1>
  </header>
  <body>
  <button id="changeLanguage" v-on:click="switchLanguage">{{uiLabels.changeLanguage}}</button>
  <button id="goBack" @click="$router.back()">{{uiLabels.goBack}}</button>
  <div>
    <div  v-show="showView==1">
    Glossary ID:
    <input type="text" v-model="pollId" id="pollID">
    <br>

    <div class="classInput">
      <div id="inputQuestion">
        {{ uiLabels.question }}:
      </div>
      <div id="inputAnswer">
          Answers:
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
    <button v-on:click="addWord" id="test">
      Test
    </button>
      <input id="prefilled1">
    <br>
    <button v-on:click="createPoll">
      Create poll
    </button>
    <br>
    </div>
    <div v-show="showView==2">
    <p>
      {{uiLabels.congratulations}}
    </p>
    <input type="text" id="prefilledInput" readonly="readonly">
    <button @click="copyToClipboard"> <!-- har ej kopplat denna knapp till en fungerande metod än-->
      {{uiLabels.copy}}
    </button>
    <br>
      {{ data }}
      <br>

<!--      {{ data.questions[data.questions.length-1] }}-->

    <br>
    <router-link v-bind:to="'/result/'+pollId">Check result</router-link>
    </div>
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
      willShow: false,
      showView: 1,
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
    test: function(){
      socket.emit("createPoll", {pollId: this.pollId, lang: this.lang})
      socket.emit("addQuestion", {pollId: this.pollId, q: this.question, a: this.answers})
      console.log(this.q)
      console.log(this.answer)
      socket.emit("createPoll", {pollId: this.pollId, lang: this.lang})
      document.getElementById('prefilled1').setAttribute('value',this.answers)

    },
    createPoll: function () {
      socket.emit("createPoll", {pollId: this.pollId, lang: this.lang})
      socket.emit("addQuestion", {pollId: this.pollId, q: this.question, a: this.answers})
      console.log(this.q)
      console.log(this.answer)
      socket.emit("createPoll", {pollId: this.pollId, lang: this.lang})
      this.showView = 2
      document.getElementById('prefilledInput').setAttribute('value',this.pollId)

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
      let copyID = document.querySelector("#prefilledInput")
      copyID.setAttribute('type', 'text')
      copyID.select()
      document.execCommand('copy')
    },
    switchLanguage: function() {
      if (this.lang === "en")
        this.lang = "sv"
      else
        this.lang = "en"
      socket.emit("switchLanguage", this.lang)
    },
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

#changeLanguage{
  position: absolute;
  right: 1em;
  top: 1em;
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

#prefilledInput {
  text-align: center;
}

</style>
