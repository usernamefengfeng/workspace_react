import React, { Component } from 'react'
import {
  Card,
  Input,
  Select,
  Icon,
  Table,
  Button,
  message
} from 'antd'
//引入节流函数
import throttle from 'lodash.throttle'

import {reqProducts,reqSearchProducts, reqUpdateStatus} from '../../api'
import LinkButton from '../../components/link-button'
import {PAGE_SIZE} from '../../utils/constans'
import memoryUtils from '../../utils/memoryUtils';

const Option = Select.Option

/**
 * 商品管理---Home
 */
export default class ProductHome extends Component {

  state = {
    loading:false,  //加载loading默认为不显示
    products:[],    //商品列表数据
    total:0,        //商品的总数量
    searchType:'productName',  //默认是按名称搜索
    searchName:'',   //搜索的关键字
  }

  //更新商品状态-----在售/已下架
  updateStatus = throttle ( async (productId,status) => {
    
    //计算更新后的值
    status = status === 1? 2 : 1
  
    //请求更新
    const result = await reqUpdateStatus(productId,status)
    //console.log(productId,status)
    //console.log(result)
    //数据请求成功
    if (result.status === 0) {
      //显示成功
      message.success('商品更新成功')
      //获取当前页面
      this.getProducts(this.pageNum)
    }
  },1000) 

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
        width:100,
        // dataIndex:'status',//默认status===1
        render:({_id,status})=>{
          let btnText = '下架'
          let text = '在售'
          //console.log(_id,status)
          if(status === 2){
            //console.log('+++++----')
            btnText = '上架'
            text = '已下架'
          }
          return (
            <span>
              <button onClick={()=>{this.updateStatus(_id,status)}} >{btnText}</button><br/>
              <span>{text}</span>
            </span>
          )
        }
      },
      {
        title:'操作',
        render:(product)=>(
          <span>
            {/* 将product对象使用state传递给目标路由组件 */}
            <LinkButton
              onClick={()=>{
                //在内存中保存product
              memoryUtils.product = product
                this.props.history.push('/product/detail')
                }}>
              详情
              </LinkButton>
            <LinkButton onClick={()=>{
              //在内存中保存product
              memoryUtils.product = product
              this.props.history.push('/product/addupdate')
            }}>修改</LinkButton>
          </span>
        )
      }
    ]
  }

  //异步获取指定页码的商品列表显示
  getProducts = async (pageNum) => {
    //保存当前请求的页码
    this.pageNum = pageNum
    const {searchType,searchName} = this.state
    //发送请求获取数据
    let result
    if (!this.isSearch) {
      result = await reqProducts(pageNum,PAGE_SIZE)
      //console.log('-----')
    } else {
      result = await reqSearchProducts({pageNum,pageSize:PAGE_SIZE,searchName,searchType})
      //console.log('++++++')
    }
    
    //判断是否获取数据成功
    if(result.status === 0){
      //取出数据
      const {total,list} = result.data
      //更新状态
      this.setState({
        total,
        products:list
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

    const {total, products, loading, searchType, searchName} = this.state

    const title = (
      <span>
        <Select
         style={{width:200}} 
         value={searchType}  //搜索类型
         onChange={(value)=>this.setState({searchType:value})} 
         >
          <Option value="productName">按名称搜索</Option>
          <Option value="productDesc">按描述搜索</Option>
        </Select>
        <Input
         style={{width:200,margin:'0 10px'}} 
         placeholder="请输入关键字"
         value={searchName}
         onChange={(event)=>this.setState({searchName:event.target.value})} 
          />
        <Button type="primary" onClick={()=>{
          this.isSearch = true
          this.getProducts(1)  //默认显示从第一页开始
        }} >搜索</Button>
      </span>
    )
    
    const extra = (
      <Button type='primary' onClick={()=>{
        memoryUtils.product = {}
        this.props.history.push('/product/addupdate') //添加商品路径的跳转
      }}>
        <Icon type='plus' />
        添加商品
      </Button>
    )

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
            defaultPageSize:PAGE_SIZE,  //每页条目数
            showQuickJumper:true,
            onChange:this.getProducts,
            current:this.pageNum        //页码
          }}
        />
      </Card>
    )
  }
}