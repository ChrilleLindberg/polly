<template>
<div class="wrapper4" >


<!--  <div v-for="(i) in data.maxValue" v-bind:key="i">

    <div class="line1"  v-bind:style="{height:2*i +'em'}"> hej
    </div>
  </div>-->

  <div class="bar" v-for="(_, key) in data.list" v-bind:key="key" >
    <div v-if="data.list[key]*data.amountStudent>0" style="font-size: 1.5em; color: rgb(259,228,201);;">
    {{data.list[key]*data.amountStudent}}
    </div>
    <div  v-bind:style="{height:18*data.list[key] +'em', width: 17/data.list.length + 'em',  }" v-if="key>=0*(data.list.length-1)"  style="background-color:#F52C33; ">
    <div v-bind:style="{height: 18*data.list[key] + 'em', width: 17/data.list.length + 'em'}" v-if="key>=0.33*(data.list.length-1)"  style="background-color:#F0E544;">
      <div v-bind:style="{height: 18*data.list[key]  +'em', width:17/data.list.length + 'em'}" v-if="key>0.66*(data.list.length-1)"  style="background-color:#2DF029;">
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
  color: rgb(259,228,201);
  display: inline-block;
  vertical-align: bottom;
  bottom:-3.17em;
  z-index: 2;
  margin:0 auto;

}

.line1{
  width: 64em;
  border-color:  red;
  border-style:solid;
  border-width:2px ;
  display:flex;

 overflow:auto;
  position: absolute;
  z-index:1;
  flex-direction: column;
}

.wrapper4 {
  top:3em;
  margin-top:1em;
  width:auto;
  background-color: rgb(16,111,103);
  left:2em;
  display:flex;
  align-items:flex-end;
  z-index:0;
  color: rgb(259,228,201);



  border-bottom: 3px white solid;
  border-left: 3px white solid;
  position: relative;
  height:20em;

}



</style>
