<template>
  <div class="page-header-index-wide">
    <a-row :gutter="24">
      <a-col :sm="24" :md="12" :xl="6" :style="{marginBottom: '24px'}">
        <chart-card :loading="loading" title="总流程数" :total="vwflowTotal">
          <a-tooltip title="指标说明" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <div>
            <trend :flag="vwflowMonthlyRatio > 0 ? 'up' : 'down'" style="margin-right: 16px;">
              <span slot="term">月同比</span>
              {{ vwflowMonthlyRatio }}%
            </trend>
            <trend :flag="vwflowDailyRatio > 0 ? 'up' : 'down'">
              <span slot="term">日同比</span>
              {{ vwflowDailyRatio }}%
            </trend>
          </div>
          <template slot="footer">
            <trend style="margin-right: 16px;">
              <span slot="term">月流程数</span>
              {{ vwflowMonthTotal }}
            </trend>
            <trend style="margin-left: 16px;">
              <span slot="term">日流程数</span>
              {{ vwflowDayTotal }}
            </trend>
          </template>
        </chart-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="6" :style="{marginBottom: '24px'}">
        <chart-card :loading="loading" title="总用户数" :total="vuserTotal | NumberFormat">
          <a-tooltip title="指标说明" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <div>
            <trend
              :flag="(vNewUserTotal - vNewUserTotalLast) > 0 ? 'up' : 'down'"
              style="margin-right: 16px;"
            >
              <span slot="term">月同比</span>
              {{ (((vNewUserTotal - vNewUserTotalLast) / vNewUserTotalLast) * 100 ).toFixed(2) }}%
            </trend>
          </div>
          <template slot="footer">
            <trend style="margin-right: 16px;">
              <span slot="term">月新增用户数</span>
              {{ vNewUserTotal }}
            </trend>
            <trend style="margin-left: 16px;">
              <span slot="term">日均新增用户</span>
              {{ vNewUserTotalD }}
            </trend>
          </template>
        </chart-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="6" :style="{marginBottom: '24px'}">
        <chart-card :loading="loading" title="总访问量" :total="vtotal | NumberFormat">
          <a-tooltip title="指标说明" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <div>
            <trend :flag="mtotalRatio > 0 ? 'up' : 'down'" style="margin-right: 16px;">
              <span slot="term">月同比</span>
              {{ mtotalRatio }}%
            </trend>
          </div>
          <template slot="footer">
            <trend style="margin-right: 16px;">
              <span slot="term">月访问量</span>
              {{ mtotal }}
            </trend>
            <trend style="margin-left: 16px;">
              <span slot="term">日访问量</span>
              {{ ctotal }}
            </trend>
          </template>
        </chart-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="6" :style="{marginBottom: '24px'}">
        <chart-card :loading="loading" title="总业务数" :total="vBussinessTotal | NumberFormat">
          <a-tooltip title="指标说明" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <div>
            <trend :flag="'up'" style="margin-right: 16px;">
              <span slot="term">行政业务</span>
              {{ 35 }}%
            </trend>
            <trend :flag="'up'">
              <span slot="term">财务业务</span>
              {{ 15 }}%
            </trend>
          </div>
          <template slot="footer">
            业务分布
            <span style="margin-left:5px;">行政、财务、任务、博客、文档</span>
          </template>
        </chart-card>
      </a-col>
    </a-row>
    <a-card :loading="loading" :bordered="false" :body-style="{padding: '0'}">
      <div class="salesCard">
        <a-tabs
          size="large"
          defaultActiveKey="1"
          v-model="activeKey"
          @change="getData"
          :tab-bar-style="{marginBottom: '24px', paddingLeft: '16px'}"
        >
          <div class="extra-wrapper" slot="tabBarExtraContent">
            <div class="extra-item">
              <a-tag color="cyan" @click="reloadData()">&nbsp;刷&nbsp;新&nbsp;</a-tag>
            </div>
          </div>
          <a-tab-pane loading="true" tab="我的待办" key="1" style>
            <template>
              <div style="top:50px;">
                <a-spin :spinning="spinning" style="top:50px;">
                  <div class="spin-content"></div>
                </a-spin>
              </div>
              <a-table
                :columns="columns"
                :dataSource="dataWaitList"
                :pagination="false"
                style="padding-top:-10px;margin-top:-10px"
              >
                <a slot="type" slot-scope="text, record">
                  <a-menu-item>
                    <a :data-info="JSON.stringify(record)" @click="handleDetailWF(record)">
                      <span v-html="record.type"></span>
                    </a>
                  </a-menu-item>
                </a>
                <a slot="topic" slot-scope="text, record">
                  <a-menu-item>
                    <a
                      :data-info="JSON.stringify(record)"
                      @click="handleDetailWF(record)"
                      style="color:#303030;"
                    >
                      <span style="color:#303030;" v-html="record.topic"></span>
                    </a>
                  </a-menu-item>
                </a>

                <span slot="name" slot-scope="text, record">
                  <a-tag
                    :color="record.name.length > 5 ? 'geekblue' : 'green'"
                    :key="record.name"
                    @click="handleDetailWF(record)"
                  >{{ record.name.toUpperCase() }}</a-tag>
                </span>

                <span slot="username" slot-scope="username">
                  <a-tag
                    v-for="tag in username"
                    :color="
                      tag === 'admin'
                        ? 'volcano'
                        : tag.length > 5
                        ? 'geekblue'
                        : 'green'
                    "
                    :key="tag"
                  >{{ tag }}</a-tag>
                </span>

                <span slot="proponents" slot-scope="text, record">
                  <a-tag color="volcano" :key="record.proponents">
                    {{
                    record.proponents
                    }}
                  </a-tag>
                </span>

                <span slot="create_time" slot-scope="text, record">
                  <a-tag color="red" :key="record.create_time">{{ record.create_time }}</a-tag>
                </span>
              </a-table>
            </template>
          </a-tab-pane>
          <a-tab-pane loading="true" tab="我的已办" key="2">
            <template>
              <div style="top:50px;">
                <a-spin :spinning="spinning" style="top:50px;">
                  <div class="spin-content"></div>
                </a-spin>
              </div>
              <a-table
                :columns="columns"
                :dataSource="dataDoneList"
                :pagination="false"
                style="padding-top:-10px;margin-top:-10px"
              >
                <a slot="type" slot-scope="text, record">
                  <a-menu-item>
                    <a :data-info="JSON.stringify(record)" @click="handleDetailWF(record)">
                      <span v-html="record.type"></span>
                    </a>
                  </a-menu-item>
                </a>

                <a slot="topic" slot-scope="text, record">
                  <a-menu-item>
                    <a
                      :data-info="JSON.stringify(record)"
                      @click="handleDetailWF(record)"
                      style="color:#303030;"
                    >
                      <span style="color:#303030;" v-html="record.topic"></span>
                    </a>
                  </a-menu-item>
                </a>

                <span slot="name" slot-scope="text, record">
                  <a-tag
                    :color="record.name.length > 5 ? 'geekblue' : 'green'"
                    :key="record.name"
                    @click="handleDetailWF(record)"
                  >{{ record.name }}</a-tag>
                </span>

                <span slot="username" slot-scope="text, record">
                  <a-tag
                    v-for="tag in record.username"
                    :color="
                      tag === 'admin'
                        ? 'volcano'
                        : tag.length > 5
                        ? 'geekblue'
                        : 'green'
                    "
                    :key="tag"
                  >{{ tag }}</a-tag>
                </span>

                <span slot="proponents" slot-scope="text, record">
                  <a-tag color="volcano" :key="record.proponents">
                    {{
                    record.proponents
                    }}
                  </a-tag>
                </span>

                <span slot="create_time" slot-scope="text, record">
                  <a-tag color="blue" :key="record.create_time">{{ record.create_time }}</a-tag>
                </span>
              </a-table>
            </template>
          </a-tab-pane>
          <a-tab-pane loading="true" tab="行政公告" key="5">
            <template>
              <div style="top:50px;">
                <a-spin :spinning="spinning" style="top:50px;">
                  <div class="spin-content"></div>
                </a-spin>
              </div>
              <a-table
                :columns="announce_columns"
                :dataSource="dataAnnounceList"
                :pagination="false"
                style="padding-top:-10px;margin-top:-10px"
              >
                <span slot="announce_type" slot-scope="text, record">
                  <a-tag
                    color="cyan"
                    :key="record.announce_type"
                    @click="handleAnnounceInfo(record, record.table_name)"
                  >{{ record.announce_type }}</a-tag>
                </span>
                <span slot="ctitle" slot-scope="text, record">
                  <a
                    :key="record.title"
                    @click="handleAnnounceInfo(record, record.table_name)"
                    style="color:#303030;"
                  >{{ record.title }}</a>
                </span>
                <span slot="create_by" slot-scope="text, record">
                  <a-tag color="geekblue" :key="record.create_by">
                    {{
                    record.create_by
                    }}
                  </a-tag>
                </span>
                <span slot="create_time" slot-scope="text, record">
                  <a-tag color="pink" :key="record.create_time">
                    {{
                    record.create_time
                    }}
                  </a-tag>
                </span>
              </a-table>
            </template>
          </a-tab-pane>
          <a-tab-pane loading="true" tab="红头文件" key="6">
            <template>
              <div style="top:50px;">
                <a-spin :spinning="spinning" style="top:50px;">
                  <div class="spin-content"></div>
                </a-spin>
              </div>
              <a-table
                :columns="announce_columns"
                :dataSource="dataHeadList"
                :pagination="false"
                style="padding-top:-10px;margin-top:-10px"
              >
                <span slot="announce_type" slot-scope="text, record">
                  <a-tag
                    color="cyan"
                    :key="record.announce_type"
                    @click="handleAnnounceInfo(record, record.table_name)"
                  >{{ record.announce_type }}</a-tag>
                </span>
                <span slot="ctitle" slot-scope="text, record">
                  <a
                    :key="record.title"
                    @click="handleAnnounceInfo(record, record.table_name)"
                    style="color:#303030;"
                  >{{ record.title }}</a>
                </span>
                <span slot="create_by" slot-scope="text, record">
                  <a-tag color="geekblue" :key="record.create_by">
                    {{
                    record.create_by
                    }}
                  </a-tag>
                </span>
                <span slot="create_time" slot-scope="text, record">
                  <a-tag color="pink" :key="record.create_time">
                    {{
                    record.create_time
                    }}
                  </a-tag>
                </span>
              </a-table>
            </template>
          </a-tab-pane>
          <a-tab-pane loading="true" tab="新闻资讯" key="7">
            <template>
              <div style="top:50px;">
                <a-spin :spinning="spinning" style="top:50px;">
                  <div class="spin-content"></div>
                </a-spin>
              </div>
              <a-table
                :columns="announce_columns"
                :dataSource="dataNewsList"
                :pagination="false"
                style="padding-top:-10px;margin-top:-10px"
              >
                <span slot="announce_type" slot-scope="text, record">
                  <a-tag
                    color="cyan"
                    :key="record.announce_type"
                    @click="handleAnnounceInfo(record, record.table_name)"
                  >{{ record.announce_type }}</a-tag>
                </span>
                <span slot="ctitle" slot-scope="text, record">
                  <a
                    :key="record.title"
                    @click="handleAnnounceInfo(record, record.table_name)"
                    style="color:#303030;"
                  >{{ record.title }}</a>
                </span>
                <span slot="create_by" slot-scope="text, record">
                  <a-tag color="geekblue" :key="record.create_by">
                    {{
                    record.create_by
                    }}
                  </a-tag>
                </span>
                <span slot="create_time" slot-scope="text, record">
                  <a-tag color="pink" :key="record.create_time">
                    {{
                    record.create_time
                    }}
                  </a-tag>
                </span>
              </a-table>
            </template>
          </a-tab-pane>
          <a-tab-pane loading="true" tab="奖罚通报" key="8">
            <template>
              <div style="top:50px;">
                <a-spin :spinning="spinning" style="top:50px;">
                  <div class="spin-content"></div>
                </a-spin>
              </div>
              <a-table
                :columns="announce_columns"
                :dataSource="dataNoticeList"
                :pagination="false"
                style="padding-top:-10px;margin-top:-10px"
              >
                <span slot="announce_type" slot-scope="text, record">
                  <a-tag
                    color="cyan"
                    :key="record.announce_type"
                    @click="handleAnnounceInfo(record, record.table_name)"
                  >{{ record.announce_type }}</a-tag>
                </span>
                <span slot="ctitle" slot-scope="text, record">
                  <a
                    :key="record.title"
                    @click="handleAnnounceInfo(record, record.table_name)"
                    style="color:#303030;"
                  >{{ record.title }}</a>
                </span>
                <span slot="create_by" slot-scope="text, record">
                  <a-tag color="geekblue" :key="record.create_by">
                    {{
                    record.create_by
                    }}
                  </a-tag>
                </span>
                <span slot="create_time" slot-scope="text, record">
                  <a-tag color="pink" :key="record.create_time">
                    {{
                    record.create_time
                    }}
                  </a-tag>
                </span>
              </a-table>
            </template>
          </a-tab-pane>
          <a-tab-pane loading="true" tab="市场观察" key="9">
            <template>
              <div style="top:50px;">
                <a-spin :spinning="spinning" style="top:50px;">
                  <div class="spin-content"></div>
                </a-spin>
              </div>
              <a-table
                :columns="announce_columns"
                :dataSource="dataViewsList"
                :pagination="false"
                style="padding-top:-10px;margin-top:-10px"
              >
                <span slot="announce_type" slot-scope="text, record">
                  <a-tag
                    color="cyan"
                    :key="record.announce_type"
                    @click="handleAnnounceInfo(record, record.table_name)"
                  >{{ record.announce_type }}</a-tag>
                </span>
                <span slot="ctitle" slot-scope="text, record">
                  <a
                    :key="record.title"
                    @click="handleAnnounceInfo(record, record.table_name)"
                    style="color:#303030;"
                  >{{ record.title }}</a>
                </span>
                <span slot="create_by" slot-scope="text, record">
                  <a-tag color="geekblue" :key="record.create_by">
                    {{
                    record.create_by
                    }}
                  </a-tag>
                </span>
                <span slot="create_time" slot-scope="text, record">
                  <a-tag color="blue" :key="record.create_time">
                    {{
                    record.create_time
                    }}
                  </a-tag>
                </span>
              </a-table>
            </template>
          </a-tab-pane>
        </a-tabs>
      </div>
    </a-card>

    <a-row>
      <template>
        <div>
          <!-- 向上箭头 -->
          <a-back-top />
        </div>
      </template>
    </a-row>
  </div>
