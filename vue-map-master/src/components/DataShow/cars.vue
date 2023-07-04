<!--车辆出现统计：上传一批车，统计在某段时间范围，出现的次数。生成直方图饼图-->
<template>
  <div class="info">
    <div class="info-title">车辆出现统计
      <el-button type="danger" size="mini" icon="el-icon-circle-close" circle style="float:right" @click="close"></el-button>
    </div>

    <el-tabs v-model="activeName">
      <el-tab-pane label="查询条件" name="first">
        <div >
          <el-form ref="form" :model="form"  label-width="80px" >
            <el-form-item label="车牌号" prop="carNumbers">
              <el-input v-model="form.carNumbers" placeholder="输入多个用英文逗号分开,或者从本地文件中上传"></el-input>
            </el-form-item>
            <el-form-item >
              <input type="file" ref="fileInput" @change="handleFileChange1">
            </el-form-item>
            <el-form-item required label="起止时间">
              <el-col :span="11">
                <el-form-item prop="startTime">
                  <el-date-picker
                    v-model="form.startTime"
                    type="datetime"
                    placeholder="选择日期时间"
                    style="width: 100%;"
                    value-format="yyyy-MM-dd hh:mm:ss"
                  >
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col class="line" :span="2">-</el-col>
              <el-col :span="11">
                <el-form-item prop="endTime">
                  <el-date-picker
                    v-model="form.endTime"
                    type="datetime"
                    placeholder="选择日期时间"
                    style="width: 100%;"
                    value-format="yyyy-MM-dd hh:mm:ss"
                  >
                  </el-date-picker>
                </el-form-item>

              </el-col>
            </el-form-item>

            <el-form-item>
              <el-button size="medium" type="primary" @click="importFromMap">导入地图上的卡口</el-button>
              <el-button size="medium" type="primary" @click="onSubmit" style="width: 100px;">查询</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>
      <el-tab-pane label="常用查询" name="second">
        <el-form>
          <el-row>
            <el-col :span="24"><div style="background: #d3dce6; border-radius: 4px; min-height: 36px;"><el-button type="text" @click="fill1">用例1</el-button></div></el-col>
          </el-row>
          <el-row>
            <el-col :span="24"><div style="background: #d3dce6; border-radius: 4px; min-height: 36px;"><el-button type="text" @click="fill2">用例2</el-button></div></el-col>
          </el-row>
          <el-row>
            <el-col :span="24"><div style="background: #d3dce6; border-radius: 4px; min-height: 36px;"><el-button type="text" @click="fill3">用例3</el-button></div></el-col>
          </el-row>
          <el-row>
            <el-col :span="24"><div style="background: #d3dce6; border-radius: 4px; min-height: 36px;"><el-button type="text" @click="fill4">用例4</el-button></div></el-col>
          </el-row>
        </el-form>

      </el-tab-pane>
      <el-tab-pane label="查询结果" name="third">
        <el-table
          ref="multipleTable"
          :data="tableDate"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
          @expand-change="expandChange">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            type="expand"
            width="55">
            <template slot-scope="props">
              <div v-for="point in props.row.points">轨迹点：{{point}}</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="carType"
            label="车牌号"
            width="120">
          </el-table-column>
          <el-table-column
            prop="carNumber"
            label="次数"
            show-overflow-tooltip>
          </el-table-column>

        </el-table>
        <el-button type="primary" style="margin-top: 10px" @click="showData">展示所选轨迹</el-button>
      </el-tab-pane>
      <el-tab-pane label="数据统计" name="fourth">

      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { getInfoList } from "@/api/map";
import {vehicleCamStats, listByCarNumberOrderInTimeRange} from "../../api/map";

