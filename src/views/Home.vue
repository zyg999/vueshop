<template>

  <el-container class="home-container">
    <el-header>
      <div>
        <img src="../assets/img/shop.jpg" alt="logo"/>
        <span>电商后台管理系统</span>
      </div>
      <el-button type="danger" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollapsed ? '64px' : '200px'">
        <el-menu
            default-active="2"
            background-color="#55e063"
            unique-opened
            text-color="#fff"
            active-text-color="#ef12eb"
            :collapse="isCollapsed"
            router

        :collapse-transition="false">
          <div class="toggle-button" @click="toggleCollapse" >|||</div>
          <!--            一级菜单-->
          <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
<!--一级菜单模板区域-->
            <template slot="title">
<!--              图标-->
              <i :class="iconsObj[item.id]"></i>
<!--              文本-->
              <span>{{ item.authName }}</span>
            </template>
            <!--          二级菜单-->
            <el-menu-item :index="'/' + subItem.path" v-for="subItem in item.children" :key="subItem.id">
              <template slot="title">
                <!--              图标-->
                <i class="el-icon-menu"></i>
                <!--              文本-->
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>

          </el-submenu>

        </el-menu>
      </el-aside>
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
  </el-container>

</template>

<script>
export default {
  name: "Home",
  data() {
    return{
      menuList: [],
      iconsObj: {
        '125': 'el-icon-user',
        '103': 'el-icon-view',
        '101': 'el-icon-goods',
        '102': 'el-icon-coin',
        '145': 'el-icon-notebook-2'
      },
      isCollapsed: false
    }
  },
  created() {
    this.getMenus()
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    getMenus() {
      this.$axios.get('menus').then(res => {
        console.log(res);
        if (res.data.meta.status !== 200) return this.$message.error(res.data.meta.msg)
        this.menuList = res.data.data
      })
    },
    toggleCollapse() {

      this.isCollapsed = !this.isCollapsed
    }
  }

}
</script>

<style scoped>
  .home-container {
    height: 100%;
  }
  .el-header {
    background-color: #55e063;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    color: #ffffff;
    font-size: 20px;

  }
  .el-header div{
    display: flex;
    align-items: center;
  }
  .el-header span {
    margin-left: 15px;
  }
  .el-header img {
    height: 70px;
    width: 70px;
  }
  .el-aside {
    background-color: #55e063;
  }
  .el-main{
    background-color: #EAEDF1;
    /*background-color: #ef12eb;*/

  }
  .toggle-button {
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;

  }

</style>