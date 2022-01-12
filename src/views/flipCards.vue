<template>

  <head>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
  </head>
  <!--<transition name="slideLeft" :css="!swipeRight">-->

  <!--<gameCard v-for="card in gameCards" v-bind:key="card">

  </gameCard>-->

  <i id="goBack" class="fa fa-home" v-on:click="$router.push('/')"> </i>
  <div class="wrapper">
    <div class="icon facebook">
      <div class="tooltip">{{ uiLabels.language }}</div>
      <span><i><img v-on:click="switchLanguage" v-bind:src="uiLabels.flag" class="pictureFlag"></i></span>
      <!-- tog bort class="fab fa-facebook-f" -->
    </div>
  </div>
  <div v-bind:class="{infoDiv:true,infoImg1:showVar==1,infoImg2:showVar==2,infoImg3:showVar==3}" v-show="!showGame">
    <i class="fa fa-arrow-right" id="arrow" @click="nextInfoImg"></i>
    <div class="skipDiv" @click="skipInfoImg">
      <p class="skipText">{{ uiLabels.skipAll }}</p>
    </div>
    <div class="infoTitle">
      <h1>{{ uiLabels.tutorial }}</h1>
    </div>
    <div class="infoText">
      <p v-show="showVar==1">{{ uiLabels.gameInfo1 }}</p>
      <p v-show="showVar==2">{{ uiLabels.gameInfo2 }}</p>
      <p v-show="showVar==3">{{ uiLabels.gameInfo3 }}</p>
    </div>
  </div>
  <div v-show="showGame">
    <transition-group v-bind:name="transitionType">
      <gameCard v-for="(item, i) in gameCards.question"
                v-bind:question="gameCards.question[i]" v-bind:answer="gameCards.answers[i]"

                :key="item" v-bind:showCard="gameCards.showCard[i]" v-bind:doneCard="gameCards.doneCard[i]"
                :ref="'card' + i">
      </gameCard>
    </transition-group>

    <div id="wrapper29">

      <div id="congrats" v-show="gameCards.doneCard.filter(Boolean).length == gameCards.doneCard.length">
        <h2>{{ uiLabels.flipcardCongrats }} </h2>
        <div>
          <button type="submit" name="go_search" @click="this.$router.go()" class="participate">
            {{ uiLabels.playAgain }}
          </button>
          <br>
          <button type="submit" name="go_search" @click="$router.push('/')" class="participate">
            {{ uiLabels.backHome }}
          </button>
        </div>
      </div>
      <div class="centerContainer">
        <div class="aboveCenterContainer">
          <div class="barTextContainer">
            <h4 class="barText"> {{ uiLabels.antalkort }} {{
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
        <!-- förra congrats -->
      </div>
      <div class="belowCenterContainer">
        <div class="buttonsInner">
          <!--  -->
          <i id="buttonImageCross" @click="swipeLeft"
             v-bind:class="{disabledButton: gameCards.doneCard.length - gameCards.doneCard.filter(Boolean).length <= 1}"
             class="fa fa-times-circle" aria-hidden="true"></i>

          <!--<img id="buttonImageCross" @click="swipeLeft" v-bind:class="{disabledButton: gameCards.doneCard.length - gameCards.doneCard.filter(Boolean).length <= 1}"
               src="https://cdn-icons-png.flaticon.com/128/1828/1828843.png"> -->
          <div class="fill"></div>
          <div>
            <i id="buttonImageCheck" @click="swipeRight"
               v-bind:class="{disabledButton: gameCards.doneCard.length - gameCards.doneCard.filter(Boolean).length <= 0}"
               class="fa fa-check-circle" aria-hidden="true"></i>
            <!-- <img id="buttonImageCheck" @click="swipeRight" v-bind:class="{disabledButton: gameCards.doneCard.length - gameCards.doneCard.filter(Boolean).length <= 0}"
                  src="https://cdn-icons.flaticon.com/png/128/4436/premium/4436481.png?token=exp=1641553421~hmac=5ba5566c9fa51b1c3bce57a898f2f2d1"> -->
          </div>
        </div>
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
      showVar: 1,
      showGame: false,
      uiLabels: {}
    }
  }, created: function () {
    socket.on("init", (labels) => {
      this.uiLabels = labels
    })
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
    this.pollId = this.$route.params.id
    socket.on("init", (labels) => {
      this.uiLabels = labels
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
    },

    nextInfoImg: function () {
      this.showVar += 1;
      if (this.showVar == 4) {
        this.showGame = true;
      }
    }
    ,
    skipInfoImg: function () {
      this.showGame = true;
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

#wrapper29 {
  background-color: rgb(18, 54, 90);
  height: 100%;
  top: 0;
  left: 0;
  width: 100%;
  position: absolute;
  z-index: -4;
  color: rgb(249, 228, 201);
}

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
  background-color: rgb(161, 203, 65);;
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
  font-size: 5em;
  right: -10em;
  grid-column: 1;
  cursor: pointer;
  color: rgb(243, 71, 71);
}

#buttonImageCheck {
  font-size: 5em;
  right: -10em;
  grid-column: 3;
  cursor: pointer;
  position: relative;
  right: 8px;
  color: rgb(161, 203, 65);
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
  color: rgb(249, 228, 201);
}

#goBack {
  position: absolute;
  left: 1em;
  top: 1em;
  cursor: pointer;
  font-size: 2.5em;
  color: rgb(249, 228, 201);
}

.infoDiv {
  overflow: hidden;
  width: 100vw;
  height: 100vh;
  z-index: 100;
  object-fit: cover;
  background-color: white;
  z-index: 100;
  overflow: hidden;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.infoImg1 {
  background-image: url("https://live.staticflickr.com/65535/51815392132_40982a5d50_k.jpg");
}

.wrapper {
  display: inline-flex;
  position: absolute;
  right: 1.8em;
  top: 1.8em;
  cursor: pointer;
  border-radius: 50%;
  width: 2em;
  height: 2em;
}

.wrapper .icon {
  position: relative;
  background-color: #ffffff;
  border-radius: 50%;
  width: 1.2em;
  height: 1em;
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

.pictureFlag {
  border-radius: 0.5em;
  width: 2.3em;
  height: 1.6em;
  box-shadow: 4px 4px 20px -2px rgba(0, 0, 0, .35);
  z-index: 1000;
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
  min-height: 1.7em;
}

.participate:hover {
  cursor: pointer;
  transform: translateY(-2px);
}

.participate:hover:active {
  transform: translateY(10px);
  box-shadow: 0px -1px 2px 0px rgba(0, 0, 0, .35);
}

#congrats {
  position: relative;
  top: 14em;
  margin-right: 10%;
  margin-left: 10%;
}

h4 {
  font-size: 1.5em;
}

.infoImg2 {
  background-image: url("https://live.staticflickr.com/65535/51816452918_4f58487627_k.jpg");
}

.infoImg3 {
  background-image: url("https://live.staticflickr.com/65535/51815392162_113bd61a8d_k.jpg");
}

#arrow {
  position: absolute;
  bottom: 10%;
  right: 20%;
  font-size: 3em;
  color: #9D9D9D;
  cursor: pointer;
}

.skipDiv {
  position: absolute;
  bottom: 6.2%;
  left: 20%;
}

.skipText {
  cursor: pointer;
  color: #9D9D9D;
  text-decoration: underline;
  font-size: 2em;
}

.infoText {
  position: absolute;
  bottom: 25%;
  text-align: center;
  width: 100%;
}

.infoTitle {
  margin-top: 2em;
  color: #9D9D9D;
}

</style>