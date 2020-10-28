<template>
    <div class="fillContaier">
      <div>
        <el-form :inline="true" ref="add_data" :model='search_data'>
          <!-- 筛选 -->
          <el-form-item label='按照时间筛选:'>
              <el-date-picker
                        v-model="startTime"
                        type='datetime'
                        placeholder='请选择开始时间'>

          </el-date-picker>
          --
          <el-date-picker
                        v-model="endTime"
                        type='datetime'
                        placeholder='请选择结束时间'>

          </el-date-picker>
          </el-form-item>

            <el-form-item >
              <el-button type='primary' size='small' icon='search' @click='handleSearch()'>筛选</el-button>
          </el-form-item>

          <el-form-item class="btnRight">
              <el-button 
                        type='primary' 
                        size='small' 
                        icon='view' 
                        v-if='user.identity == "manager"'
                        @click='handleAdd()'>添加</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="table_container">

    
    <el-table
    v-if='tableData.length > 0'
    :data="tableData"
    max-height='450'
    border
    style="width: 100%">
    <el-table-cloumn
                  type='index'
                  label='序号'
                  algin='center'
                  width='70'>

    </el-table-cloumn>
    <el-table-column
      prop='date'
      label="创建时间"
      align='center'
      width="250">
      <template slot-scope='scope'>
        <i class="el-icon-item"></i>
        <span style="margin-left: 10px">{{ scope.row.date}}</span>
      </template>
    </el-table-column>
    <el-table-column 
                    align='center'
                    prop="type"
                    label="收支类型"
                    width='150'>

    </el-table-column>
    <el-table-column
                    align='center'
                    prop="decrible"
                    label="收支描述"
                    width='180'>

    </el-table-column>
    <el-table-column
                    prop="income"
                    label="收入"
                    width='170'>
      <template slot-scope="scope">
        <span style="color:#00d053">{{ scope.row.income }}</span>
      </template>
    </el-table-column>
    <el-table-column
                    align='center'
                    prop="expand"
                    label="支出"
                    width='170'>
      <template slot-scope="scope">
        <span style="color:#f5676">{{ scope.row.expand }}</span>
      </template>
    </el-table-column>
    <el-table-column
                    prop="cash"
                    align='center'
                    label="账户现金"
                    width='180'>
      <template slot-scope="scope">
        <span style="color:#4db3ff">{{ scope.row.cash }}</span>
      </template>
    </el-table-column>
    <el-table-column
                    align='center'
                    prop="remark"
                    label="备注"
                    width='220'>

    </el-table-column>
    <el-table-column 
                    prop="operation"
                    algin="center"
                    label="操作"
                    fixed='right'
                    width='320'
                    v-if='user.identity == "manager"'
                    >
      <template slot-scope="scope">
        <el-button
          type='warning'  
          size="small"
          icon="edit"
          @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
        <el-button
          size="small"
          type="danger"
          icon='delete'
          @click="handleDelete(scope.$index, scope.row)">删除</el-button>
      </template>
    </el-table-column>

    </el-table>
    <!-- 分页 -->
    <el-row>
      <el-col :span='24'>
        <div class="pagination">
                   <el-pagination
                      @size-change="handleSizeChange"
                      @current-change="handleCurrentChange"
                      :current-page.sync="paginations.page_index"
                      :page-sizes="paginations.page_sizes"
                      :page-size="paginations.page.size"
                      layout="paginations.layout"
                      :total="400">
                  </el-pagination>

        </div>
      </el-col>
    </el-row>
    </div>
    <Dialog :dialog='dialog' :formData='formData' @update='getProfile'></Dialog>
  </div>
</template>
<script>
import Dialog from '../components/Dialog'
export default {
    name:"fundList",
    data(){
        return{
            search_data:{
                startTime:"",
                endTime:''
            },
            filterTableData:[

            ],
            paginations:{
              page_index:1,
              total:0,//总数
              page_size:5,
              page_sizes:[5,10,15,20],//每页显示多少条
              layout:'total,sizes,prev,pager,next,jumper',//翻页属性
            },
            tableData:[],
            alltableData:[],
            formData:{
                type:'',
                describle:'',
                income:'',
                expand:'',
                cash:'',
                remark:'',
                id:''
            },
            dialog:{
              show:false,
              title:'',
              option:'edit'
            }  
        };
    },
        computed:{
          user(){
            return this.$store.getters.user;
          }
        },
        created(){
            this.getProfile();
        },
        methods:{
            getProfile(){
                //获取表格数据
                this.$axios
                .get('/api/profile')
                .then(res=>{
                    // console.log(res);
                    this.alltableData = res.data;
                    this.filterTableData = res.data;
                    //设置分页数据
                    this.setPaginations();
                })
                .catch(err =>console.log(err))
            },
            setPaginations(){
              //分页属性设置
              this.paginations.total = this.alltableData.length;
              this.paginations.page_index = 1;
              this.paginations.page_size = 5;
              //设置默认的分页数据
              this.tableData = this.alltableData.filter((item,index)=>{
                return index < this.paginations.page_index;
              })
            },
            handleEdit(index,row){
                // console.log(123);
                //编辑
                // console.log(this.dialog);
                this.dialog = {
                  shwo:true,
                  title:'修改资金信息',
                  option:'edit'
                }
                this.formData = {
                  type:row.type,
                  describle:row.describle,
                  income:row.income,
                  expand:row.expand,
                  cash:row.cash,
                  remark:row.remark,
                  id:row._id
                }
            },
            handleDelete(index,row){
                // console.log(456);
                this.$axios.delete(`/api/profiles/delete/${row._id}`)
                .then(res =>{
                    this.$message('删除成功！')
                    this.getProfile();
                })
            },
            handleAdd(){
              // console.log(444);
              this.dialog={
                // show = true,
                title:'添加资金信息',
                option:'add'
                }
                this.formData = {
                  type:"",
                  describle:"",
                  income:"",
                  expand:"",
                  cash:"",
                  remark:"",
                  id:""
                }
                this.dialog.show = true
              },
             handleSizeChange(page_size){
                //切换size
                this.paginations.page_index =1;
                this.paginations.page_size = page_size;
                this.tableData = this.alltableData.filter((item,index) =>{
                  return index < page_size;
                })
              },
             handleCurrentChange(page){
                  //获取当前页
                  let index = this.paginations.page_size * (page -1);
                  //数据的总和
                  let nums = this.paginations.page * page;
                  //容器
                  let tables =[];

                  for(let i= index; i<nums;i++){
                    if(this.alltableData[i]){
                      tables.push(this.alltableData[i])
                    }
                    this.tableData = tables;
                  }
            },
            handleSearch(){
              //筛选
              if(!this.search_data.startTime || !this.search_data.endTime){
                  this.$message({
                    type:'warning',
                    message:'请选择时间'
                  });
                  this.getProfile();
                  return;
              }
              const startTime = thsi.search_data.startTime.getTime();
              const endTime = thsi.search_data.endTime.getTime();
              this.alltableData = this.filterTableData.filter(item =>{
                // console.log(item);
                let data = new Data(item.date);
                let time = date.getTime();
                return time>= sTime && time <= eTime;

              })
              //分页数据
              this.setPaginations();
            }
              },
    components:{
       Dialog 
            }
    }

</script>

<style scoped>
  .fillContaier{
    width: 100%;
    height: 100%;
    padding:16px;
    box-sizing: border-box;
  }
  .btnRight{
    float: right;
  }
  .pagination{
    text-align: right;
    margin-top: 10px;
  }
</style>