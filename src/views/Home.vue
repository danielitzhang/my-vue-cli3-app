<template>
  <div class="home">
    <HelloWorld />
    <div class="content_box">
      <div class="header_box">
        <van-search
          class="search_box"
          v-model="keyword"
          placeholder="输入姓名、手机号、订单号"
          show-action
          @search="onSearch"
        >
          <div slot="action" @click="onSearch">查找</div>
        </van-search>
        <div class="btn" @click="reset">重置</div>
        <div class="btn" @click="onSearch">刷新</div>
        <!-- <div class="btn" @click="show=true">状态</div> -->
        <div class="status_btn max_device_status_btn">
          <p @click="selectStatus(1)" :class="{act:status==1}"><span style="background-color:#f6bb42;"></span>待排房</p>
          <p @click="selectStatus(2)" :class="{act:status==2}"><span style="background-color:#48cfad;"></span>待入住</p>
          <p @click="selectStatus(3)" :class="{act:status==3}"><span style="background-color:#a0cecb;"></span>已入住</p>
          <p @click="selectStatus(4)" :class="{act:status==4}"><span style="background-color:#aab2bd;"></span>已完成</p>
        </div>
      </div>
      <div class="status_btn min_device_status_btn">
          <p @click="selectStatus(1)" :class="{act:status==1}"><span style="background-color:#f6bb42;"></span>待排房</p>
          <p @click="selectStatus(2)" :class="{act:status==2}"><span style="background-color:#48cfad;"></span>待入住</p>
          <p @click="selectStatus(3)" :class="{act:status==3}"><span style="background-color:#a0cecb;"></span>已入住</p>
          <p @click="selectStatus(4)" :class="{act:status==4}"><span style="background-color:#aab2bd;"></span>已完成</p>
        </div>
      <van-popup v-model="show" position="bottom">
        <van-picker show-toolbar :columns="columns" @cancel="show=false" @confirm="onChange" />
      </van-popup>
      <div class="data_list" >
        <div class="item_box" v-for="(item, index) in dataList" :key="index">
          <div class="item_order_num">{{item.orderNumber}}</div>
          <div v-for="(guest, index1) in item.guests" :key="index1" class="guest_box" :class="{'isDpf':item.status==1?true:false,'isDrz':item.status==2?true:false,'isYrz':item.status==3?true:false,'isYwc':item.status==4?true:false,}">
            <div v-if="index1 < 2">
            <!-- <div> -->
              {{guest.name}} 
              <span>{{guest.mobile}}</span> 
            </div>
          </div>
          <div class="more_box" @click="moreClick(item)" v-if="item.guests.length>2">
            更多入住人>
          </div>
          <div class="btm_box">
            <div class="left_info">
              <div>{{item.roomTypeName + item.roomNumber}}</div>
              <div>{{changeTime(item.arriveTime) + '-' + changeTime(item.departureTime)}}</div>
            </div>
            <div class="live_box" v-if="item.status == 1||item.status==2" @click="openDia(item)">
              办入住
            </div>
          </div>
        </div>
      </div>
      <div class="page_box">
        <van-pagination 
          v-model="pageIndex" 
          :page-count="totalPage"
          force-ellipses
          @change='onSearch'
        />
      </div>
      <van-popup v-model="morePeople" position="right" class="wh_box">
        <div class="more_people_box">
          <h4>{{moreItem.roomTypeName}}</h4>
          <p>{{moreItem.orderNumber}}</p>
          <div class="guest_info_box">
            <div v-for="item in moreItem.guests" :key="item.orderNumber">
              {{item.name}} <span>{{item.mobile}}</span>
            </div>
          </div>
          <div class="close_btn" @click="morePeople = false">
            关闭
          </div>
        </div>
      </van-popup>
      <van-popup v-model="addPeople" position="right" class="wh_box">
        <div class="more_people_box">
          <h4>{{roomNumber}}</h4>
          <h5>{{addFiles.roomTypeName}} <span @click='roomChage'>换房></span></h5>
          <div class="guest_info_box">
            <div v-for="(item,index) in guests" :key="item.roomNumber">
              <div v-show="!item.editView">
                {{item.name}} <span>{{item.mobile}}</span>
              </div>
              <div v-show="item.editView" class="guest_edit">
                <input type="text" v-model="item.name" name="">
                <input type="tel" v-model="item.mobile" name="">
              </div>
              <div class="icon_box">
                <img src="../assets/images/delet.png" alt="" @click="deleteItem(item, index)">
                <img v-show="!item.editView" src="../assets/images/edit.png" @click="updatePeople(item)">
                <img v-show="item.editView" src="../assets/images/ok.png" @click="confirmGuest(item,index)">
              </div>
            </div>
            
          </div>
          <div class="input_box" v-if="updateFormShow">
            <div class="line_box">
              <span>入住人姓名：</span>
              <input type="text" v-model="addForm.name" placeholder="姓名" />
            </div>
            <div class="line_box">
              <span>入住人手机：</span>
              <input type="text" :value="addForm.mobile" placeholder="手机号">
            </div>
          </div>
          <div class="input_box" v-if="addFormShow">
            <div>
              <div class="line_box">
                <span>入住人姓名：</span>
                <input type="text" placeholder="姓名" v-model="addForm.name">
              </div>
              <div class="line_box">
                <span>入住人手机：</span>
                <input type="text" placeholder="手机号" v-model="addForm.mobile">
              </div>
            </div>
            <div class="icon_box" style="margin-left:auto;">
              <img src="../assets/images/delet.png" alt="" @click="deleteNewItem">
              <img src="../assets/images/ok.png" @click="confirmNewGuest">
            </div>
          </div>
          
          <div class='add_btn' @click='addAPeople'>
            <img src='../assets/images/add.png' /> 添加同住人
          </div>
          <div class="btn_tow">
            <div @click="addPeople=false">取消</div>
            <div class="go_live" @click="checkIn">
              办入住
            </div>
          </div>
        </div>
      </van-popup>
      <!--更换房间-->
      <van-popup v-model="roomChageView" position="right" class="wh_box">
        <div class="room_change_box">
          <div class="title">房间列表</div>
          <div class="rooms">
            <span v-for="item in availRooms" :key="item.roomNumber" :class="{act:item.roomNumber==selectedRoomNumber}" @click="select(item)">{{item.roomNumber}}</span>
          </div>
          <div class="room_chage_btn close_btn" @click="arrangeRoom">确定</div>
          <div class="cancel_btn" @click="roomChageView=false">取消</div>
        </div>
      </van-popup>
    </div>
  </div>
