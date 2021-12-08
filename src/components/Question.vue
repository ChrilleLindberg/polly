<template>

  <div class="form__group">
  <p v-for="(q, i) in question.q" :key="q">
    {{ q }}

    <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet">

    <input type="text" class="form__input" id="name" placeholder="Full name" required="" v-model="myAnswers[i]">
    <label for="name" class="form__label">Full Name</label>

  </p>
  </div>






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
<style>
*,
*::after,
*::before {
  margin: 30%;
  padding: 0;
  box-sizing: inherit;
  font-size: 62,5%;
}

body {
  height: 100%;
  width: 100%;

  display: flex;
  justify-content: center;
  align-items: center;

  color: #fff;
}

.form__label {
  font-family: 'Roboto', sans-serif;
  font-size: 1.2rem;
  margin-left: 2rem;
  margin-top: 0.7rem;

  transition: all 0.3s;
  transform: translateY(0rem);
}

.form__input {
  font-family: 'Roboto', sans-serif;
  color: #333;
  font-size: 1.2rem;
  margin: 0 auto;
  padding: 1rem 2rem;
  border-radius: 0.2rem;
  background-color: rgb(255, 255, 255);
  border: none;
  width: 30%;

  border-bottom: 0.3rem solid transparent;
  transition: all 0.3s;
}

.form__input:placeholder-shown + .form__label {
  opacity: 0;
  visibility: hidden;
  -webkit-transform: translateY(-4rem);
  transform: translateY(-4rem);
}
</style>