<template>

  <header>
    <!--<h1 @click="$route.back">{{uiLabels.glossaryCreator}}</h1>-->
    <input type="text" v-model="pollId" v-bind:disabled="!inputActivated" id="pollID" @keydown.space.prevent @input="checkInput" v-bind:placeholder="uiLabels.writeField">
    <button v-show="!inputActivated" @click="activateInput" id="pen">
      <img src="https://www.pngrepo.com/png/198202/180/edit-pencil.png" class="checkMark" id="penImg">
    </button>
    <img v-show="(!pollIdExists || oldPollSame) && pollId.length > 0 && pollId !== 'new' && inputActivated" src="https://www.freepnglogos.com/uploads/tick-png/tick-paddy-power-hotshot-jackpot-first-goalscorer-predictor-18.png" class="checkMark">
    <img v-show="(pollIdExists && !oldPollSame) && pollId.length > 0 || pollId == 'new'" src="https://emojipedia-us.s3.amazonaws.com/source/skype/289/cross-mark_274c.png" class="checkMark">
  </header>
  <body>

  <div class="wrapper">
    <div class="icon facebook">
      <div class="tooltip">{{uiLabels.language}}</div>
      <span><i class="fab fa-facebook-f"><img v-on:click="switchLanguage" v-bind:src="uiLabels.flag"  class="pictureFlag"></i></span>
    </div>
  </div>

  <img id="goBack" v-on:click="$router.push('/')" src="https://as1.ftcdn.net/v2/jpg/03/66/63/52/500_F_366635299_S1MlOWCcUVFPwgtxznb89r56tvyBBBVU.jpg" alt="{{uiLabels.goBack}}" style="width: 3em; height: 3em" >
  <div class="middlePart">
    <div  v-show="showView==1">
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
    <button v-on:click="addWord" id="plusButton">
      +
    </button>
    <br>
    <button v-on:click="createPoll" v-bind:disabled="answersEmpty || (pollIdExists && !oldPollSame) || pollId.length < 1 || this.pollId == 'new'" class="buttonNice">
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


<style scoped>
.classInput {
  padding-top: 5%;
  padding-bottom: 0.5em;
  display: grid;
  grid-template-columns: 10fr 9fr 1fr;
  grid-template-rows: repeat(auto-fit,4em);
  vertical-align: center;
}

body {
  background-color: #3C5377;
  color: #666666;
}

header {
  padding-bottom: 5%;
  padding-top: 2%;
}

.middlePart {
  padding-right: 30%;
  padding-left: 30%;
  vertical-align: center;
  horiz-align: center;
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

input:focus {
  outline: none;
}

#prefilledInput {
  text-align: center;
}

.checkMark {
  height: 1.5em;
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


#plusButton {
  border-style: solid;
  border-color: #EF8584;
  border-width: 0.2em;
  border-radius: 0.5em;
  background-color: white;
  color: #666666;
  height: 2em;
  width: 3em;
  margin-bottom: 5em;
  -webkit-transform: perspective(1px) translateZ(0);
  transform: perspective(1px) translateZ(0);
  -webkit-transition-duration: 0.3s;
  transition-duration: 0.3s;
  -webkit-transition-property: transform;
  transition-property: transform;
}

#plusButton:hover, #plusButton:active {
  -webkit-transform: scale(0.8);
  transform: scale(0.8);
}

#createButton {
  height: 2em;
  border-radius: 0.5em;
  background-color: #EF8584;
  color: white;
  border-style: solid;
  border-width: 0.2em;
  border-color: #EF8584;
}

#pen {
  background-color: transparent;
  border:none;
}

#penImg {
  height: 1.5em;
}

#pollID {
  font-size: 1.5em;
  text-align: center;
  border-radius: 0.2em;
}
.pictureFlag{
  border-radius: 50%;
  width:1.2em;
  height:1em;
  box-shadow: 0 10px 10px rgba(0, 0, 0, 0.1);



}
.wrapper {
  display: inline-flex;
  position: absolute;
  right: 1em;
  top: 1.3em;
  cursor: pointer;
  border-radius: 50%;
  width:2em;
  height:2em;
}

.wrapper .icon {

  position: relative;

  background-color: #ffffff;
  border-radius: 50%;
  width:1.2em;
  height:1em;
  display: flex;

  align-items: center;
  flex-direction: column;
  box-shadow: 0 10px 10px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.wrapper .tooltip {
  position: absolute;
  top: 0;
  font-size: 14px;
  background-color: white;
  color: #EF8584;
  padding: 5px 8px;
  border-radius: 5px;
  box-shadow: 0 10px 10px rgba(0, 0, 0, 0.1);
  opacity: 0;
  pointer-events: none;
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.wrapper .tooltip::before {
  position: absolute;
  content: "";
  height: 8px;
  width: 8px;
  background-color: #ffffff;
  bottom: -3px;
  left: 50%;
  transform: translate(-50%) rotate(45deg);
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.wrapper .icon:hover .tooltip {
  top: -30px;
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
}
#goBack {
  position: absolute;
  left: 1em;
  top: 1em;
  mix-blend-mode: multiply;
  cursor:pointer
}

</style>
