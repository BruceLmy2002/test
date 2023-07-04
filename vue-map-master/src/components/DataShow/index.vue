<!--车辆次数统计 某段时间内通过卡口的车辆及对应次数，所经过的卡口，该车辆轨迹-->
<template>
  <div class="info">
    <div class="info-title">车辆次数统计
      <el-button type="danger" size="mini" icon="el-icon-circle-close" circle style="float:right" @click="close"></el-button>
    </div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="查询条件" name="first">
        <div >
          <el-form ref="form" :model="form"  label-width="80px" >
            <el-form-item label="卡口组" prop="camIds">
              <el-input v-model="form.camIds" placeholder="输入多个用英文逗号分开,或者从本地文件中上传"></el-input>
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
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          height="500"
          :row-key="getRowKey"
          :expand-row-keys="expandedRows"
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
              <div v-for="point in props.row.features.geometry.coordinates">{{point}}</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="carNumber"
            label="车牌号"
            width="140">
          </el-table-column>
          <el-table-column
            prop="count"
            label="次数"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="cams"
            label="经过卡口"
            show-overflow-tooltip>
          </el-table-column>
        </el-table>
<!--        <el-pagination-->
<!--          @size-change="handleSizeChange"-->
<!--          @current-change="handleCurrentChange"-->
<!--          :current-page="currentPage"-->
<!--          :page-sizes="[10, 20, 30, 40]"-->
<!--          :page-size="pageSize"-->
<!--          layout="total, sizes, prev, pager, next, jumper"-->
<!--          :total="totalItems">-->
<!--        </el-pagination>-->

        <el-button type="primary" style="margin-top: 10px" @click="showData">展示所选轨迹</el-button>
      </el-tab-pane>
      <el-tab-pane label="数据统计" name="fourth">

      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import {vehicleCamStats, listByCarNumberOrderInTimeRange} from "../../api/map";
var colors = ['#FAE200', '#D27E37', '#C53634', '#C12B6E', '#A92E9A', '#67238A', '#211A50', '#18244E'].reverse();
var allData = []
var e = []
export default {
  props:{
    camList:{}
  },
  data() {
    return {
      activeName: 'first',
      form: {
        camIds: '',
        startTime:'',
        endTime:'',
      },
      tableData:[],
      // currentPage: 1, // 当前页码
      // pageSize: 5, // 每页显示的条数
      // totalItems: 0, // 总条数
      expandedRows: [],
      selected: [],
      points: [],
    }
  },
  created() {
  },
  methods: {
    getRowKey(row) {
      return row.id; // 使用唯一标识作为行的 key
    },
    expandRow(row) {
      e.push(row.id); // 将行的唯一标识添加到展开数组中
    },
    collapseRow(row) {
      const index = e.indexOf(row.id);
      if (index !== -1) {
        e.splice(index, 1); // 从展开数组中移除行的唯一标识
      }
    },
    // handleSizeChange(size) {
    //   this.pageSize = size;
    //   this.getData(); // 根据新的每页条数重新获取数据
    // },
    // handleCurrentChange(page) {
    //   this.currentPage = page;
    //   this.getData(); // 根据新的页码重新获取数据
    // },
    // getData() {
    //   // 假设tableData为所有数据数组
    //   // 这里根据实际情况使用适当的方式截取对应页码和条数的数据
    //   const startIndex = (this.currentPage - 1) * this.pageSize;
    //   const endIndex = startIndex + this.pageSize;
    //   this.tableData = allData.slice(startIndex, endIndex);
    // },
    handleSelectionChange(rows) {
      this.selected = rows.map(function(rows) {
        return {
          id: rows.id,
          features: rows.features
        };
      })
      console.log(this.selected)
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
        this.expandRow(row)
        var a = []
        a.push(row.carNumber)
        let form = {
          startTime: this.form.startTime,
          endTime: this.form.endTime,
          carNumbers: a,
        }
        console.log(allData)
        if(allData[row.id].features.geometry.coordinates.length === 0 ){
          listByCarNumberOrderInTimeRange(form).then((response) => {
            console.log(response.msg)
            row.features = response.msg.features[0]
            allData[row.id].features = response.msg.features[0]
            this.expandedRows = e
          })
        }

      } else {
        // 行被关闭
        this.collapseRow(row);
        console.log('行被关闭');
      }
    },
    showData() {
      const length = this.selected.length
      console.log(this.selected)
      for (var i=0; i<length; i++){
        if (this.selected[i].features.geometry.coordinates.length === 0){
          var a = []
          a.push(allData[this.selected[i].id].carNumber)
          let form = {
            startTime: this.form.startTime,
            endTime: this.form.endTime,
            carNumbers: a,
          }
          var id = this.selected[i].id
          listByCarNumberOrderInTimeRange(form).then((response) => {
            allData[id].features = response.msg.features[0]
          })
        }
        let line = {
          path: allData[id].features.geometry.coordinates,
          color: colors[id % colors.length]
        }
        for (var j=0; j<allData[id].features.geometry.coordinates.length; j++){
          this.$parent.point.push({
            lnglat : allData[id].features.geometry.coordinates[j],
            camAddress: ' '
          })
        }

        this.$parent.polylinePath.push(line)
      }
      console.log('=-----------------')
      console.log(this.$parent.polylinePath)
      console.log(this.$parent.point)
      this.$parent.$refs.mapView.visible.polyline = true;
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
      this.tableData = []
      if(typeof this.form.camIds === "string"){
        this.form.camIds.split(',')
      }
      console.log(this.form)
      vehicleCamStats(this.form).then((response) => {

        if(response.code === 200){
          this.$message({
            message: '查询成功',
            type: 'success'
          });
          console.log(response.msg)
          allData = response.msg
          for(var i=0; i<allData.length; i++){
            allData[i].id = i
            allData[i].features = {
              geometry:{coordinates:[]}
            }
          }
          this.tableData = allData
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
          this.activeName = 'third'
        }else {
          this.$message.error('查询失败');
        }

      })
    },
    fill1(){
      this.form = {
        camIds:["3701999862"],
        startTime:"2021-02-01 13:00:00",
        endTime:"2021-02-01 13:05:00"
      }

      this.activeName = 'first'
    },
    fill2(){
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


