<template>
  <div class="container">
    <h1> HEJ</h1>
  <body>
  <div class="maincontainer">

    <transition name="slideLeft" :css="!swipeRight">

      <div class="thecard" v-show="showCard">

      <div class="thefront"><h1>Front of Card</h1><p>This is the front of the card. It contains important information. Please see overleaf for more details.</p></div>

      <div class="theback"><h1>Back of Card</h1><p>Your use of this site is subject to the terms and conditions governing this and all transactions.</p>
        <button>Submit</button></div>

    </div>
    </transition>
  </div>

  <button @click="swipeRight = false, showCard = false">
    Nej
  </button>
  <button @click="swipeRight = true, showCard2 = false">
    JA
  </button>
  </body>
  </div>
</template>

<script>
export default {
  name: "flipCards",
data: function () {
  return {
    showCard: true,
    showCard2: true,
    swipeRight: true
  }
} /* created: function () {
    const infinite = true;
    while(infinite) {
      setTimeout(() => this.isShown = false, 2000);
      setTimeout(() => this.isShown = true, 4000);
      console.log("hej")
      this.timeDelay();

    }
},   methods:{
    timeDelay: function() {
    setTimeout(function () {}, 2000)
    }
    } */
  }



</script>

<style scoped>

.container{
  width: 100%;
  height: 100%;
  position: absolute;
  /*background-color: #FBE4C9;*/
  /*transition: 0.5ms;*/
  animation-name: animate;
  animation-direction: alternate-reverse;
  animation-duration: 44s;
  animation-fill-mode: forwards;
  animation-iteration-count: infinite;
  animation-play-state: running;
  /*animation-timing-function: ease-in-out;*/

}

@keyframes animate{
  0%
  {
    background-color: rgb(236,87,46);
    color: rgb(255,238,235);
    /*background-image:url(/eyePink.svg);*/
  }
  11.1%{
    background-color: rgb(236,87,46);
    color: rgb(255,238,235);
  }
  11.11%{
    background-color: rgb(18,54,90);
    color: rgb(249,228,201);
  }
  22.21%{
    background-color: rgb(18,54,90);
    color: rgb(249,228,201);
  }
  22.22%{
    background-color: rgb(255,238,235);
    color: rgb(254,70,21);
  }
  33.32%{
    background-color: rgb(255,238,235);
    color: rgb(254,70,21);
  }
  33.33%{
    background-color: rgb(251,228,201);
    color: rgb(239,134,132);
  }
  44.43%{
    background-color: rgb(251,228,201);
    color: rgb(239,134,132);
  }
  44.44%{
    background-color: rgb(18,54,90);
    color: rgb(249,228,201);
  }
  55.54%{
    background-color: rgb(18,54,90);
    color: rgb(249,228,201);
  }
  55.55%{
    background-color: rgb(16,111,103);
    color: rgb(249,228,201);
  }
  66.65%{
    background-color: rgb(16,111,103);
    color: rgb(249,228,201);
  }
  66.66%{
    background-color: rgb(241,153,125);
    color: rgb(249,228,201);
  }
  77.76%{
    background-color: rgb(241,153,125);
    color: rgb(249,228,201);
  }
  77.77%{
    background-color: rgb(241,203,98);
    color: rgb(0,93,158);
  }
  88.87%{
    background-color: rgb(241,203,98);
    color: rgb(0,93,158);
  }
  88.88%{
    background-color: rgb(18,54,90);
    color: rgb(249,228,201);
  }
  100%{
    background-color: rgb(18,54,90);
    color: rgb(249,228,201);
  }

}

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
  background: #fafafa;
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
/*This block (ends here) is merely styling for the flip card, and is NOT an essential part of the flip code */


.fade-enter-active,
.fade-leave-active {
  transition: opacity .5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.slideRight-enter-active,
.slideRight-leave-active {
  transition: transform .5s;
}

.slideRight-enter,
.slideRight-leave-to {
  transform: translateY(-50%) translateX(-100vw);
}

.slideLeft-enter-active,
.slideLeft-leave-active {
  transition: transform .5s;
}

.slideLeft-enter,
.slideLeft-leave-to {
  transform: translateY(-50%) translateX(100vw);

}
/*
    Auther: Abdelrhman Said
*/

@import url("https://fonts.googleapis.com/css2?family=Poppins&display=swap");

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

*:focus,
*:active {
  outline: none !important;
  -webkit-tap-highlight-color: transparent;
}

html,
body {
  display: grid;
  height: 100%;
  width: 100%;
  font-family: "Poppins", sans-serif;
  place-items: center;
  background: linear-gradient(315deg, #ffffff, #d7e1ec);
}








</style>