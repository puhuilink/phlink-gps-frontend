<template>
  <el-dropdown>
    <el-badge is-dot :hidden="msgList.length === 0">
      <svg-icon :icon-class="'ring'" />
    </el-badge>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item
        v-for="(item, index) in msgList"
        :key="index"
        :command="index"
      >
        <span class="thick">{{ item.msg }}</span>
        <time class="time">{{ item.time }}</time>
        <hr color="#F0F8FF" size="1">
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Notifications',
  data() {
    return {
      hasNews: false,
      msgList: [],
      ws: null, // 建立的连接
      lockReconnect: false, // 是否真正建立连接
      timeout: 28 * 1000, // 30秒一次心跳
      timeoutObj: null, // 心跳心跳倒计时
      serverTimeoutObj: null, // 心跳倒计时
      timeoutnum: null, // 断开 重连倒计时
      currentDate: null
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'token'
    ])
  },
  mounted() {
    this.initWebpack(this.name, this.token)
    this.currentDate = new Date()
  },
  methods: {
    initWebpack(name, auth) {
      const url = 'ws://localhost:8081/pre/ws'
      if ('WebSocket' in window) {
        this.ws = new WebSocket(url + '?username=' + name + '&token=' + auth)
      } else if ('MozWebSocket' in window) {
        this.ws = new MozWebSocket(url + '?username=' + name + '&token=' + auth)
      } else {
        console.log('浏览器不支持 WebSocket!')
        return
      }
      this.ws.onopen = this.onopen
      this.ws.onmessage = this.onmessage
      this.ws.onclose = this.onclose
      this.ws.onerror = this.onerror
    },
    reconnect() {
      const that = this
      if (that.lockReconnect) {
        return
      }
      that.lockReconnect = true
      // 没连接上会一直重连，设置延迟避免请求过多
      that.timeoutnum && clearTimeout(that.timeoutnum)
      that.timeoutnum = setTimeout(function() {
        that.initWebpack(that.name, that.token)
        that.lockReconnect = false
      }, 5000)
    },
    reset() {
      const that = this
      clearTimeout(that.timeoutObj)
      clearTimeout(that.serverTimeoutObj)
      that.start()
    },
    start() {
      const self = this
      self.timeoutObj && clearTimeout(self.timeoutObj)
      self.serverTimeoutObj && clearTimeout(self.serverTimeoutObj)
      self.timeoutObj = setTimeout(function() {
        // 发送一个心跳，后端收到后，返回一个心跳消息
        if (self.ws.readyState === 1) {
          self.ws.send(JSON.stringify({ code: 'heartCheck' }))
        } else {
          self.reconnect()
        }
        self.serverTimeoutObj = setTimeout(function() {
          // 超时关闭
          self.ws.close()
        }, self.timeout)
      }, self.timeout)
    },
    onopen() {
      var msg = 'open'
      this.ws.send(JSON.stringify({ code: 'msg', msg: msg }))
      // 开启心跳
      this.start()
    },
    onmessage(e) {
      const data = JSON.parse(e.data)
      if (data && data.code === 'msg') {
        this.msgList.unshift(data)
      } else {
        console.log('msg: ', data)
      }
      // 收到服务器信息，心跳重置
      this.reset()
    },
    onclose(e) {
      console.log('websocket 断开: ' + e.code + ' ' + e.reason + ' ' + e.wasClean)
      const msg = 'close'
      this.ws.send(JSON.stringify({ code: 'msg', msg: msg }))
      this.reconnect()
    },
    onerror(e) {
      console.log('websocket 出现错误')
      this.reconnect()
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-badge {
    /deep/
    .el-badge__content {
        margin-top:20px
    }
  }
  .time {
    font-size: 13px;
    color: #999;
  }
  .thick {
    font-weight: bold
  }
</style>