</template>

<script>
import ChartCard from "@/components/ChartCard";
import ACol from "ant-design-vue/es/grid/Col";
import ATooltip from "ant-design-vue/es/tooltip/Tooltip";
import MiniArea from "@/components/chart/MiniArea";
import MiniBar from "@/components/chart/MiniBar";
import MiniProgress from "@/components/chart/MiniProgress";
import RankList from "@/components/chart/RankList";
import Bar from "@/components/chart/Bar";
import LineChartMultid from "@/components/chart/LineChartMultid";
import HeadInfo from "@/components/tools/HeadInfo.vue";
import Trend from "@/components/Trend";
import { getLoginfo, getVisitInfo } from "@/api/api";
import * as manageAPI from "@/api/manage";
import * as storage from "@/utils/storage";
import * as tools from "@/utils/util";

const rankList = [];
const barData = [];
const columns = [
  {
    title: "办理事项",
    dataIndex: "type",
    key: "type",
    slots: { title: "type" },
    width: 100,
    align: "center",
    scopedSlots: { customRender: "type" }
  },
  {
    title: "业务",
    width: 100,
    align: "center",
    key: "name",
    dataIndex: "name",
    scopedSlots: { customRender: "name" }
  },
  {
    title: "主题",
    width: 400,
    align: "left",
    key: "topic",
    dataIndex: "topic",
    scopedSlots: { customRender: "topic" }
  },
  {
    title: "操作人员",
    key: "username",
    width: 150,
    align: "left",
    dataIndex: "username",
    scopedSlots: { customRender: "username" }
  },
  {
    title: "流程发起人",
    key: "proponents",
    width: 150,
    align: "left",
    dataIndex: "proponents",
    scopedSlots: { customRender: "proponents" }
  },
  {
    title: "创建时间",
    width: 100,
    align: "center",
    key: "create_time",
    dataIndex: "create_time",
    scopedSlots: { customRender: "create_time" }
  }
];

