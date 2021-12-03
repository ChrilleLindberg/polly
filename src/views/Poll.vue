<template>
  <body>
  <div>
    {{pollId}}
    <Question v-bind:question="question"
              v-on:answer="submitAnswer"/>
  </div>
  {{question.a}}
  {{myAnswers}}
  {{correctOrNot}}

  <button v-on:click="FinishedQuiz">
    Submit Quiz

  </button>
  </body>
</template>


<script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.4.0/dist/confetti.browser.min.js">
// @ is an alias to /src
import Question from '@/components/Question.vue';

import io from 'socket.io-client';
const socket = io();

export default {
  name: 'Poll',
  components: {
    Question
  },



  data: function () {
    return {
      question: {
        q: "",
        a: []

      },
      pollId: "inactive poll",
      numbCorrectAnswers: 0,
      myAnswers: ["hey","car","hus"],
      correctOrNot: []
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

    submitAnswer: function (answer) {
      socket.emit("submitAnswer", {pollId: this.pollId, answer: answer})
    },


      FinishedQuiz: function(){
      for (let i = 0; i <this.question.a.length; i++) {
        console.log(this.question.a[i])
        if(this.question.a[i] === this.myAnswers[i]) {
          console.log(this.question.a[i])
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

</style>
