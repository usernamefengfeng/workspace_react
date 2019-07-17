import React, { Component } from 'react'
import {
  Card,
  Input,
  Select,
  Icon,
  Table,
  Button
} from 'antd'

import {reqProducts} from '../../api'
import LinkButton from '../../components/link-button'

const Option = Select.Option

/**
 * 商品管理---Home
 */
export default class ProductHome extends Component {

  state = {
    loading:false,  //加载loading默认为不显示
    products:[],    //商品列表数据
    total:0,        //商品的总数量
  }

  initColumns = () => {
    this.columns = [
      {
        title:'商品名称',
        dataIndex:'name',
      },
      {
        title:'商品描述',
        dataIndex:'desc',
      },
      {
        title:'价格',
        dataIndex:'price',
        render:(price)=>'￥'+price,
      },
      {
        title:'状态',
        dataIndex:'status',
        render:(status)=>{
          let btnText = '下架'
          let text = '在售'
          if(status === 2){
            btnText = '上架'
            text = '已下架'
          }
          return (
            <span>
              <button>{btnText}</button>
              <span>{text}</span>
            </span>
          )
        }
      },
      {
        title:'操作',
        render:(product)=>(
          <span>
            <LinkButton>详情</LinkButton>
            <LinkButton>修改</LinkButton>
          </span>
        )
      }
    ]
  }

  //异步获取指定页码的商品列表显示
  getProducts = async (pageNum) => {
    //发送请求获取数据
    const result = await reqProducts(pageNum,2)
    
    //判断是否获取数据成功
    if(result.status === 0){
      //取出数据
      const {total,list} = result.data
      //更新状态
      this.setState({
        total,
        product:list
      })
    }
  }

  componentWillMount(){
    this.initColumns()
  }

  componentDidMount(){
    //获取第一页显示
    this.getProducts(1)
  }

  render() {

    const title = (
      <span>
        <Select style={{width:200}} value="1" >
          <option value="1">按名称搜索</option>
          <option value="2">按描述搜索</option>
        </Select>
        <Input style={{width:200,margin:'0 10px'}} placeholder="请输入关键字" />
        <Button type="primary">搜索</Button>
      </span>
    )
    
    const extra = (
      <Button type='primary' >
        <Icon type='plus' />
        添加商品
      </Button>
    )

    const {total, products, loading} = this.state

    return (
      <Card title={title} extra={extra}>
        <Table
          bordered={true}
          rowKey="_id"
          loading={loading}
          columns={this.columns}
          dataSource={products}
          pagination={{
            total,
            defaultPageSize:2,
            showQuickJumper:true,
            onChange:this.getProducts
          }}
        />
      </Card>
    )
  }
}