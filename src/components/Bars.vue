<template>
<div class="wrapper4" >
  <div class="line-1" style="height: 5em;"></div>
  <div class="line-1" style="height: 10em;"></div>
  <div class="line-1" style="height: 15em;"></div>
  <div class="line-1" style="height: 20em;"></div>
  <div class="line-1" style="height: 25em;"></div>


  <div class="bar" v-for="(_, key) in data" v-bind:key="key">

    <div  v-bind:style="{height:20*data[key] +'em', width: 20/data.length + 'em' }" v-if="key>=0*(data.length-1)"  style="background-color:red; ">
    <div v-bind:style="{height: 20*data[key] + 'em', width:20/data.length + 'em'}" v-if="key>=0.33*(data.length-1)"  style="background-color:yellow;">
      <div v-bind:style="{height: 20*data[key]  +'em', width:20/data.length + 'em'}" v-if="key>0.66*(data.length-1)"  style="background-color:green;">
      </div>
    </div>
  </div>


    <div class="BarClass" >
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
  },
  arrayValues:[]
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.bar {
  position: relative;
  display: inline-block;
  vertical-align: bottom;
  bottom:-1.15em;
  z-index: 2;
  margin-left:3em;


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

.line-1{
  width: 64em;

  border-top: 1px solid gray;
  color:red;
  position: absolute;
  z-index:1;
}

.wrapper4 {

  width:64em;
  margin-left:10%;
  display:flex;
  align-items:end;
  z-index:0;
  margin-right:10%;

  border-bottom: gray solid;
  border-left: gray solid;
  position: relative;
  height:28em;

}
</style>
