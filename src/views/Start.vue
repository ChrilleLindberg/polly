<template>
  <header>
    <h1>
      {{uiLabels.welcomeMessage}}
    </h1>
  </header>
  <body id="bodyID" >
    <div id="nav" v-show="isVisible==1">
      <p v-show="isVisible==1">{{uiLabels.infoText}}</p>
      <br>
      <label v-show="isVisible==1">
        <!--{{uiLabels.writeField}}-->
        <input type="text" v-model="id" @focus="switchVisibleFocus" @blur="switchVisibleOne" v-bind:placeholder="uiLabels.writeField">
      </label>
      <button @click="$router.push('/poll/'+id)" id="participate" v-show="isVisible==1"> <!-- denna knapp ska bli grön när man har skrivit in i input -->
        GO!
      <!-- <router-link v-bind:to="'/poll/'+id" tag="button">{{uiLabels.participatePoll}}</router-link> -->
      </button>
      <br>
      <button id="changeLanguage" v-on:click="switchLanguage" v-show="isVisible==1">{{uiLabels.changeLanguage}}</button>
      <button id="switchVisible" v-on:click="switchVisibleTwo" v-show="isVisible==1"> {{uiLabels.createPoll}}</button>
    </div>

    <div id="twoOptions" v-show="isVisible==2">
      <h2>
        {{uiLabels.twoOptionsText }}
      </h2>
      <button @click="$router.push('/create/'+lang)" id="create" >
        {{uiLabels.createNew}}
      </button>
      <br>
      <button id="edit" v-on:click="switchVisibleThree"> <!-- Ska öppna createsidan fast alla fält ska vara ifyllda. -->
        {{uiLabels.editExisting}}
      </button>
    </div>
    <div id="editExisting" v-show="isVisible==3">
      <p>
        {{uiLabels.editExisting}}
      </p>
      <input @focus="switchVisibleFocus" @blur="switchVisibleThree" type="text" v-model="id" v-bind:placeholder="uiLabels.writeField">
    </div>
  </body>
</template>

<script>
import io from 'socket.io-client';
const socket = io();

export default {
  name: 'Start',
  data: function () {
    return {
      uiLabels: {},
      id: "",
      lang: "en",
      isVisible: 1
    }
  },
  created: function () {
    socket.on("init", (labels) => {
      this.uiLabels = labels
    })
  },
  methods: {
    switchLanguage: function() {
      if (this.lang === "en")
        this.lang = "sv"
      else
        this.lang = "en"
      socket.emit("switchLanguage", this.lang)
    },
    switchVisibleOne: function (){
      this.isVisible = 1,
      document.body.style.backgroundColor = "white";
      document.body.style.background = "1";
    },
    switchVisibleTwo: function (){
      this.isVisible = 2
    },
    switchVisibleThree: function (){
      this.isVisible = 3
      document.body.style.backgroundColor = "white";
    },
    switchVisibleFocus: function (){
      document.body.style.backgroundColor = "lightgrey";
    }
  }
}
</script>

<style>
#changeLanguage{
  position: absolute;
  right: 1em;
  top: 1em;
}
</style>