import moment from 'moment'
//删除cookie
// export function delCookie (name) {
//   // setCookie(name, "", -1);
//   /*let exp = new Date();
//   exp.setTime(exp.getTime() - 1);
//   let cval = getCookie(name);
//   if (cval != null)
//     document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();*/
// }//获取当前到前面指定天数的时间段
export function getDate(dateNum){
    let dateArray=[];
    dateArray.push(moment().format('YYYY/MM/DD'))
    for(var i=1;i<dateNum;i++){
      dateArray.push(moment().subtract(i, 'day').format('YYYY/MM/DD'))
    }
    return dateArray;
}
export default {
  convertArrayToObj(arr, key) {
    let obj = {};
    arr.forEach((item) => {
      let k = item[key] === undefined?key:item[key];
      obj[k] = item;
    })
    return obj;
  },
  //字符串截取
  urlGet(url,name){
    if(url&&name){
      var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
      var r = url.substr(url.indexOf("\?")+1).match(reg);
      if (r!=null) return unescape(r[2]); return null;
    }else{
      return '参数缺少'
    }
  },
  //设置cookie,增加到vue实例方便全局调用
  setCookie (c_name, value, expiredays) {
    let exdate = new Date();
    exdate.setDate(exdate.getDate() + expiredays);
    document.cookie = c_name + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString());
  },
  //获取cookie、
  getCookie(name) {
    let arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr == document.cookie.match(reg))
      return (arr[2]);
    else
      return null;
  },
  
}
