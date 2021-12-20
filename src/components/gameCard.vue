<template>

  <transition v-bind:class="{slideLeft: left, slideRight:!left}">
  <div class="maincontainer" v-show="showCard && !doneCard">
    <div class="thecard">
      <div class="thefront"><h1> {{question}} </h1>
      </div>
      <div class="theback"><h1> {{answer}}</h1>
      </div>
    </div>
  </div>
  </transition>

</template>

<script>
export default {
  name: "gameCard",
  props: {
    question: Object,
    answer: Object,
    showCard: Object,
    doneCard: Object
  },
  /*name: "gameCard",
  q:"",
  a:"",
  show:true*/
}
</script>

<style scoped>

/* THE MAINCONTAINER HOLDS EVERYTHING */
.maincontainer{
  position: absolute;
  width: 250px;
  height: 320px;
  background: none;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
/* THE CARD HOLDS THE FRONT AND BACK FACES */
.thecard{
  position: relative;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 10px;
  transform-style: preserve-3d;
  transition: all 0.8s ease;
}
/* THE PSUEDO CLASS CONTROLS THE FLIP ON MOUSEOVER AND MOUSEOUT */
.thecard:hover{
  transform: rotateY(180deg);
}
/* THE FRONT FACE OF THE CARD, WHICH SHOWS BY DEFAULT */
.thefront{
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
}
/* THE BACK FACE OF THE CARD, WHICH SHOWS ON MOUSEOVER */
.theback{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 10px;
  backface-visibility: hidden;
  overflow: hidden;
  background: #312e97;
  color: #333;
  text-align: center;
  transform: rotateY(180deg);
}
/*This block (starts here) is merely styling for the flip card, and is NOT an essential part of the flip code */
.thefront h1, .theback h1{
  font-family: 'zilla slab', sans-serif;
  padding: 30px;
  font-weight: bold;
  font-size: 24px;
  text-align: center;
}
.thefront p, .theback p{
  font-family: 'zilla slab', sans-serif;
  padding: 30px;
  font-weight: normal;
  font-size: 12px;
  text-align: center;
}

</style>