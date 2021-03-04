<template>
<el-dialog
    :title="title"
    :visible.sync="DialogVisible"
    width="50%"
    @close="addDialogClose">

  <el-form :model="UserForm" :rules="addUserFormRules" ref="FormRef" label-width="70px">
    <el-form-item label="用户名" prop="username" disabled>
      <el-input v-model="UserForm.username" :disabled="!operateType"></el-input>
    </el-form-item>
    <slot></slot>
    <el-form-item label="邮箱" prop="email">
      <el-input v-model="UserForm.email"></el-input>
    </el-form-item>
    <el-form-item label="手机号" prop="mobile">
      <el-input v-model="UserForm.mobile"></el-input>
    </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="DialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="UserOperate">确 定</el-button>
  </span>
</el-dialog>
</template>

<script>
export default {
  name: "MyDialog",
  props: {
    operateType: {
      type: Boolean,
      default: false
    },
    UserForm: {
      type: Object,

    },
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    //验证邮箱的规则
    var checkEmail = (rule, value, callback) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      //合法对象
      if (regEmail.test(value)) {
        return callback()
      }
      //不合法
      return callback(new Error('请输入合法的邮箱'))

    }
    //验证手机号的规则
    var checkMobile = (rule, value, callback) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      //合法对象
      if (regMobile.test(value)) {
        return callback()
      }
      //不合法
      return callback(new Error('请输入合法的电话号码'))


    }
    return {
      DialogVisible: false,

      addUserFormRules: {
        //验证用户名是否合法
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在3~10个字符', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在3~10个字符', trigger: 'blur' },
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          {validator: checkEmail, trigger: 'blur'}

        ],
        mobile: [
          { required: true, message: '请输入电话号码', trigger: 'blur' },
          {validator: checkMobile, trigger: 'blur'}

        ],
  }
    }
  },
  methods: {
    //添加用户对话框关闭事件
    addDialogClose() {
      this.$refs.FormRef.resetFields()
    },
    UserOperate() {
     this.$emit('UserOperate')
    }

  }
}
</script>

<style scoped>

</style>