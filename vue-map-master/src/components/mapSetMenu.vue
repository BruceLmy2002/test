<template>
  <div id="startMenu">
    <div class="menu-top">
      <Icon type="md-map" class="user-icon"></Icon>
<!--      <Icon type="md-person" class="user-icon"></Icon>-->
      <span class="user-name">地图设置</span>
    </div>
    <div class="menu-cont">
      <Carousel v-model="value1" :trigger="'hover'" :arrow="'never'" class="menu-cont-page">
        <CarouselItem v-for="(num, index) in menuList" :key="index" class="menu-cont-page-item">
          <div
            v-for="(item, index) in num"
            :key="index"
            class="menu-item"
            :style="item.color | formatColor"
            @click="setMap(item.id)"
          >
            <Icon :type="item.icon"></Icon>
            <div class="menu-item-text">
              <span>{{item.title}}</span>
            </div>
          </div>
        </CarouselItem>
      </Carousel>
    </div>
  </div>
</template>

<script>
import DataMonitor from "./DataMonitor/Index.vue";
import test1 from "./sys1/Index.vue";
import test2 from "./sys2/Index.vue";
import sys3 from "@/views/sys3/Index.vue";

export default {
  props: [],
  components: {
    DataMonitor,
    test1,
    test2,
    sys3
  },
  data() {
    return {
      button1:"关闭工具栏",
      button2:"显示监控卡口",
      button3:"删除标记",
      button4:"3D地图",
      value1: 0,
      menuList: [
        { id: 1, icon: "ios-analytics", title: "关闭工具栏", color: "#cb5a5e"},
        { id: 2, icon: "md-apps", title: "显示监控卡口", color: "#30962d"},
        { id: 3, icon: "md-aperture", title: "删除标记", color: "#ca8319"},
        { id: 4, icon: "md-analytics", title: "3D地图", color: "#ed3f14"},
      ]
    };
  },
  filters: {
    formatColor: function (color) {
      return "background-color:" + color;
    }
  },
  mounted() {
    this.menuCalculate();
  },
  methods: {
    setMap(methodsNums) {
      this[methodsNums]()
    },
    1() {
      if (this.menuList[0][0].title === "显示工具栏") {
        this.$set(this.menuList[0][0], 'title', "关闭工具栏");
        this.$parent.$refs.mapView.visible.control = true;
      } else {
        this.$parent.$refs.mapView.visible.control = false;
        this.$set(this.menuList[0][0], 'title', "显示工具栏");
      }
    },
    2() {
      if (this.menuList[0][1].title === "显示监控卡口") {
        this.$parent.$refs.mapView.visible.marker = true;
        this.$set(this.menuList[0][1], 'title', "隐藏监控卡口");
      } else {
        this.$parent.$refs.mapView.visible.marker = false;
        this.$set(this.menuList[0][1], 'title', "显示监控卡口");
      }
    },
    3() {
      this.$parent.point=[]
      this.$parent.camList=[]
      this.$parent.polylinePath=[]
    },
    4() {
      if (this.menuList[0][3].title === "3D地图") {
        this.$parent.$refs.mapView.pitch = 55;
        this.$set(this.menuList[0][3], 'title', "2D地图");
      } else {
        this.$parent.$refs.mapView.pitch = 0;
        this.$set(this.menuList[0][3], 'title', "3D地图");
      }
    },
    //格式化菜单数据,以6来均分
    menuCalculate: function () {
      var list = this.menuList;
      var arr = [];
      for (var i = 0; i < list.length; i += 6) {
        arr.push(list.slice(i, i + 6));
      }
      this.menuList = arr;
      console.log(this.menuList)
      console.log(this.menuList[0])
      console.log(this.menuList[0][0])
      console.log(this.menuList[0][0].color)

    },
    //点击一个菜单项事件
    startMenuItem: function (item) {
      var flag = false;
      var sysId = '';
      var list = this.$parent.startMenuList;
      for (var _item of list) {
        if (_item.id == item.id) {
          flag = true;
          sysId = _item.sysId;
        }
      }
      console.log(list, sysId, item)
      if (!flag) {
        this.creatLayer(item);
      } else {
        this.$layer.setTop(sysId);
        this.$emit('changeLayer', sysId)
      }

      this.$parent.isShowMenu = false;
    },
    //创建一个弹出层
    creatLayer: function (item) {
      var _this = this;
      var page = item.page;
      var width = document.getElementById("main-map").offsetWidth + "px";
      var height = document.getElementById("main-map").offsetHeight + 5 + "px";
      var layer = this.$layer.iframe({
        content: {
          content: page, //传递的组件对象
          parent: this, //当前的vue对象
          data: [] //props
        },
        area: [width, height],
        title: item.title,
        center: false,        //是否显示在窗口正中心
        shadeClose: false,    //是否允许点击阴影关闭
        btntool: true,        //是否显示右上角最小化和关闭图标
        move: false,          //是否允许拖动
        fullScreen: true,   //全屏显示
        close: function (id) {
          var list = _this.$parent.startMenuList;
          for (var i in list) {
            if (list[i].sysId == id) {
              _this.$parent.startMenuList.splice(i, 1);
            }
          }
        }
      });
      this.$parent.startMenuList.push({ id: item.id, sysId: layer, icon: item.icon, color: item.color });
      this.$emit('changeLayer', layer)
    }
  }
};
</script>

<style>
#startMenu {
  position: absolute;
  left: 0px;
  bottom: 40px;
  width: 290px;
  height: 450px;
  display: block;
  background-color: rgba(15, 43, 76, 0.9);
  z-index: 999999;
}
.menu-top {
  width: 100%;
  height: 80px;
  padding: 15px 0px 20px 40px;
}
.menu-cont {
  width: 100%;
  height: 360px;
  border: 0.8px solid #888;
  border-width: 0.8px 0;
  padding: 15px 5px;
}
.menu-bottom {
  width: 100%;
  height: 60px;
  padding: 14px 0;
}
.menu-bottom button {
  margin: 0 10px;
}
.user-icon {
  border-radius: 25px;
  width: 45px;
  height: 45px;
  background-color: #666;
  float: left;
  color: #fff;
  font-size: 32px;
  line-height: 45px;
  transition: all 0.2s ease;
}
.user-icon:hover {
  cursor: pointer;
  background-color: #333;
  color: #bbb;
  transform: rotateY(180deg);
}
.user-name {
  float: left;
  color: #ddd;
  padding: 10px;
  font-size: 16px;
}
.menu-cont-page {
  width: 100%;
  height: 100%;
}
.menu-cont-page-item {
  padding: 10px 35px;
  width: 280px !important;
  height: 308px !important;
  overflow: hidden;
}
.menu-item {
  width: 90px;
  height: 90px;
  margin: 5px;
  color: #fff;
  font-size: 14px;
  float: left;
  border: 1.5px solid transparent;
  /* background-color: #cb5a5e; */
  transition: all 0.2s ease;
  line-height: 16px;
}
.menu-item:hover {
  border-color: #ddd;
  cursor: pointer;
  border-radius: 4px;
}
.menu-item i {
  font-size: 45px;
  padding: 5px 0;
  display: block;
  transition: all 0.25s ease;
}
.menu-item:hover i {
  transform: rotateY(180deg);
}
.menu-item:hover .menu-item-text span {
  font-weight: bold;
}
.menu-item-text {
  width: 86px;
  height: 35px;
  display: table-cell;
  vertical-align: middle;
  text-align: center;
}
.menu-item .menu-item-text span {
  margin: 0 auto;
  text-align: center;
}
</style>
