<template>
  <div>
    <el-card shadow="never" class="box-card fail-con">
      <el-badge :value="count" class="item" type="primary">
        <el-input v-model="fenceName" placeholder="查询围栏名称" clearable @keyup.enter.native="resetFencePageList">
          <template slot="append">
            <el-button icon="el-icon-search" @click="resetFencePageList" />
            <el-button icon="el-icon-plus" @click="addFenceContext" />
          </template>
        </el-input>
      </el-badge>

      <div v-infinite-scroll="getFencePageList" infinite-scroll-immediate="false">
        <div
          v-for="(item, index) of fenceList"
          :key="item.id"
          class="itemList"
          :class="[index === indexAtion ? 'itemListAction' : '']"
        >
          <div class="top" @click.capture="selectFence(index, item)">
            <p class="img">
              <img :src="fenceImage" alt="电子围栏">
            </p>
            <el-input v-if="item.state === 'add'" v-model="addNameInput" placeholder="输入围栏名称" />
            <p v-else class="text">{{ item.name }}</p>
          </div>
          <hr style="border-color: rgba(255, 255, 255, 0.28) !important;">
          <div class="updateTime">
            <p>更新时间：{{ item.updateTime }}</p>
          </div>
          <hr style="border-color: rgba(255, 255, 255, 0.28) !important;">
          <div v-if="item.state === 'idle'" class="funCon">
            <el-button type="text" size="small" icon="el-icon-delete" plain @click="deleteFence(item)">删除</el-button>
          </div>
          <div v-if="item.state === 'add'" class="funCon">
            <el-button type="text" size="small" plain icon="el-icon-check" @click="addFence()">完成</el-button>
            <el-button type="text" size="small" plain icon="el-icon-close" @click="cancelAddFence()">取消</el-button>
          </div>
          <div v-if="item.state === 'edit'" class="funCon">
            <el-button type="text" size="small" plain icon="el-icon-check" @click="updateFence()">更新</el-button>
            <el-button type="text" size="small" plain icon="el-icon-close" @click="cancelEditFence(item)">取消</el-button>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { saveFence, getFence, updateFence, deleteFence } from '@/api/fence'

