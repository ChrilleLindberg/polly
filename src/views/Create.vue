<template>

  <header>
    <h1 @click="$route.back">{{uiLabels.glossaryCreator}}</h1>
  </header>
  <body>
  <button id="changeLanguage" v-on:click="switchLanguage">{{uiLabels.changeLanguage}}</button>
  <!-- <button id="goBack" @click="$router.back()">{{uiLabels.goBack}}</button> -->
  <img id="goBack" v-on:click="$router.push('/')" src="https://as1.ftcdn.net/v2/jpg/03/66/63/52/500_F_366635299_S1MlOWCcUVFPwgtxznb89r56tvyBBBVU.jpg" alt="{{uiLabels.goBack}}" style="width: 3em; height: 3em" >
  <div class="middlePart">
    <div  v-show="showView==1">
    Glossary ID:
    <input type="text" v-model="pollId" v-bind:disabled="!inputActivated" id="pollID" @keydown.space.prevent @input="checkInput" v-bind:placeholder="uiLabels.writeField">
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
               id="qInput"
               v-bind:placeholder="uiLabels.enterWord">
      </div>
      <div class="aInputClass">
        <input v-for="(_, i) in answers"
               v-model="answers[i]"
               v-bind:key="'answer'+i"
               @input="checkWords"
               id="aInput"
               v-bind:placeholder="uiLabels.enterTranslation">
      </div>
      <div class="removeWords">
        <button v-for="index in answers.length" :key="index"
               id="removeLine">
          <img @click="removeLine(index-1)" src="https://www.shareicon.net/data/512x512/2016/01/05/698410_trash_512x512.png" id="trashCan">
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
  grid-template-columns: 10fr 9fr 1fr;
  grid-template-rows: repeat(auto-fit,4em);
}

body {
  background-color: #FBE4C9;
}

.middlePart {
  padding-right: 30%;
  padding-left: 30%;
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
  grid-row-gap: 0.5em;
}

#inputQuestion {
  grid-column: 1;
}

#inputAnswer {
  grid-column: 2;
}

#qInput {
  text-align: center;
  border-style: solid;
  height: 2em;
  border-bottom-left-radius: 0.5em;
  border-top-left-radius: 0.5em;
  border-color: #EF8584;
  border-width: 0.2em;
  border-right-style: outset;
  border-right-width: 0.05em;
  border-right-color: #666666;
}

.aInputClass {
  grid-column: 2;
  text-align: center;
  display: grid;
  grid-row-gap: 0.5em;
}

.removeWords {
  display: grid;
}

#aInput {
  text-align: center;
  border-style: solid;
  border-bottom-right-radius: 0.5em;
  border-top-right-radius: 0.5em;
  border-color: #EF8584;
  border-width: 0.2em;
  border-left-width: 0;
}


input:focus::placeholder {
  color: transparent;
}

#prefilledInput {
  text-align: center;
}

.checkMark {
  height: 1em;
}

#trashCan {
  height: 1em;
  opacity: 50%;
}

#trashCan:hover {
  opacity: 100%;
}

#removeLine {
  background-color: transparent;
  border-color: transparent;
}

</style>
