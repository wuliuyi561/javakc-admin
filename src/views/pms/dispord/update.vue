<template>
  <div id="app-container">
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
  </div>
</template>

<script>
  import  dispord from '@/api/pms/dispord'
  export default {
        data(){
          return{
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
      created() {
        this.init()
      },
      methods: {
        init() { // ## 初始化
                 // ## 判断路径中是否存在id值
          if (this.$route.params && this.$route.params.id) {
            // ## 从路径中获取id值
            const id = this.$route.params.id
            // ##调用回显方法
            this.view(id)
          }
        },
          view(id){// ## 回显
            dispord.getById(id)
              .then(response => {
                // ## 调度指令对象赋值
                this.dispOrd = response.data.dispOrd
              })
          },
        saveDispOrd(){// ## 修改数据
          this.saveBtnDisabled = true // ##禁用保存按钮
          dispord.update(this.dispOrd)
            .then(response => {
              // ## 提示信息
              this.$message({
                type: 'success',
                message: '修改成功!'
              })
              // ## 回到list页面,重定向功能
              this.$router.push('/pms/dispord/list')
            })
        }
      }
    }
</script>

