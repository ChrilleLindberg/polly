<template>
  <head>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
  </head>
  <body  v-bind:class="[{'container': !hideCon}, {'nextPage': hideCon}]" >
  <header id="movedown">
    <h1>
      {{ uiLabels.welcomeMessage }}
    </h1>
  </header>
  <div type="submit" class="wrapper">
    <div class="icon facebook">
      <div class="tooltip">{{uiLabels.language}}</div>
      <span><i><img v-on:click="switchLanguage" v-bind:src="uiLabels.flag"  class="pictureFlag"></i></span> <!-- tog bort class="fab fa-facebook-f" -->
    </div>
  </div>
  <div style="width:2em;height:2em ">
    <i id="goBack" class="fa fa-home" v-show="isVisible==2 || isVisible==3 || isVisible==4 || isVisible==5" v-on:click="switchVisibleOne" > </i>
  </div>
    <div id="nav" v-show="isVisible==1">
      <p v-show="isVisible==1">{{uiLabels.infoText}}</p>
      <ul class="growing-search-freebie">
        <li>
          <div class="growing-search">
            <div class="inputpollID">
              <input autocomplete="off" type="text" name="search" id="inputPollId" v-model="id"
                     v-bind:placeholder="uiLabels.writeField" @input="checkPollId" @keydown.space.prevent/>
            </div><!-- Space hack -->
          </div>
          <button type="submit" name="go_search" @click="switchVisibleFive" class= "participate" v-show="isVisible==1" v-bind:disabled="!pollExists">
            GO!
          </button>
        </li>
      </ul>
      <p v-show="isVisible==1">{{uiLabels.createText}}</p>
  </div>
  <div id="editExisting" v-show="isVisible==3">
    <p>
      {{ uiLabels.editExisting }}
    </p>
    <ul class="growing-search-freebie">
      <li>
        <div class="growing-search">
          <div class="inputpollID">
            <input autocomplete="off" type="text" name="search" class="inputPollId" v-model="idEdit"
                   v-bind:placeholder="uiLabels.writeField" @input="checkPollId2" @keydown.space.prevent @keyup.enter="pressEnter"/>
          </div><!-- Space hack -->
        </div>
        <button type="submit" name="go_search" @click="editExistingGo" class="participate" v-bind:disabled="!editExists">
          GO!
        </button>
      </li>
    </ul>
  </div>

  <div id="showResult" v-show="isVisible==4">
    <p>
      {{ uiLabels.showResult}}
    </p>
    <ul class="growing-search-freebie">
      <li>
        <div class="growing-search">
          <div class="inputpollID">
            <input autocomplete="off" type="text" name="search" class="inputPollId" v-model="idResult"
                   v-bind:placeholder="uiLabels.writeField" @input="checkPollId3" @keydown.space.prevent @keyup.enter="pressEnter"/>
          </div><!-- Space hack -->
        </div>
        <button type="submit" name="go_search" @click="$router.push('/result/'+idResult)" class="participate" v-bind:disabled="!resultExists">
          GO!
        </button>
      </li>
    </ul>
  </div>

  <div id="playMode" v-show="isVisible==5">
    <p>
      {{ uiLabels.gamemode }}
    </p>
    <ul class="growing-search-freebie">
      <li>
        <button type="submit" name="go_search" @click="$router.push('/flipcards/'+id)" class="participate" >
          {{ uiLabels.flipcards }}
        </button>
        <br>
        <button type="submit" name="go_search" @click="$router.push('/poll/'+id)" class="participate">
          {{ uiLabels.glossary }}
        </button>
      </li>
    </ul>
  </div>
  <nav class="dropMenu" id="CreatorOptionButton" v-show="isVisible != 3 && isVisible != 4 && isVisible !=5">
    <h2><i class="fa fa-bars" aria-hidden="true"></i> &nbsp; Creator Option</h2>
    <input id="toggle" type="checkbox" checked>
    <ul class="startMenu">
      <li id="menuItem" @click="$router.push('/create/'+ 'new/' + lang)">{{ uiLabels.createNew }}</li>
      <li id="menuItem" v-on:click="switchVisibleThree">{{ uiLabels.editExisting }}</li>
      <li id="menuItem" v-on:click="switchVisibleFour">{{ uiLabels.showResult }}</li>
    </ul>
  </nav>

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
      idResult:"",
      lang: "en",
      isVisible: 1,
      pollIds: [],
      pollExists: false,
      editExists: false,
      resultExists: false,
      hideCon:false
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
      this.isVisible = 1;

      this.hideCon=false;
    },
    switchVisibleTwo: function () {
      this.isVisible = 2;
      this.hideCon=true;
    },
    switchVisibleThree: function () {
      this.isVisible = 3;
      this.hideCon=true;
    },
    switchVisibleFour: function () {
      this.isVisible = 4;
      this.hideCon=true;
    },
    switchVisibleFive: function () {
      this.isVisible = 5;
      this.hideCon=true;
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
    checkPollId3: function () {
      socket.emit("sendPollId", this.idResult)
      socket.on("checkPollId", (resultExists) =>
          this.resultExists = resultExists)
    },
    editExistingGo: function () {
      this.$router.push('/create/' + this.idEdit + '/' + this.lang)
      socket.emit("sendGlossary", this.idEdit)
    },
    pressEnter: function () {
      if (this.editExists && this.isVisible==3) {
        this.$router.push('/create/'+ this.idEdit + '/' + this.lang)
      }
      if (this.pollExists && this.isVisible==1) {
        this.$router.push('/poll/'+ this.id )
      }
      if (this.resultExists && this.isVisible==4) {
        this.$router.push('/result/'+ this.idResult)
      }

    },
  }
}
</script>
<style scoped>

