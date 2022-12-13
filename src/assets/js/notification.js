 // 封装一个函数每次请求成功后，给出用户相对应的提示信息
 const notification = function(result,fail,success,status){
  if(result.meta.status!==status){
    return this.$message.error(fail);
  }else{
    this.$message.success(success);
  }
};

export default notification;