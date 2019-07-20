import React, { Component } from 'react'
import {Card, Icon, Select, Input, Form, Button } from 'antd'

import LinkButton from '../../components/link-button'
//import PicturesWall from './pictures-wall'
import memoryUtils from '../../utils/memoryUtils'
import {reqCategorys} from '../../api'

const Item = Form.Item
const Option = Select.Option
/**
 * 商品管理---Product的子路由组件-----AddUpdateProduct--添加/修改
 */
class AddUpdateProduct extends Component {

  state = {
    categorys:[]
  }

  //发送请求分类名称--id
  getCategorys = async () => {
    //发送请求--获取id
    const result = await reqCategorys()
    //判断成功状态--拿到分类数组
    if (result.status === 0) {
      const categorys = result.data
      this.setState({categorys})
    }
  }

  /* 
    对价格进行自定义验证
  */
 validatePrice = (rule, value, callback) => {
   if (value === '') {
     callback()
   } else if(value * 1 <= 0 ) {
     callback('价格必须大于0')
   } else {
     callback()
   }
 }

  /* 
    处理提交的回调--统一验证
  */
  handleSubmit = (event) => {
   //阻止事件的默认行为(提交表单)
   event.preventDefault()
   //进行统一的表单验证
   this.props.form.validateFields((err,values) => {
    //  if (!err) {
    //    const {name,desc,pirce,categoryId} = values
    //  }
   })
  }

  componentWillMount () {
    this.product = memoryUtils.product
    this.isUpdate = !!this.product._id
  }

  componentDidMount () {
    this.getCategorys()
  }

  render() {

    //读取携带过来的state数据 
    const {categorys} = this.state
    const {product} = this
    const {getFieldDecorator} = this.props.form

    const title = (
      <span>
        <LinkButton onClick={()=>this.props.history.goBack()}>
          <Icon 
          type='arrow-left'
          style={{marginRight:10,fontSize:20}}
          />
        </LinkButton>
        <span>商品添加</span>
      </span>
    )

    //指定form中的所有item布局
    const formLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 8 }
    }

    return (
      <Card title={title}>
        <Form {...formLayout} onSubmit={this.handleSubmit} >
          <Item label='商品名称'>
            {getFieldDecorator('name',{
              initialValue:product.name,
              rules: [
                { required: true, message: '必须输入商品名称!' }
              ],
            })(<Input placeholder='请输入商品名称'/>)}
          </Item>
          <Item label='商品描述'>
            {getFieldDecorator('desc',{
              initialValue:product.desc,
              rules: [
                { required: true, message: '必须输入商品描述!' }
              ],
            })(<Input placeholder='请输入商品描述'/>)}
          </Item>
          <Item label='商品价格'>
            {getFieldDecorator('pirce',{
              initialValue:product.pirce,
              rules: [
                { required: true, message: '必须输入商品价格!' },
                {validator: this.validatePrice}
              ],
            })(<Input type='number' placeholder='请输入商品价格' addonAfter='元'/>)}
          </Item>
          <Item label='商品分类'>
            {getFieldDecorator('categoryId',{
              initialValue:product.categoryId || '',
              rules: [
                { required: true, message: '必须输入商品分类!' }
              ],
            })(
              <Select>
                <Option value=''>未选择</Option>
                {
                  categorys.map(c => <Option value={c._id} key={c._id}>{c.name}</Option>)
                }
              </Select>
            )}
          </Item>
          <Item label='商品图片'>
            <div>商品图片组件</div>
          </Item>
          <Item label='商品详情'>
            <div>商品详情组件</div>
          </Item>
          <Item>
            <Button type='primary' htmlType='submit'>提交</Button>
          </Item>
        </Form>
      </Card>
    )
  }
}

export default Form.create()(AddUpdateProduct)