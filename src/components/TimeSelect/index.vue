<template>
  <div class="byted-weektime">
    <div class="calendar">
      <!-- <div class="schedule"></div> -->
      <!-- <div class="schedule" style="opacity: 0; display: none; left: 680px; top: 294px; width: 11px; height: 30px;"></div> -->
      <table class="calendar-table" style="width:610px">
        <thead class="calendar-head">
          <tr>
            <th rowspan="6" class="week-td">星期/时间</th>
            <th colspan="24">00:00 - 12:00</th>
            <th colspan="24">12:00 - 24:00</th>
          </tr>
          <tr>
            <td v-for="index in tableHeader" :key="index" colspan="2">{{ index }}</td>
          </tr>
        </thead>
        <!-- <tbody @mousemove.prevent.stop="tableFrameMove" @mouseleave.prevent.stop="tableFrameLeave" @mousedown.prevent.stop="tableFrameDown" @mouseup.prevent.stop="tableFrameUp"> -->
        <tbody id="tableBody">
          <div
            id="tableFrame"
            :style="{width:tableFrameObj.width+'px',height:tableFrameObj.height+'px',top:tableFrameObj.top+'px',left:tableFrameObj.left+'px',bottom:tableFrameObj.bottom+'px',right:tableFrameObj.right+'px'}"
          />
          <tr>
            <td>星期一</td>
            <td
              v-for="(item,i) in rowUnit[0]"
              :key="i"
              class="calendar-atom-time"
              :class="item.class"
              @mousedown.prevent="handleMouseDown(i, 0)"
              @mouseup.prevent="handleMouseUp(i,0)"
            />
          </tr>
          <tr>
            <td>星期二</td>
            <td
              v-for="(item,i) in rowUnit[1]"
              :key="i"
              class="calendar-atom-time"
              :class="item.class"
              @mousedown.prevent="handleMouseDown(i, 1)"
              @mouseup.prevent="handleMouseUp(i,1)"
            />
          </tr>
          <tr>
            <td>星期三</td>
            <td
              v-for="(item,i) in rowUnit[2]"
              :key="i"
              class="calendar-atom-time"
              :class="item.class"
              @mousedown.prevent="handleMouseDown(i, 2)"
              @mouseup.prevent="handleMouseUp(i,2)"
            />
          </tr>
          <tr>
            <td>星期四</td>
            <td
              v-for="(item,i) in rowUnit[3]"
              :key="i"
              class="calendar-atom-time"
              :class="item.class"
              @mousedown.prevent="handleMouseDown(i, 3)"
              @mouseup.prevent="handleMouseUp(i,3)"
            />
          </tr>
          <tr>
            <td>星期五</td>
            <td
              v-for="(item,i) in rowUnit[4]"
              :key="i"
              class="calendar-atom-time"
              :class="item.class"
              @mousedown.prevent="handleMouseDown(i, 4)"
              @mouseup.prevent="handleMouseUp(i,4)"
            />
          </tr>
          <tr>
            <td>星期六</td>
            <td
              v-for="(item,i) in rowUnit[5]"
              :key="i"
              class="calendar-atom-time"
              :class="item.class"
              @mousedown.prevent="handleMouseDown(i, 5)"
              @mouseup.prevent="handleMouseUp(i,5)"
            />
          </tr>
          <tr>
            <td>星期日</td>
            <td
              v-for="(item,i) in rowUnit[6]"
              :key="i"
              class="calendar-atom-time"
              :class="item.class"
              @mousedown.prevent="handleMouseDown(i, 6)"
              @mouseup.prevent="handleMouseUp(i,6)"
            />
          </tr>

          <tr>
            <td colspan="49" class="td-table-tip">
              <div class="clearfix">
                <span class="pull-left tip-text">
                  <i class="el-icon-top" />请用鼠标点选时间段
                </span>
                <a class="pull-right" @click="clear">清空</a>
              </div>
            </td>
          </tr>
          <tr>
            <td colspan="49" class="timeContent">
              <div v-for="(item, index) in timeStr" v-show="item.length" :key="index">
                <span>{{ weekDate[index + 1] }}:</span>
                <strong>
                  <span>{{ item }}</span>
                </strong>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TimeSelect',
  props: {
    value: {
      type: Object,
      default() {
        return { vtime: [] }
      }
    }
  },
  data() {
    return {
      tableHeader: [
        '00',
        '01',
        '02',
        '03',
        '04',
        '05',
        '06',
        '07',
        '08',
        '09',
        '10',
        '11',
        '12',
        '13',
        '14',
        '15',
        '16',
        '17',
        '18',
        '19',
        '20',
        '21',
        '22',
        '23'
      ],
      weekDate: {
        '1': '星期一',
        '2': '星期二',
        '3': '星期三',
        '4': '星期四',
        '5': '星期五',
        '6': '星期六',
        '7': '星期日'
      },
      rowUnit: [
        // 每一个单元格
        // [{class:null,timeData:0},{class:null,timeData:1}...]  星期一
      ],
      timeContent: [
        // 选中的时间段原始数据
        // {arr:[]},{arr:[]}...
      ],
      timeSection: [
        // 时间段,可以返回给后端的数据
        // [
        // 	[0,1,2,3],[7,8]    => [0,2],[3.5,4.5]
        // ],
        // [
        // 	[4,5,6],[10]       => [2,3.5],[5,5.5]
        // ]
      ],
      timeStr: [
        // 时间段,前端显示的数据
        // '00:00~02:00 | 03:30~04:30',
        // '02:00~03:30 | 05:00~05:30',
        // ''
      ],
      beginDay: 0,
      beginTime: 0,
      downEvent: false,
      tableFrameObj: {
        width: 0,
        height: 0,
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        oldLeft: 0,
        oldTop: 0,
        flag: false
      }
    }
  },
  created() {
    // 先初始化页面元素
    this.init()

    // 然后监听绑定值的变化
    this.$watch(
      'value',
      function(newVal) {
        if (newVal === undefined || newVal == null) {
          this.clear()
          console.log('undefined & null')
        } else {
          const newValue = { ...newVal }
          if (
            newValue.hasOwnProperty('from') &&
            newValue.hasOwnProperty('vtime')
          ) {
            this.clear()
            const intervalTimeArray = newValue.vtime
            for (let x = 0; x < intervalTimeArray.length; x++) {
              intervalTimeArray[x].forEach(intervalTime => {
                if (intervalTime.length > 0) {
                  this.handleMouseDown((intervalTime[0] - 0.5) * 2, x)
                  this.handleMouseUp((intervalTime[1] - 0.5) * 2, x)
                }
              })
            }
          } else {
            console.log('loop')
          }
        }
      },
      { immediate: true }
    )
  },
  methods: {
    init() {
      for (let i = 0; i < 7; i++) {
        const arr = []
        for (let j = 0; j < 48; j++) {
          arr.push({ class: null, timeData: j })
        }
        this.rowUnit.push(arr)
        this.timeContent.push({ arr: [] })
        this.timeSection.push([])
        this.timeStr.push('')
      }
    },
    handleMouseDown(i, day) {
      this.downEvent = true // 按下时鼠标不在范围内则不算
      this.beginDay = day
      this.beginTime = i
    },
    handleMouseUp(i, day) {
      // 当点击事件是在table内才触发选取数据操作
      if (this.downEvent) {
        // 选时间段
        const _this = this
        const begin = this.beginTime
        const start = begin <= i ? begin : i // x轴 起点
        const length = Math.abs(begin - i)
        const end = start + length // x轴 终点

        const dayStart = this.beginDay <= day ? this.beginDay : day // y轴 起点
        const dayLength = Math.abs(this.beginDay - day)
        const dayEnd = dayStart + dayLength // y轴 终点

        // 当框选范围内所有块都是选中状态时,执行反选
        const isAdd = function() {
          for (let x = dayStart; x < dayEnd + 1; x++) {
            for (let y = start; y < end + 1; y++) {
              if (_this.rowUnit[x][y].class == null) return true
            }
          }
          return false
        }
        if (isAdd()) {
          // 没选中的全都选上
          for (let x = dayStart; x < dayEnd + 1; x++) {
            for (let y = start; y < end + 1; y++) {
              if (this.rowUnit[x][y].class == null) {
                this.rowUnit[x][y].class = 'ui-selected'
                this.timeContent[x].arr.push(this.rowUnit[x][y].timeData)
              }
            }
          }
        } else {
          // 反选
          const indexOf = function(arr, val) {
            for (let i = 0; i < arr.length; i++) {
              if (arr[i] === val) return i
            }
            return -1
          }

          const arrayRemove = function(arr, val) {
            const index = indexOf(arr, val)
            if (index > -1) {
              arr.splice(index, 1)
            }
          }
          for (let x = dayStart; x < dayEnd + 1; x++) {
            for (let y = start; y < end + 1; y++) {
              this.rowUnit[x][y].class = null
              arrayRemove(this.timeContent[x].arr, this.rowUnit[x][y].timeData)
            }
          }
        }
        // 过滤时间段,将临近的时间段合并
        this.filterTime(dayStart, dayEnd)
      }
      this.downEvent = false
      this.$emit('input', { vtime: this.timeSection })
    },
    filterTime(start, end) {
      // 选中的x,y坐标信息 x:0-47  y:0-6
      function sortCut(arr) {
        // 提取连续的数字
        const result = []
        arr.forEach(function(v, i) {
          const temp = result[result.length - 1]
          if (!i) {
            result.push([v])
          } else if (v % 1 === 0 && v - temp[temp.length - 1] === 1) {
            temp.push(v)
          } else {
            result.push([v])
          }
        })
        return result
      }
      function toStr(num) {
        if (Number.isInteger(num)) {
          const str = num < 10 ? '0' + num : num.toString()
          return str + ':00'
        } else {
          const str =
            Math.floor(num) < 10
              ? '0' + Math.floor(num)
              : Math.floor(num).toString()
          return str + ':30'
        }
      }
      function timeToStr(arr) {
        // 把数组转成方便阅读的字符串
        let str = ''
        arr.forEach((arr, index) => {
          let str1 = ''
          if (index === 0) {
            str1 = toStr(arr[0]) + '~' + toStr(arr[1])
          } else {
            str1 = ' , ' + toStr(arr[0]) + '~' + toStr(arr[1])
          }
          str += str1
        })
        return str
      }
      // 排序,分割成
      for (let i = start; i < end + 1; i++) {
        const arr1 = sortCut(this.timeContent[i].arr.sort((a, b) => a - b))
        const arr2 = []
        const arr5 = []
        arr1.forEach(arr => {
          // 转成带小数点的时间段,以及供前端显示的字符串
          const arr3 = []
          arr3.push(arr[0] / 2 + 0.5)
          arr3.push(arr[arr.length - 1] / 2 + 0.5)
          arr2.push(arr3)

          const arr6 = []
          arr6.push(arr[0] / 2)
          arr6.push(arr[arr.length - 1] / 2 + 0.5)
          arr5.push(arr6)
        })
        // console.log(arr2)
        this.timeStr[i] = timeToStr(arr5)
        this.timeSection[i] = arr2
      }
    },
    clear() {
      this.rowUnit.forEach(item => {
        item.forEach(item1 => {
          item1.class = null
        })
      })
      this.timeContent.forEach(item => {
        item.arr = []
      })
      this.timeSection.forEach(item => {
        // 赋值成空数组[]出问题
        item.length = 0
      })
      // 遍历赋值成'',不管用
      this.timeStr.length = 0
      for (let i = 0; i < 7; i++) {
        this.timeStr.push('')
      }
      // this.initState = true
    },
    // 画框操作
    tableFrameMove() {
      if (!this.tableFrameObj.flag) return
      if (this.downEvent) {
        const x1 = this.tableFrameObj.oldLeft
        const y1 = this.tableFrameObj.oldTop
        const x2 = event.layerX
        const y2 = event.layerY
        this.tableFrameObj.left = x2 > x1 ? x1 : x2
        this.tableFrameObj.top = y2 > y1 ? y1 : y2
        this.tableFrameObj.width = Math.abs(x2 - x1)
        this.tableFrameObj.height = Math.abs(y2 - y1)
      }
    },
    tableFrameDown() {
      this.tableFrameObj.flag = true
      this.tableFrameObj.oldLeft = event.layerX
      this.tableFrameObj.oldTop = event.layerY
    },
    tableFrameUp() {
      this.tableFrameObj.flag = false
      this.clearDragData()
    },
    tableFrameLeave() {
      this.tableFrameObj.flag = false
      this.clearDragData()
    },
    clearDragData() {
      for (const prop in this.tableFrameObj) {
        this.tableFrameObj[prop] = 0
      }
    }
  }
}
</script>

