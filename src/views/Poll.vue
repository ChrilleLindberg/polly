<template>
  <head>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
  </head>
  <body>
  <div v-show="isVisible">
    <div>
      <h1>Glossary-ID: {{ pollId }}</h1>

      <div id="">
        <h2 id="userWord">{{ uiLabels.userWord }}</h2><h2 id="translationText">{{ uiLabels.translation }}</h2>
      </div>

      <Question v-bind:question="question"
                v-on:answer="submitAnswer"/>
    </div>
    <br>

    <i id="goBack" class="fa fa-home" v-on:click="$router.push('/')"> </i>

    <div class="wrapper">
      <div class="icon facebook">
        <div class="tooltip">{{ uiLabels.language }}</div>
        <span><i><img v-on:click="switchLanguage" v-bind:src="uiLabels.flag" class="pictureFlag"></i></span>
        <!-- tog bort class="fab fa-facebook-f" -->
      </div>
    </div>

    <div>
      <button class="participate" v-on:click="showModal=true">
        {{ uiLabels.submitQuiz }}
      </button>
      <transition name="fade" appear>
        <div class="modal-overlay" v-if="showModal" v-on:click="showModal = false"></div>
      </transition>
      <transition name="slide" appear>
        <div class="modal" v-if="showModal">
          <button class="xModulButton" v-on:click="showModal = false"> x</button>
          <h1>{{ uiLabels.enterName }}</h1>
          <p><input autocomplete="off" type="string" id="fullnamebox" v-model="nameContendor">
            <br>
          </p>
          <button id="finalButton" class="button" v-on:click="FinishedQuiz" v-bind:disabled="nameContendor == ''">
            {{ uiLabels.submitFinal }}
          </button>
        </div>
      </transition>
    </div>
  </div>

  <div id="yourResult" v-show="!isVisible">
    <i id="goBack" class="fa fa-home" v-on:click="$router.push('/')"> </i>
    <h1>{{ nameContendor }}</h1>
    <div class="wrapper">
      <div class="icon facebook">
        <div class="tooltip">{{ uiLabels.language }}</div>
        <span><i><img v-on:click="switchLanguage" v-bind:src="uiLabels.flag"
                      class="pictureFlag"></i></span> <!-- tog bort class="fab fa-facebook-f" -->
      </div>
    </div>

    <h3> {{ uiLabels.youHave }} {{ numbCorrectAnswers }}/{{ question.a.length }} {{ uiLabels.correct }} </h3>
    <br>
    <h4 class="rubrikSpalt">
      <div>{{ uiLabels.question }}</div>
      <div>{{ uiLabels.yourAnswer}}</div>
      <div>{{uiLabels.correctAnswer}}</div>
      <div>{{ uiLabels.result }}</div>
    </h4>
    <div class="individualResults">
      <div class="table">
    <span v-for="(q) in question.q" :key="q" id="table1">
      <span> {{ q }}</span>
    </span>
        <span v-for="(a,i) in myAnswers.answer" :key="a" id="table2">

      <span v-bind:class="{table2incorrect:!correctOrNot[i]}"> {{ a }}</span>
    </span>

        <span v-for="(b) in question.a" :key="b" id="table3">

        <span> {{ b }}</span>
      </span>

        <span v-for="(t,i) in correctOrNot" :key="t" id="table4">
        <i class="fa fa-times" id="timesIcon" aria-hidden="true" v-show="!correctOrNot[i]"></i>
          <i class="fa fa-check" id="checkIcon" aria-hidden="true" v-show="correctOrNot[i]"></i>
          <!--<span>

          <img v-bind:src="[{'https://cdn.pixabay.com/photo/2013/07/13/10/48/check-157822_1280.png':t[i]},{'https://cdn.pixabay.com/photo/2014/03/24/13/45/incorrect-294245_960_720.png': !t[i]}]" alt="true" style="height: 40px; width:50px"> </span>-->
      </span>
      </div>
    </div>
    <div id="buttonUnder">
      <button class="button" v-on:click="$router.replace('/')">{{ uiLabels.backHome }}</button>
    </div>
  </div>
  </body>
