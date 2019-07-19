import React, { Component } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import ProductHome from './home'
import ProductAddUpdate from './add-update'
import ProductDetail from './detail'
import './product.less'
/**
 * 商品管理
 */
export default class Product extends Component {
  render() {
    return (
      <Switch>
        <Route to="/product" exact component={ProductHome} />
        <Route to="/product/addupdate" component={ProductAddUpdate} />
        <Route to="/product/detail" component={ProductDetail} />
        <Redirect to="product" />
      </Switch>
    )
  }
}