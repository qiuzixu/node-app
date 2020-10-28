<template>
    <div class="dialog">
        <el-dialog
                :title="dialog.title"
                :visible.sync='dialog.show'
                :close-on-click-modal="false"
                :close-on-press-escape='false'
                modal-append-to-body="false"
                >
        <div class="form">
            <el-form  ref='form' 
                      :model='formData'
                     rule='form_rules'
                     label-width='120px'
                     style="margin:10px ;width:'auto'">
                     <el-form-item label='收支类型'>
                         <el-select v-model='formData.type' placeholder="收支类型">
                             <el-option v-for='(formtype,index) in format_type_list' :key='index'
                                                :label='formtype' :value='formtype'></el-option>
                         </el-select>
                         <el-form-item prop="describle" label='收支描述:'>
                             <el-input type='describle' v-model='formData.describle'></el-input>
                         </el-form-item>
                         <el-form-item prop="income" label='收入:'>
                             <el-input type='income' v-model='formData.income'></el-input>
                         </el-form-item>
                         <el-form-item prop="expand" label='支出:'>
                             <el-input type='expand' v-model='formData.expand'></el-input>
                         </el-form-item>
                         <el-form-item prop="cash" label='账户现金:'>
                             <el-input type='cash' v-model='formData.cash'></el-input>
                         </el-form-item>
                         <el-form-item prop="remark" label='备注:'>
                             <el-input type='textarea' v-model='formData.remark'></el-input>
                         </el-form-item>
                     </el-form-item>
                    <el-form-item class="text-right">
                        <el-button @click='dialog.show = false'>取消</el-button>
                        <el-button @click="onSumit('form')">提交</el-button>

                    </el-form-item>
                     </el-form>
        </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name:'dialog',
    data(){
        return {
            
            format_type_list:[
                '提现',
                '提现手续费',
                '充值',
                '优惠券',
                '充值礼物卷',
                '转账'
            ],
            form_rules:{
                describle:[
                    {
                        required:true,message:'收支描述不能为空',trigger:'blur'
                    },
                     {
                        required:true,message:'收入不能为空',trigger:'blur'
                    },
                     {
                        required:true,message:'支出不能为空',trigger:'blur'
                    },
                     {
                        required:true,message:'账户现金不能为空',trigger:'blur'
                    },
                    
                ]
            }
        }
    },
    props:{
        dialog:Object,
        formData:Object
    },
    methods:{
        onSubmit(form){
            this.$refs[form].validate(valid=>{
                if(valid){
                    const url = this.dialog.option == 'add' ? 'add' : `edit/${this.formData.id}`
                    // console.log(this.formData);
                    this.$axios.post(`/api/profiles/add/${url}`,this.formData)
                    .then(res =>{
                        //添加成功
                        this.$message({
                             message:'数据添加成功',
                             type:'success'
                        })
                       
                    });
                    //隐藏dialog
                    this.dialog.show = false;
                    this.$emit("update")
                }
            })
        }
    }
}
</script>

<style scoped>
.notfoud{
    width: 100px;
    height: 100px;
    overflow: hidden;
}
.notfoud img{
    width: 100%;
    height: 100%;
}
</style>