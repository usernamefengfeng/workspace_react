import React, {Component} from 'react'
import {Link,withRouter} from 'react-router-dom'
import { Menu, Icon, Button } from 'antd'

import logo from '../../assets/images/logo.png'
import './index.less'


const { SubMenu } = Menu
/*
左侧导航组件
 */
class LeftNav extends Component {

  render() {
    return (
      <div className="left-nav">
        <Link to='/' className="left-nav-header">
          <img src={logo} alt="logo"/>
          <h1>硅谷后台</h1>
        </Link>

        <Menu
          defaultSelectedKeys={['/home']}
          defaultOpenKeys={['sub1']}
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