header {
  font-size: 2em;
  font-family: "beirut ";
  user-select: none;
}

body {
  font-family: Helvetica, Arial, sans-serif;
  font-size: 1em;

}

#goBack {
  position: absolute;
  left: 1em;
  top: 1em;
  cursor:pointer;
  font-size: 2.5em;

}

ul.growing-search-freebie {
  display: table;
  list-style: none;
  margin: 1em auto 0 auto;
  padding: 0;
}

ul.growing-search-freebie > li {
  float: left;
  margin-right: 1em;
  margin-bottom: 1em;
  padding: 0em 0em;
}

ul.growing-search-freebie > li:last-child {
  margin-right: 0;
}

ul.growing-search-freebie > li > span {
  margin-bottom: 1em;
}

.growing-search div {
  display: inline-block;
  font-size: 20px;
  padding: 0.1em 0.5em 0.1em 0.5em;
  border-radius: 5px;
  background: #fff;
  margin-right: 0.5em;
}

.growing-search .inputpollID input {
  margin-right: 0;
  border: none;
  font-size: inherit;
  transition: width 200ms;
  padding-top: 0.5em;
  padding-left: 0.5em;
  padding-bottom: 0.2em;
  margin-bottom: 0.2em;
  width: 8em;
  color: black;
  border-bottom: 1.5px solid  gray;
}

