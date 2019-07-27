/* 
封装的是能发ajax请求的函数, 向外暴露的本质是axios
1. 解决post请求携带参数的问题: 默认是json对象格式, 需要转换成urlencode格式
2. 让请求成功的结果不再是response, 而是response.data的值
3. 统一处理所有请求的异常错误
*/

import axios from 'axios'
import qs from 'qs'  //将JSON格式转换数据格式为urlencoded
import { message } from 'antd'


//添加请求拦截器，让post请求的请求体格式为urlencoded格式
//在真正发请求前执行
axios.interceptors.request.use((config)=>{
  //得到请求的方式和请求体的数据
  const {method,data} = config
  //处理post请求，将data对象转换为query参数格式字符串
  if(method.toLocaleLowerCase() === 'post' && typeof data === 'object'){
    config.data = qs.stringify(data) // username=admin&password=admin
  }
  return config
})

// 添加响应拦截器
  // 功能1: 让请求成功的结果不再是response, 而是response.data的值
  // 功能2: 统一处理所有请求的异常错误
//在请求返回之后并且在我们指定的请求响应回调函数之前执行
axios.interceptors.response.use((response)=>{
  //返回的结果就会交给我们指定的请求响应回调函数
  return response.data
},(error)=>{  //统一处理所有的请求异常
  message.error('请求出错:'+message.error)
  //返回一个pending状态的promise，终止promise链
  return new Promise(()=>{})
})

export default axios