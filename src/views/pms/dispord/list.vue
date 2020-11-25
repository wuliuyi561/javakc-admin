<template>
  <div id="app-container">

    <!-- 查询表单 -->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="dispOrdQuery.orderName" placeholder="指令名称" />
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker
          v-model="dispOrdQuery.beginDate"
          type="datetime"
          placeholder="选择开始时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="dispOrdQuery.endDate"
          type="datetime"
          placeholder="选择截止时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>
      <el-button type="primary" @click="query()">查询</el-button>
      <el-button type="primary" @click="resetData()">重置</el-button>
    </el-form>

    <!-- 列表 -->
    <el-table :data="dispOrdList" border fit highlight-current-row @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" />
      <el-table-column label="序号" width="70" align="center">
        <template slot-scope="scope">
          {{ (pageNum - 1) * pageSize + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="orderName" label="指令名称" width="80" />
      <el-table-column label="优先级">
        <template slot-scope="scope">
          {{
          scope.row.priority === 1 ? '一级' :
          scope.row.priority === 2 ? '二级' :
          scope.row.priority === 3 ? '三级' : '四级'
          }}
        </template>
      </el-table-column>
      <el-table-column label="专业类型">
        <template slot-scope="scope">
          {{
          scope.row.specType === 1 ? '生产调度指令' :
          scope.row.specType === 2 ? '安全调度指令' :
          scope.row.specType === 3 ? '开工调度指令' : '培训调度指令'
          }}
        </template>
      </el-table-column>
      <el-table-column prop="orderDesc" label="指令描述" />
    </el-table>

    <!-- 分页 -->
    <el-pagination
      :page-size="pageSize"
      :current-page="pageNum"
      :total="total"
      :pager-count="11"
      style="padding: 30px 0; text-align: center;"
      layout="total, prev, pager, next, jumper"
      @current-change="query">
    </el-pagination>

    <!-- 操作按钮 -->
    <el-row>
      <el-col :span="2" :offset="8">
        <el-button type="primary" @click="toCreateDispOrd()">创建</el-button>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" @click="toUpdateDispOrd()" :disabled="this.multipleSelection.length === 0 || this.multipleSelection.length > 1">修改</el-button>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" @click="deleteDispOrd()" :disabled="this.multipleSelection.length === 0 || this.multipleSelection.length > 1">删除</el-button>
      </el-col>
    </el-row>

    <!-- 创建对话框 -->
    <el-dialog
      title="增加集团调度指令信息"
      :visible.sync="dialogVisible"
      width="50%">
      <el-form label-width="130px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="优先级">
              <el-select v-model="dispOrd.priority" clearable placeholder="请选择">
                <el-option :value="1" label="一级"/>
                <el-option :value="2" label="二级"/>
                <el-option :value="3" label="三级"/>
                <el-option :value="4" label="四级"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="专业类型">
              <el-select v-model="dispOrd.specType" clearable placeholder="请选择">
                <el-option :value="1" label="生产调度指令"/>
                <el-option :value="2" label="安全调度指令"/>
                <el-option :value="3" label="开工调度指令"/>
                <el-option :value="4" label="培训调度指令"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="指令名称">
              <el-input v-model="dispOrd.orderName"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="指令描述">
              <el-input v-model="dispOrd.orderDesc" :rows="10" type="textarea"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="3" :offset="5">
            <el-form-item>
              <el-button :disabled="saveBtnDisabled" type="primary" @click="saveDispOrd()">保存</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item>
              <el-button type="primary" @click="createDialogVisible = false">返回</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>


<!--      :before-close="handleClose">-->
<!--      <span>这是一段信息</span>-->
<!--      <span slot="footer" class="dialog-footer">-->
<!--    <el-button @click="dialogVisible = false">取 消</el-button>-->
<!--    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>-->
<!--  </span>-->
    </el-dialog>
  </div>
</template>

<script>
  import  dispord from '@/api/pms/dispord'

    export default {
      data() {// ## 定义变量和初始值
        return {
          dispOrdQuery: {},  // ## 查询条件 封装查询对象
          pageNum: 1,  // ## 当前页  从第一页开始
          pageSize: 5,   // ## 当前一页展示多少条数据 每页最大条数
          dispOrdList: [],   // ## 用来接收数据信息 展示的数据
          total: 0, // ## 总记录数
          multipleSelection: [], // ## 记录表格复选框选中的值
          dialogVisible: false,  // ## 关闭创建对话框
          saveBtnDisabled: false, // ## 不禁用按钮
          dispOrd: {// ## 调度指令信息
            id: '',
            orderName: '',
            priority: '',
            specType: '',
            orderDesc: ''
          }
        }
      },
      created() {// ## 未被渲染之前执行的
        this.query()
      }
      ,
      methods: { // ## 创建具体的方法,调用 dispOrd.js 定义的方法
        query(pageNum = 1) {// ## 带条件的分页查询
          this.pageNum = pageNum
          dispord.findPageDispOrd(this.dispOrdQuery, this.pageNum, this.pageSize)
            .then(response => {
              // ## 列表展示数据
              this.dispOrdList = response.data.items
              // ## 总记录数赋值
              this.total = response.data.total
            })
        },
        handleSelectionChange(val) { // ## 复选框改变时触发该事件
          this.multipleSelection = val
        },

        resetData() {// ## 重置查询数据
          // ## 清空数据
          this.dispOrdQuery = {}
          // ## 重新查询
          this.query()
        },
        toCreateDispOrd() {// ## 创建触发事件
          // ## 打开对话框
          this.dialogVisible = true
          // ## 清空数据
          this.dispOrd = {}
          // ## 释放禁用按钮
          this.saveBtnDisabled = false
        },
        saveDispOrd() {// ## 创建调度指令信息
          // ## 禁用保存按钮
          this.saveBtnDisabled = true
          dispord.save(this.dispOrd)
            .then(response => {
              // ## 消息提示
              this.$message({
                message: '创建成功！',
                type: 'success'
              })
              // ## 关闭对话框
              this.dialogVisible = false
              // ## 重新查询
              this.query()
            })
        },
        toUpdateDispOrd() {// ## 跳转到修改调度指令库管理页面
          // ## 获取所有选中行的id组成的字符串，以逗号分隔
          var ids = this.multipleSelection.map(item => item.id).join()
          // ## 跳转
          this.$router.push('/pms/dispord/update/' + ids)
        },
        deleteDispOrd() {// ## 单条数据删除
            this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              // ## 获取所有选中行的id组成的字符串，以逗号分隔
              var ids = this.multipleSelection.map(item => item.id).join()
              dispord.deleteDispOrd(ids)
                .then(response => {
                  // ## 消息提示
                  this.$message({
                    type: 'success',
                    message: '删除成功！'
                  })
                  // ## 重新查询
                  this.query()
                })
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              });
            })
        }
      }
    }
</script>


