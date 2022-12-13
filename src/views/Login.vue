<template>
  <div class="login-container">
    <div class="login_box">
      <!-- 图像区域 -->
      <div class="img_box">
        <img src="../assets/logo.png"/>
      </div>
      <!-- 登录表单区域 -->
      <el-form ref="formReset" :rules="loginFormRules" :model="loginForm" label-width="0px" class="login_form">
        <!-- 用户名 -->
        <el-form-item prop="username"> 
          <el-input v-model="loginForm.username" prefix-icon="el-icon-user-solid" class="login_form_input"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" prefix-icon="el-icon-lock" type="password" class="login_form_input"></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="login_form_btn" >
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name:'Login',
  data() {
    return {
      loginForm:{
        username:'admin',
        password:'123456'
      },
      // 表单验证规则
      loginFormRules:{
        username: [
            { required: true, message: '请输入用户名称', trigger: 'blur' },
            { min: 3, max: 10, message: '用户名的长度在 3 到 10 个字符', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入登录密码', trigger: 'blur' },
            { min: 6, max: 15, message: '密码的长度在 6 到 15 个字符', trigger: 'blur' }
          ],
      }
    };
  },
  methods: {
    reset() {
      this.$refs.formReset.resetFields();
    },
    login(){
      this.$refs.formReset.validate(async res=>{
        if(!res){return} // 当用户名和密码的输入的格式有误就不发起请求
        // 发起请求
        const {data:result} = await this.$http.post('login',this.loginForm);
        // status为200说明用户名存在
        if(result.meta.status===200){
          this.$message.success('登录成功');
          // 将登录之后的 token 保存在客户端 sessionStorage中
          // 项目中出了登录之外的API接口，必须要登录之后才能访问
          // token正在当前网站打开期间有效
          sessionStorage.setItem('token',result.data.token);
          // 通过编程式导航跳转到/home
          this.$router.push('/home')
        }else{
          this.$message.error('登录失败');
        }
      })
    }
  },
}
</script>

<style lang="less" scoped>
.login-container {
  background-color: #2b4b6b;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 400px;
  background-color: rgba(0, 25, 25, 0.5);
  border-radius: 20px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.img_box {
  width: 130px;
  height: 130px;
  border: 1px solid black;
  border-radius: 50%;
  padding: 5px;
  position: absolute;
  left: 50%;
  top: -65px;
  transform: translate(-50%);
  background-color: rgb(210, 220, 14);
  img {
    width: 100%;
    height: 100%;
    border: 1px solid white;
    border-radius: 50%;
    margin-top: -2.3px;
    background-color: white;
  }
}
.login_form{
  width: 90%;
  position: absolute;
  top: 25%;
  left: 5%;
  .login_form_input{
    margin-top: 15px;
  }
  .login_form_btn{
    position: relative;
    display: flex;
    justify-content:space-between;
    top: 30px;
  }
}
</style>
