<template>


  <!--<transition name="slideLeft" :css="!swipeRight">-->

  <!--<gameCard v-for="card in gameCards" v-bind:key="card">

  </gameCard>-->
  <transition-group v-bind:name="transitionType">
    <gameCard v-for="(item, i) in gameCards.question"
              v-bind:question="gameCards.question[i]" v-bind:answer="gameCards.answers[i]"
              :key="item" v-bind:showCard="gameCards.showCard[i]" v-bind:doneCard="gameCards.doneCard[i]">
    </gameCard>
  </transition-group>

  <!--</transition>-->
  <div class="barContainer">
    <p>
      Antal kort kvar: {{ gameCards.doneCard.length - gameCards.doneCard.filter(Boolean).length }}
    </p>
    <div v-show="gameCards.doneCard.filter(Boolean).length == gameCards.doneCard.length">
      Du har klarat alla ord!
    </div>

    <div class="progressBar">
      <div class="progressBarGreen"
           v-bind:style="{width: (gameCards.doneCard.filter(Boolean).length / gameCards.doneCard.length)*100 + '%'}">
      </div>
    </div>


  </div>
  <div class="buttons">
    <button @click="swipeLeft"
            v-bind:disabled="gameCards.doneCard.length - gameCards.doneCard.filter(Boolean).length == 1">
      Nej
    </button>
    <button @click="swipeRight">
      JA
    </button>
  </div>
</template>

<script>
import gameCard from "../components/gameCard";

import io from 'socket.io-client';

const socket = io();

export default {
  name: "flipCards",
  components: {
    gameCard
  },

  el: '#app',
  data: function () {
    return {
      gameCards: {
        question: [""],
        answers: [""],
        showCard: [],
        doneCard: []
      },
      j: Number,
      transitionType: ""
    }
  }, created: function () {
    this.pollId = this.$route.params.id
    socket.emit("getPollInfo", this.pollId)
    socket.on('getPollInfo2', (pollInfo) => {
      this.gameCards.question = pollInfo.questions[0].q
      this.gameCards.answers = pollInfo.questions[0].a
      this.j = this.gameCards.question.length - 1;
      this.gameCards.doneCard = new Array(this.gameCards.question.length).fill(false);
      this.gameCards.showCard = new Array(this.gameCards.question.length).fill(false);
      this.gameCards.showCard[this.gameCards.question.length - 1] = true;
    })
  },
  methods: {
    swipeLeft: function () {
      this.transitionType = "slideLeft";                  //skulle vi kunna använda doneCard här istället?
      this.gameCards.showCard[this.j] = false;
      this.j--;

      if (this.j == -1) {
        this.j = this.gameCards.question.length - 1;
        console.log("left if length", this.gameCards.question.length - 1)
      }
      while (this.gameCards.doneCard[this.j] == true) {
        if (this.j == 0) {
          for (let i = this.gameCards.question.length; i > 0; i--)
            if (this.gameCards.doneCard[i] == false) {
              this.j = i + 1;
              break;
            }
        }
        this.j--;
      }
      this.gameCards.showCard[this.j] = true;
      console.log("left j end", this.j)

    }
    ,
    swipeRight: function () {
      this.transitionType = "slideRight";                    //skulle vi kunna använda doneCard här istället?
      this.gameCards.showCard[this.j] = false;
      this.gameCards.doneCard[this.j] = true;
      this.j--;

      if (this.j == -1) {
        this.j = this.gameCards.question.length - 1;
      }
      while (this.gameCards.doneCard[this.j] == true) {
        if (this.j == 0) {
          for (let i = this.gameCards.question.length; i > 0; i--)
            if (this.gameCards.doneCard[i] == false) {
              this.j = i + 1;
              break;
            }
        }
        this.j--;
      }
      this.gameCards.showCard[this.j] = true;
    }
  }
}


</script>

<style scoped>

.barContainer {
  height: 10em;
  width: 100%;
  display: flex;
  justify-content: center;
}

.progressBar {
  position: absolute;
  top: 15%;
  background-color: red;
  height: 1em;
  width: 40%;
  position: center;
  vertical-align: center;
}

.progressBarGreen {
  height: 100%;
  background-color: green;
  transition: width 2s ease-in-out;
}

.buttons {
  left:0;
  width: 100%;
  position: absolute;
  bottom: 15%;
  display: flex;
  justify-content: center;
}

/*This block (ends here) is merely styling for the flip card, and is NOT an essential part of the flip code */


.slideRight-enter-active,
.slideRight-leave-active {
  transition: transform 1s;
}

.slideRight-enter,
.slideRight-leave-to {
  transform: translateY(-50%) translateX(100vw) rotateZ(45deg);
}

.slideLeft-enter-active,
.slideLeft-leave-active {
  transition: transform 1s;
}

.slideLeft-enter,
.slideLeft-leave-to {
  transform: translateY(-50%) translateX(-100vw) rotate(-45deg);

}

/*
    Auther: Abdelrhman Said
*/

@import url("https://fonts.googleapis.com/css2?family=Poppins&display=swap");


html,
body {
  display: grid;
  height: 100%;
  width: 100%;
  font-family: "Poppins", sans-serif;
  place-items: center;
  background: linear-gradient(315deg, #ffffff, #d7e1ec);
}


</style>