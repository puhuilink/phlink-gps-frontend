<template>
  <div>
    <slot />
  </div>
</template>
<script>
import commonMixin from 'vue-baidu-map/components/base/mixins/common.js'
import bindEvents from 'vue-baidu-map/components/base/bindEvent.js'
import { createPoint } from 'vue-baidu-map/components/base/factory.js'

export default {
  name: 'BmPolygon',
  mixins: [commonMixin('overlay')],
  props: {
    path: {
      type: Array,
      default() {
        return []
      }
    },
    strokeColor: {
      type: String,
      default: 'blue'
    },
    strokeWeight: {
      type: Number,
      default: 3
    },
    strokeOpacity: {
      type: Number,
      default: 0.5
    },
    strokeStyle: {
      type: String,
      default: 'solid'
    },
    fillColor: {
      type: String,
      default: 'blue'
    },
    fillOpacity: {
      type: Number,
      default: 0.1
    },
    massClear: {
      type: Boolean,
      default: true
    },
    clicking: {
      type: Boolean,
      default: true
    },
    editing: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    path: {
      handler(val, oldVal) {
        this.reload()
      },
      deep: true
    },
    strokeColor(val) {
      this.originInstance.setStrokeColor(val)
    },
    strokeOpacity(val) {
      this.originInstance.setStrokeOpacity(val)
    },
    strokeWeight(val) {
      this.originInstance.setStrokeWeight(val)
    },
    strokeStyle(val) {
      this.originInstance.setStrokeStyle(val)
    },
    fillColor(val) {
      this.originInstance.setFillColor(val)
    },
    fillOpacity(val) {
      this.originInstance.setFillOpacity(val)
    },
    editing(val) {
      val ? this.originInstance.enableEditing() : this.originInstance.disableEditing()
    },
    massClear(val) {
      val ? this.originInstance.enableMassClear() : this.originInstance.disableMassClear()
    },
    clicking(val) {
      this.reload()
    }
  },
  methods: {
    load() {
      const { BMap, map, path, strokeColor, strokeWeight, strokeOpacity, strokeStyle, fillColor, fillOpacity, editing, massClear, clicking } = this
      const overlay = new BMap.Polygon(path.map(item => createPoint(BMap, item)), {
        strokeColor,
        strokeWeight,
        strokeOpacity,
        strokeStyle,
        fillColor,
        fillOpacity,
        // enableEditing: editing,
        enableMassClear: massClear,
        enableClicking: clicking
      })
      this.originInstance = overlay
      map.addOverlay(overlay)
      bindEvents.call(this, overlay)
      const that = this
      overlay.addEventListener('rightclick', function(e) {
        that.$emit('rightclick', e)
      })
      // 有bug，直接给 editing 赋值时会出现未知错误，使用下面的方法抹平。
      editing ? overlay.enableEditing() : overlay.disableEditing()
    }
  }
}
</script>
