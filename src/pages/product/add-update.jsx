import React, { Component } from 'react'
import {Card, Icon, Select, Input, Form, Button, message} from 'antd'

import LinkButton from '../../components/link-button'
import PicturesWall from './pictures-wall'
import RichTextEditor from './rich-text-editor'
import memoryUtils from '../../utils/memoryUtils'
import {reqCategorys,reqAddUpdateProduct} from '../../api'

const Item = Form.Item
const Option = Select.Option
/**
 * 商品管理---Product的子路由组件-----AddUpdateProduct--添加/修改
 */
class AddUpdateProduct extends Component {

  state = {
    categorys:[]
  }

  constructor(props){
    super(props);
    //创建ref容器，并保存到组件对象中
    this.pwRef = React.createRef()  //图片
    this.editorRef = React.createRef()  //富文本编辑器
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
   this.props.form.validateFields( async (err,values) => {
     if (!err) {
       const {name,desc,pirce,categoryId} = values

       //收集上传的图片文件名数组
       const imgs = this.pwRef.current.getImgs()

       //输入商品详情的标签字符串
       const detail = this.editorRef.current.getDetail()
       //封装product对象
       const product = {name,desc,pirce,categoryId,imgs,detail}
       //判断是否存在商品的id-----添加/修改
       if (this.isUpdate) {
         product._id = this.product._id
       }
       //发送请求添加或修改--商品
       const result = await reqAddUpdateProduct(product)
       //判断成功状态
       if (result.status === 0) { //成功
         message.success(`${this.isUpdate ? '修改' : '添加'}商品成功`)
         this.props.history.replace('/product')
       } else {
         message.error(result.msg)
       }
     }
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
    const {isUpdate,product} = this
    const {getFieldDecorator} = this.props.form

    const title = (
      <span>
        <LinkButton onClick={()=>this.props.history.goBack()}>
          <Icon 
          type='arrow-left'
          style={{marginRight:10,fontSize:20}}
          />
        </LinkButton>
        <span>{isUpdate ? '修改商品':'添加商品'}</span>
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
            {/* 将容器交给需要标记的标签对象, 在解析时就会自动将标签对象保存到容器中(属性名为: current, 属性值标签对象) */}
            <PicturesWall ref={this.pwRef} imgs={product.imgs} />
          </Item>
          <Item label='商品详情' wrapperCol={{ span: 20 }}>
            <RichTextEditor ref={this.editorRef} detail={product.detail} />
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