</template>
<script>
import { Toast } from 'vant';
import HelloWorld from '@/components/HelloWorld.vue'
import {get,post} from '@/utils/http'
export default {
  data(){
    return {
      keyword:'',
      pageIndex:1,
      status:0,
      show:false,
      columns: ['待排房', '待入住', '已入住', '已完成'],
      dataList:[],
      totalPage:0,
      moreItem:{},
      morePeople:false,
      halls: [],
      floors: [],
      rooms: [],
      maxPeopleNumber:1,
      roomNumber:'',
      addPeople:false,
      addFiles:{

      },
      guests:[],
      addFormShow:false,
      addForm:{
        name:'',
        mobile:'',
      },
      updateFormShow:false,
      updateForm:{
        name:'',
        mobile:''
      },
      roomChageView:false,//选房弹窗，
      availRooms:[],//可用房间
      selectedRoomNumber:"",//选房是点击选中的房间号
    }
  },
  components: {
    HelloWorld
  },
  mounted(){
    this.onSearch();
  },
  computed:{
    classObject: function (item) {
      console.log(item)
      return {
        isDpf: item.status==1?true:false,
        isDrz: item.status==2?true:false,
        isYrz: item.status==3?true:false,
        isYwc: item.status==4?true:false,
      }
    },
  },
  methods:{
    selectStatus(type){
      this.status=type;
      this.onSearch();
    },
    deleteNewItem(){
      this.addFormShow=false;
    },
    confirmNewGuest(){
      if(this.addForm.name==''||this.addForm.mobile==''){
        Toast('请填写完整的客户信息');
        return false;
      }
      this.guests.push({name:this.addForm.name,mobile:this.addForm.mobile,editView:false})
      console.log(this.guests)
      this.addFormShow=false;
    },
    arrangeRoom(){
      post("/hotel/order/order.arrange.room",{
        orderNumber:this.addFiles.orderNumber,
        occupationAccount:this.addFiles.occupationAccount,
        roomNumber:this.selectedRoomNumber
      }).then(msg=>{
        Toast.success("排房成功")
        this.roomNumber = this.selectedRoomNumber;
        this.roomChageView=false;
      })
    },
    select(item){
      this.selectedRoomNumber=item.roomNumber;
    },
    confirmGuest(item,index){
      this.guests[index].name=item.name;
      this.guests[index].mobile=item.mobile;
      item.editView=false;
      console.log(this.guests)
    },
    roomChage(){
      get('/hotel/order/order.avail.rooms', {
        orderNumber:this.addFiles.orderNumber,
        occupationAccount:this.addFiles.occupationAccount
      })
      .then((res) => {
        this.availRooms=res.rooms;
        this.roomChageView=true;
      }).catch((err) => {
        console.log(err)
      });
    },
    onSearch(){
      get("/hotel/order/order.wxmini.list", {
        keyword:this.keyword?this.keyword:'',
        pageIndex:this.pageIndex?this.pageIndex:1,
        status:this.status?this.status:'0',
      })
      .then((res) => {
        // res.lists.forEach(async val => {
          
        // });
        let that = this;
        for (let i = 0;i < res.lists.length; i++) {
          (function (index) {
            // console.log(index, res.lists[index]);
            post('/hotel/order/order.refresh.item',{
              orderNumber:res.lists[index].orderNumber,
              occupationAccounts:res.lists[index].occupationAccount
            })
            .then((resp) => {
              // if (++index < res.lists.length) {
                // console.log(index,res.lists[index]);
                res.lists[index] = resp.lists[0]
                // loop(index);
              // } else {
              //   console.log("全部执行完毕");
              // }
            }).catch((err) => {
              console.log(err)
            });
          })(i);
          
        }
        // this.dataList = res.lists;
        // this.totalPage = res.totalPage;
        
        that.dataList = res.lists;
        that.totalPage = res.totalPage;
        console.log(res,this.dataList);
      }).catch((err) => {
        
      });
    },
    async refreshItem(item){
      post('/hotel/order/order.refresh.item',{
        orderNumber:item.orderNumber,
        occupationAccounts:item.occupationAccount
      })
      .then((res) => {
        return res.lists[0]
      }).catch((err) => {
        console.log(err)
      });
    },
    updatePeople(item){
      item.editView=true;
    },
    deleteItem(item,index){
      this.guests.splice(index, 1);
    },
    onChange(picker, value, index) {
      console.log(`当前值：${value}, 当前索引：${index}`)
      this.status = value;
      this.onSearch();
      this.show = false;
    },
    moreClick(item){
      this.moreItem = item;
      this.morePeople = true;
    },
    reset(){
      this.keyword = '';
      this.onSearch();
    },
    changeTime (str) {
      let a = str.split(' ');
      let b = a[0].split('-');
      return b[1] + '.' + b[2];
    },
    openDia(item){
      console.log(item)
      this.addPeople = true;
      this.addFiles = item;
      let temp=item.guests.map(it=>{
        return {
          ...it,
          editView:false
        }
      })
      this.guests = temp;
      console.log(this.guests, this.dataList)
      if(!item.roomNumber){
        get('/hotel/order/order.avail.rooms', {
          orderNumber:item.orderNumber,
          occupationAccount:item.occupationAccount
        })
        .then((res) => {
          this.halls = res.halls;
          this.floors = res.floors;
          this.rooms =  res.rooms;
          this.maxPeopleNumber = res.info.maxPeopleNumber;
          this.guests = item.guests;
          var a = [], b = [];
          for (let i = 0; i < this.floors.length; i++) {
            if (this.halls[0].hallId == this.floors[i].hallId) {
              a.push(this.floors[i]);
            }
          }
          for (let i = 0; i < this.rooms.length; i++) {
            if (a[0].floorId == this.rooms[i].floorId && this.halls[0].hallId == this.rooms[i].hallId) {
              b.push(this.rooms[i]);
            }
          }
          post("/hotel/order/order.arrange.room",{
            orderNumber:item.orderNumber,
            occupationAccount:item.occupationAccount,
            roomNumber:b[0].roomNumber
          }).then(msg=>{
            this.roomNumber = b[0].roomNumber;
            this.maxPeopleNumber = res.info.maxPeopleNumber;
          })
        }).catch((err) => {
          console.log(err)
        });
      }else{
        this.roomNumber = item.roomNumber;
        this.maxPeopleNumber = item.maxPeopleNumber;
      }
      // get('/hotel/order/order.avail.rooms', {
      //   orderNumber:item.orderNumber,
      //   occupationAccount:item.occupationAccount
      // })
      // .then((res) => {
      //   this.halls = res.halls;
      //   this.floors = res.floors;
      //   this.rooms =  res.rooms;
        // this.maxPeopleNumber = res.info.maxPeopleNumber;
      //   this.guests = item.guests;
      //   var a = [], b = [];
      //   for (let i = 0; i < this.floors.length; i++) {
      //     console.log(this.floors);
      //     if (this.halls[0].hallId == this.floors[i].hallId) {
      //       a.push(this.floors[i]);
      //     }
      //   }
      //   for (let i = 0; i < this.rooms.length; i++) {
      //     if (a[0].floorId == this.rooms[i].floorId && this.halls[0].hallId == this.rooms[i].hallId) {
      //       b.push(this.rooms[i]);
      //     }
      //   }
      //   this.addFiles = item;
        
      // }).catch((err) => {
      //   console.log(err)
      // });
    },
    addAPeople(){

      if (this.addFormShow) {
        Toast('请先提交当前入住人信息');
      }else if(this.guests.length + 1 > this.maxPeopleNumber){
        Toast('当前房间最多可住' + this.maxPeopleNumber + '人');
      }else{
        this.addFormShow = true;
        this.addForm.name = '';
        this.addForm.mobile = '';
      }
    },
    checkIn(){
      if(!this.guests.length){
        Toast('请输入入住人信息');
        return false;
      }
      post('/hotel/order/order.checkin', {
        orderNumber:this.addFiles.orderNumber,
        roomNumber:this.roomNumber,
        guests: JSON.stringify(this.guests)
      })
      .then((res) => {
        let flag=res.info.guests.every(it=>it.state==1);
        if(!flag){
          Toast('入住失败');
        }else{
          Toast.success('入住成功');
          this.addPeople=false;
          setTimeout(()=>{
            this.onSearch();
          })
        }
      }).catch((err) => {
        
      });
    },
  }
}
</script>
<style lang="scss">
input{border:none;outline: none;padding-left: 0.5rem;}
.wh_box{
  width: 100%;
  height: 100%;
  .title{
    font-family: Source Han Sans CN;
    font-size: 1.07rem;
    line-height: 1.81rem;
    letter-spacing: 0.11rem;
    color: #333333;
    text-align: center;
    margin-top: 2.56rem;
  }
  //选择房间样式
  .rooms{
    margin-top: 2.56rem;
    padding:0 0.5rem;font-size: 0.2rem;
    span{
      width: 3.07rem;
      height: 1.71rem;
      background-color: #ffffff;
      box-shadow: 0rem 0.11rem 0.43rem 0rem 
        rgba(102, 102, 102, 0.16);
      border-radius: 0.85rem;
      padding: 0.1rem 0;
      text-align: center;
      display: inline-block;
      font-size: 0.64rem;
      line-height: 1.71rem;
      letter-spacing: 0.06rem;
      color: #333333;
      margin: 0.64rem 0.43rem 0 0;
      &.act{
        background-color: #0188fb;color: white;border:none;
      }
    }
  }
  .room_chage_btn{
      margin: 1rem 0.5rem 0.4rem;
      height: 0.8rem;
      line-height: 0.8rem;
      text-align: center;
      font-size: 0.3rem;
      letter-spacing: 0.03rem;
      color: #ffffff;
      background-image: linear-gradient(270deg, 
        #1b33ff 0%, 
        #30c7f3 100%);
      box-shadow: 0rem 0.11rem 0.64rem 0rem 
        rgba(48, 121, 243, 0.24);
      border-radius: 1.6rem;
      
    }
    .cancel_btn{
      margin: 0 0.5rem;
      height: 0.8rem;
      line-height: 0.8rem;
      text-align: center;
      font-size: 0.3rem;
      letter-spacing: 0.03rem;
      border-radius: 1.6rem;
      border: 1px solid #999;
    }
  .more_people_box{
    h4{
      font-size: 1.08rem;
      text-align: center;
      margin: 1rem 0 0;
    }
    h5{
      font-size: 1.08rem;
      text-align: center;
      margin: 0;
      span{
        font-size: 0.43rem;
        font-weight: normal;
        letter-spacing: 0.04rem;
        color: #333333;
      }
    }
    p{
      margin: 0;
      text-align: center;
      font-size: 0.43rem;
      line-height: 0.56rem;
      letter-spacing: 0.02rem;
      color: #666666;
    }
    .input_box{
      font-size: 0.3rem;padding: 0 1rem;display: flex;align-items:center;
        .line_box{
          display: flex;align-items:center;margin-bottom: 0.2rem;
          input{
            width: 40%;
          }
        }
      }
    .guest_info_box{
      margin:1rem;
      font-size: 0.2rem;
      .guest_edit{
        input{
          font-size: 0.4rem;
          &:first-child{
            width: 1rem;
          }
          &:last-child{
            width: 3rem;
          }
        }
      }
      div{
        display: inline-block;
        font-size: 0.64rem;
        line-height: 0.83rem;
        letter-spacing: 0.06rem;
        color: #333333;
        display: flex;align-items:center;
        span{
          font-size: 0.43rem;
          line-height: 0.56rem;
          letter-spacing: 0.02rem;
          color: #333333;
        }
      }
      .icon_box{
        display: inline-block;
        margin-left:auto;
        img{
          vertical-align: middle;
          width: 0.7rem;
        }
        span{
          border-left: 0.1rem solid #cccccc;
          padding-left: 0.2rem;
          font-size: 0.43rem;
          font-weight: normal;
          font-stretch: normal;
          line-height: 0.83rem;
          letter-spacing: 0.02rem;
          color: #333333;
        }
      }
    }
    .close_btn{
      margin: 1rem;
      height: 1.09rem;
      line-height: 1.09rem;
      text-align: center;
      font-size: 0.43rem;
      letter-spacing: 0.03rem;
      color: #ffffff;
      background-image: linear-gradient(270deg, 
        #1b33ff 0%, 
        #30c7f3 100%);
      box-shadow: 0rem 0.11rem 0.64rem 0rem 
        rgba(48, 121, 243, 0.24);
      border-radius: 1.6rem;
    }
    .btn_tow{
      display: flex;
      width: calc(100% - 2rem);
      padding: 1rem;
      div{
        flex: 1;
        // width: 2rem;
        text-align: center;
        font-size: 0.43rem;
        letter-spacing: 0.03rem;
        box-shadow: 0rem 0.11rem 0.64rem 0rem 
          rgba(48, 121, 243, 0.24);
        border-radius: 1.6rem;
        height: 1.09rem;
        line-height: 1.09rem;
      }
      .go_live{
        color: #ffffff;
        background-image: linear-gradient(270deg, 
          #1b33ff 0%, 
          #30c7f3 100%);
        
      }
    }
  }
  .add_btn{
    margin: 1.31rem auto;
    height: 1.09rem;
    width: 4.33rem;
    font-size: 0.43rem;
    font-weight: normal;
    letter-spacing: 0rem;
    color: #333333;
    background-color: #ffffff;
    border-radius: 2.13rem;
    border: solid 0.03rem #cccccc;
    line-height: 1.09rem;
    text-align: center;
    color: #333333;
    /* padding-bottom: 30rpx; */
    img{
      vertical-align: middle;
    }
  }
}
</style>

<style lang="scss" scoped>
  p,div{margin:0;padding: 0;}
  .header_box{
    margin:0.48rem 0.68rem;
    display: flex;align-items:center;
    .search_box{
      width: 10rem;border:1px solid #e1e1e1;border-radius: 10px;
    }
    input{
      font-size: 0.2rem;
    }
    .btn{
      width: 2.93rem;
	    height: 1.28rem;
      font-size: 0.43rem;
      letter-spacing: 0rem;
      color: #333333;
      text-align: center;
      display: inline-block;
      line-height: 1.28rem;
      margin:0 0.2rem;
      // border:1px solid #e1e1e1;
      background-color: #ffffff;
      box-shadow: 0rem 0.11rem 0.64rem 0rem 
        rgba(48, 121, 243, 0.16);
      border-radius: 0.64rem;
    }
  }
  .min_device_status_btn{display: none!important;margin: 0 0.68rem;}
  .status_btn{
    display: flex;align-items:center;margin-left: auto;font-size: 0.2rem;
    p{
      margin-right: 0.15rem;
      padding:2px 5px;
      font-size: 0.43rem;
      border-radius: 0.43rem;
      line-height: 0.85rem;
      width: 2.35rem;
	    height: 0.85rem;
      &.act{
        background-color: #f6bb42;
        color: white;
        span{
          background-color: white!important;
        }
      }
      span{
        display: inline-block;
        width: 0.43rem;
	      height: 0.43rem;
        border-radius: 50%;
        margin: 0.2rem;
        vertical-align:top;
      }
    }
  }
  .data_list{
    margin: 0.48rem 0 0.48rem 0.38rem;
    .item_box{
      width: 5.4rem;
      height: 6.03rem;
      vertical-align: top;
      box-shadow: 0rem 0.11rem 0.43rem 0rem 
		rgba(102, 102, 102, 0.16);
    display: inline-block;
	    border-radius: 10px;
      margin: .2rem .2rem 0 0;
      padding: 0.2rem;
      position: relative;
      .item_order_num{
        font-family: Source Han Sans CN;
        font-size: 0.37rem;
        // line-height: 0.64rem;
        letter-spacing: 0.04rem;
        color: #999999;
        margin: 0.42rem 0.43rem 0.64rem;
      }
      .guest_box{
        // padding: 0.2rem .2rem 0;
        font-size: 0.25rem;
        font-weight: bold;
        padding-left: 0.21rem;
        margin-bottom: 0.43rem;
          &.isDpf{
            border-left: 0.21rem solid rgb(246, 187, 66);
          }
          &.isDrz{
            border-left: 0.21rem solid rgb(72, 207, 173);
          }
          &.isYrz{
            border-left: 0.21rem solid rgb(160, 206, 203);
          }
          &.isYwc{
            border-left: 0.21rem solid rgb(170, 178, 189);
          }
        div{
          span{
            font-size: 0.2rem;
            font-weight:normal;
            color: #333333;
          }
        }
        
      }
      .more_box{
        line-height: 0.52rem;
        text-align:center;
        font-family: Source Han Sans CN;
        font-size: 0.32rem;
        letter-spacing: 0.03rem;
        color: #3079f3;
      }
      .btm_box{
        position: absolute;
        bottom: 0.43rem;
        width: 100%;
        left: 0.43rem;
        .left_info{
          display: inline-block;
          div{
            font-family: Source Han Sans CN;
            font-size: 0.37rem;
            // line-height: 0.64rem;
            letter-spacing: 0.04rem;
            color: #666666;
          }
        }
        .live_box{
          width: 1.92rem;
          height: 0.85rem;
          border-radius: 0.21rem;
          background-image: linear-gradient(270deg, #1b33ff 0%, #30c7f3 100%);
          text-align: center;
          font-size: 0.37rem;
          line-height: 0.85rem;
          letter-spacing: 0.02rem;
          color: #ffffff;
          float: right;
          position: absolute;
          bottom: 0.3rem;
          right: 0.86rem;
          vertical-align: middle;

        }
      }
      
    }
    
    
  }
  //媒体查询
  @media screen and (max-width: 799px) {
      .min_device_status_btn{
        display: flex!important;
        margin-left: 0.68rem!important;
      }
      .max_device_status_btn{
        margin-left: auto!important;
        display: none!important;
      }
  }
</style>

