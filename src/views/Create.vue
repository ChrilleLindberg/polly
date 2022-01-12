<template>
  <head>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
  </head>
  <body>
  <div id="backgroundDiv" v-show="showView==2">
    <!--<img src="https://acegif.com/wp-content/gif/confetti-10.gif" id="backgroundImg">-->
    <!--  <img src="https://acegif.com/wp-content/gif/confetti-4.gif" id="backgroundImg"> -->
  </div>
  <br>
  <h1 class="createText" v-show="showView !==2 ">{{uiLabels.glossaryCreator}}</h1>
  <h1 class="congratsText " v-show="showView == 2"> {{uiLabels.congratulations}}</h1>
  <h1 class="congratsText" v-show="showView == 2"> {{uiLabels.youhavecreated}}</h1>
  <div class="inputFieldTop" v-show="showView==1">
    <input autocomplete="off" type="text" v-model="pollId" v-bind:disabled="!inputActivated" id="inputFieldPollId" @keydown.space.prevent @input="checkInput" v-bind:placeholder="uiLabels.writeField">
    &nbsp;
    <button v-show="!inputActivated" @click="activateInput" id="pen">
      <i class="fa fa-pencil" aria-hidden="true" ></i>
    </button>
    <i class="fa fa-check" id="checkmark" aria-hidden="true" img v-show="(!pollIdExists || oldPollSame) && pollId.length > 0 && pollId !== 'new' && inputActivated"></i>
    <i class="fa fa-times" id="crossmark" aria-hidden="true" img v-show="(pollIdExists && !oldPollSame) && pollId.length > 0 || pollId == 'new'"></i>
  </div>

  <div class="wrapper">
    <div class="icon">
      <div class="tooltip">{{uiLabels.language}}</div>
      <span><i><img v-on:click="switchLanguage" v-bind:src="uiLabels.flag"  class="pictureFlag"></i></span> <!-- tog bort class="fab fa-facebook-f" -->
    </div>
  </div>

  <i id="goBack" class="fa fa-home" v-on:click="$router.push('/')"> </i>
  <div class="middlePart">
    <div  v-show="showView==1">
    <div class="classInput">
      <div class="qInputClass">
        <input  autocomplete="off"
                v-for="(_, i) in question"
               v-model="question[i]"
               v-bind:key="'question'+i"
               @input="checkWords"
               id="qInput"
               v-bind:placeholder="uiLabels.enterWord">
      </div>
      <div class="aInputClass">
        <input v-for="(_, i) in answers"
               autocomplete="off"
               v-model="answers[i]"
               v-bind:key="'answer'+i"
               @input="checkWords"
               id="aInput"
               @keyup.enter="addWord"
               v-bind:placeholder="uiLabels.enterTranslation">
      </div>
      <div class="removeWords">
        <button v-for="index in answers.length" :key="index"
               id="removeLine">
          <i class="fa fa-trash" aria-hidden="true" id="trashCan" @click="removeLine(index-1)"></i>
        </button>
      </div>

    </div>
    <button v-on:click="addWord" id="plusButton">
      +
    </button>
    <br>
      <div class="wrapperC">
        <div v-bind:class="{iconC:answersEmpty || (pollIdExists && !oldPollSame) || pollId.length < 1 || this.pollId == 'new'}">
          <div class="tooltipC">
            <p v-show="(pollIdExists && !oldPollSame) || pollId =='' || pollId == 'new'"> {{ uiLabels.IDMessage }}</p>
            <p v-show="answersEmpty && !((pollIdExists && !oldPollSame) || pollId =='' || pollId == 'new')"> {{ uiLabels.inputMessage }} </p></div>
          <button v-on:click="createPoll" v-bind:disabled="answersEmpty || (pollIdExists && !oldPollSame) || pollId.length < 1 || this.pollId == 'new'" class="buttonNice">
            {{ uiLabels.createGlossary }}
          </button>
        </div>
      </div>
    </div>
    <div v-show="showView==2">