.growing-search .inputpollID input:focus {
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
.growing-search .inputpollID input:hover, .growing-search .submit button:hover {
  cursor: text;
}

.growing-search .inputpollID input:focus, .growing-search .submit button:focus {
  outline: none;
}

input:focus::placeholder {
  color: transparent;
}
.pictureFlag{
  border-radius: 0.5em;
  width:2.3em;
  height:1.6em;
  box-shadow: 4px 4px 20px -2px rgba(0,0,0,.35);
}
.wrapper {
  display: inline-flex;
  position: absolute;
  right: 1.8em;
  top: 1.8em;
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
.participate{
  position:static;
  background-color: rgb(16,111,103);


  color: rgb(249,228,201);
  box-shadow: 4px 4px 20px -2px rgba(0,0,0,.35);
  font-size: 2em;
  margin-left: 0;
  margin-bottom: 0.2em;
  margin-top: 0.5em;
  padding:0em 1em 0em 1em;
  display:inline-block;
  font-weight: 100;
  border-radius: 0.5em;
  box-sizing: border-box;
  border-style: solid;
  border-width: thin;
  text-decoration:none;
  text-align:center;
  transition: all 0.2s;
  cursor: default;
  height: 1.7em;

}
.participate:disabled{
  background-color: lightgray;
  color: gray! important;
  cursor: default !important;
  height: 1.7em;
  padding-left: 1em;
  padding-right: 1em;
  margin-top: 0.5em;
  margin-bottom: 0.2em;
  margin-left: 0;
  border-radius: 0.5em;
  border-style: none;
  border-width: 0.2em;
  font-weight: bold;
}

.participate:disabled {
  border-radius: 0.5em;
  background-color: lightgray;
  color: #666666;
  border-style: solid;
  border-width: thin;
  font-weight: initial;

}
.participate:disabled:hover{
  transform: translateY(0px);
}
.participate:hover{
  cursor:pointer;
  transform: translateY(-2px);

}
.participate:hover:active {
  transform: translateY(10px);
  box-shadow: 0px -1px 2px 0px rgba(0,0,0,.35);
}


#movedown{
  margin-top: 3em;
  margin-bottom: -2em;
}
nav {
  margin: auto;
  margin-top: -3em;
  position: relative;
  width: 15em;
  height: 200px;
}
nav h2 {
  border-radius: 0.5em;
  position: relative;
  border-style: solid;
  border-width: thin;
  height: 40px;
  font-weight: 200;
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  box-shadow: 4px 4px 20px -2px rgba(0,0,0,.35);
  transition: all .4s;
}

nav:hover h2{
  transform: translateY(-2px);
  box-shadow: 2px 2px 5px -1px rgba(0,0,0,.35);
}
nav:hover:active h2{
  transform: translateY(10px);
  box-shadow: 0px -1px 2px 0px rgba(0,0,0,.35);
}

.dropMenu input{
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  z-index: 1;
  opacity: 0;
  cursor: pointer;
  height: 40px;
  border-radius: 0.5em;
}

#toggle:checked ~ul {
  height: 0%;
}

nav ul.startMenu {
  padding-left: 0;
  padding-top: 0;
  margin-top: 0;
  list-style: none;
  overflow: hidden;
  text-align: right;
  margin-bottom: 22px;
  text-align: center;
  transition: all .4s ease-out;
  height: 99%;

}
nav ul.startMenu li#menuItem{
  border-radius: 0.5em;
  border-style: solid;
  border-width: thin;
  position: relative;
  display: inline-block;
  line-height: 1.5;
  width: 95%;
  margin-bottom: 5px;
  transition: background 3s;
  box-shadow: 2px 2px 10px -2px rgba(0,0,0,.35);
}

nav ul.startMenu li#menuItem:hover {
  cursor: pointer;
  box-shadow: 2px 2px 5px -1px rgba(0,0,0,.55);
  transition: background 3s;

}

nav ul.startMenu a {
  display: block;
  text-transform: lowercase;
  font-weight: 200;
  text-decoration: none;
  transition: color .3s;
}

.container{
  width: 100%;
  height: 100%;
  position: absolute;
  margin: 0px!important;
  top: 0em;
  left: 0em;
  animation-name: animate;
  animation-direction: alternate;
  animation-duration: 44s;
  animation-fill-mode: forwards;
  animation-iteration-count: infinite;
  animation-play-state: running;
  /*animation-timing-function: ease-in-out;*/
  background-size: 3em;
  background-position: top 2.5em left 2.5em;
  background-repeat: no-repeat;
  overflow-y: scroll;
  overflow-x: hidden;
}

.container::-webkit-scrollbar{
  display: none;
}

.nextPage{
  width: 100%;
  height: 100%;
  position: absolute;
  margin: 0px!important;
  top: 0em;
  left: 0em;
  background-image: none;
  color: rgb(18,54,90);
  background-color: rgb(249,228,201);
}

