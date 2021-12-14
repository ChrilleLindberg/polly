<template>
  <header>
    <h1>
      {{ uiLabels.welcomeMessage }}
    </h1>

  </header>

  <body id="bodyID" >
  <div class="wrapper">
    <div class="icon facebook">
      <div class="tooltip">{{uiLabels.language}}</div>
      <span><i class="fab fa-facebook-f"><img v-on:click="switchLanguage" v-bind:src="uiLabels.flag"  class="pictureFlag"></i></span>
    </div>
  </div>
<div style="width:2em;height:2em ">
  <img id="goBack" v-show="isVisible==2 || isVisible==3" v-on:click="switchVisibleOne" src="https://as1.ftcdn.net/v2/jpg/03/66/63/52/500_F_366635299_S1MlOWCcUVFPwgtxznb89r56tvyBBBVU.jpg" alt="{{uiLabels.goBack}}" style="width: 3em; height: 3em" >
</div>
    <div id="nav" v-show="isVisible==1">
      <p v-show="isVisible==1">{{uiLabels.infoText}}</p>
      <ul id="growing-search-freebie">
        <li>
          <div class="growing-search">
            <div class="input">
              <input type="text" name="search" id="inputPollId" v-model="id"
                     v-bind:placeholder="uiLabels.writeField" @input="checkPollId" @keydown.space.prevent/>
            </div><!-- Space hack -->
          </div>
          <button type="submit" name="go_search" @click="$router.push('/poll/'+id) ; console.log('halla')" id="participate" v-show="isVisible==1" v-bind:disabled="!pollExists">
            GO!
          </button>
        </li>
      </ul>
      <br>

    <br>
    <button class="buttonNice" v-on:click="switchVisibleTwo" v-show="isVisible==1"> {{ uiLabels.createPoll }}</button>
  </div>

  <div id="twoOptions" v-show="isVisible==2">
    <p>
      {{ uiLabels.twoOptionsText }}
    </p>
    <button @click="$router.push('/create/'+ 'new/' + lang)" id="create">
      {{ uiLabels.createNew }}
    </button>
    <br>
    <button id="edit" v-on:click="switchVisibleThree"> <!-- Ska öppna createsidan fast alla fält ska vara ifyllda. -->
      {{ uiLabels.editExisting }}
    </button>
  </div>
  <div id="editExisting" v-show="isVisible==3">
    <p>
      {{ uiLabels.editExisting }}
    </p>
    <input @focus="switchVisibleFocus" @keyup.enter="$router.push('/create/'+ idEdit + '/' + lang)"
           @blur="switchVisibleThree" type="text" v-model="idEdit" v-bind:placeholder="uiLabels.writeField"
           @input="checkPollId2" @keydown.space.prevent>
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
      this.$router.push('/create/' + this.idEdit + '/' + this.lang)
      socket.emit("sendGlossary", this.idEdit)
    }


  }
}
</script>

<style>

header {
  font-size: 2em;
  font-family: "beirut ";
  margin-top: 2em;
}

body {
  background-color: #FBE4C9;
  color: #EF8584;
  font-family: Helvetica, Arial, sans-serif;
  font-size: 1.3em;
}

#goBack {
  position: absolute;
  left: 1em;
  top: 1em;
  mix-blend-mode: multiply;
}
#goBack:hover{
  cursor:pointer;
}



ul#growing-search-freebie {
  display: table;
  list-style: none;
  margin: 1em auto 0 auto;
  padding: 0;
}

ul#growing-search-freebie > li {
  float: left;
  margin-right: 1em;
  margin-bottom: 1em;
  padding: 0em 0em;
}

ul#growing-search-freebie > li:last-child {
  margin-right: 0;
}

ul#growing-search-freebie > li > span {
  margin-bottom: 1em;
}

.growing-search {
  padding: 0.1em 0.1em 0.1em 0.3em;
  border-radius: 5px;
  background: #fff;
}

.growing-search div {
  display: inline-block;
  font-size: 20px;
}

.growing-search .input input {
  margin-right: 0;
  border: none;
  font-size: inherit;
  transition: width 200ms;
  padding-top: 0.5em;
  padding-left: 0.5em;
  padding-bottom: 0.5em;
  width: 8em;
  color: #aaa;
  border-bottom: 1px solid #eee;
}

.growing-search .input input:focus {
  width: 16em;
}

.growing-search .submit button {
  margin-left: 0;
  border: none;
  font-size: 1.15em;
  color: #aaa;
  background-color: #fff;
  padding-top: 0.1em;
  padding-bottom: 0.1em;
  transition: color 200ms;
}


.growing-search .input input:hover, .growing-search .submit button:hover {
  cursor: text;
}

.growing-search .input input:focus, .growing-search .submit button:focus {
  outline: none;
}

.growing-search .submit button:hover {
  color: #3498db;
}

.pictureFlag{
  border-radius: 50%;
  width:1.2em;
  height:1em;
  box-shadow: 0 10px 10px rgba(0, 0, 0, 0.1);


}

.wrapper {
  display: inline-flex;
  position: absolute;
  right: 1em;
  top: 1.3em;
  cursor: pointer;
  border-radius: 50%;
  width:2em;
  height:2em;

}

.wrapper .icon {

  position: relative;

  background-color: #ffffff;
  border-radius: 50%;
  width:1.2em;
  height:1em;
  display: flex;

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
  bottom: -3px;
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
.buttonNice{

  width: 11em;
  height: 3em;

  color:#EF8584;
  font-size: 1em;
  font-weight: 800;
  border-radius: 50%;
  border-style: solid;
  border-color:#EF8584;
  background-color: white;
  cursor: pointer;
}
.buttonNice:hover{

  color:white;

  border-style: solid;
  border-color:#EF8584;
  background-color: #EF8584;
}
.buttonNice:active{

  color:white;

  border-style: solid;
  border-color:#EF8584;
  background-color: #EF8584;

}
</style>