<!--    <h3>
      {{uiLabels.congratulations}}
    </h3>-->
    <input type="text" id="prefilledInput" readonly="readonly"> &nbsp;
    <button @click="copyToClipboard" class="copyButton" title="Kopiera ID"> <!-- har ej kopplat denna knapp till en fungerande metod än-->
      <i class="fa fa-clipboard" aria-hidden="true"></i>
    </button>
      <div id="createinfotextdiv">
      <p id="createInfoText">
        {{uiLabels.createinfotext}}
      </p>
      </div>
      <button type="submit" name="go_search" @click="$router.push('/')" class="participate">
        {{ uiLabels.backHome }}
      </button>
    </div>
  </div>
  </body>
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

*{
  margin: 0;
  padding:0;
}
h1 {
  color: rgb(249, 228, 201);
  position: relative;
  top:2em

}
body{
  font-family: Helvetica, Arial, sans-serif;
  background-color: rgb(18,54,90);
  width: 100%;
  height: 100%;
  overflow: auto;
  position: absolute;
  top:0em;
  left:0em;
  z-index:-2;
}

#backgroundDiv {
  position: absolute;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  z-index: -1;
  display: flex;
  justify-content: center;
  top: 0em;
  background-image: url("https://acegif.com/wp-content/gif/confetti-10.gif");
  opacity: 50%;
}

html {
  background-color: #FFFAF1;
}

.middlePart {
  padding: 5%;
}

#changeLanguage{
  position: absolute;
  right: 1em;
  top: 1em;
}
#createinfotextdiv{
  position: relative;
  top:5em;
  background-color: white;
  margin: auto;
  width: 50%;
  height: auto;
  border-radius: 2em;
  padding: 1em;
  box-shadow: 4px 4px 20px -2px rgba(0,0,0,.35);
}

p{
  color: rgb(18,54,90);
  font-family: Helvetica, Arial, sans-serif;
  font-size: 1.5em;
  line-height: 1.5;
}

#createInfoText{
  position: relative;
  display: inline-block;

}
.participate{
  position:relative;
  top:3em;
  background-color: rgb(16,111,103);
  color: rgb(249,228,201);
  box-shadow: 4px 4px 20px -2px rgba(0,0,0,.35);
  font-size: 2em;
  margin-left: 0;
  margin-bottom: 0.2em;
  margin-top: 0.5em;
  padding:0em 1em 0em 1em;
  display:inline-block;
  font-weight: 100;
  border-radius: 0.5em;
  box-sizing: border-box;
  border-style: solid;
  border-width: thin;
  text-decoration:none;
  text-align:center;
  transition: all 0.2s;
  cursor: pointer;
  min-height: 1.7em;
  height: auto;
}
.participate:hover{
  cursor:pointer;
  transform: translateY(-2px);
}
.participate:hover:active {
  transform: translateY(10px);
  box-shadow: 0px -1px 2px 0px rgba(0,0,0,.35);
}

.classInput {
  padding-top: 5%;
  padding-bottom: 0.5em;
  display: grid;
  grid-template-columns: 10fr 9fr 1fr;
  grid-template-rows: repeat(auto-fit,1fr);
  vertical-align: center;
  position: relative;
  top:5em;
}
.qInputClass {
  border-radius: 1em;
  grid-column: 1;
  text-align: center;
  display: grid;
  grid-row-gap: 0.5em;
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
  margin: 0 auto;
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

.copyButton {
  margin-left: 0.5em;
  height: 2.5em;
  width: 2.5em;
  border-style: solid;
  color: #EF8584;
  border-color: #EF8584;
  border-width: 0.2em;
  border-radius: 0.5em;
  box-shadow: 4px 4px 20px -2px rgba(0,0,0,.35);
  transition: all .6s;
}
.copyButton:hover {
  cursor: pointer;
  background-color: #EF8584;
  color: #FFFAF1;
  transform: translateY(-2px);
  box-shadow: 2px 2px 5px -1px rgba(0,0,0,.35);
}
.copyButton:hover:active {
  transform: translateY(10px);
  box-shadow: 0px -1px 2px 0px rgba(0,0,0,.35);
}

#trashCan {
  opacity: 75%;
  vertical-align: center;
  font-size: 2em;
  color: rgb(249, 228, 201);
  position: relative;
  right:0.3em;
  margin-left:0.3em;
}