</template>


<script>
// @ is an alias to /src


import Question from '@/components/Question.vue';

import io from 'socket.io-client';

const socket = io();

export default {
  name: 'Poll',
  components: {
    Question
  },

  el: '#app',
  data: function () {
    return {
      question: {
        q: "",
        a: []

      },

      pollId: "inactive poll",
      numbCorrectAnswers: 0,
      myAnswers: [""],
      correctOrNot: [],
      showModal: false,
      nameContendor: "",
      isVisible: true,
      uiLabels: {},
      questionsConverted: [],
      answersConverted: [],
      incorrectAnswer: false
    }

  },

  created: function () {
    this.pollId = this.$route.params.id
    socket.emit('joinPoll', this.pollId)
    socket.on("newQuestion", q =>
        this.question = q
    )
    socket.on("init", (labels) => {
      this.uiLabels = labels
    })


  },

  methods: {


    submitAnswer: function (answer) {
      this.myAnswers = answer
      //socket.emit("submitAnswer", {pollId: this.pollId, answer: answer})
    },


    FinishedQuiz: function () {
      this.isVisible = false;
      this.showModal = false;

      for (let i = 0; i < this.question.a.length; i++) {

        this.questionsConverted[i] = this.question.a[i].toLowerCase()

        if (typeof (this.myAnswers.answer[i]) != "undefined") {
          this.answersConverted[i] = this.myAnswers.answer[i].toLowerCase()

        }

        if (this.questionsConverted[i] == this.answersConverted[i]) {
          this.numbCorrectAnswers += 1;
          this.correctOrNot.push(true);


        } else {
          this.correctOrNot.push(false)
        }
      }
      socket.emit("finishAnswer", this.numbCorrectAnswers, this.pollId, this.nameContendor)

    },

    switchLanguage: function () {
      if (this.lang === "en")
        this.lang = "sv"
      else
        this.lang = "en"
      socket.emit("switchLanguage", this.lang)
    }
  }

}

</script>


<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;

}

body {
  position: absolute;
  width: 100%;
  min-height: 100%;
  top: 0;
  left: 0;
  font-family: Helvetica, Arial, sans-serif;
overflow-x: hidden;
  background-color: rgb(18, 54, 90);
  /*background: linear-gradient(90deg, #CEEDE8 0%, #EBEFFB 45%, #CAD2F9 100%);*/

}

.button {
  appearance: none;
  outline: none;
  border: none;
  background: none;
  cursor: pointer;

  display: inline-block;
  padding: 15px 25px;
  background-color: rgb(16,111,103);
  /*background-image: linear-gradient(to right, #86FF60, #2CEB78); */
  border-radius: 8px;

  color: #FFF;
  font-size: 18px;
  font-weight: 700;

  box-shadow: 4px 4px 20px -2px rgba(0, 0, 0, .35);
  transition: 0.4s ease-out;
}

.button:hover {
  box-shadow: 6px 6px rgba(0, 0, 0, 0.6);
}
.button:disabled{
  background-color: gray;
}

.xModulButton {
  border: solid orange 0.1em;
  color: orange;
  border-radius: 50%;
  width: 1.5em;
  height: 1.5em;
  text-align: center;
  font-size: 1.2em;
  background-color: transparent;
  position: absolute;
  left: 0.5em;
  top: 0.5em;
  font-weight: lighter;
}

.xModulButton:hover {
  color: red;
  cursor: pointer;
  border: solid red 0.1em;
}

.modal-overlay {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0em;
  left: 0em;
  z-index: 98;
  backdrop-filter: blur(0.5em);
  box-shadow: 0px 1px 15px 10px rgb(177, 80, 80);
  background-color: rgba(9, 108, 238, 0.3);
}

.modal {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 99;


  width:auto;
  background-color: rgb(18, 54, 90);
  border-radius: 16px;
  margin-right: 25%;



  padding: 25px;
}

