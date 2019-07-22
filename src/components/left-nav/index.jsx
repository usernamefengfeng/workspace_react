import React, {Component} from 'react'
import {Link,withRouter} from 'react-router-dom'
import { Menu, Icon } from 'antd'

import logo from '../../assets/images/logo.png'
import menuList from '../../config/menuConfig'
import './index.less'


const SubMenu = Menu.SubMenu
/*
左侧导航组件
 */
class LeftNav extends Component {


  //遍历得到导航列表
  /* 
  根据menu的数据数组生成对应的标签数组
  使用map() + 递归调用
  */
  /* menuNodes = (menuList) => {
    return menuList.map(item => {
      //判断是否有子组件
      if(!item.children){
        return (
          <Menu.Item key={item.key}>
            <link to={item.key}>
              <Icon type={item.icon} />
              <span>{item.title}</span>
            </link>
          </Menu.Item>
        )
      } else {
        return (
          <SubMenu
            key={item.key}
            title={
              <span>
                <Icon type={item.icon} />
                <span>{item.title}</span>
              </span>
            }
          >
            {this.menuNodes(item.children)}
          </SubMenu>
        )
      }
    })
  }
 */


  /* 
  根据menu的数据数组生成对应的标签数组
  使用reduce() + 递归调用
  */

  getMenuNodes = (menuList) =>{
    //得到当前请求路由路径
    const path = this.props.location.pathname
    console.log(path)  //---/home
    return menuList.reduce((pre,item)=>{
      //向pre添加menu.item
      if(!item.children){
        pre.push((
          <Menu.Item key={item.key}>
            <Link to={item.key}>
              <Icon type={item.icon} />
              <span>{item.title}</span>
            </Link>
          </Menu.Item>
        ))
      }else{
        //查找一个与当前请求路径匹配的子item
        const cItem = item.children.find(cItem=>path.indexOf(cItem.key)===0)
        //如果存在，说明当前的子列需要打开
        if(cItem){
          this.openKey = item.key
        }
        // 向pre添加<SubMenu>
        pre.push((
          <SubMenu
            key={item.key}
            title={
              <span>
                <Icon type={item.icon} />
                <span>{item.title}</span>
              </span>
            }
          >
            {this.getMenuNodes(item.children)}
          </SubMenu>
        ))
      }
      return pre
    },[])
  }


  //DOM即将挂载到页面上
  componentWillMount(){
    this.menuNodes = this.getMenuNodes(menuList)
  }

  render() {

    const path = this.props.location.pathname

    //得到需要打开菜单项的key
    const openKey = this.openKey
    return (
      <div className="left-nav">
        <Link to='/' className="left-nav-header">
          <img src={logo} alt="logo"/>
          <h1>硅谷后台</h1>
        </Link>

        <Menu
          selectedKeys={[path]}
          defaultOpenKeys={[openKey]}  //默认打开列表子项item
          mode="inline"
          theme="dark"
        >
          {
            this.menuNodes
          }
        </Menu>
        {/* <Menu
          defaultSelectedKeys={['/home']}
          defaultOpenKeys={['sub1']}
          mode="inline"
          theme="dark"
        >
          <Menu.Item key="/home">
            <Icon type="pie-chart" />
            <span>首页</span>
          </Menu.Item>
          
          <SubMenu
            key="sub1"
            title={
              <span>
                <Icon type="mail" />
                <span>商品列表</span>
              </span>
            }
          >
            <Menu.Item key="5">商品</Menu.Item>
            <Menu.Item key="6">列表</Menu.Item>
          </SubMenu>
        </Menu> */}
      </div>
    )
  }
}

/* 
withRouter高阶组件:
包装非路由组件, 返回一个新的组件
新的组件向非路由组件传递3个属性: history/location/match
*/
export default withRouter(LeftNav)