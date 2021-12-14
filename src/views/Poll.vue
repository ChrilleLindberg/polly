<template>
  <body>
  <div id="app" v-show="isVisible">
  <div>
    <h1>{{pollId}}</h1>
    <Question v-bind:question="question"
              v-on:answer="submitAnswer"/>
  </div>
  {{question.a}}
    {{myAnswers}}

    <img id="goBack" v-on:click="$router.push('/')" src="https://as1.ftcdn.net/v2/jpg/03/66/63/52/500_F_366635299_S1MlOWCcUVFPwgtxznb89r56tvyBBBVU.jpg" alt="{{uiLabels.goBack}}" style="width: 3em; height: 3em" >

    <div class="wrapper">
      <div class="icon facebook">
        <div class="tooltip">{{uiLabels.language}}</div>
        <span><i class="fab fa-facebook-f"><img v-on:click="switchLanguage" v-bind:src="uiLabels.flag"  class="pictureFlag"></i></span>
      </div>
    </div>

    <div>
    <button class="button" v-on:click="showModal=true" >
      {{ uiLabels.submitQuiz }}
    </button>
    <transition name="fade" appear>
      <div class="modal-overlay" v-if="showModal" v-on:click="showModal = false"></div>
    </transition>
    <transition name="slide" appear>
      <div class="modal" v-if="showModal">
        <h1>{{uiLabels.enterName}}</h1>
        <p> <input type="string" id="fullnamebox" v-model="nameContendor" >
          <br>
          </p>
        <button class="button" v-on:click="FinishedQuiz" >
          {{ uiLabels.submitFinal }}
<!--        <button class="button" v-on:click="$router.replace('/')" id="participate" >  Submit your answer-->
        </button>
      </div>
    </transition>
  </div>
  </div>
  <div id="yourResult" v-show="!isVisible">
    <h1>{{nameContendor}}</h1>

    <h3> {{ uiLabels.youHave }} {{numbCorrectAnswers}}/{{question.a.length}} {{ uiLabels.correct }} </h3>
    <br>
    <h3 class="rubrikSpalt" ><div>{{ uiLabels.question }}</div> <div>{{ uiLabels.answers }}</div> <div>{{ uiLabels.result }}</div> </h3>
    <div class="wrapper2">
    <div class="table">
    <span v-for="(q) in question.q" :key="q" id="table1">
      <span> {{ q }}</span>
    </span>
    <span v-for="(a) in myAnswers.answer" :key="a" id="table2">

      <span> {{ a }}</span>
    </span>
      <span v-for="(t) in correctOrNot" :key="t" id="table3">

        <span> <img v-bind:src="t" alt="true" style="height: 40px; width:50px"> </span>
      </span>

    </div>
    </div>
    <div id="buttonUnder">
    <button class="button"  v-on:click="$router.replace('/')">{{ uiLabels.backHome }}</button>
    </div>
    </div>
  </body>
</template>


<script >
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
      isVisible:true,
      uiLabels:{},
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
      this.myAnswers=answer
      //socket.emit("submitAnswer", {pollId: this.pollId, answer: answer})
    },



      FinishedQuiz: function(){
      this.isVisible=false;
      this.showModal = false;

      for (let i = 0; i <this.question.a.length; i++) {

        if(this.question.a[i] === this.myAnswers.answer[i]) {
          this.numbCorrectAnswers += 1;
          this.correctOrNot.push("https://cdn.pixabay.com/photo/2013/07/13/10/48/check-157822_1280.png");


        }
      else {
          this.correctOrNot.push("https://cdn.pixabay.com/photo/2014/03/24/13/45/incorrect-294245_960_720.png")
        }
      }
        socket.emit("finishAnswer",this.numbCorrectAnswers,this.pollId,this.nameContendor)

    },

  switchLanguage: function() {
    if (this.lang === "en")
      this.lang = "sv"
    else
      this.lang = "en"
    socket.emit("switchLanguage", this.lang)
  }


  }

}

</script>


<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'montserrat', sans-serif;
  background: linear-gradient(90deg, #CEEDE8 0%, #EBEFFB 45%, #CAD2F9 100%);
}

#app {
  position: relative;

  /*display: flex; makes the table go vertical instead*/
  justify-content: center;
  align-items: center;

  width: 100vw;
  min-height: 100vh;
  overflow-x: hidden;
}

.button {
  appearance: none;
  outline: none;
  border: none;
  background: none;
  cursor: pointer;

  display: inline-block;
  padding: 15px 25px;
  background-image: linear-gradient(to right, #CC2E5D, #FF5858);
  border-radius: 8px;

  color: #FFF;
  font-size: 18px;
  font-weight: 700;

  box-shadow: 3px 3px rgba(0, 0, 0, 0.4);
  transition: 0.4s ease-out;

&:hover {
   box-shadow: 6px 6px rgba(0, 0, 0, 0.6);
 }
}

.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 98;
  background-color: rgba(0, 0, 0, 0.3);
}

.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 99;

  width: 100%;
  max-width: 400px;
  background-color: #FFF;
  border-radius: 16px;

  padding: 25px;
}
h1 {
  color: #222;
  font-size: 32px;
  font-weight: 900;
  margin-bottom: 15px;
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
  transform: translateY(-50%) translateX(100vw);


}

#buttonUnder{
  margin-top: 2em;
  margin-bottom:5em;
}
#fullnamebox{
height: 3em;
  width: 15em;
  font-family: "Times New Roman", Times, serif,italic;

  font-size:15px;
}
.rubrikSpalt{
  margin-left: 33%;
  margin-right: 33%;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-auto-flow: column;
}
.wrapper2{
margin-left: 33%;
  margin-right: 33%;
  overflow: scroll;
  height: 20em;
  background: #CAD2F9;
  border-style: dotted;

}

.table {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-auto-flow: column;
  grid-gap: 1.5em;

  /*width:auto;
  height:10em ; */
}
#table1{
  grid-column:1;
  border-top: 1px solid #dfdfdf;
  padding-top:2em;

}
#table2 {
  grid-column: 2;
  border-top: 1px solid #dfdfdf;
  padding-top:2em;
}
#table3{
  grid-column:3;
  border-top: 1px solid #dfdfdf;
  padding-top:2em;
  color: red;
}
#goBack {
  position: absolute;
  left: 1em;
  top: 1em;
  mix-blend-mode: multiply;
  cursor:pointer
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
</style>
