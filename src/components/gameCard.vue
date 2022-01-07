<template>

  <div class="maincontainer" v-show="showCard && !doneCard">
    <div v-bind:class="rotateClass" @click="changeClass">
      <div class="thefront"><h1> {{ question }} </h1>
      </div>
      <div class="theback"><h1> {{ answer }}</h1>
      </div>
    </div>
  </div>

</template>

<script>
export default {
  name: "gameCard",
  props: {
    question: Object,
    answer: Object,
    showCard: Object,
    doneCard: Object,
  },

  data: function () {
    return {
      rotateClass: "frontclass"
    }
  },
  methods: {
    changeClass: function () {
      if (this.rotateClass == "thecard2") {
        this.rotateClass = "thecard"
        console.log("thecard")
      } else {
        this.rotateClass = "thecard2"
        console.log("thecard2")
      }
    },
    setTheCard: function () {
      this.rotateClass = "thecard"
    }
  }


}


</script>

<style scoped>


/* THE MAINCONTAINER HOLDS EVERYTHING */
.maincontainer {
  position: absolute;
  width: 250px;
  height: 320px;
  background: none;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  cursor: pointer;
}

/* THE CARD HOLDS THE FRONT AND BACK FACES */
.thecard {
  position: relative;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 10px;
  transform-style: preserve-3d;
  transition: all 0.8s ease;
  transform: rotateY(0deg);
}

.thecard2 {
  position: relative;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 10px;
  transform-style: preserve-3d;
  transition: all 0.8s ease;
  transform: rotateY(180deg);
}


/* THE FRONT FACE OF THE CARD, WHICH SHOWS BY DEFAULT */
.thefront {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 10px;
  backface-visibility: hidden;
  overflow: hidden;
  background: #ffc728;
  color: #000;
  border-radius: 10px;
  border-color: rgb(0, 0, 0, 50%);
  border-style: solid;
  border-width: 0em;
}

/* THE BACK FACE OF THE CARD, WHICH SHOWS ON MOUSEOVER */
.theback {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 10px;
  backface-visibility: hidden;
  overflow: hidden;
  background: #56bdb4;
  color: #333;
  text-align: center;
  transform: rotateY(180deg);
}

/*This block (starts here) is merely styling for the flip card, and is NOT an essential part of the flip code */
.thefront h1, .theback h1 {
  font-family: 'zilla slab', sans-serif;
  font-weight: bold;
  font-size: 24px;
  text-align: center;
  position: relative;
  top: 40%;
}

</style>