<style scoped>
.byted-weektime .calendar {
  -webkit-user-select: none;
  position: relative;
  display: inline-block;
}
/*.byted-weektime .calendar .schedule{background:#2F88FF;width:0;height:0;position:fixed;display:none;top:0;left:0;pointer-events:none;-webkit-transition:all 400ms ease;-moz-transition:all 400ms ease;-ms-transition:all 400ms ease;transition:all 400ms ease}*/
.byted-weektime .calendar .calendar-table {
  border-collapse: collapse;
  border-radius: 4px;
}
.byted-weektime .calendar .calendar-table tr .calendar-atom-time:hover {
  background: #ccc;
}
.byted-weektime .calendar .calendar-table tr .ui-selected {
  background: #2f88ff;
}
.byted-weektime .calendar .calendar-table tr .ui-selected:hover {
  background: #2f88ff;
}
.byted-weektime .calendar .calendar-table tr,
.byted-weektime .calendar .calendar-table td,
.byted-weektime .calendar .calendar-table th {
  border: 1px solid #ccc;
  font-size: 12px;
  text-align: center;
  min-width: 11px;
  line-height: 1.8em;
  -webkit-transition: background 200ms ease;
  -moz-transition: background 200ms ease;
  -ms-transition: background 200ms ease;
  transition: background 200ms ease;
}
.byted-weektime .calendar .calendar-table tbody tr {
  height: 30px;
}
.byted-weektime .calendar .calendar-table tbody tr td:first-child {
  background: #f8f9fa;
}
.byted-weektime .calendar .calendar-table thead th,
.byted-weektime .calendar .calendar-table thead td {
  background: #f8f9fa;
}
.byted-weektime .calendar .calendar-table .td-table-tip {
  line-height: 2.4em;
  padding: 0 12px 0 19px;
  background: #fff !important;
}
.byted-weektime .calendar .calendar-table .td-table-tip .clearfix {
  height: 46px;
  line-height: 46px;
}
.byted-weektime .calendar .calendar-table .td-table-tip .pull-left {
  font-size: 14px;
  color: #333333;
}
.byted-weektime .week-td {
  width: 75px;
  padding: 20px 0;
}
.byted-weektime a {
  cursor: pointer;
  color: #2f88ff;
  font-size: 14px;
}
#tableFrame {
  position: absolute;
  background-color: blue;
  opacity: 0.3;
}
</style>
