/* 
将用户的信息存储在本地的内存中，提高效率
*/
import storageUtils from './storageUtils'

export default {
  //用来存储登陆用户的信息, 初始值为local中读取的user
  user: storageUtils.getUser()
}