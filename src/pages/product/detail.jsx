import React, { Component } from 'react'
import {Card, Icon, List} from 'antd'

import LinkButton from '../../components/link-button'

const Item = List.Item
/**
 * 商品管理---ProductDetail
 */
export default class ProductDetail extends Component {
  render() {
    const title = (
      <span>
        <LinkButton>
          <Icon 
          type='arrow-left'
          style={{marginRight:10,fontSize:20}}
          onClick={()=>this.props.history.goBack()}
          />
        </LinkButton>
        <span>商品详情</span>
      </span>
    )
    return (
      <Card title={title} className='detail'>
        <List>
          <Item>
            <span className='detail-left'>商品名称:</span>
            <span></span>
          </Item>
          <Item>
            <span className='detail-left'>商品描述:</span>
            <span></span>
          </Item>
          <Item>
            <span className='detail-left'>商品价格:</span>
            <span></span>
          </Item>
          <Item>
            <span className='detail-left'>所属分类:</span>
            <span></span>
          </Item>
          <Item>
            <span className='detail-left'>商品图片:</span>
            <span></span>
          </Item>
        </List>
      </Card>
    )
  }
}