const announce_columns = [
  {
    title: "类型",
    dataIndex: "announce_type",
    key: "announce_type",
    slots: { title: "announce_type" },
    width: 100,
    align: "center",
    scopedSlots: { customRender: "announce_type" }
  },
  {
    title: "标题",
    dataIndex: "title",
    key: "title",
    slots: { title: "ctitle" },
    width: 800,
    align: "left",
    scopedSlots: { customRender: "ctitle" }
  },
  {
    title: "时间",
    width: 100,
    align: "center",
    key: "create_time",
    dataIndex: "create_time",
    scopedSlots: { customRender: "create_time" }
  }
];

export default {
  name: "Analysis",
  components: {
    ATooltip,
    ACol,
    ChartCard,
    MiniArea,
    MiniBar,
    MiniProgress,
    RankList,
    Bar,
    Trend,
    LineChartMultid,
    HeadInfo
  },
  data() {
    return {
      loading: true,
      vtotal: 0,
      ctotal: 0,
      mtotal: 0,
      mtotalLast: 0,
      mtotalRatio: 0.0,
      center: null,
      rankList,
      barData,
      loginfo: {},
      visitFields: ["ip", "visit"],
      visitInfo: [],
      vuserTotal: "-",
      vNewUserTotal: "-",
      vNewUserTotalD: "-",
      vNewUserTotalLast: "",
      vwflowTotal: "-",
      vwflowMonthTotal: "-",
      vwflowDayTotal: "-",
      vwflowDailyRatio: "-",
      vwflowMonthlyRatio: "-",
      vBussinessTotal: "-",
      indicator: <a-icon type="loading" style="font-size: 24px" spin />,
      dataWaitList: [],
      dataDoneList: [],
      dataAnnounceList: [],
      dataNoticeList: [],
      dataHeadList: [],
      dataNewsList: [],
      dataViewsList: [],
      dataNotice: [],
      columns,
      announce_columns,
      activeKey: "1",
      loadingMore: false,
      showLoadingMore: true,
      spinning: false
    };
  },
  async created() {
    setTimeout(() => {
      this.loading = !this.loading;
    }, 1000);
    this.initLogInfo();
    await this.getData(1);

    //设置每十分钟请求用户信息
    setInterval(() => {
      manageAPI.queryToken();
    }, 10 * 60 * 1000);
  },
  async mounted() {
    await this.getData();
  },
  methods: {
    async getData(key) {
      //查询我的已办，我的待办，行政公告，红头文件，新闻资讯，奖罚通报，市场观察等内容
      //获取用户信息
      var userInfo = storage.getStore("cur_user");
      let username = userInfo["username"];
      let realname = userInfo["realname"];

      if (this.activeKey == 1 || key == 1) {
        //获取我的待办数据
        this.dataWaitList = await manageAPI.queryProcessLogWait(
          username,
          realname
        );
        this.dataWaitList = this.dataWaitList.slice(0, 10);
      } else if (this.activeKey == 2 || key == 2) {
        //获取我的已办数据
        this.dataDoneList = await manageAPI.queryProcessLogDone(
          username,
          realname
        );
        this.dataDoneList = this.dataDoneList.slice(0, 10);
      } else if (this.activeKey == 3 || key == 3) {
        //获取我的消息数据
      } else if (this.activeKey == 4 || key == 4) {
        //获取我的收藏数据
      } else if (this.activeKey == 5 || key == 5) {
        //获取行政公告数据
        this.dataAnnounceList = await manageAPI.queryAnnounceList(0, 10);
        this.dataAnnounceList = this.dataAnnounceList.slice(0, 10);
      } else if (this.activeKey == 6 || key == 6) {
        //获取红头文件数据
        this.dataHeadList = await manageAPI.queryHeadList(0, 10);
        this.dataHeadList = this.dataHeadList.slice(0, 10);
      } else if (this.activeKey == 7 || key == 7) {
        //获取新闻资讯数据
        this.dataNewsList = await manageAPI.queryNewsList(0, 10);
        this.dataNewsList = this.dataNewsList.slice(0, 10);
      } else if (this.activeKey == 8 || key == 8) {
        //获取奖罚通报数据
        this.dataNoticeList = await manageAPI.queryNoticeList(0, 10);
        this.dataNoticeList = this.dataNoticeList.slice(0, 10);
      } else if (this.activeKey == 9 || key == 9) {
        //获取市场观察数据
        this.dataViewsList = await manageAPI.queryViewsList(0, 10);
        this.dataViewsList = this.dataViewsList.slice(0, 10);
      }

      //用户姓名从英文转为中文
      this.transUsername(this.dataWaitList);
      this.transUsername(this.dataDoneList);

      //获取日访问量/总访问量
      try {
        var total = await manageAPI.queryTableDataAll("v_visit_total");
        total = total[0];
        this.ctotal = total["ctotal"];
        this.vtotal = total["vtotal"];
      } catch (error) {
        console.log("error :" + error);
      }

      try {
        var cmonth = moment().format("YYYY-MM");
        var cmonthLast = moment()
          .month(moment().month() - 1)
          .format("YYYY-MM");

        //获取日期格式
        var vMonthTotal = await manageAPI.queryTableDataAll("v_visit_month");

        //遍历数据
        for (let item of vMonthTotal) {
          if (item["month"] == cmonth) {
            this.mtotal = item.total;
          }
          if (item["month"] == cmonthLast) {
            this.mtotalLast = item.total;
          }
        }

        //计算月同比
        this.mtotalRatio = (
          ((this.mtotal - this.mtotalLast) / this.mtotalLast) *
          100
        ).toFixed(2);
      } catch (error) {
        console.log("error :" + error);
      }
    },

    async transUsername(list) {
      //遍历数据，将英文名转为中文名
      for (let item of list) {
        try {
          item["username"] = await manageAPI.patchEnameCname(
            item["username"].toString()
          );
          item["proponents"] = await manageAPI.patchEnameCname(
            item["proponents"]
          );

          item["username"] = tools.deNull(item["username"]).split(",");
        } catch (error) {
          console.log(error);
        }
      }
    },
    /**
     * @function 刷新页面
     */
    async reloadData() {
      this.spinning = true;
      var userInfo = storage.getStore("cur_user");
      let username = userInfo["username"];
      let realname = userInfo["realname"];
      if (this.activeKey == 1) {
        //获取我的待办数据
        this.dataWaitList = await manageAPI.queryProcessLogWait(
          username,
          realname
        );
        this.dataWaitList = this.dataWaitList.slice(0, 10);
      } else if (this.activeKey == 2) {
        //获取我的已办数据
        this.dataDoneList = await manageAPI.queryProcessLogDone(
          username,
          realname
        );
        this.dataDoneList = this.dataDoneList.slice(0, 10);
      } else if (this.activeKey == 3) {
        console.log(this.activeKey);
      } else if (this.activeKey == 4) {
        console.log(this.activeKey);
      } else if (this.activeKey == 5) {
        //获取行政公告数据
        this.dataAnnounceList = await manageAPI.queryAnnounceList(0, 10);
        this.dataAnnounceList = this.dataAnnounceList.slice(0, 10);
      } else if (this.activeKey == 6) {
        //获取红头文件数据
        this.dataHeadList = await manageAPI.queryHeadList(0, 10);
        this.dataHeadList = this.dataHeadList.slice(0, 10);
      } else if (this.activeKey == 7) {
        //获取新闻资讯数据
        this.dataNewsList = await manageAPI.queryNewsList(0, 10);
        this.dataNewsList = this.dataNewsList.slice(0, 10);
      } else if (this.activeKey == 8) {
        //获取奖罚通报数据
        this.dataNoticeList = await manageAPI.queryNoticeList(0, 10);
        this.dataNoticeList = this.dataNoticeList.slice(0, 10);
      } else if (this.activeKey == 9) {
        //获取市场观察数据
        this.dataViewsList = await manageAPI.queryViewsList(0, 10);
        this.dataViewsList = this.dataViewsList.slice(0, 10);
      }
      //用户姓名从英文转为中文
      this.transUsername(this.dataWaitList);
      this.transUsername(this.dataDoneList);
      this.spinning = false;
    },
    /**
     * @function 刷新近期访问统计
     */
    async reloadVisitData() {
      this.initLogInfo();
    },
    /**
     * @function 查看详情页面
     */
    async handleDetailWF(record) {
      //获取当前操作对象
      var curRow = JSON.parse(JSON.stringify(record));

      //获取当前用户
      var userInfo = storage.getStore("cur_user");

      //获取选中记录的所属表单名称
      var tableName = curRow["tname"];

      //获取操作类型
      var type = curRow["type"] == "知会" ? "notify" : "workflow";

      //设置跳转URL
      var detailURL = `/workflow/view?table_name=${tableName}&id=${curRow.id}&processLogID=${curRow.pid}&user=${userInfo.username}&type=${type}`;

      //跳转到相应页面
      this.$router.push(detailURL);
    },
    /**
     * @function 查看详情页面
     */
    async handleAnnounceInfo(record, tableName) {
      //获取当前操作对象
      var curRow = JSON.parse(JSON.stringify(record));

      //获取当前用户
      var userInfo = storage.getStore("cur_user");

      //设置跳转URL
      var detailURL = `/workflow/view?table_name=${tableName}&id=${curRow.id}&user=${userInfo.username}&type=notify`;

      //跳转到相应页面
      this.$router.push(detailURL);
    },
    /**
     * @function 获取近期用户访问统计，
     */
    async initLogInfo() {
      //查询登录统计数据
      getLoginfo(null).then(res => {
        if (res.success) {
          Object.keys(res.result).forEach(key => {
            res.result[key] = res.result[key] + "";
          });
          this.loginfo = res.result;
        }
      });

      //查询访问统计数据
      getVisitInfo().then(res => {
        if (res.success) {
          this.visitInfo = res.result;
        }
      });

      //查询用户信息
      this.vuserTotal = await manageAPI.queryUserCount();

      //查询流程统计
      this.vwflowTotal = await manageAPI.queryWflowCount();

      //查询月度流程统计
      this.vwflowMonthTotal = await manageAPI.queryWflowMonthCount();

      //查询日常流程统计
      this.vwflowDayTotal = await manageAPI.queryWflowDayCount();

      //查询日同比率
      this.vwflowDailyRatio = await manageAPI.queryWflowDailyRatio();

      //查询月同比率
      this.vwflowMonthlyRatio = await manageAPI.queryWflowMonthlyRatio();

      //查询月度新增用户数
      this.vNewUserTotal = await manageAPI.queryNewUserTotal();

      //返回上月月度新增用户数
      this.vNewUserTotalLast = await manageAPI.queryNewUserTotalLastMonth();

      //查询日新增用户数
      this.vNewUserTotalD =
        typeof this.vNewUserTotal == "number"
          ? Number.parseFloat(this.vNewUserTotal / 30).toFixed(2)
          : "-";

      //查询业务数据
      this.vBussinessTotal = await manageAPI.queryBusinessTotal();

      console.log(this.vuserTotal);
    }
  }
};
</script>

<style lang="scss" scoped>
thead.ant-table-thead {
  display: none;
}
.circle-cust {
  position: relative;
  top: 28px;
  left: -100%;
}
.extra-wrapper {
  line-height: 55px;
  padding-right: 24px;

  .extra-item {
    display: inline-block;
    margin-right: 24px;

    a {
      margin-left: 24px;
    }
  }
}

/* 首页访问量统计 */
.head-info {
  position: relative;
  text-align: left;
  padding: 0 32px 0 0;
  min-width: 125px;

  &.center {
    text-align: center;
    padding: 0 32px;
  }

  span {
    color: rgba(0, 0, 0, 0.45);
    display: inline-block;
    font-size: 0.95rem;
    line-height: 42px;
    margin-bottom: 4px;
  }
  p {
    line-height: 42px;
    margin: 0;
    a {
      font-weight: 600;
      font-size: 1rem;
    }
  }
}
</style>
