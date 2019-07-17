import React, { Component } from 'react'
import { Card, Table, Button, Icon, message, Modal} from 'antd';

//本地库
import LinkButton from '../../components/link-button'
import { reqCategorys, reqAddCategory, reqUpdateCategory } from '../../api'
import AddUpdateForm from './add-update-form'

/**
 * 分类管理
 */
export default class Category extends Component {
   
  //定义初始状态
  state = {
    categorys:[],  //所有分类的数组
    loading:false,  //发送请求时显示
    showStatus:0,   //0--不显示， 1--显示添加， 2--修改分类列表
  }


  //初始化table的所有列信息的数组
  initColumns = () => {
    this.columns = [
      {
        title: '分类的名称',
        dataIndex: 'name',
      },
      {
        title: '操作',
        width:300,
        render:(category)=> <LinkButton onClick={()=>{
          this.category = category  //保存当前分类，其他地方都可以读到
          this.setState({showStatus:2})
        }}>修改分类</LinkButton>
      },
    ];
  }


  //异步获取分类列表显示-----一次获取所有的数据
  getCategorys =async () => {
    //显示loading
    this.setState({loading:true})
    //发送ajax请求
    const result = await reqCategorys()
    // console.log(this.category)
    //隐藏loading
    this.setState({loading:false})
    //判断数据是否请求成功
    if(result.status === 0) { //成功
      //取出分类列表
      const categorys = result.data
      //更新状态Categorys数据
      this.setState({categorys})
    }else{ //失败
      message.error('获取分类列表失败')
    }
  }


  //点击按钮添加数据
  handleOk = () => {

    //进行表单的验证
    this.form.validateFields(async (err,values)=>{
      if(!err){
        //验证通过，得到数据
        const {categoryName} = values

        const {showStatus} = this.state
        let result
        //判断状态------添加/修改/隐藏
        if(showStatus === 1){  //添加
          //发送添加的请求
          result = await reqAddCategory(categoryName)
        }else{  //修改
          const categoryId = this.category._id
          result = await reqUpdateCategory(categoryId,categoryName)
        }

        //重置输入的数据(变成初始值)
        this.form.resetFields()
        //更新添加后列表数据状态
        this.setState({showStatus:0})

        const action = showStatus===1? '添加':'修改'
        //根据响应的结果，做出不同的处理
        if(result.status === 0){
          //重新获取分类列表显示
          this.getCategorys()
          //console.log(this.getCategorys())
          message.success(action+'分类成功')
        }else{
          message.error(action+'分类失败')
        }
      }
    })
  }


  //点击取消的回调
  handleCancel = () => {
    this.form.resetFields()
    this.setState({showStatus:0})
  }

  componentWillMount(){
    this.initColumns()
  }

  componentDidMount(){
    this.getCategorys()
  }

  render() {

    const { categorys, loading, showStatus } = this.state
    //读取更新的分类名称
    const category = this.category || {}
    
    //右上角按钮
    const extra = (
      <Button type="primary" onClick={()=>{this.setState({showStatus:1})}}>
        <Icon type="plus"/>
        添加
      </Button>
    )

    return (
      <Card extra={extra}>
        <Table 
        bordered   //-----bordered={true}
        rowKey="_id"
        loading={loading}
        columns={this.columns}
        dataSource={categorys}
        pagination={{ defaultPageSize: 3, showQuickJumper: true}}
        />

        <Modal
          title={showStatus === 1? '添加分类':'修改分类'}
          visible={showStatus !== 0}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          {/* 将子组件传递过来的form对象保存到当前的组件对象上 */}
          <AddUpdateForm setForm={form => this.form=form} categoryName={category.name}/>
        </Modal>
      </Card>
    )
  }
}