#trashCan:hover {
  opacity: 100%;
  cursor: pointer;
}

#removeLine {
  background-color: transparent;
  border-color: transparent;
  horiz-align: center;
  vertical-align: center;
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
  position: relative;
  top:6em;
}

#plusButton:hover, #plusButton:active {
  -webkit-transform: scale(0.8);
  transform: scale(0.8);
}

.buttonNice {
  height: 3em;
  border-radius: 0.5em;
  background-color: #EF8584;
  color: #FFFAF1;
  border-style: solid;
  border-width: 0.2em;
  border-color: #EF8584;
  box-shadow: 4px 4px 20px -2px rgba(0,0,0,.35);
  transition: all .1s;
}

.buttonNice:disabled {
  cursor: initial;
  height: 3em;
  border-radius: 0.5em;
  background-color: #FFFFFF;
  color: lightgray;
  border-style: solid;
  border-width: 0.2em;
  border-color: lightgray;
  box-shadow: 4px 4px 20px -2px rgba(0,0,0,.35);
}
.buttonNice:hover {
  transform: translateY(-2px);
  box-shadow: 2px 2px 5px -1px rgba(0,0,0,.35);
}
.buttonNice:hover:active {
  transform: translateY(10px);
  box-shadow: 0px -1px 2px 0px rgba(0,0,0,.35);
}
.buttonNice:disabled:hover {
  transform: translateY(0px);
}
.wrapperC {
  display: inline-flex;
  position: relative;
  top:5em;
  margin-bottom: 2em;
}

.iconC {
  position: relative;
  background-color: #ffffff;
  border-radius: 0.5em;
  display: flex;
  align-items: center;
  flex-direction: column;
  box-shadow: 0 10px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.2s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.tooltipC {
  width: 200%;
  margin-top: -2em;

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

.tooltipC::before {
  position: absolute;
  content: "";
  height: 8px;
  width: 8px;
  background-color: #ffffff;
  bottom: -2.2px;
  left: 50%;
  transform: translate(-50%) rotate(45deg);
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.iconC:hover .tooltipC {
  top: -30px;
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
}
.createInfo{
  border-radius: 0.5em;
  background-color: #EF8584;
  color: #FFFAF1;
  border-style: solid;
  border-width: 0.2em;
  border-color: #EF8584;
}

button {
  cursor: pointer;
}

#pen {
  background-color: transparent;
  border:none;
}
#checkmark{
  color: green;
  position: relative;
  top:4.15em;
}
#crossmark{
  color: red;
  position: relative;
  top:4.15em;
}
.inputFieldTop {
  position: relative;
  top: 1em;
}

#inputFieldPollId, #prefilledInput {
  border-radius: 0.5em;
  border-style: solid;
  border-color: lightgray;
  height: 2em;
  text-align: center;
  position: relative;
  top:5em;
}
#prefilledInput, .copyButton{
  position: relative;
  top:5em;
  left:1.5em;
}

#inputFieldPollId:disabled {
  background-color: #EBECE5;
  border-color: lightgreen;
}

#inputFieldTop:focus::placeholder {
  color: transparent;
}

.pictureFlag{
  border-radius: 0.5em;
  width:2.3em;
  height:1.6em;
  box-shadow: 4px 4px 20px -2px rgba(0,0,0,.35);
}
.wrapper {
  display: inline-flex;
  position: absolute;
  right: 1.8em;
  top: 1.8em;
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
  margin-top: 1.2em;
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
  bottom: -2.2px;
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
  cursor:pointer;
  font-size: 2.5em;
  color: rgb(249,228,201);
}

footer {
  position: absolute;
  bottom: 1em;
}

.tooltip {
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

</style>
