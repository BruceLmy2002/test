<template>
  <div class="page">
      <el-amap ref="map" :zoom="zoom" :center="center" :pitch="pitch" view-mode="3D"  class="amap-demo" @click="getMap">
        <!--        控件-->
        <el-amap-control-scale :visible="visible.control" ></el-amap-control-scale>
        <el-amap-control-tool-bar :visible="visible.control" ></el-amap-control-tool-bar>
<!--        <el-amap-control-control-bar :visible="visible.control" position="LB"></el-amap-control-control-bar>-->
        <el-amap-control-map-type :visible="visible.control" ></el-amap-control-map-type>
        <!--        控件-->
        <el-amap-marker-cluster v-if="visible.marker" :points="points"  @init="markerInit" @click="clickMarker"></el-amap-marker-cluster>
        <el-amap-loca>
          <el-amap-loca-line :visible="visible.line" :source-url="sourceUrl" :layer-style="layerStyle" @mousemove="mousemove"></el-amap-loca-line>
        </el-amap-loca>
      </el-amap>
<!--    <info></info>-->
  </div>
</template>
<script>
import { BaiduMap } from "vue-baidu-map";
import info from "@/components/mapLayer/info";
const colors = ['#f7fcf5', '#e5f5e0', '#c7e9c0', '#a1d99b', '#74c476', '#41ab5d', '#238b45', '#006d2c', '#00441b'].reverse();
export default {
  data() {
    return {
      zoom: 11,
      center: [117.120128,36.652069],
      pitch:0,
      path: [[117,36], [117.110128,36.642069]],
      visible: {
        control:true,
        line:false,
        marker:true,
        polygon:true,
      },
      sourceUrl: 'https://a.amap.com/Loca/static/loca-v2/demos/mock_data/bj_bus.json',
      mapStyle: 'amap://styles/916e03b38cfc09e90d195b3a566df71a',
      sourceUrlP:'https://geo.datav.aliyun.com/areas_v3/bound/370100_full.json',
      show: false,
      points:[{"lnglat":["117.120128","36.652069"]},{"lnglat":["117.110128","36.642069"]}],
      layerStyle: {
        color: function (index, prop) {
          var i = index % colors.length;
          return colors[i];
        },
        lineWidth: (index, prop) => {
          var i = index % colors.length;
          return i * 0.1 + 2;
        },
        altitude: function (index, feature) {
          var i = index % colors.length;
          return 100 * i;
        },
        // dashArray: [10, 5, 10, 0],
        dashArray: [10, 0, 10, 0],
      }
    };
  },
  components: {
    BaiduMap, info
  },
  mounted() {
    // this.initMap();
    console.log(this)
  },
  methods: {
    init(layer){
    },
    markerInit(e){
      console.log('marker init: ', e);
    },
    clickMarker(){
      alert('点击了标号')
    },
    mousemove(feature){
      console.log('移动到标号上：', feature)
    },
    getMap() {
      // bmap vue component
      console.log('$refs: ', this.$refs.map.$$getInstance())
    },
    getLocation(e) {
      console.log('getLocation: ', e)
    }

  }
};
</script>
<style>
#mymap {
  width: 100%;
  height: 100%;
  display: block;
}
.anchorBL {
  display: none;
}
</style>

