<template>
<div class="wrapper1">

  <div class="bar" v-for="(_, key) in data" v-bind:key="key">

    <div v-bind:style="{height: 500*data[key]/(28*data.length) +'em', width: 40/data.length + 'em' }" v-if="key>=0*(data.length-1)"  style="background-color:red;">
    <div v-bind:style="{height: 500*data[key]/(28*data.length) + 'em', width:40/data.length + 'em'}" v-if="key>=0.33*(data.length-1)"  style="background-color:yellow;">
      <div v-bind:style="{height: 500*data[key]/(28*data.length)  +'em', width:40/data.length + 'em'}" v-if="key>0.66*(data.length-1)"  style="background-color:green;">
      </div>
    </div>
  </div>


    <div class="BarClass">
      <p>{{key}}</p>
    </div>
  </div>


</div>


</template>

<script>
export default {
  name: 'Bars',
  props: {
    data: Object
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.bar {
  left:-5em;
  display: inline-block;
  vertical-align: bottom;
  position: relative;
  top:10em;
  margin-left:1em;




}

.bar span {
  position: relative;
  top: -1.2em;


}
.bar div:nth-child(1){


}
.BarClass{
  margin-top:1em;
}

/*.bar:nth-child(1) div:nth-child(1) {
  background-color:red;
}
.bar:nth-child(2) div:nth-child(1) {
  background-color:blue;
}
.bar:nth-child(3) div:nth-child(1) {
  background-color:teal;
}
.bar:nth-child(4) div:nth-child(1) {
  background-color:purple;
}
.bar:nth-child(5) div:nth-child(1) {
  background-color:yellow;
}*/

.wrapper1 {
  width:64em;
  margin-left:10%;

  margin-right:10%;

  border-bottom: gray solid;
  border-left: gray solid;
  position: static;
  height:28em;

}
</style>
