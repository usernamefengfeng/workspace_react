import React, { Component } from 'react'
import {Redirect} from 'react-router-dom'
import {Card, Icon, List} from 'antd'

import LinkButton from '../../components/link-button'
import memoryUtils from '../../utils/memoryUtils'
import {BASE_IMG_URL} from '../../utils/constans'
import {reqCategory} from '../../api'

const Item = List.Item
/**
 * 商品管理---Product的子路由组件-----detail--详情
 */
export default class ProductDetail extends Component {

  state = {
    categoryName:''  //分类名称
  }

  //发送请求分类名称--id
  getCategory = async (categoryId) => {
    //发送请求--获取id
    const result = await reqCategory(categoryId)
    //判断成功状态--拿到分类名称
    if (result.status === 0) {
      const categoryName = result.data.name
      this.setState({categoryName})
    }
  }

  componentDidMount () {
    const product = memoryUtils.product
    if (product._id) {
      this.getCategory(product.categoryId)
    }
  }

  render() {
    //读取携带过来的state数据 
    const {categoryName} = this.state
    const product = memoryUtils.product

    if(!product || !product._id){
      return <Redirect to='/product' />
    }

    const title = (
      <span>
        <LinkButton onClick={()=>this.props.history.goBack()}>
          <Icon 
          type='arrow-left'
          style={{marginRight:10,fontSize:20}}
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
            <span>{product.name}</span>
          </Item>
          <Item>
            <span className='detail-left'>商品描述:</span>
            <span>{product.desc}</span>
          </Item>
          <Item>
            <span className='detail-left'>商品价格:</span>
            <span>{product.price}元</span>
          </Item>
          <Item>
            <span className='detail-left'>所属分类:</span>
            <span>{categoryName}</span>
          </Item>
          <Item>
            <span className='detail-left'>商品图片:</span>
            <span>
              {
                product.imgs.map(img=><img className='detail-img' key={img} src={BASE_IMG_URL+img} alt='img' />)
              }
            </span>
          </Item>
          <Item>
            <span className='detail-left'>商品详情:</span>
            <span dangerouslySetInnerHTML={{__html:product.detail}}></span>
          </Item>
        </List>
      </Card>
    )
  }
}