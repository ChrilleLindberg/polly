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
    <input type="text" v-model="pollId" v-bind:disabled="!inputActivated" id="pollID" @keydown.space.prevent @input="checkInput">
    <button v-show="!inputActivated" @click="activateInput">
      <img src="https://www.pngrepo.com/png/198202/180/edit-pencil.png" class="checkMark">
    </button>
    <img v-show="(!pollIdExists || oldPollSame) && pollId.length > 0 && pollId !== 'new' && inputActivated" src="https://www.freepnglogos.com/uploads/tick-png/tick-paddy-power-hotshot-jackpot-first-goalscorer-predictor-18.png" class="checkMark">
    <img v-show="(pollIdExists && !oldPollSame) && pollId.length > 0 || pollId == 'new'" src="https://emojipedia-us.s3.amazonaws.com/source/skype/289/cross-mark_274c.png" class="checkMark">
    <br>
    <div class="classInput">
      <div id="inputQuestion">
        {{ uiLabels.question }}:
      </div>
      <div id="inputAnswer">
        {{ uiLabels.answers }}:
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
    <button v-on:click="createPoll" v-bind:disabled="answersEmpty || (pollIdExists && !oldPollSame) || pollId.length < 1 || this.pollId == 'new'">
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
      oldPollId: "",
      question: [""],
      answers: [""],
      questionNumber: 0,
      data: {},
      uiLabels: {},
      willShow: false,
      pollIdExists: false,
      pollLengthOk: false,
      showView: 1,
      answersEmpty: true,
      oldPollSame: false,
      penVisible: false,
      inputActivated: true
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
      this.oldPollId = this.$route.params.pollId
      socket.emit("getPollInfo",this.pollId)
      socket.on('getPollInfo2', (pollInfo) => {
        this.question = pollInfo.questions[0].q
        this.answers = pollInfo.questions[0].a
        //this.checkInput()
        this.checkWords()
        this.showPen()
      })
    }

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
      this.checkWords()
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
      this.checkWords()
    },
    checkInput: function () {
      socket.emit("sendPollId", this.pollId)
      socket.on("checkPollId", (pollExists) =>
          this.pollIdExists = pollExists)
      this.oldPollSame = false
      if (this.pollId == this.oldPollId) {
        this.oldPollSame = true
      }
    },
    checkWords: function () {
      this.answersEmpty = false
      this.answers.forEach(i=> {
        if (i.length < 1) {
          this.answersEmpty = true
        }
      })
      this.question.forEach(i=> {
        if (i.length < 1) {
          this.answersEmpty = true
        }
      })
    },
    showPen: function () {
      if (this.pollId.length > 0) {
        this.inputActivated = false
      }
    },
    activateInput: function () {
      this.inputActivated = true
    }
  }
}
</script>


<style>
.classInput {
  display: grid;
  grid-template-columns: 1fr 4fr 4fr 1fr;
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
  grid-column: 2;
  text-align: center;
  display: grid;
}

#inputQuestion {
  grid-column: 2;
}

#inputAnswer {
  grid-column: 3;
}

#qInput {
  text-align: center;
}

.aInputClass {
  grid-column: 3;
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

.checkMark {
  height: 1em;
}

</style>