@keyframes animate{
  0%
  {
    background-color: rgb(236,87,46);
    color: rgb(255,238,235);
    background-image:url(/eye/eyeLightPink.svg);
  }
  9.71%{
    transform: scale(1,1);}
  11.1%{
    background-color: rgb(236,87,46);
    color: rgb(255,238,235);
    background-image:url(/eye/eyeLightPink.svg);
  }
  11.11%{
    background-color: rgb(18,54,90);
    color: rgb(249,228,201);
    background-image:url(/eye/eyeYellow.svg);
    transform: scale(1.01,1.01);}
  12%{
    transform: scale(1,1);
  }
  20.82%{
  transform: scale(1,1);
  }
  22.21%{
    background-color: rgb(18,54,90);
    color: rgb(249,228,201);
    background-image:url(/eye/eyeYellow.svg);
  }
  22.22%{
    background-color: rgb(255,238,235);
    color: rgb(254,70,21);
    background-image:url(/eye/eyeRed.svg);
    transform: scale(1.01,1.01);
  }
  23.1%{
  transform: scale(1,1);
  }
  31.93%{
  transform: scale(1,1);
  }
  33.32%{
    background-color: rgb(255,238,235);
    color: rgb(254,70,21);
    background-image:url(/eye/eyeRed.svg);
  }
  33.33%{
    background-color: rgb(251,228,201);
    color: rgb(239,134,132);
    background-image:url(/eye/eyePinkRed.svg);
    transform: scale(1.01,1.01);
  }
34.2%{
  transform: scale(1,1);
}
  43.04%{
  transform: scale(1,1);
  }
  44.43%{
    background-color: rgb(251,228,201);
    color: rgb(239,134,132);
    background-image:url(/eye/eyePinkRed.svg);
  }
  44.44%{
    background-color: rgb(18,54,90);
    color: rgb(249,228,201);
    background-image:url(/eye/eyeYellow.svg);
    transform: scale(1.01,1.01);
  }
  45.2%{
    transform: scale(1,1);
  }
  54.15%{
  transform: scale(1,1);
  }
  55.54%{
    background-color: rgb(18,54,90);
    color: rgb(249,228,201);
    background-image:url(/eye/eyeYellow.svg);
  }
  55.55%{
    background-color: rgb(16,111,103);
    color: rgb(249,228,201);
    background-image:url(/eye/eyeYellow.svg);
    transform: scale(1.01,1.01);
  }
  56.3%{
    transform: scale(1,1);
  }
  65.26%{
  transform: scale(1,1);
  }
  66.65%{
    background-color: rgb(16,111,103);
    color: rgb(249,228,201);
    background-image:url(/eye/eyeYellow.svg);
  }
  66.66%{
    background-color: rgb(241,153,125);
    color: rgb(249,228,201);
    background-image:url(/eye/eyeYellow.svg);
    transform: scale(1.01,1.01);
  }
  67.5%{
    transform: scale(1,1);
  }
  76.37%{
  transform: scale(1,1);
  }
  77.76%{
    background-color: rgb(241,153,125);
    color: rgb(249,228,201);
    background-image:url(/eye/eyeYellow.svg);
  }
  77.77%{
    background-color: rgb(241,203,98);
    color: rgb(0,93,158);
    background-image:url(/eye/eyeBlue.svg);
    transform: scale(1.01,1.01);
  }
  78.6%{
    transform: scale(1,1);
  }
  87.48%{
  transform: scale(1,1);
  }
  88.87%{
    background-color: rgb(241,203,98);
    color: rgb(0,93,158);
    background-image:url(/eye/eyeBlue.svg);

  }
  88.88%{
    background-color: rgb(18,54,90);
    color: rgb(249,228,201);
    background-image:url(/eye/eyeYellow.svg);
    transform: scale(1.01,1.01);
  }
  89.7%{
    transform: scale(1,1);
  }
  98.6%{
  transform: scale(1,1);
  }
  100%{
    background-color: rgb(18,54,90);
    color: rgb(249,228,201);
    background-image:url(/eye/eyeYellow.svg);
  }

}
</style>