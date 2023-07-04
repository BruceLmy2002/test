<template>
  <div class="page">
      <el-amap ref="map" :zoom="zoom" :zooms="[2, 30]" :center="center" :pitch="pitch" view-mode="3D"  class="amap-demo" @click="getMap"  @zoomchange="zoomChange" @init="initMap">
        <!--       地图 控件栏-->
        <el-amap-control-scale :visible="visible.control" ></el-amap-control-scale>
        <el-amap-control-tool-bar :visible="visible.control" ></el-amap-control-tool-bar>
        <el-amap-control-map-type :visible="visible.control" ></el-amap-control-map-type>
        <!--        控件-->

<!--        连线-->
          <el-amap-polyline v-for="p in polylinePath" :visible="visible.polyline" :path="p.path" :stroke-color="p.color"></el-amap-polyline>

<!--        <el-amap-layer-canvas v-if="canvas" :canvas="canvas" :bounds="bounds" :visible="visible.layer" @init="initLayer" ></el-amap-layer-canvas>-->
<!--        连线-->

<!--        点标记-->
        <el-amap-marker  :visible="visible.marker" v-for="(marker, index) in point" :key="index" :position="marker.lnglat"  :title="marker.camAddress" ></el-amap-marker>
<!--        点标记-->
        <el-amap-loca @init="initLoca">
          <el-amap-loca-scatter :visible="visible.marker" :sourceData="points" :layer-style="layerStyleScatter" @click="clickMarker" ></el-amap-loca-scatter>
          <el-amap-loca-line :visible="visible.line" :sourceData="lines" :layer-style="layerStyle" @mousemove="mousemove"></el-amap-loca-line>
        </el-amap-loca>

      </el-amap>
<!--    <info></info>-->
  </div>
</template>
<script>
import info from "@/components/mapLayer/info";
const colors = ['#f7fcf5', '#e5f5e0', '#c7e9c0', '#a1d99b', '#74c476', '#41ab5d', '#238b45', '#006d2c', '#00441b'].reverse();
export default {
  props:{
    lines:{},
    points:{},
    lineString:{},
    polylinePath:{},
    point:{}
  },
  data() {
    return {

      // icon: ,
      zoom: 15,
      center: [117.120128,36.652069],
      firstPlayFlag: true,
      bounds: [116.83695000897586, 36.401302737152854 ,117.36915231402126, 36.84171521015678],
      // bounds: [-180, -85 , 180, 85],
      canvas: null,
      map: null,
      girdSize: 100,
      context: null,
      pitch:0,
      visible: {
        control:true,
        line:false,
        marker:true,
        polyline:false,
        layer:false,
      },
      sourceUrl: 'https://a.amap.com/Loca/static/loca-v2/demos/mock_data/bj_bus.json',
      mapStyle: 'amap://styles/916e03b38cfc09e90d195b3a566df71a',
      sourceUrlP:'https://geo.datav.aliyun.com/areas_v3/bound/370100_full.json',
      sourceUrlScatter:'https://a.amap.com/Loca/static/loca-v2/demos/mock_data/sz_road_F.json',
      show: false,
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
      },
      layerStyleScatter: {
        unit: 'px',
        size: [25, 25],
        borderWidth: 1,
        texture: 'static/p2.png',
        // texture: 'https://pic.616pic.com/ys_img/00/07/26/3JJnrZk3Dy.jpg',
        color: 'rgb(38,65,178)',
        duration: 500,
        // animate: true,
      }
    };
  },
  components: {
    info
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
    zoomChange(){
    },
    clickMarker(Feature){
      console.log(Feature)
      let marker = {
        lnglat: Feature.coordinates,
        camAddress: Feature.properties.camAddress,
        camId: Feature.properties.camId
      };
      this.$parent.point.push(marker)
      this.$parent.camList.push(marker)
    },
    initLoca(loca){
      loca.animate.start();
    },
    mousemove(feature){

    },
    getMap() {
      // bmap vue component
      console.log('$refs: ', this.$refs.map.$$getInstance())
    },
    getLocation(e) {
      console.log('getLocation: ', e)
    },
    initMap(map){
      var canvas = document.createElement('canvas');
      var context = canvas.getContext('2d');
      // context.fillStyle = 'rgb(0,100,255)';
      // // context.strokeStyle = 'white';
      context.globalAlpha = 1;
      context.lineWidth = 1;
      canvas.width = canvas.height = 10000;
      this.canvas = canvas;
      this.context = context;
      this.firstPlayFlag = true;
    },
    initLayer(layer){

      var draw = () => {
        if (!this.firstPlayFlag){
          return;
        }
        console.log('start')
        var canvasWidth = this.context.canvas.width;
        var canvasHeight = this.context.canvas.height;

        var xLineTotals = Math.floor(canvasHeight / this.girdSize);
        for(var i = 0; i< xLineTotals; i++){

          this.context.beginPath(); // 开启路径，设置不同的样式
          this.context.moveTo(0, this.girdSize * i); // -0.5是为了解决像素模糊问题
          this.context.lineTo(canvasWidth, this.girdSize * i);
          this.context.strokeStyle = "#ccc"; // 设置每个线条的颜色

          this.context.stroke();
        }
        var yLineTotals = Math.floor(canvasWidth / this.girdSize);
        for(var j = 0; j< yLineTotals; j++) {
          this.context.beginPath(); // 开启路径，设置不同的样式
          this.context.moveTo(this.girdSize * j, 0); // -0.5是为了解决像素模糊问题
          this.context.lineTo(this.girdSize * j, canvasHeight);
          this.context.strokeStyle = "#ccc"; // 设置每个线条的颜色

          this.context.stroke();
        }
        // 刷新渲染图层
        layer.reFresh();
        AMap.Util.requestAnimFrame(draw);
      };
      draw();
      this.firstPlayFlag = false;

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

