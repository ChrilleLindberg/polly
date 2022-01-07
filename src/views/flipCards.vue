<template>


  <!--<transition name="slideLeft" :css="!swipeRight">-->

  <!--<gameCard v-for="card in gameCards" v-bind:key="card">

  </gameCard>-->

  <transition-group v-bind:name="transitionType">
    <gameCard v-for="(item, i) in gameCards.question"
              v-bind:question="gameCards.question[i]" v-bind:answer="gameCards.answers[i]"
              :key="item" v-bind:showCard="gameCards.showCard[i]" v-bind:doneCard="gameCards.doneCard[i]"
              :ref="'card' + i">
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
        <div class="progressBar">
          <div class="progressBarGreen"
               v-bind:style="{width: (gameCards.doneCard.filter(Boolean).length / gameCards.doneCard.length)*100 + '%'}">
          </div>
        </div>
      </div>
    </div>
    <div v-show="gameCards.doneCard.filter(Boolean).length == gameCards.doneCard.length">
      Grattis! Du har klarat alla ord!
      <div>
        <button @click="this.$router.go()">Spela igen</button>
      </div>
    </div>
  </div>
  <div class="belowCenterContainer">
    <div class="buttonsInner">
      <!--  -->
      <img id="buttonImageCross" @click="swipeLeft" v-bind:class="{disabledButton: gameCards.doneCard.length - gameCards.doneCard.filter(Boolean).length <= 1}"
           src="https://cdn-icons-png.flaticon.com/128/1828/1828843.png">
      <div class="fill"></div>
      <div>
        <img id="buttonImageCheck" @click="swipeRight" v-bind:class="{disabledButton: gameCards.doneCard.length - gameCards.doneCard.filter(Boolean).length <= 0}"
             src="https://cdn-icons.flaticon.com/png/128/4436/premium/4436481.png?token=exp=1641553421~hmac=5ba5566c9fa51b1c3bce57a898f2f2d1">
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
        doneCard: [false]
      },
      j: Number,
      transitionType: "",
      card: ["card1", "card2", "card3", "card4"]
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

      this.$refs.card0.setTheCard()
      this.$refs.card1.setTheCard()
      this.$refs.card2.setTheCard()
      this.$refs.card3.setTheCard()

      console.log("left j end", this.j)

    }
    ,
    swipeRight: function () {
      this.transitionType = "slideRight";
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

.barTextContainer {
  margin-top: 10%;
  margin-bottom: 0.2em;
}

.progressBar {
  position: absolute;
  background-color: pink;
  height: 0.2em;
  width: 10em;
  border-radius: 2em;
  border-style: solid;
  border-color: black;
  border-width: 0.1em;
}

.progressBarGreen {
  height: 100%;
  background-color: green;
  transition: width 2s ease-in-out;
  border-radius: 2em;

}

.belowCenterContainer {
  position: absolute;
  width: 50%;
  transform: translateX(50%);
  bottom: 10%;
  display: flex;
  justify-content: center;
}

.buttonsInner {
  display: flex;
  justify-content: center;
}

.fill {
  width: 2em;
  position: relative;
}

#buttonImageCross {
  height: 5em;
  right: -10em;
  grid-column: 1;
  cursor: pointer;
}

#buttonImageCheck {
  height: 5em;
  right: -10em;
  grid-column: 3;
  cursor: pointer;
  position: relative;
  right: 8px;
}

#buttonImageCheck:hover, #buttonImageCross:hover {
  transform: scale(0.95);
}

.disabledButton {
  opacity: 0.5;
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
  transform: translateY(-50%) translateX(100vw) rotateZ(45deg);
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