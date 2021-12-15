<template>
  <body  v-bind:class="[{'container': !hideCon}, {'nextPage': hideCon}]" >
  <header id="movedown">
    <h1>
      {{ uiLabels.welcomeMessage }}
    </h1>
  </header>
  <button id="buttonTest">
    OK
  </button>


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
              <input autocomplete="off" type="text" name="search" id="inputPollId" v-model="id"
                     v-bind:placeholder="uiLabels.writeField" @input="checkPollId" @keydown.space.prevent/>
            </div><!-- Space hack -->
          </div>
          <button type="submit" name="go_search" @click="$router.push('/poll/'+id) ; console.log('halla')" id="participate" v-show="isVisible==1" v-bind:disabled="!pollExists">
            GO!
          </button>
        </li>
      </ul>



    <button class="buttonNice" v-on:click="switchVisibleTwo" v-show="isVisible==1"> {{ uiLabels.createPoll }}</button>
  </div>

  <div id="twoOptions" v-show="isVisible==2">
    <p>
      {{ uiLabels.twoOptionsText }}
    </p>
    <button class="buttonNice" style="font-size: 1em;" @click="$router.push('/create/'+ 'new/' + lang)" id="create">
      {{ uiLabels.createNew }}
    </button>
    <br>

    <button class="buttonNice" id="edit"  style="font-size: 1em;" v-on:click="switchVisibleThree"> <!-- Ska öppna createsidan fast alla fält ska vara ifyllda. -->
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
      hideCon:false,
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
      this.hideCon=true
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

<style scoped>

header {
  font-size: 2em;
  font-family: "beirut ";

}

body {
  /*background-color: #3C5377;
  color: #EF8584;*/
  font-family: Helvetica, Arial, sans-serif;
  font-size: 1.3em;
}

#goBack {
  position: absolute;
  left: 1em;
  top: 1em;
  mix-blend-mode: multiply;
  cursor:pointer

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

}

.growing-search div {
  display: inline-block;
  font-size: 20px;
  padding: 0.1em 0.5em 0.1em 0.5em;
  border-radius: 5px;
  background: #fff;
  margin-right: 0.5em;
}

.growing-search .input input {
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

input:focus::placeholder {
  color: transparent;
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

  width: auto;
  height: auto;
  padding: 0.5em 0.5em 0.5em 0.5em;
  color:#EF8584;
  font-size: 0.5em;
  font-weight: 800;
  border-radius: 10px;
  border-style: solid;
  border-color:#EF8584;
  background-color: white;
  cursor: pointer;
  margin-top:1em;
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
#participate{
  position:static;
  background-color: lawngreen;
  font-size: 2em;
  margin-left: 0;
  margin-bottom: 0.2em;
  margin-top: 0.2em;
  padding:0em 1em 0em 1em;
  display:inline-block;
  font-weight: 100;
  border-radius: 0.2em;
  box-sizing: border-box;
  text-decoration:none;
  color: #000000;
  text-align:center;
  transition: all 0.2s;
  cursor: default;
}
#participate:disabled{
  background-color: lightgray;
  color: gray! important;
  cursor: default !important;
}
#participate:hover{
  cursor:pointer;
  color: #000000;
}


#movedown{
  margin-top: 5em;
}
#buttonTest{
  top: 1.5em;
  left: 1.4em;
  position: absolute;
  background: transparent;
  color: transparent;
  border: none !important;
  font-size:2em;
}
#buttonTest:hover{
  cursor:pointer;
}


.container{
  width: 100%;
  height: 100%;
  position: absolute;
  margin: 0px!important;
  top: 0em;
  left: 0em;
  /*background-color: #FBE4C9;*/
  /*transition: 0.5ms;*/
  animation-name: animate;
  animation-direction: alternate;
  animation-duration: 44s;
  animation-fill-mode: forwards;
  animation-iteration-count: infinite;
  animation-play-state: running;
  /*animation-timing-function: ease-in-out;*/
  background-size: 3em;
  background-position: top 3em left 3em;
  background-repeat: no-repeat;
}

.nextPage{
  width: 100%;
  height: 100%;
  position: absolute;
  margin: 0px!important;
  top: 0em;
  left: 0em;

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
    transform: scale(1,1);
  }
  11.1%{
    background-color: rgb(236,87,46);
    color: rgb(255,238,235);
    background-image:url(/eye/eyeLightPink.svg);
  }
  11.11%{
    background-color: rgb(18,54,90);
    color: rgb(249,228,201);
    background-image:url(/eye/eyeYellow.svg);
    transform: scale(1.01,1.01);
  }
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