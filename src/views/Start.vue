<template>
  <header>
    <h1>
      {{uiLabels.welcomeMessage}}
    </h1>
  </header>
  <body id="bodyID" >
   <button id="changeLanguage" v-on:click="switchLanguage">{{uiLabels.changeLanguage}}
     <img src="{{uiLabels.flag}}" style="height: 2em;width: 3em">
   </button>
   <!-- svenska flaggan:https://cdn.countryflags.com/thumbs/sweden/flag-400.png
        engelska flaggan: https://image.freepik.com/free-vector/illustration-uk-flag_53876-18166.jpg
        -->

   <img id="goBack" v-show="isVisible==2 || isVisible==3" v-on:click="switchVisibleOne" src="https://as1.ftcdn.net/v2/jpg/03/66/63/52/500_F_366635299_S1MlOWCcUVFPwgtxznb89r56tvyBBBVU.jpg" alt="{{uiLabels.goBack}}" style="width: 3em; height: 3em" >
    <div id="nav" v-show="isVisible==1">
      <p v-show="isVisible==1">{{uiLabels.infoText}}</p>
      <br>
      <label v-show="isVisible==1">
        <!--{{uiLabels.writeField}}-->
        <input type="text" id="inputPollId" v-model="id" @focus="switchVisibleFocus" @blur="switchVisibleOne" v-bind:placeholder="uiLabels.writeField" @input="checkPollId" @keydown.space.prevent>
      </label>
      <button @click="$router.push('/poll/'+id)" id="participate" v-show="isVisible==1" v-bind:disabled="!pollExists"> <!-- denna knapp ska bli grön när man har skrivit in i input -->
        GO!
      <!-- <router-link v-bind:to="'/poll/'+id" tag="button">{{uiLabels.participatePoll}}</router-link> -->
      </button>
      <br>
      <button id="switchVisible" v-on:click="switchVisibleTwo" v-show="isVisible==1"> {{uiLabels.createPoll}}</button>
    </div>

    <div id="twoOptions" v-show="isVisible==2">
      <h2>
        {{uiLabels.twoOptionsText }}
      </h2>
      <button @click="$router.push('/create/'+ 'new/' + lang)" id="create" >
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
      <input @focus="switchVisibleFocus" @keyup.enter="$router.push('/create/'+ idEdit + '/' + lang)" @blur="switchVisibleThree" type="text" v-model="idEdit" v-bind:placeholder="uiLabels.writeField" @input="checkPollId2" @keydown.space.prevent>
      <button @click="editExistingGo" v-bind:disabled="!editExists">
        GO!
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
      idEdit: "",
      lang: "en",
      isVisible: 1,
      pollIds: [],
      pollExists: false,
      editExists: false,
    }
  },
  created: function () {
    socket.on("init", (labels) => {
      this.uiLabels = labels
    })
    socket.on("checkPollId", (polls) =>
        this.polls = polls)
  },
  methods: {
    switchLanguage: function () {
      if (this.lang === "en")
        this.lang = "sv"
      else
        this.lang = "en"
      socket.emit("switchLanguage", this.lang)
    },
    switchVisibleOne: function () {
      this.isVisible = 1,
          document.body.style.backgroundColor = "white";
      document.body.style.background = "1";
    },
    switchVisibleTwo: function () {
      this.isVisible = 2
    },
    switchVisibleThree: function () {
      this.isVisible = 3
      document.body.style.backgroundColor = "white";
    },
    switchVisibleFocus: function () {
      document.body.style.backgroundColor = "lightgrey";
    },
    checkPollId: function () {
      socket.emit("sendPollId", this.id)
      socket.on("checkPollId", (pollExists) =>
          this.pollExists = pollExists)
    },
    checkPollId2: function () {
      socket.emit("sendPollId", this.idEdit)
      socket.on("checkPollId", (editExists) =>
          this.editExists = editExists)
    },
    editExistingGo: function () {
      this.$router.push('/create/'+ this.idEdit + '/' + this.lang)
      socket.emit("sendGlossary",this.idEdit)
}
  }
}
</script>

<style>
#goBack{
  position: absolute;
  left: 1em;
  top: 1em;
}

#changeLanguage{
  position: absolute;
  right: 1em;
  top: 1em;
}

</style>