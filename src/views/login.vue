<template>
  <div class="login_container">
    <div class="login_box">
<!--      头像区域-->
      <div class="avatar_box">
        <img src="../assets/img/vue.jpg" alt="">
      </div>
<!--      登录表单区域-->
      <el-form  label-width="0px" class="login_form" :model="loginForm" :rules="loginFormRules" ref="loginFormRef">
<!--      账号  -->
        <el-form-item prop="username">
          <el-input  prefix-icon="el-icon-user" v-model="loginForm.username"></el-input>
        </el-form-item>
<!--        密码-->
        <el-form-item prop="password">
          <el-input  prefix-icon="el-icon-lock" v-model="loginForm.password" type="password"></el-input>
        </el-form-item>
<!--      登录按钮区域  -->
        <el-form-item class="btns">
          <el-button type="primary" @click="submitForm">登录</el-button>
          <el-button type="info" @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>

    </div>
  </div>
</template>

<script>
export default {
  name: "login",
  data() {
    return {
      //这是登录表单数据绑定的对象
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      //表单验证规则
      loginFormRules: {
        //验证用户名是否合法
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在3~10个字符', trigger: 'blur' },
        ],
        //验证密码是否合法
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在6~15个字符', trigger: 'blur' },
        ]
      }

    }
  },
  methods: {
    submitForm() {
      //console.log('登录');
      this.$refs.loginFormRef.validate(valid => {
        if (!valid) return
        this.$axios.post("login", this.loginForm).then(res => {{
          if (res.data.meta.status !== 200) return this.$message.error('登录失败!')
          console.log(res);
          this.$message.success('登录成功')
          window.sessionStorage.setItem('token', res.data.data.token)
          this.$router.push('/home')
        }})
      })
    },
    resetForm() {
      // console.log('重置');
      this.$refs.loginFormRef.resetFields()
    }

  }
}
</script>

<style Lang="less" scoped>
  .login_container {
    background-color: #2b4b6b;
    height: 100%;
  }
  .login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
  }
  .avatar_box img {
    height: 100%;
    width: 100%;
    border-radius: 50%;
    background-color: #eee;
  }
  .btns {
    display: flex;
    justify-content: flex-end;
  }
  .login_form {
    position: absolute;
    bottom: 0px;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }

</style>