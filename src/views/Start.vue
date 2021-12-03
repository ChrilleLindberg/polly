<template>
  <header>
    <h1>
      {{uiLabels.welcomeMessage}}
    </h1>
  </header>
  <body>
    <div id="nav" v-show="isVisible">
      <p>{{uiLabels.infoText}}</p>
      <br>
      <label v-on:click="hej">
        <!--{{uiLabels.writeField}}-->
        <input type="text" v-model="id" v-bind:placeholder="uiLabels.writeField">
      </label>
      <button @click="$router.push('/poll/'+id)" id="participate" > <!-- denna knapp ska bli grön när man har skrivit in i input -->
        GO!
      <!-- <router-link v-bind:to="'/poll/'+id" tag="button">{{uiLabels.participatePoll}}</router-link> -->
      </button>
      <br>
      <button id="changeLanguage" v-on:click="switchLanguage">{{uiLabels.changeLanguage}}</button>
      <button id="switchVisible" v-on:click="switchVisible"> {{uiLabels.createPoll}}</button>
    </div>

    <div id="twoOptions" v-show="!isVisible">
      <h2>
        {{uiLabels.twoOptionsText }}
      </h2>
      <button @click="$router.push('/create/'+lang)" id="create" >
        {{uiLabels.createNew}}
      </button>
      <br>
      <button id="edit"> <!-- Ska öppna createsidan fast alla fält ska vara ifyllda. -->
        {{uiLabels.editExisting}}
      </button>
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
      isVisible: true
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
    switchVisible: function (){
      this.isVisible= false
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