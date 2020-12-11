<template>
  <div class="app-container">
    <el-row>
      <el-col :span="6">
        <fence
          :add-data="saveData"
          :edit-data="editData"
          @transferfence="doClick"
          @delfence="doClear"
        />
      </el-col>
      <el-col :span="18">
        <baidu-map v-bind="mapOptions" :map-click="false" :style="select" class="map-container" @ready="handler">
          <bm-polygon-ex
            :polygon-data="polygonData"
            @drawover="callbakAdd"
            @modifyover="callbakModify"
            @delete="callbakDelete"
          />
          <bm-city-list anchor="BMAP_ANCHOR_TOP_LEFT" />
        </baidu-map>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import {
  BaiduMap,
  BmCityList
} from 'vue-baidu-map/components'
import BmPolygonEx from './components/PolygonEx'
import Fence from './components/fence'

export default {
  components: { BaiduMap, BmPolygonEx, BmCityList, Fence },
  data() {
    return {
      map: {},
      saveData: [],
      editData: [],
      mapOptions: {
        ak: '7BvqXd0SNk9NVMTz1DkCAmxO1dhausVe',
        center: {
          lng: 105.484323,
          lat: 36.716746
        },
        scrollWheelZoom: true,
        zoom: 5
      },
      polygonData: [{
        path: [],
        value: 0
      }],
      select: { width: '100%', height: '' }

    }
  },
  mounted() {
    this.selectStyle()
  },
  methods: {
    selectStyle() {
      this.select.height = (window.innerHeight) - 100 + 'px'
    },
    handler({ BMap, map }) {
      // TODO 现在支持一个多边形围栏
      this.setViewPort(map, this.polygonData[0].path)
      this.map = map
    },
    doClick(path) {
      console.log('%c doClick', 'color: blue;')
      this.polygonData = [{
        path: path,
        value: 0
      }]
      this.setViewPort(this.map, path)
    },
    setViewPort(map, path) {
      // 调用百度地图方法设置坐标数组居中和缩放
      if (path.length > 0) {
        const viewPort = map.getViewport(path.map(p => {
          return new BMap.Point(p.lng, p.lat)
        }))
        map.centerAndZoom(viewPort.center, viewPort.zoom)
      } else {
        // 没有坐标就显示在中国
        map.centerAndZoom(new BMap.Point(105.484323, 36.716746), 5)
      }
    },
    doClear() {
      this.polygonData = [{
        path: [],
        value: 0
      }]
    },
    callbakAdd(e) {
      console.log('%c map callbakAdd', 'color: green;')
      this.saveData = e.path
    },
    callbakModify(e) {
      console.log('%c map callbakModify', 'color: green;')
      console.log(e)
      this.editData = e.path
    },
    callbakDelete(e) {
      console.log('%c map callbakDelete', 'color: green;')
      console.log(e)
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .map-container {
    >>> .anchorBL,
    >>> .anchorTR,
    >>> .BMap_zlHolder,
    >>> [id^=PanoramaFlashWraperTANGRAM] {
        display: none;
        visibility: hidden;
    }
  }

</style>
<style>
  .citylist_popup_main .city_content_top {
    height: 40px!important;
  }
</style>
