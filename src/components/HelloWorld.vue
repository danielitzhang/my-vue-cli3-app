<template>
  <div class="hello">
    <img src="../assets/images/logo.jpg" >
    <div>{{hotelName}}</div>
  </div>
</template>

<script>
import {get,post} from '@/utils/http'
export default {
  data(){
    return {
      hotelName:'',

    }
  },
  mounted(){
    this.getHotelInfo()
  },
  methods:{
    getHotelInfo(){
      get('/hotel/info/hotel.info')
      .then((res) => {
        console.log(res);
        this.hotelName = res.hotel.hotelName;
        
      }).catch((err) => {
        
      });
    },
  },
  
  
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.hello{
  // position: fixed;
  // top: 0;
  // left: 0;
  width: 100%;
  height: 1.71rem;
  background: #3079f3;
  display: flex;align-items:center;
  img{
    border-radius: 50%;
    width: 1.07rem;
	  height: 1.07rem;
    margin: 0.32rem 0.43rem 0.32rem 0.64rem;
  }
  div{
    font-size: 0.64rem;
    line-height: 1.71rem;
    font-weight: normal;
    font-stretch: normal;
    color: #ffffff;
    display: inline-block;
  }
}
</style>
