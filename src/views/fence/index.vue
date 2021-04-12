<template>
  <div class="app-container">
    <div class="top-home-rank">
    <amap ref="map"
          cacheKey="map"
          view-mode="3D"
          map-style="amap://styles/whitesmoke"
          async
          :rotation="0"
          :pitch="0"
          >
    <template v-slot:control>
      <el-form :inline="true" class="controls">
        <el-form-item>
          <el-select v-model="fenceName"
                     placeholder="选择或查询围栏"
                     filterable="true"
                     clearable
                     v-loadmore="loadmore"
                     :remote-method="searchFence"
                     size="mini"
                     @change="change">
              <el-option
                v-for="(item) in fences"
                :key="item.id"
                :label="item.name"
                :value="item.fence"
                > 
                <span style="float: left; font-weight: bold">{{ item.name }}</span>
              </el-option>
          </el-select>
          <el-button-group>
            <el-tooltip content="添加围栏" placement="top" effect="light">
              <el-button size="mini" icon="el-icon-plus"></el-button>
            </el-tooltip>
            <el-tooltip content="删除围栏" placement="top" effect="light">
              <el-button size="mini" icon="el-icon-minus"></el-button>
            </el-tooltip>
          </el-button-group>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="editable" label="编辑" size="mini" border/>
        </el-form-item>
      </el-form>
      <el-form class="info" inline="true">
        <el-form-item label="面积:" v-show="area > 0">
          {{ (area / 1000000).toFixed(4) }} k㎡
        </el-form-item>
        <el-form-item v-show="area > 0">
            <el-popover
              placement="bottom"
              title="围栏原始数据"
              width="200"
              trigger="click">
              <el-input type="textarea" v-model="fenceLatlag" rows="10" readonly></el-input>
              <el-button slot="reference" size="mini" icon="el-icon-document-copy" circle></el-button>
            </el-popover>
        </el-form-item>
        <el-form-item label="卫星图">
          <el-switch v-model="satellite" />
        </el-form-item>
      </el-form>
      <amap-satellite-layer :visible="satellite" />
    </template>
    <template v-slot:map-content>
      <amap-polygon
        ref="polygons"
        :path.sync="path"
        :fill-color="fill"
        :fill-opacity="0.01"
        :stroke-color="stroke"
        :editable="editable"
      />
    </template>
    </amap>
    </div>
  </div>
</template>

<script>
import Amap from '@amap/amap-vue/lib/amap';
import Polygon from '@amap/amap-vue/lib/polygon';
import SatelliteLayer from '@amap/amap-vue/lib/satellite-layer';
import { saveFence, getFence, updateFence, deleteFence } from '@/api/fence'

export default {
  components: {
    Amap,
    'AmapPolygon': Polygon,
    'AmapSatelliteLayer': SatelliteLayer
  },
  data() {
    return {
      fences: [],
      fenceName: null,
      path: null,
      editable: true,
      satellite: false,
      fill: '#40a9ff',
      stroke: '#000A58'
    }
  },
  computed: {
    $map() {
      return this.$refs.map.$map
    },
    area() {
      if(this.path) {
        return window.AMap.GeometryUtil.ringArea(this.path)
      }
    },
    fenceLatlag() {
      return JSON.stringify(this.path, undefined, 4)
    }
  },
  mounted() {
    this.searchFence()
  },
  methods: {
    searchFence(query) {
      const params = new URLSearchParams()
      if(query) {
        params.append('name', query)
      }
      params.append('current', 1)

      setTimeout(() => {
        getFence(params).then((res) => {
          let fenceList = res.data.data.records.map((obj) => {
            return {
              id: obj.id,
              fence: obj.fence,
              name: obj.name,
              updateTime: obj.updateTime,
              createTime: obj.createTime
            }
          })
          this.fences = fenceList
        })}, 500)
    },
    change(fence) {
      if (fence) {
        this.path = fence.map((d) => {
          return new AMap.LngLat(d.lng, d.lat)
        })
        this.setFitView(this.$map)
      }
    },
    async setFitView(map) {
      await this.$nextTick()
      const target = this.$refs.polygons.$target
      map.setFitView(target)
    }
  }
}
</script>

<style lang="scss" scoped>
  .top-home-rank {
    height: 550px;
  }
  .controls {
    position: absolute;
    left: 6px;
    top: 0px;
  }
  .info {
    position: absolute;
    right: 6px;
    top: 0;
  }
</style>