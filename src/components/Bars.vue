<template>
<div class="wrapper4" >
  <p id="Y-axel">Antal personer</p>
  <p id="X-axel">Antal rätt</p>
  <div class="wrapper">
  <p style="background-color:#F22259;padding: 1em 0.2em 1em 0.2em; margin-top:1em;margin-bottom:1em;">0%-33% </p>
  <p style="background-color:#0a6abf; padding: 1em 0.2em 1em 0.2em; margin-top:1em;margin-bottom:1em;">33%-66%</p>
  <p style="background-color:#f25c05; padding: 1em 0.2em 1em 0.2em;margin-top:1em;margin-bottom:1em;">66%-100%</p>
  </div>

  
  <div class="line-1" style="height: 5em;" ></div>
  <div class="line-1" style="height: 10em;"></div>
  <div class="line-1" style="height: 15em;"></div>
  <div class="line-1" style="height: 20em;"></div>
  <div class="line-1" style="height: 25em;"></div>


  <div class="bar" v-for="(_, key) in data.list" v-bind:key="key">
{{data.list[key]*data.amountStudent}}
    <div  v-bind:style="{height:20*data.list[key] +'em', width: 20/data.list.length + 'em' }" v-if="key>=0*(data.list.length-1)"  style="background-color:#F22259; ">
    <div v-bind:style="{height: 20*data.list[key] + 'em', width:20/data.list.length + 'em'}" v-if="key>=0.33*(data.list.length-1)"  style="background-color:#0a6abf;">
      <div v-bind:style="{height: 20*data.list[key]  +'em', width:20/data.list.length + 'em'}" v-if="key>0.66*(data.list.length-1)"  style="background-color:#f25c05;">
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
  bottom:-3.16em;
  z-index: 2;
  margin:0 auto;



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
#Y-axel{
  writing-mode: vertical-rl;
  text-orientation:sideways;
  position: absolute;
  left: -3em;
  top:10em;
}

#X-axel{
  position:absolute;
  top:29.5em;
  left:30em;
}
.wrapper{
  writing-mode: vertical-rl;
  text-orientation:sideways;
  color:white;
  font-weight: bold;
  display:grid;
  padding-left:1em;
  grid-template-columns: 1fr 1fr 1fr;
  position: absolute;
  left: 66em;
  top:0;
}

</style>
