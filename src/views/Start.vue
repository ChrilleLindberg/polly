<template>
  <header>
    <h1>
      {{uiLabels.welcomeMessage}}
    </h1>
  </header>
  <body>
    <div id="nav">
      <p>{{uiLabels.infoText}}</p>
      <br>
      <label v-on:click="hej">
        <!--{{uiLabels.writeField}}-->
        <input type="text" v-model="id" v-bind:placeholder="uiLabels.writeField">

      </label>
      <router-link v-bind:to="'/poll/'+id" tag="button">{{uiLabels.participatePoll}}</router-link>
      <br>
      <button id="changeLanguage" v-on:click="switchLanguage">{{uiLabels.changeLanguage}}</button>
      <router-link v-bind:to="'/create/'+lang">{{uiLabels.createPoll}}</router-link>
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
      lang: "en"
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
    hej: function (){
      console.log("hej")
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