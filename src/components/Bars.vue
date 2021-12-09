<template>
<div class="wrapper1">
  <div class="bar" v-for="(_, key) in data" v-bind:key="key">
    <div v-bind:style="{height: data[key] + 'px'}" v-if="key>=0*(data.length-1)"  style="background-color:red;" >
    <div v-bind:style="{height: data[key] + 'px'}" v-if="key>=0.33*(data.length-1)"  style="background-color:yellow;" >
      <div v-bind:style="{height: data[key] + 'px'}" v-if="key>0.66*(data.length-1)"  style="background-color:green;" >
      </div>
    </div>
  </div>
      <span> {{data[key]}}</span>


    <div>

      {{key}}
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
  display: inline-block;
  width: 50px;
  vertical-align: bottom;

}

.bar span {
  position: relative;
  top: -1.2em;
}
.bar div:nth-child(1){

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
  padding:3em;
}
</style>
