<template>
  <a-card :bordered="false" :class="{abcdefg: true}">
    <!--我的花名册信息-->
    <a-col :md="24" :sm="24">
      <a-descriptions title="用户信息" bordered>
        <template v-for="(item, index) in registerInfo">
          <a-descriptions-item :label="item.key" :span="2">{{
            item.value
          }}</a-descriptions-item>
        </template>
      </a-descriptions>
    </a-col>
  </a-card>
</template>

<script>
import * as manageAPI from '@/api/manage';
import * as storage from '@/utils/storage';
import * as tools from '@/utils/util';

const propsName = {
  username: '账户',
  name: '员工姓名',
  sex: '员工性别',
  employee_feature: '人员性质',
  company_name: '单位名称',
  center_name: '所属中心',
  depart_name: '部门名称',
  job_name: '岗位名称',
  job_level: '职级',
  join_time: '入职时间',
  contract_time: '劳动合同期限',
  work_year: '公司年龄',
  bank_no: '银行账号',
  bank_name: '开户行',
  probation_status: '试用期',
  confirm_date: '转正日期',
  work_status: '在职状态',
  off_time: '离职时间',
  pregnancy: '病产孕',
  pregnancy_time: '病产孕时间（区间）',
  id_card: '证件号',
  phone: '通讯号码',
  salary_bank_name: '工资卡开户行',
  salary_bank_no: '工资卡卡号',
  off_work_status: '离职办理状态',
  wages_team: '工资归属单位',
  wages_main_unit: '工资主体单位',
  compilation_status: '编制状态',
};

const salaryPropsName = {
  username: '账户',
  name: '姓名',
  salary_date: '计薪天数',
  create_by: '创建人',
  secret_salary: '保密费',
  provident_fund_remark: '公积金备注',
  total_paid_tax: '1月至上月已缴个人所得税累计',
  departure_deduction: '离职还扣',
  total_tax_threshold: '1月至当月个税起点累计',
  quar_mon_perform_salary: '季度绩效',
  after_tax_charge: '税后服务费',
  taxable_wages: '计税工资',
  wage_standard: '工资标准',
  attendance_deduction: '考勤扣款',
  overtime_allowance: '加班补贴',
  social_security_remarks: '社保备注',
  total_taxable_wages: '1月至当月计税工资累计',
  union_funds: '工会经费',
  special_deductions_remarks: '专项扣除备注',
  bank_no: '银行卡号',
  total_deductions: '扣款合计',
  social_security_provident_fund: '社保公积金合计',
  provident_fund: '住房公积金',
  children_education: '子女教育累计(专项扣除)',
  commun_subsidy: '通讯补贴',
  work_date: '应出勤天数',
  job_level: '岗位层级',
  id: '主键',
  transport_subsidy: '交通补',
};

export default {
  name: 'RegisterInfo',
  components: {},
  props: {},
  data() {
    return {
      previewVisible: false,
      previewImage: '',
      registerInfo: {},
      spinning: false,
    };
  },
  /**
   * @function 创建后初始化数据函数
   */
  async created() {
    //动态加载初始化数据
    this.loadData();
  },
  /**
   * @function 方法定义区域
   */
  methods: {
    /**
     * @function 加载数据函数
     */
    async loadData() {
      //获取用户信息
      var userInfo = storage.getStore('cur_user');

      //检索用户花名册信息
      await this.searchQuery();

      //打印用户数据
      console.log(userInfo);
    },

    /**
     * @function 查询函数
     */
    async searchQuery() {
      //获取用户信息
      var username = tools.queryUrlString('username');

      //查询用户真实姓名
      var userinfo = await manageAPI.queryUserInfoByView(username);

      //真实姓名
      var realname = '';

      try {
        //获取用户姓名
        userinfo = userinfo[0];
        //真实姓名
        realname = userinfo.realname;
      } catch (error) {
        console.error(error);
      }

      try {
        //获取我的花名册数据
        var item = await manageAPI.queryRegisterByUserName(realname, username);

        //删除属性
        delete item.id;

        //部门信息
        var departName = await manageAPI.queryDepartName(item.depart_name);

        //设置部门
        item.depart_name = departName['name'];

        //遍历对象，设置属性
        for (let key in item) {
          item[key] = {
            key: propsName[key] || salaryPropsName[key],
            value: item[key],
          };
        }

        //重新设置花名册对象
        this.registerInfo = item;
      } catch (error) {
        console.error(error);
      }

      //缓存本次查询条件，下次打开此页面，可以还原查询条件
      storage.setStore(
        `system_register_info_user@${username.username}`,
        JSON.stringify(this.registerInfo),
        3600
      );

      //返回花名册信息
      return this.registerInfo;
    },
  },
};
</script>
<style scoped>
.abcdefg .ant-card-body {
  margin-left: 0%;
  margin-right: 0%;
  margin-bottom: 1%;
  border: 0px solid black;
  min-width: 800px;
}
.explain {
  text-align: left;
  margin-left: 50px;
}
.explain .ant-input,
.sign .ant-input {
  font-weight: bolder;
  text-align: center;
  border-left-width: 0px !important;
  border-top-width: 0px !important;
  border-right-width: 0px !important;
}
.explain div {
  margin-bottom: 10px;
}

.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
.ant-tag {
  margin-bottom: 5px;
}
.ant-tag-geekblue {
  margin-bottom: 5px;
}
</style>
