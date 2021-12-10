<template>
  <body>
  <h1>Results</h1>

  <div v-show="showBars">
  <Bars v-bind:data="data"/>

  </div>

  <div v-show="!showBars">

  <div class="wrapper">
    <div class="table">
    <span v-for="(idName) in name" :key="idName" id="table1">
      <span> {{ idName }}</span>
    </span>
      <span v-for="(idResult) in studentResult" :key="idResult" id="table2">
      <span> {{ idResult }}</span>
      </span>
    </div>
  </div>
    <button v-on:click="getResults"> Get Results </button>
    <button v-on:click="getBarsResult"> Show bar results </button>
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
      question: "",
      data: [],
      BarAndResults:[],
      name:[],
      studentResult:[],
      nameStudent:"",
      showBars:false,

    }
  },
  created: function () {
    this.pollId = this.$route.params.id


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
        console.log(correct)
        this.BarAndResults[correct] += 1;
      }
      this.data=this.BarAndResults
      }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
body{
  font-family: 'montserrat', sans-serif;
  background: linear-gradient(90deg, #CEEDE8 0%, #EBEFFB 45%, #CAD2F9 100%);
}
.wrapper{
  margin-left: 33%;
  margin-right: 33%;
  overflow: scroll;
  height: 20em;
  background: #CAD2F9;
  border-style: dotted;
  margin-bottom:4em;

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