export default {
  props:{
    camList:{}
  },
  data() {
    return {
      activeName: 'first',
      form: {
        camNumbers: '',
        startTime:'',
        endTime:'',
      },
      tableDate:[],
    }
  },
  created() {
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleFileChange1(event) {
      const file = event.target.files[0]; // 获取选择的文件
      const reader = new FileReader(); // 创建FileReader对象

      reader.onload = (e) => {
        const content = e.target.result; // 读取文件内容
        const processedContent = content.replace(/\r?\n|\r/g, "");
        this.$set(this.form, 'camIds', processedContent)

        // 可以在此处执行其他逻辑或对读取到的内容进行处理
      };

      reader.readAsText(file); // 以文本形式读取文件内容
    },

    close(){
      this.$parent.isCount=false
    },
    expandChange(row, expandedRows){
      if (expandedRows.includes(row)) {
        // 行被展开
        console.log('行被展开');
      } else {
        // 行被关闭
        console.log('行被关闭');
      }
    },
    showData() {
      this.$parent.$refs.mapView.visible.line = true;
    },

    importFromMap() {
      const  length_now = a.length
      length = this.camList.length;
      if (length_now < length){
        var i=0;
        for(i=0; i<length; i++){
          a.push(this.camList[i].camId)
        }
        this.form.camIds = a.toString()
        console.log(this.form.camIds)
      }
    },
    onSubmit(){
      this.tableDate = []
      if(typeof this.form.carNumbers === "string"){
        this.form.carNumbers.split(',')
      }
      if(typeof this.form.camIds === "string"){
        this.form.camIds.split(',')
      }
      vehicleCamStats(this.form).then((response) => {
        if(response.code === 200){
          this.$message({
            message: '查询成功',
            type: 'success'
          });
          console.log(response.msg)
          // this.$parent.lines = response.msg
          // var i=0;
          // for (i=0; i<this.$parent.lines['features'].length; i++){
          //   const coordinates = this.$parent.lines['features'][i]['geometry']['coordinates']
          //   this.$parent.lines['features'][i]['geometry']['coordinates'] = []
          //   let data = {
          //     points: coordinates,
          //     carNumber: this.$parent.lines['features'][i]['properties']['carNumber'],
          //     carType: this.$parent.lines['features'][i]['properties']['carType'],
          //   }
          //   this.tableDate.push(data)
          // }
          // console.log(response)
          // this.activeName = 'third'
        }else {
          this.$message.error('查询失败');
        }

      })
    },
    fill1(){
      this.form = {
        carNumbers:["鲁A0000626000"],
        startTime:"2021-02-01 13:00:00",
        endTime:"2021-02-01 13:05:00"
      }
      this.activeName = 'first'
    },
    fill2(){
      this.form = {
        carNumbers:["黑N0001284399","黑P0001093807"],
        carTypes:["小型汽车号牌"],
        startTime:"2021-02-01 00:00:00",
        endTime:"2021-02-01 24:00:00",
        camIds:["3701033233","3701022226"],
        trajectoryCut:30
      }

      this.activeName = 'first'
    },
    fill3(){
      this.activeName = 'first'
    },
    fill4(){
      this.activeName = 'first'
    },
  },
}
</script>

<style lang="scss" scoped>
.info {
  position: fixed;
  width: 500px;
  left: 30px;
  top: 20px;
  background-color: rgba(255, 255, 255, 0.7);
  color: #4f4d4d;
  padding: 25px 35px;
  border-radius: 5px;
  &-title {
    font-size: 28px;
    line-height: 32px;
    padding-bottom: 20px;
    &-desc {
      font-size: 14px;
      color: #9e9e9e;
      text-align: left;
    }
  }
  .cont {
    color: #ffffff;
    display: flex;
    &-item {
      flex: 33%;
      padding: 15px;
      &-num {
        color: #e91e63;
        font-size: 26px;
      }
      &-title {
        font-size: 18px;
        color: #ffffff;
      }
      &-desc {
        color: #adadad;
        font-size: 16px;
        &-num {
          color: #e91e63;
        }
      }
      .now {
        color: #ff5722;
      }
      .input {
        color: #f90;
      }
      .heal {
        color: #19be6b;
      }
      .dead {
        color: #a2a2a2;
        // text-decoration: line-through;
      }
      .ext {
        color: #00bcd4;
      }
    }
  }
}
</style>

<style lang="scss">
.info {
  .ivu-tabs-nav .ivu-tabs-tab {
    color: #aaaaaa;
  }
  .ivu-tabs-nav .ivu-tabs-tab-active {
    color: #ffffff;
  }
  .ivu-tabs-ink-bar {
    background-color: #ffffff;
  }
}
</style>




