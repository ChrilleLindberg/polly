<template>


  <p v-for="(q, i) in question.q" :key="q">
    {{ q }}
    <input type="string" id="answers" v-model="myAnswers[i]">
  </p>





<!--<button v-for="a in question.a" v-on:click="answer(a)" v-bind:key="a">
  {{ a }}
</button>-->
</template>
<script>
export default {
  name: 'Bars',
  props: {
    question: Object
  },
  data: function () {
    return {
      myAnswers: [],
    }
  },
  created: function () {
      this.$emit("answer", {answer: this.myAnswers});
  }
}
</script>