<template>
  <head>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
  </head>
  <body>
  <h1>{{ uiLabels.results }}</h1>
  <i id="goBack" class="fa fa-home" v-on:click="$router.push('/')"> </i>
  <div class="wrapper">
    <div class="icon facebook">
      <div class="tooltip">{{uiLabels.language}}</div>
      <span><i><img v-on:click="switchLanguage" v-bind:src="uiLabels.flag"  class="pictureFlag"></i></span> <!-- tog bort class="fab fa-facebook-f" -->
    </div>
  </div>


  <div v-show="showBars">
  <Bars v-bind:data="data"/>
  </div>

  <div v-show="!showBars">

  <div class="wrapper3">
    <div class="table">
    <span v-for="(idName) in name" :key="idName" id="table1">
      <span> {{ idName }}</span>
    </span>
      <span v-for="(idResult) in studentResult" :key="idResult" id="table2">
      <span> {{ idResult }}</span>
      </span>
    </div>
  </div>

  <button class="buttonNice" v-on:click="getBarsResult"> {{ uiLabels.showBarResults }} </button>
  </div>

  <br>
  </body>
</template>

<script>
// @ is an alias to /src
import Bars from '@/components/Bars.vue';
import io from 'socket.io-client';
const socket = io();

export default {
  name: 'Result',
  components: {
    Bars
  },
  data: function () {
    return {
      lang:"",
      question: "",
      data: {list:[], amountStudent:0},
      BarAndResults:[],
      name:[],
      studentResult:[],
      nameStudent:"",
      showBars:false,
      uiLabels:{},

    }
  },
  created: function () {
    this.pollId = this.$route.params.id
    socket.on("init", (labels) => {
      this.uiLabels = labels
    })

    socket.emit('joinPoll', this.pollId)
    socket.on("dataUpdate", (update) => {
      //this.data = update.a;
      console.log(update)

      this.question = update.q;
      console.log("test" +update.q)
    });
    socket.on("newQuestion", update => {
      this.question = update.q;
      //this.data = {};

    })
    socket.on("dataGetResults", update =>{
      //this.nameAndResults.push(update)
      console.log("update" +update)
      this.name=[]
      this.studentResult=[]
      for (let i = 0; i <update.length; i++) {
        this.name.push(update[i].nameStudent)
        this.studentResult.push(update[i].AmountCorrects)
      }
    })
  },
  methods: {
  getResults: function(){


    socket.emit('getResults', this.pollId)

  },
    getBarsResult: function(){
      this.BarAndResults = new Array(this.question.length+1).fill(0);
      console.log("varje index" + this.BarAndResults)
      this.showBars=true

      console.log("längd" +this.question.length)
      for (let i = 0; i <this.name.length; i++) {
        let correct = this.studentResult[i];


        this.BarAndResults[correct] += 1;


      }
      for (let i = 0; i <this.question.length+1; i++) {
        console.log("enstaka resultat" +this.BarAndResults[2])
        this.BarAndResults[i]=this.BarAndResults[i]/this.name.length
        console.log("enstaka resultat efter" +this.BarAndResults[2])

      }
      this.data.list=this.BarAndResults
      this.data.amountStudent=this.name.length
      console.log("hur lång är listan" +this.name.length)
      console.log("titta listan" +this.BarAndResults)
      },

    switchLanguage: function() {
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
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
body{
  font-family: 'montserrat', sans-serif;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0em;
  left: 0em;

  background-color: rgb(255,238,235);


}
body h1{
  color: rgb(254,70,21);


}
.wrapper3 {
  margin: 1em 33% 1em 33%;
  overflow: scroll;
  height: 25em;
  background: rgb(249,228,201);
  box-shadow: 0em 0.1em 0.15em 0.1em rgb(203, 172, 172);
}
.pictureFlag{
  border-radius: 60%;
  width:2.3em;
  height:1.6em;
  box-shadow: 0 10px 10px rgba(0, 0, 0, 0.1);
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
#goBack {
  position: absolute;
  left: 1em;
  top: 1em;
  mix-blend-mode: multiply;
  cursor:pointer;
  font-size: 3em;
}

.buttonNice{

  width: 11em;
  height: 3em;
  color:#EF8584;
  font-size: 1em;
  font-weight: 800;
  font-family: "Times New Roman", serif;
  border-radius: 5px;
  border-style: solid;
  border-color:#EF8584;
  background-color: white;
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

.table {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-auto-flow: column;
  grid-gap: 1.5em;

  /*width:auto;
  height:10em ; */
}
#table1{
  grid-column:1;
  border-top: 1px solid #dfdfdf;
  padding-top:2em;

}
#table2 {
  grid-column: 2;
  border-top: 1px solid #dfdfdf;
  padding-top:2em;
}

</style>
