/* 
包含应用中所有请求的接口函数
函数的返回值都是promise对象
*/

import ajax from './ajax'

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


const name = 'admin'
const pwd = 'admin'
reqLogin(name,pwd).then(result=>{
  console.log('成功了',result)
})