export default {
  components: {},
  props: {
    addData: {
      type: Array,
      default() {
        return []
      }
    },
    editData: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      count: 0,
      isLoading: false,
      fenceList: [],
      indexAtion: -1,
      fenceName: '',
      fenceImage: require('@/assets/image/icon_fence.png'), // 电子围栏
      nameEdit: false,
      currentID: '',
      addNameInput: '',
      addFenceFalg: false,
      iotFencePageParam: {
        current: 1,
        size: 10
      }
    }
  },
  watch: {
    addData(newPolygonData, oldPolygonData) {
      // console.log("addPolygonData", newPolygonData)
    },
    editData(newPolygonData, oldPolygonData) {
      this.fenceList.forEach((item) => {
        if (item.id === this.currentID) {
          item.state = 'edit'
        }
      })
    }
  },
  mounted() {
    this.getFencePageList()
  },
  methods: {
    deleteFence(item) {
      // 查看告警配置中是否有围栏信息
      this.$confirm('您确定要删除 ' + item.name + ' ?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteFence(item.id).then((res) => {
          this.resetFencePageList()
          this.$emit('delfence')
        })
      }).catch((err) => {
        console.log('取消删除!', err)
      })
    },
    // 添加围栏
    addFenceContext() {
      if (this.addFenceFalg === false) {
        this.$emit('delfence')
        this.indexAtion = ''
        this.funBtnAction = ''

        this.addFenceFalg = true
        this.fenceList.unshift(
          { name: '新增围栏名称', state: 'add' }
        )
      } else {
        this.$message({
          message: '有新建围栏未完成!',
          type: 'warning'
        })
      }
    },
    // 切换
    selectFence(index, item) {
      this.$emit('delfence')
      this.indexAtion = index
      this.funBtnAction = ''

      this.currentID = item.id
      if (item.hasOwnProperty('fence')) {
        this.$emit('transferfence', item.fence)
      } else {
        console.log('新建数据')
      }
    },
    resetFencePageList() {
      this.show = false
      const params = new URLSearchParams()
      const cur = this.iotFencePageParam.current = 1
      if (this.fenceName !== '') {
        params.append('name', this.fenceName)
      }
      params.append('current', cur)

      getFence(params).then((res) => {
        this.fenceList = res.data.data.records.map((obj) => {
          return {
            id: obj.id,
            fence: JSON.parse(obj.fence),
            name: obj.name,
            updateTime: obj.updateTime,
            createTime: obj.createTime,
            state: 'idle'
          }
        })
        this.count = res.data.data.total
      })
      this.show = true
    },
    // 获取所有围栏
    getFencePageList() {
      const params = new URLSearchParams()
      const cur = this.iotFencePageParam.current++
      if (this.fenceName !== '') {
        params.append('name', this.fenceName)
      }
      params.append('current', cur)

      getFence(params).then((res) => {
        const temp = res.data.data.records.map((obj) => {
          return {
            id: obj.id,
            fence: JSON.parse(obj.fence),
            name: obj.name,
            updateTime: obj.updateTime,
            createTime: obj.createTime,
            state: 'idle'
          }
        })
        this.count = res.data.data.total
        this.fenceList = [...this.fenceList, ...temp]
      })
    },
    addFence() {
      if (this.addNameInput && this.addData.length > 0) {
        const param = {
          fence: JSON.stringify(this.addData),
          name: this.addNameInput
        }

        saveFence(param).then((res) => {
          this.resetFencePageList()
          this.addFenceFalg = false // 保存后去除添加标记
        }
        )
      } else {
        this.$message({
          message: '请输入围栏名称或编辑围栏.',
          type: 'warning'
        })
      }
    },
    updateFence() {
      const param = {
        id: this.currentID,
        fence: JSON.stringify(this.editData)
      }
      updateFence(param).then((res) => {
        this.resetFencePageList()
      }
      )
    },
    cancelEditFence(item) {
      if (item.hasOwnProperty('fence')) {
        this.$emit('transferfence', item.fence)
        item.state = 'idle'
      } else {
        console.log('新建数据')
      }
    },
    cancelAddFence() {
      this.fenceList.shift()
      this.addFenceFalg = false
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  position: relative;
  z-index: 2;
  padding: 0px;
}

.itemList.itemListAction {
  border: 2px solid #519ee2;
  .funBtn.funBtnAction {
    color: #519ee2;
  }
}
.itemList {
  border: 1px solid #ccc;
  margin: 10px 0px;
  padding: 5px;
  border-radius: 6px;
  cursor: pointer;
  .top {
    display: flex;
    justify-content: space-around;
    align-items: center;
    p{
      margin: 5px;
    }
    .img {
      width: 10%;
      img {
        width: 80%;
        height: 80%;
      }
    }
    .text {
      width: 70%;
    }
  }
  .updateTime {
    display: flex;
    justify-content: space-around;
    align-items: center;
    font-size: 12px;
  }
  .funCon {
    display: flex;
    justify-content: space-around;
    align-items: center;
    font-size: 1.1em;
    div {
      text-align: center;
      padding: 10px;
      cursor: pointer;
    }
  }
}

.fail-con {
  height: calc(100vh - 100px);
  overflow: auto;
  position: relative;
}
/*滚动条样式*/
.fail-con::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 4px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 4px;
  scrollbar-arrow-color: red;
}
.fail-con::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 5px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: rgba(0, 0, 0, 0.2);
  scrollbar-arrow-color: red;
}
.fail-con::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 0;
  background: rgba(0, 0, 0, 0.1);
}

.leftWarp {
  position: absolute;
}
</style>
