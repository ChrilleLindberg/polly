<template>
<div class="wrapper4" >


  <div v-for="(i) in data.maxValue" v-bind:key="i">

  <div class="line1"  v-bind:style="{height:2*i +'em'}"> hej
  </div>
  </div>

  <div class="bar" v-for="(_, key) in data.list" v-bind:key="key" >

  {{data.list[key]*data.amountStudent}}
    <div  v-bind:style="{height:18*data.list[key] +'em', width: 15/data.list.length + 'em',  }" v-if="key>=0*(data.list.length-1)"  style="background-color:#FF2500; border-style: solid; border-color:white; border-width: 2px 2px 0 2px ">
    <div v-bind:style="{height: 18*data.list[key] + 'em', width:15/data.list.length + 'em'}" v-if="key>=0.33*(data.list.length-1)"  style="background-color:#FFFF00;">
      <div v-bind:style="{height: 18*data.list[key]  +'em', width:15/data.list.length + 'em'}" v-if="key>0.66*(data.list.length-1)"  style="background-color:#7FFF00;">
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
  background-color: lightgray;
  left:2em;
  display:flex;
  align-items:end;
  z-index:0;




  border-bottom: 2px black solid;
  border-left: 2px black solid;
  position: relative;
  height:20em;

}



</style>
