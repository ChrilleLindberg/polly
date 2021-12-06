<template>
  <body>
  <div id="app" v-show="isVisible">
  <div >
    <h1>{{pollId}}</h1>
    <Question v-bind:question="question"
              v-on:answer="submitAnswer"/>
  </div>
  {{question.a}}
    {{myAnswers}}


    <div >
    <button class="button" v-on:click="FinishedQuiz">
      Submit Quiz
    </button>
    <transition name="fade" appear>
      <div class="modal-overlay" v-if="showModal" v-on:click="showModal = false"></div>
    </transition>
    <transition name="slide" appear>
      <div class="modal" v-if="showModal">
        <h1>To submit please enter your full name</h1>
        <p> <input type="string" id="fullnamebox" v-model="nameContendor">
          <br>
          </p>
        <button class="button" v-on:click="isVisible=false">
          Submit your final answer
<!--        <button class="button" v-on:click="$router.replace('/')" id="participate" >  Submit your answer-->
        </button>
      </div>
    </transition>
  </div>
  </div>
  <div id="yourResult" v-show="!isVisible">
    <h1>{{nameContendor}}</h1>

    Du har fått {{numbCorrectAnswers}}/{{question.a.length}} rätt
    <div id="table">
    <span v-for="(q) in question.q" :key="q" id="table1">
      {{ q }}
    </span>
    <span v-for="(a) in myAnswers.answer" :key="a" id="table2">
      {{ a }}
    </span>
      <span v-for="(t) in correctOrNot" :key="t" id="table3">
        {{ t }}
      </span>

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
      isVisible:true
    }

  },

  created: function () {
    this.pollId = this.$route.params.id
    socket.emit('joinPoll', this.pollId)
    socket.on("newQuestion", q =>
      this.question = q
    )



  },

  methods: {
    BackToHome: function(){

    },

    submitAnswer: function (answer) {
      this.myAnswers=answer
      //socket.emit("submitAnswer", {pollId: this.pollId, answer: answer})
    },



      FinishedQuiz: function(){
      this.showModal = true;
      for (let i = 0; i <this.question.a.length; i++) {

        if(this.question.a[i] === this.myAnswers.answer[i]) {
          this.numbCorrectAnswers += 1;
          this.correctOrNot.push(true);

        }
      else {
          this.correctOrNot.push(false);

        }
      }
      console.log(this.numbCorrectAnswers)
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
#fullnamebox{
height: 3em;
  width: 15em;
  font-family: "Times New Roman", Times, serif,italic;

  font-size:15px;
}
#table {
  display: grid;


}
#table1{
  grid-column:1;

}
#table2{
  grid-column:2;

}
#table3{
  grid-column:3;

}
</style>
