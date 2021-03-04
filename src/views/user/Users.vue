<template>
  <div>
<!--    面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
<!--    卡片视图区域-->
    <el-card>

      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" class="input-with-select" v-model="queryInfo.query" clearable
          @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="changeDialog" >添加用户</el-button>
        </el-col>
      </el-row>
<!--      用户列表区域-->
      <el-table :data="userList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template v-slot="scope">
            <el-switch
                v-model="scope.row.mg_state"
                @change="userStateChange(scope.row)"
                active-color="#13ce66"
                inactive-color="#ff4949">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template v-slot="scope">

<!--            修改按钮-->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
<!--            删除按钮-->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>
<!--            分配角色按钮-->
            <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>

          </template>
        </el-table-column>
      </el-table>
<!--      分页区域-->
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[1, 2, 5, 10]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>

    </el-card>
<!--    添加用户对话框-->
    <MyDialog ref="myDialog" :operate-type="true" :user-form="addUserForm" :title="addTitle" @UserOperate="addUser">
      <el-form-item label="密码" prop="password">
        <el-input v-model="addUserForm.password"></el-input>
      </el-form-item>
    </MyDialog>
    <my-dialog ref="editDialog" :user-form="editForm" :title="editTitle" @UserOperate="editUser"></my-dialog>
  </div>
</template>

<script>

import MyDialog from "@/components/dialog";
export default {
  name: "Users",
  components: {MyDialog},
  data() {
    return{
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      userList: [],
      total: 0,
      addUserForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editForm: {},
      addTitle: '添加用户',
      editTitle: '修改用户'


    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    getUserList() {
      this.$axios.get('users', {params: this.queryInfo}).then(res => {
        this.userList = res.data.data.users
        this.total = res.data.data.total
        console.log(res);
      })
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()

    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    //监听swith开关状态的改变
    userStateChange(userInfo) {
      this.$axios.put(`users/${userInfo.id}/state/${userInfo.mg_state}`).then(() => {
        this.$message.success('更新用户状态成功')
      }).catch(() => {
        userInfo.mg_state = ! userInfo.mg_state
        this.$message.error('更新用户状态失败')
      })

    },
    //改变对话框显示和隐藏状态
    changeDialog() {
      this.$refs.myDialog.DialogVisible = true

    },
    //展示编辑用户的对话框
    showEditDialog(id) {
      this.$refs.editDialog.DialogVisible = true
      this.$axios.get('users/' + id).then(res => {
        console.log(res);
        if (res.data.meta.status !== 200) {
          return this.$message.error('查询用户信息失败！')
        }
        this.editForm = res.data.data

      })

    },
    //点击按钮添加新用户
    addUser() {
      this.$refs.myDialog.$refs.FormRef.validate(valid => {
        if (!valid) return
        //可以发起添加用户的请求
        this.$axios.post('users', this.addUserForm).then(() => {
          this.$message.success('添加用户成功!')
          this.$refs.myDialog.DialogVisible = false
        }).catch(() => {
          this.$message.error('添加用户失败!')
        })
      })



    },
    //点击按钮修改用户信息
    editUser() {
      this.$refs.editDialog.$refs.FormRef.validate((valid) => {
        console.log('aaa');
        if (!valid) return

        this.$axios.put('users/' + this.editForm.id, {
          email: this.editForm.email,
          mobile: this.editForm.mobile
        }).then(res => {
          console.log(res);
          if (res.data.meta.status !== 200) {
            return this.$message.error('更新用户信息失败')
          }
          this.$refs.editDialog.DialogVisible = false
          //刷新数据列表
          this.getUserList()
          this.$message.success('更新用户信息成功!')
        })
      })

    },
//根据id删除对应用户信息
    removeUserById(id) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'}).then(res => {
        console.log(res);
        this.$axios.delete('users/' + id).then(res => {
          console.log(res);
          if (res.data.meta.status !== 200) {
            return this.$message.error('删除用户失败！')
          }
          this.$message.success('删除用户成功')
          this.getUserList()
        })


      }).catch(() => {
          return this.$message.info('已经取消删除')

      })

    }


  }
}
</script>

<style scoped>

</style>