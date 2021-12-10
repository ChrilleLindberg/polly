<template>

  <header>
    <h1>{{uiLabels.glossaryCreator}}</h1>
  </header>
  <body>
  {{this.pollId}}
  {{this.pollOk}}
  {{this.pollIdExists}}
  {{this.answersEmpty}}
  {{this.answers.length}}
  {{this.answers[0].length}}

  <button id="changeLanguage" v-on:click="switchLanguage">{{uiLabels.changeLanguage}}</button>
  <button id="goBack" @click="$router.back()">{{uiLabels.goBack}}</button>
  <div>
    <div  v-show="showView==1">
    Glossary ID:
    <input type="text" v-model="pollId" id="pollID" @keydown.space.prevent @input="checkInput">
    <img v-show="!pollIdExists && pollId.length > 0" src="https://www.freepnglogos.com/uploads/tick-png/tick-paddy-power-hotshot-jackpot-first-goalscorer-predictor-18.png" id="checkMark">
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
               @input="checkWords"
               id="qInput">
      </div>
      <div class="aInputClass">
        <input v-for="(_, i) in answers"
               v-model="answers[i]"
               v-bind:key="'answer'+i"
               @input="checkWords"
               id="aInput">
      </div>
      <div class="removeWords">
        <button v-for="index in answers.length" :key="index"
               @click="removeLine(index-1)"
               id="aInput">
          -
        </button>
      </div>

    </div>
    <button v-on:click="addWord">
      +
    </button>
    <br>
    <button v-on:click="createPoll" v-bind:disabled="!answersEmpty">
      {{ uiLabels.createGlossary }}
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
      pollIdExists: false,
      pollLengthOk: false,
      showView: 1,
      pollOk: false,
      answersEmpty: true
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

    if (this.$route.params.pollId !== "new") {
      this.pollId = this.$route.params.pollId
      socket.emit("getPollInfo",this.pollId)
      socket.on('getPollInfo2', (pollInfo) => {
        this.question = pollInfo.questions[0].q
        this.answers = pollInfo.questions[0].a
      })
    }

    this.checkInput()
    this.checkWords()

  },
  methods: {
    createPoll: function () {
      //socket.emit("clearPollId", {pollId: this.pollId}) //tar bort gamla frågor och svar, med index 0
      socket.emit("createPoll", {pollId: this.pollId, lang: this.lang})
      socket.emit("addQuestion", {pollId: this.pollId, q: this.question, a: this.answers})
      console.log(this.q)
      console.log(this.answer)
      socket.emit("createPoll", {pollId: this.pollId, lang: this.lang})
      this.showView = 2
      document.getElementById('prefilledInput').setAttribute('value',this.pollId)

    },

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
    removeLine: function (index) {
      this.question.splice(index,1)
      this.answers.splice(index,1)
    },
    checkInput: function () {
            socket.emit("sendPollId", this.pollId)
      socket.on("checkPollId", (pollExists) =>
          this.pollIdExists = pollExists)
    },
    checkWords: function () {
      this.answers.forEach(i=> {
        if (answer.length < 1) {
          this.answersEmpty = false
        } else {
          this.answersEmpty = true
        }
      })
    }
  }
}
</script>


<style>
.classInput {
  display: grid;
  grid-template-columns: 4fr 4fr 1fr;
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

.removeWords {
  display: grid;
}

#aInput {
  text-align: center;
}

#prefilledInput {
  text-align: center;
}

#checkMark {
  height: 1em;
}

</style>