h1 {
  color: rgb(249, 228, 201);
  font-size: 32px;
  font-weight: 900;
  margin-bottom: 15px;
  margin-top: 0.5em;
  font-family: Helvetica, Arial, sans-serif;
}

h2 {
  color: rgb(249, 228, 201);
}

h4, h3 {
  color: rgb(249, 228, 201);
}
h3{
  font-size: 2em;
  margin-top:1em
}

p {
  color: #666;
  font-size: 18px;
  font-weight: 400;
  margin-bottom: 15px;
}


.fade-enter-active,
.fade-leave-active {
  transition: opacity .5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform .5s;
}

.slide-enter,
.slide-leave-to {
  transform: translateY(-50%) translateX(-100vw);
}

#buttonUnder {
  margin-top: 2em;
  margin-bottom: 5em;
}

#fullnamebox {
  height: 3em;
  width: 15em;
  font-family: Helvetica, Arial, sans-serif;

  font-size: 15px;
}

.rubrikSpalt {
  margin-left: 10%;
  margin-right: 10%;
  margin-bottom: 0.5em;
  margin-top:1em;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-auto-flow: column;
  font-size: 1.3em;
}

.individualResults {
  margin-left: 10%;
  margin-right: 10%;
  overflow: auto;
  height: auto;
  max-height: 20em;
  box-shadow: 0em 0.1em 0.15em 0.1em rgb(203, 172, 172);
  background-color: white;

}

.table {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-auto-flow: column;
  border:black;
  /*width:auto;
  height:10em ; */
}

#table1 {
  grid-column: 1;
  border: 2px solid rgb(18, 54, 90);
  padding: 1em;
}

#table2 {
  grid-column: 2;
  border: 2px solid rgb(18, 54, 90);
  padding: 1em;
  color: green;
}

.table2incorrect {
  color: red;
}

#table3 {
  grid-column: 3;
  border: 2px solid rgb(18, 54, 90);
  padding: 1em;
}

#table4 {
  grid-column: 4;
  border: 2px solid rgb(18, 54, 90);
  padding: 1em;
}


#goBack {
  position: absolute;
  left: 1em;
  color: rgb(259,228,201);
  top: 1em;
  cursor:pointer;
  font-size: 2.5em;


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

#icon {
  color: white;
  width: 2em;
  height: 2em;
}

.participate {
  position: static;
  background-color: rgb(16, 111, 103);


  color: rgb(249, 228, 201);
  box-shadow: 4px 4px 20px -2px rgba(0, 0, 0, .35);
  font-size: 2em;
  margin-left: 0;
  margin-bottom: 0.2em;
  margin-top: 0.5em;
  padding: 0em 1em 0em 1em;
  display: inline-block;
  font-weight: 100;
  border-radius: 0.5em;
  box-sizing: border-box;
  border-style: solid;
  border-width: thin;
  text-decoration: none;
  text-align: center;
  transition: all 0.2s;
  cursor: default;
  height: 1.7em;

}

.participate:disabled {
  background-color: lightgray;
  color: gray ! important;
  cursor: default !important;
  height: 1.7em;
  padding-left: 1em;
  padding-right: 1em;
  margin-top: 0.5em;
  margin-bottom: 0.2em;
  margin-left: 0;
  border-radius: 0.5em;
  border-style: none;
  border-width: 0.2em;
  font-weight: bold;
}

.participate:disabled {
  border-radius: 0.5em;
  background-color: lightgray;
  color: #666666;
  border-style: solid;
  border-width: thin;
  font-weight: initial;

}

.participate:disabled:hover {
  transform: translateY(0px);
}

.participate:hover {
  cursor: pointer;
  transform: translateY(-2px);

}

.participate:hover:active {
  transform: translateY(10px);
  box-shadow: 0px -1px 2px 0px rgba(0, 0, 0, .35);
}

#timesIcon {
  color: red;
}

#checkIcon {
  color: green;
}
#userWord {
  display: flex;
  position: relative;
  left:26.9%;
}
#translationText {
  display: flex;
  position: relative;
  left:66%;
  bottom:1em;
}

</style>
