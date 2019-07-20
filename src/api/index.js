/* 
包含应用中所有请求的接口函数
函数的返回值都是promise对象
*/

import ajax from './ajax'
import jsonp from 'jsonp'
import {message} from 'antd'

// const BASE = 'http://localhost:5000'
const BASE = ''

//请求登录
//第一种写法：简写
export const reqLogin = (username,password) =>ajax.post(BASE+'/login',{username,password})
//第二种写法：
/* export const reqLogin = (username,password) => {
  ajax({
    method: 'post',
    url: BASE + '/login',
    data:{  //data是对象, 默认使用json格式的请求体携带参数数据
      username,
      password
    }
  })
} */


//jsonp请求的接口-----天气
export const reqWeather = (city) => {
  return new Promise((resolve,reject)=>{
    const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`
    //发送jsonp请求
    jsonp(url,{},(error,data)=>{
      //成功-----取出数据
      if(!error && data.status==='success'){
        const {dayPictureUrl, weather} = data.results[0].weather_data[0]
        resolve({dayPictureUrl,weather})
      }else{
        //失败-----输出错误信息
        message.error('获取天气信息失败')
      }
    })
  })
}

//获取分类列表
/* export const reqCategorys = () => ajax.get(BASE + '/manage/category/list')

export const reqCategorys = () => ajax({
  method:'GET',
  url:BASE + '/manage/category/list'
}) */
export const reqCategorys = () => ajax(BASE + '/manage/category/list')

//添加分类
export const reqAddCategory = (categoryName) => ajax.post(BASE + '/manage/category/add',{
  categoryName
})

//修改分类
export const reqUpdateCategory = ({categoryId,categoryName}) => ajax.post(BASE + '/manage/category/update',{
  categoryId,
  categoryName
})

//根据分类id获取分类
export const reqCategory = (categoryId) => ajax(BASE + '/manage/category/info',{
  params:{
    categoryId
  }
})

//获取商品的分页列表
export const reqProducts = (pageNum,pageSize) => ajax(BASE + '/manage/product/list',{
  params:{  //包含所有query参数的对象
    pageNum,
    pageSize
  }
})

//商品分页列表的搜索--名称/描述内容
export const reqSearchProducts = ({pageNum,pageSize,searchName,searchType}) => ajax(BASE + '/manage/product/search',{
  method:'GET',
  params:{
    pageNum,
    pageSize,
    [searchType]:searchName
  }
})

//商品的状态更新--上下架处理
export const reqUpdateStatus = (productId,status) => ajax(BASE + '/manage/product/updateStatus',{
  method:'POST',
  data:{
    productId,
    status
  }
})
/* export const reqUpdateStatus = (productId,status) => ajax.post(BASE + '//manage/product/updateStatus',{
  productId,
  status
}) */



/* const name = 'admin'
const pwd = 'admin'
reqLogin(name,pwd).then(result=>{
  console.log('成功了',result)
}) */


/* 
jsonp解决ajax跨域的原理
  1). jsonp只能解决GET类型的ajax请求跨域问题
  2). jsonp请求不是ajax请求, 而是一般的get请求
  3). 基本原理
   浏览器端:
      动态生成<script>来请求后台接口(src就是接口的url)
      定义好用于接收响应数据的函数(fn), 并将函数名通过请求参数提交给后台(如: callback=fn)
   服务器端:
      接收到请求处理产生结果数据后, 返回一个函数调用的js代码, 并将结果数据作为实参传入函数调用
   浏览器端:
      收到响应自动执行函数调用的js代码, 也就执行了提前定义好的回调函数, 并得到了需要的结果数据
*/