<template>
  <div class="navbar">
    <hamburger :toggle-click="toggleSideBar" :is-active="sidebar.opened" class="hamburger-container" />
    <breadcrumb class="breadcrumb-container" />
    <div class="right-menu">

      <template v-if="device!=='mobile'">
        <screenfull class="right-menu-item hover-effect" />
        <notifications class="right-menu-item hover-effect" />
      </template>

      <!--个人-->
      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <el-avatar :size="25">{{ name.substr(0, 1).toUpperCase() }}</el-avatar>
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/user/center">
            <el-dropdown-item>
              个人中心
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item>
            <span style="display:block;" @click="setting">系统设置</span>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import Screenfull from '@/components/Screenfull'
import Notifications from './Notifications'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    Screenfull,
    Notifications
  },
  data() {
    return {
      msgs: []
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'name',
      'token',
      'avatar',
      'device'
    ])
  },
  methods: {
    setting() {
      this.$store.commit('openSettingBar', true)
    },
    toggleSideBar() {
      this.$store.dispatch('toggleSideBar')
    },
    // 退出登录
    logout() {
      this.$confirm('是否退出系统, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('LogOut').then(() => {
          location.reload()
        })
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .navbar {
    height: 50px;
    overflow: hidden;

    .hamburger-container {
      line-height: 46px;
      height: 100%;
      float: left;
      cursor: pointer;
      transition: background .3s;

      &:hover {
        background: rgba(0, 0, 0, .025)
      }
    }

    .breadcrumb-container {
      float: left;
    }

    .errLog-container {
      display: inline-block;
      vertical-align: top;
    }

    .right-menu {
      float: right;
      height: 100%;
      line-height: 50px;

      &:focus {
        outline: none;
      }

      .right-menu-item {
        display: inline-block;
        padding: 0 8px;
        height: 100%;
        font-size: 14px;
        color: #5a5e66;
        vertical-align: text-bottom;

        &.hover-effect {
          cursor: pointer;
          transition: background .3s;

          &:hover {
            background: rgba(0, 0, 0, .025)
          }
        }
      }

      .avatar-container {
        margin-right: 10px;

        .avatar-wrapper {
          margin-top: 7px;
          position: relative;

          .el-icon-caret-bottom {
            cursor: pointer;
            position: absolute;
            right: -20px;
            top: 15px;
            font-size: 12px;
          }
        }
      }
    }
  }
</style>
