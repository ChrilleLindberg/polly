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
  <div class="centerContainer">
    <div class="aboveCenterContainer">
      <div class="barTextContainer">
        <h4 class="barText"> Antal kort kvar: {{
            gameCards.doneCard.length - gameCards.doneCard.filter(Boolean).length
          }} </h4>
      </div>
      <div class="barContainer">
        <div v-show="gameCards.doneCard.filter(Boolean).length == gameCards.doneCard.length">
          Du har klarat alla ord!
        </div>
        <div class="progressBar">
          <div class="progressBarGreen"
               v-bind:style="{width: (gameCards.doneCard.filter(Boolean).length / gameCards.doneCard.length)*100 + '%'}">
          </div>
        </div>
      </div>
    </div>
    <div class="belowCenterContainer">
      <div class="buttons">
        <button @click="swipeLeft"
                v-bind:disabled="gameCards.doneCard.length - gameCards.doneCard.filter(Boolean).length <= 1"
                >
          <img id="buttonImage"
              src="https://cdn.vox-cdn.com/thumbor/nK-7VljWiIL9fCXN8V6eFXTYauc=/36x0:664x353/1600x900/cdn.vox-cdn.com/uploads/chorus_image/image/51616429/ios-10-shrug-emoji.0.png">
        </button>
        <button @click="swipeRight"
                v-bind:disabled="gameCards.doneCard.length - gameCards.doneCard.filter(Boolean).length <= 0">
          <img id="buttonImage"
               src="https://cdn.vox-cdn.com/thumbor/nK-7VljWiIL9fCXN8V6eFXTYauc=/36x0:664x353/1600x900/cdn.vox-cdn.com/uploads/chorus_image/image/51616429/ios-10-shrug-emoji.0.png">
        </button>
      </div>
    </div>
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
      transitionType: "",
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
  height: 2em;
  width: 100%;
  display: flex;
  justify-content: center;
}

.centerContainer {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: -1;
}

.aboveCenterContainer {
  position: relative;
  bottom: 240px;
}

.belowCenterContainer {
  position: relative;
  top: 220px;
}

.barTextContainer {
  margin-top: 10%;
  margin-bottom: 0.2em;
}

.progressBar {
  position: absolute;
  background-color: red;
  height: 0.2em;
  width: 10em;
  border-radius: 2em;
  border-style: solid;
  border-color: gray;
  border-width: 0.1em;
}

.progressBarGreen {
  height: 100%;
  background-color: green;
  transition: width 2s ease-in-out;
  border-radius: 2em;

}

.buttons {
  width: 100%;
  position: absolute;
  bottom: 15%;
}

button {
  width: 2em;
  height: 2em;
  overflow: hidden;
}

#buttonImage {
  height: 1em;
  right: -10em;
}

/*This block (ends here) is merely styling for the flip card, and is NOT an essential part of the flip code */


.slideRight-enter-active,
.slideLeft-enter-active {
  transition: transform 1s;
  transition-delay: 0.2s;
}

.slideRight-leave-active,
.slideLeft-leave-active {
  z-index: 10;
  transition: transform 1s;
}

.slideRight-leave-to {
  transform: translateY(-50%) translateX(20vw) rotateZ(45deg);
}

.slideLeft-leave-to {
  z-index: 10;
  transform: translateY(-50%) translateX(-100vw) rotate(-45deg);
}

.slideRight-enter-from,
.slideLeft-enter-from {
  transform-origin: -25% -25%;
  transform: scale(0.75) translate(-50%, -50%);
}

.slideRight-enter-to,
.slideLeft-enter-to {
  transform-origin: -25% -25%;
  transform: scale(1) translate(-50%, -50%);
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