import React, { Component } from 'react'
import {Redirect} from 'react-router-dom'

import memoryUtils from '../../utils/memoryUtils.js'

export default class Admin extends Component {
  render() {
    //读取保存的user，如果不存在，就直接跳转到登录页面
    const user = memoryUtils.user
    if(!user._id){
      //this.props.history.replace('/login')//----事件回调函数中进行路由跳转
      return <Redirect to='/login'/>  //---自动跳转到指定路径
    }
    return (
      <div>
        Hello,{user.username}
      </div>
    )
  }
}