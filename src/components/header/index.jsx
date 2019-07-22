import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'
import {Modal} from 'antd'

import LinkButton from '../link-button'
import menuList from '../../config/menuConfig'
import {reqWeather} from '../../api'
import storageUtils from '../../utils/storageUtils'
import memoryUtils from '../../utils/memoryUtils'
import {formateDate} from '../../utils/dateUtils'
import './index.less'
/*
头部组件
 */
class Header extends Component {

  //初始状态
  state = {
    currentTime: formateDate(Date.now()), // 当前时间字符串
    dayPictureUrl: '', // 天气图片url
    weather: '', // 天气的文本
  }

  //获取当前时间---并且更新时间状态
  getTime = ()=>{
    this.intervalId = setInterval(()=>{
      const currentTime = formateDate(Date.now())
      this.setState({currentTime})
    },1000)
  }

  //调用接口，获取当前天气--更新天气状态
  getWeather = async ()=>{
    //调用接口，请求异步，获取数据
    const {dayPictureUrl,weather} = await reqWeather('北京')
    //更新状态
    this.setState({dayPictureUrl,weather})
  }

  //当前显示的title
  getTitle = ()=>{
    //得到当前的请求路径
    const path = this.props.location.pathname
    let title
    menuList.forEach( item => {
      if(item.key===path){
        title = item.title
      }else if(item.children){
        //在所有的item的子item中查找匹配
        const cItem = item.children.find(cItem=>path.indexOf(cItem.key)===0)
        //如果有---匹配
        if(cItem){
          title = cItem.title  //拿到title
        }
      }
    })
    return title
  }

  //点击退出登录
  logout = ()=>{
    // 显示确认框--对话框
    Modal.confirm({
      content: '确定退出吗?',
      onOk: () => {
        console.log('OK', this)//确认this指向问题
        // 删除保存的user数据
        storageUtils.removeUser() //local中保存的user
        memoryUtils.user = {}     //内存中保存的user
        // 跳转到login
        this.props.history.replace('/login')
      }
    })
  }

  /* 
  第一次render()之后执行一次
  一般在此执行异步操作: 发ajax请求/启动定时器
  */
 componentDidMount(){
   //获取当前时间
   this.getTime()
   //获取当前天气
   this.getWeather()
 }

 //当前组件卸载前调用该方法--清除定时器
 componentWillUnmount(){
   clearInterval(this.intervalId)
 }

  render() {

    const {dayPictureUrl,weather,currentTime} = this.state
    const username = memoryUtils.user.username
    //得到当前需要显示的title
    const title = this.getTitle()
    return (
      <div className='header'>
        <div className="header-top">
          <span>欢迎，{username}</span>
          <LinkButton onClick={this.logout}>退出</LinkButton>
        </div>
        <div className="header-bottom">
          <div className="header-bottom-left">{title}</div>
          <div className="header-bottom-right">
            <span>{currentTime}</span>
            <img src={dayPictureUrl} alt="weather"/>
            <span>{weather}</span>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(Header)