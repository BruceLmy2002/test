<template>
  <div class="main-cont" :style="mainContStyle">
    <div class="main-map" id="main-map" @click="hideMenu" :style="mainMapStyle">
      <mapView ref="mapView" :points="points" :point="point" :lines="lines" :polylinePath="polylinePath"></mapView>
    </div>
    <div class="desktop">
      <Row class="desktop-row">
        <Col span="20" class="desktop-item" @click.native="hideMenu">
          <div class="bottom-menu-item">
            <div
              class="icon-menu"
              :class="sysId == item.sysId?'active' : ''"
              v-for="(item, index) in startMenuList"
              :key="index"
              @click="changePageShow(item)"
            >
              <Icon :type="item.icon"></Icon>
            </div>
          </div>
          <div class="copyright">车辆轨迹管理系统</div>
        </Col>
        <Col span="2" class="desktop-time" @click.native="hideMenu">
          <div>{{sysTime.date}}</div>
          <div>{{sysTime.time}}</div>
        </Col>
        <Col span="2" class="start">
          <div type="text" @click="startMenu" class="start-btn">
            <Icon type="logo-windows" size="16" color="#ffb848" class="start-icon"></Icon>
            <span class="start-text">统计功能</span>
          </div>
        </Col>
        <Col span="2" class="start">
          <div type="text" @click="setMenu" class="start-btn">
            <Icon type="logo-windows" size="16" color="#ffb848" class="start-icon"></Icon>
            <span class="start-text">地图设置</span>
          </div>
        </Col>
      </Row>
    </div>
    <div class="data-monitor">
      <info v-if="isInfo" ref="info" :camList="camList"></info>
      <count v-if="isCount" ref="count" :camList="camList"></count>
      <cars v-if="isCars" ref="count" :camList="camList"></cars>
      <car v-if="isCar" ref="count" :camList="camList"></car>
    </div>
    <transition name="fade">
      <startMenu v-if="isShowMenu" @changeLayer="changeLayer"></startMenu>
    </transition>
    <transition name="fade">
      <mapSetMenu v-if="isShowSet"></mapSetMenu>
    </transition>
  </div>
</template>

<script>
import mapView from "@/components/map.vue";
import startMenu from "@/components/OpMenu.vue";
import mapSetMenu from "@/components/mapSetMenu.vue";
import info from "@/components/mapLayer/info1.vue"
import count from "@/components/DataShow/index.vue"
import car from "@/components/DataShow/car.vue"
import cars from "@/components/DataShow/cars.vue"
import { ihavesee } from "@/api/stream"
import {getAllCamInfo} from "../api/map";

export default {
  name: "hello",
  components: {
    mapView,
    startMenu,
    mapSetMenu,
    info,
    count,
    car,
    cars
  },
  data() {
    return {
      point:[],
      points: {},
      polylinePath:[],
      lines:{},

      cams:[],
      sysId: "",
      // 底边栏是否显示
      isShowMenu: false,
      isShowSet:false,
      // 相关查询面板是否显示
      isInfo:false,
      isCount:false,
      isCar:false,
      isCars:false,
      sysTime: {
        // date: new Date().toLocaleDateString(),
        // time: new Date().toLocaleTimeString()
      },
      // 所选择的卡口组
      camList:[],

      mainMapStyle: {},
      mainContStyle: {},
      startMenuList: [],

    };
  },

  computed: {},
  mounted() {
    this.init();
    this.setDesktopTime();
    this.setWindowSize();
    window.addEventListener(
      "resize",
      () => {
        this.setWindowSize();
      },
      false
    );
  },
  methods: {
    init(){
      getAllCamInfo().then((response) => {
        console.log(response.msg)
        this.points = response.msg
        console.log(this.points)

      })

    },

    changeLayer(id) {
      this.sysId = id
    },
    //点击切换下面的小图标时候
    changePageShow: function (item) {
      let sysId = item.sysId;
      this.sysId = sysId;
      this.$layer.taggel(sysId);
    },
    //设置地图层div的宽度高度
    setWindowSize: function () {
      this.mainContStyle = {
        width: document.documentElement.clientWidth + "px",
        height: document.documentElement.clientHeight + "px"
      };
      this.mainMapStyle = {
        width: document.documentElement.clientWidth + "px",
        height: document.documentElement.clientHeight - 38 + "px"
      };
    },
    //点击其他地方，隐藏开始菜单
    hideMenu: function () {
      this.isShowMenu = false;
      this.isShowSet = false;
    },
    //设置右下角时间
    setDesktopTime() {
      if (this.timeInterval) {
        clearInterval(this.timeInterval);
      }
      this.timeInterval = setInterval(() => {
        this.sysTime = {
          date: new Date().toLocaleDateString(),
          time: new Date().toLocaleTimeString()
        };
      }, 1000);
    },
    //开始菜单点击事件
    startMenu: function (e) {
      this.isShowSet = false;
      this.isShowMenu = !this.isShowMenu;
    },
    setMenu:function (e) {
      this.isShowMenu = false;
      this.isShowSet = !this.isShowSet;
    }

  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@import '~@/less/index.less';
.data-monitor {
  position: relative;
  width: 500px;
  height: 100%;
}
.desktop {
  width: 100%;
  height: 40px;
  display: block;
  position: absolute;
  bottom: 0px;
  background: @backColor;
  z-index: 9999;
}

.desktop-row {
  height: 40px;
  line-height: 40px;
  color: @backTextColor;
  overflow: hidden;
}

.start {
  background: @activeBackColor;
  transition: all 0.2s ease-in;
  width: 110px;
  z-index: 100;

  &:hover {
    background-color: @activeBackColorHover;
    cursor: pointer;
    .start-icon {
      transform: rotateY(330deg);
      color: @textColorHover;
    }
  }

  &-btn {
    width: 100%;
    height: 100%;
  }
}

.start-icon {
  padding: 5px;
  transition: all 0.4s ease-in;
}

.start-text {
  color: @backTextColor;
}

.desktop-item {
  min-width: 300px;
  width: 100%;
  position: absolute;
  padding: 0px 100px 0px 210px;
}

.desktop-time {
  display: inline;
  position: absolute;
  height: 40px;
  width: 100px;
  padding: 4px 0px 0px 5px;
  bottom: 0px;
  right: 0px;
  text-align: center;
  color: @backTextColor;
  transition: all 0.2s ease;
  &:hover {
    cursor: pointer;
    background-color: @backColorHover;
  }
  > div {
    height: 16px;
    line-height: 16px;
  }
}

.copyright {
  float: right;
  padding: 0 20px;
}
.bottom-menu-item {
  min-width: 200px;
  .active {
    background-color: @activeBackColor;
  }
}
.main-map {
  display: block;
  position: absolute;
  left: 0px;
  top: 0px;
}
.bounce-enter-active {
  animation: bounce-in 0.5s;
}
.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}
.main-cont {
  display: block;
  overflow: hidden;
}
.icon-menu {
  width: 46px;
  height: 40px;
  cursor: pointer;
  float: left;
  margin: 0 6px;
  border-bottom: 2px solid @borderColor;
  transition: all 0.2s ease;
  &:hover {
    width: 50px;
    margin: 0 4px;
    background-color: @backColorHover;
    border-bottom: 2px solid @borderColor;
    i {
      font-size: 34px;
    }
  }
  i {
    font-size: 32px;
    line-height: 40px;
    color: @backTextColor;
  }
}
</style>
