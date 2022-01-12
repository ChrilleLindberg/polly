<template>


  <div class="gridContainer" >
    <div v-for="(q, i) in question.q" :key="q">
      <div class="container">
        <div id="answer"><span style="padding-top:0.5em;"> {{ q }}</span></div>
        <div id="picture"><img src="https://icon-library.com/images/equal-icon/equal-icon-7.jpg">
        </div>
        <input id="input" style="display: flex" type="string" class="answers" v-model="myAnswers[i]"
               v-bind:placeholder="uiLabels.answer" autocomplete="off">
      </div>
    </div>
  </div>


  <!--<button v-for="a in question.a" v-on:click="answer(a)" v-bind:key="a">
    {{ a }}
  </button>-->
</template>
<script>
import io from "socket.io-client";

const socket = io();
export default {
  name: 'Bars',
  props: {
    question: Object
  },

  data: function () {
    return {
      myAnswers: [],
      uiLabels: {},
      lang:""
    }
  },
  created: function () {
    socket.on("init", (labels) => {
      this.uiLabels = labels
    })

    this.$emit("answer", {answer: this.myAnswers});


  },
  methods: {
    switchLanguage: function () {
      if (this.lang === "en")
        this.lang = "sv"
      else
        this.lang = "en"
      socket.emit("switchLanguage", this.lang)
      console.log("körs swtich lagnueage?")
    },
  }
}
</script>
<style scoped>

h2 {
  display: flex;
  color: rgb(249, 228, 201);
  font-family: Helvetica, Arial, sans-serif;

}

.container {
  display: grid;
  grid-template-columns: 10fr 1fr 10fr;
  grid-template-rows: repeat(auto-fit, 1fr);
  margin-bottom: 1em;
  justify-content: flex-end;
  margin-left: 10%;
  margin-right: 10%;
  flex-direction: row;
  align-items: flex-end;
  width: auto;
}

.textContainer {
  display: grid;
  grid-template-columns: 10fr 1fr 10fr;
  justify-content: center;
  margin-bottom: 1em;
  margin-left: 10%;
  margin-right: 10%;
  width: auto;
}

#picture {
  margin: 0 2em 0 2em;
  height: 2em;
  width: 2em;
  display: flex;
}

#answer {
  text-align: center;
  display: flex;
  justify-content: center;
  cursor: default;
  /*border-style: solid;*/
  padding: 0em 1em 0em 1em;
  height: auto;
  min-height: 2em;
  border-radius: 0.5em;
  horiz-align: right;
  /*border-color: #EF8584;
  border-width: 0.2em; */
  background-color: lightgray;
  font-weight: bold;
  font-family: Helvetica, Arial, sans-serif;
}

#input {
  /* text-align: ; */
  /*border-style: solid;*/
  padding: 0em 1em 0em 1em;
  height: 2em;
  left: 50em;
  border-radius: 0.5em;
  min-width: 1em;
  /*order-color: #EF8584;
  border-width: 0.2em; */
  text-align: center;
  font-family: Helvetica, Arial, sans-serif;
}

.rubrik {
  display: flex;
  margin-bottom: 1em;
  justify-content: flex-end;
  flex-direction: row;
  align-items: flex-end;
  width: auto;
  margin-right: 35%;
}

#translationText {
  grid-column: 3;
}

#translaion {
  grid-column: 3;
  display: flex;
  justify-content: center;
}

#userWord {
  display: flex;
  justify-content: center;
}

</style>