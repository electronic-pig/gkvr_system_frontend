<template>
    <div class="detail-wrap">
        <div id="tag-card" class="common-card">
            <div class="logo-wrap">
                <el-image class="logo" :src="'https://static-data.gaokao.cn/upload/logo/' + detail.id + '.jpg'" />
            </div>
            <div class="right-content">
                <div class="name-pos">
                    {{ detail.name }}
                </div>
                <div class="tag-line">
                    <div class="tag">{{ detail.nature }}</div>
                    <div class="tag">{{ detail.level }}</div>
                    <div v-if="detail.f985 == 1" class="tag">985工程</div>
                    <div v-if="detail.f211 == 1" class="tag">211工程</div>
                    <div v-if="detail.dual_class == '双一流'" class="tag">双一流</div>
                </div>
            </div>
        </div>
        <div id="pic-intro">
            <div class="pic-wrap">
                <img class="vid-img"
                    :src="'https://static-data.eol.cn//upload/svideo/piliang_' + detail.id + '_thumb.jpg'" />
            </div>
            <div id="intro" class="common-card">
                <div class="round-wrap">
                    <div>
                        <div id="round-study"></div>学习指数
                    </div>
                    <div>
                        <div id="round-life"></div>生活指数
                    </div>
                    <div>
                        <div id="round-job"></div>就业指数
                    </div>
                    <div>
                        <div id="round-compre"></div>综合评分
                    </div>
                </div>
                <div class="content-wrap">
                    &nbsp;&nbsp;&nbsp;&nbsp;{{ detail.content }}...
                </div>

            </div>
        </div>
        <div class="tables">
            <div class="table-left">
                <div class="score-table common-card">
                    <el-select v-model="type" placeholder="Select" @change="getEachSp">
                        <el-option value="理科" />
                        <el-option value="文科" />
                    </el-select>
                    <el-select v-model="year" placeholder="Select" @change="getEachSp">
                        <el-option value="2021" />
                        <el-option value="2020" />
                        <el-option value="2019" />
                    </el-select>
                    <el-table :data="specialData" height="1000" style="width: 100%" :default-sort="{ prop: 'score', order: 'descending' }">
                        <el-table-column prop="name" label="专业名称" />
                        <el-table-column prop="batch" label="录取批次" />
                        <el-table-column prop="score" label="最低分" />
                        <el-table-column prop="rank" label="最低位次" />
                    </el-table>
                </div>
            </div>
            <div class="table-right">
                <!-- <div class="table-wrap"> -->
                <div id="score-chart" class="common-card"></div>
                <div id="level-chart" class="common-card"></div>
                <!-- </div> -->
                <!-- <div class="bar-wrap"> -->
                <div id="rate-bar" class="common-card"></div>
                <div v-show="detail.men_rate" class="boy-girl common-card">
                    <el-icon :size="50" color="#22B6ED">
                        <Male />
                    </el-icon>{{ detail.men_rate }}
                    <div v-show="detail.men_rate" id="scale-bar"></div>
                    {{ detail.female_rate }}
                    <el-icon :size="50" color="#FFB6C1">
                        <Female />
                    </el-icon>
                </div>
                <!-- </div> -->
            </div>
        </div>
    </div>


</template>
<script>
import { computed } from 'vue';
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { ElMessage } from 'element-plus';
import * as echarts from 'echarts'
import request from "../utils/request.js";
export default {
    setup() {
        const route = useRoute();
        let schoolId = route.query.id;
        // let detail = reactive({});
        const detail = ref({});
        //获取学校详细信息
        const getSchoolDetail = () => {
            request
                .post("/getSchoolDetail", { id: schoolId })
                .then((res) => {
                    if (res.code == 200) {
                        detail.value = res.data;
                        updateChart(detail.value);
                        //ElMessage.success("获取学校列表成功");
                    } else {
                        ElMessage.error({
                            message: "获取失败:" + res.message,
                        });
                    }
                })
                .catch((err) => {
                    ElMessage.error({
                        message: "服务器错误：" + err,
                    });
                });
        };
        //专业列表
        const year = ref('2021');
        const type = ref('理科');
        const spQuery = computed(() => {
            return {
                id: schoolId,
                type: type.value == '理科' ? 0 : 1,
                year: year.value,
            }
        });
        const specialData = ref(null);
        const getEachSp = () => {
            request
                .post("/getEachSp", spQuery.value)
                .then((res) => {
                    if (res.code == 200) {
                        specialData.value = res.data;
                        //ElMessage.success("获取学校列表成功");
                    } else {
                        ElMessage.error({
                            message: "获取失败:" + res.message,
                        });
                    }
                })
                .catch((err) => {
                    ElMessage.error({
                        message: "服务器错误：" + err,
                    });
                });
        };
        // getSchoolDetail();

        // 使用刚指定的配置项和数据显示图表。
        // const main = ref();
        let roundStudy;
        let roundLife;
        let roundJob;
        let roundCompre;
        let scoreChart;
        let levelChart;
        let rateBar;
        let scaleBar;

        const updateChart = (curVal) => {
            updateRoundStudy(curVal);
            updateRoundLife(curVal);
            updateRoundJob(curVal);
            updateRoundCompre(curVal);
            updateScoreChart(curVal);
            updateLevelChart(curVal);
            updateRateBar(curVal);
            updateScaleBar(curVal);
        }

        onMounted(() => {
            initCharts();
            getSchoolDetail();
            getEachSp();
        });

        const initCharts = () => {
            initRoundStudy();
            initRoundLife();
            initRoundJob();
            initRoundCompre();
            initScoreChart();
            initLevelChart();
            initRateBar();
            initScaleBar();
        }

        const initRoundStudy = () => {
            roundStudy = echarts.init(document.getElementById('round-study'));
            roundStudy.n = 4.2;
            roundStudy.setOption({
                title: {
                    text: roundStudy.n.toString(),
                    left: 'center',
                    top: 'center',
                    textStyle: {
                        fontWeight: 'bold',
                        fontSize: 30
                    },
                },
                series: [
                    {
                        type: 'pie',
                        itemStyle: {
                            color: function (colors) {
                                var colorList = [
                                    '#fc8251',
                                    '#ffffff',
                                    '#91cd77',
                                    '#ef6567',
                                    '#f9c956',
                                    '#75bedc'
                                ];
                                return colorList[colors.dataIndex];
                            },
                        },
                        label: {
                            show: false,
                            position: 'center',
                        },
                        data: [
                            {
                                value: roundStudy.n,
                                name: 'A'
                            },
                            {
                                value: 5 - roundStudy.n,
                                name: 'B'
                            }
                        ],
                        radius: ['60%', '70%'],

                    }
                ]
            })
        }

        const updateRoundStudy = (curVal) => {
            roundStudy.setOption({
                title: {
                    text: curVal.study,
                },
                series: [{
                    data: [
                        {
                            value: curVal.study,
                        },
                        {
                            value: 5 - curVal.study,
                        }
                    ],
                }]
            });
        }

        const initRoundLife = () => {
            roundLife = echarts.init(document.getElementById('round-life'));
            roundLife.setOption({
                title: {
                    text: '4.5',
                    left: 'center',
                    top: 'center',
                    textStyle: {
                        fontWeight: 'bold',
                        fontSize: 30
                    },
                },
                series: [
                    {
                        type: 'pie',
                        itemStyle: {
                            color: function (colors) {
                                var colorList = [
                                    '#91cd77',
                                    '#ffffff',
                                    '#ef6567',
                                    '#f9c956',
                                    '#75bedc'
                                ];
                                return colorList[colors.dataIndex];
                            },
                        },
                        label: {
                            show: false,
                            position: 'center',
                        },
                        data: [
                            {
                                value: 4.5,
                                name: 'A'
                            },
                            {
                                value: 0.5,
                                name: 'B'
                            }
                        ],
                        radius: ['60%', '70%'],

                    }
                ]
            })
        }

        const updateRoundLife = (curVal) => {
            roundLife.setOption({
                title: {
                    text: curVal.life,
                },
                series: [{
                    data: [
                        {
                            value: curVal.life,
                        },
                        {
                            value: 5 - curVal.life,
                        }
                    ],
                }]
            });
        }

        const initRoundJob = () => {
            roundJob = echarts.init(document.getElementById('round-job'));
            roundJob.setOption({
                title: {
                    text: '4.7',
                    left: 'center',
                    top: 'center',
                    textStyle: {
                        fontWeight: 'bold',
                        fontSize: 30
                    },
                },
                series: [
                    {
                        type: 'pie',
                        itemStyle: {
                            color: function (colors) {
                                var colorList = [
                                    '#ef6567',
                                    '#ffffff',
                                    '#91cd77',
                                    '#f9c956',
                                    '#75bedc'
                                ];
                                return colorList[colors.dataIndex];
                            },
                        },
                        label: {
                            show: false,
                            position: 'center',
                        },
                        data: [
                            {
                                value: 4.7,
                                name: 'A'
                            },
                            {
                                value: 0.3,
                                name: 'B'
                            }
                        ],
                        radius: ['60%', '70%'],

                    }
                ]
            });
        }

        const updateRoundJob = (curVal) => {
            roundJob.setOption({
                title: {
                    text: curVal.job,
                },
                series: [{
                    data: [
                        {
                            value: curVal.job,
                        },
                        {
                            value: 5 - curVal.job,
                        }
                    ],
                }]
            });
        }

        const initRoundCompre = () => {
            roundCompre = echarts.init(document.getElementById('round-compre'));
            roundCompre.setOption({
                title: {
                    text: '4.9',
                    left: 'center',
                    top: 'center',
                    textStyle: {
                        fontWeight: 'bold',
                        fontSize: 30
                    },
                },
                series: [
                    {
                        type: 'pie',
                        itemStyle: {

                            color: function (colors) {
                                var colorList = [
                                    '#f9c956',
                                    '#ffffff',
                                    '#91cd77',
                                    '#ef6567',
                                    '#75bedc'
                                ];
                                return colorList[colors.dataIndex];
                            },
                        },
                        label: {
                            show: false,
                            position: 'center',
                        },
                        data: [
                            {
                                value: 4.9,
                                name: 'A'
                            },
                            {
                                value: 0.1,
                                name: 'B'
                            }
                        ],
                        radius: ['60%', '70%'],

                    }
                ]
            });
        }

        const updateRoundCompre = (curVal) => {
            roundCompre.setOption({
                title: {
                    text: curVal.comprehensive,
                },
                series: [{
                    data: [
                        {
                            value: curVal.comprehensive,
                        },
                        {
                            value: 5 - curVal.comprehensive,
                        }
                    ],
                }]
            });
        }

        const initScoreChart = () => {
            scoreChart = echarts.init(document.getElementById('score-chart'));
            scoreChart.setOption({
                title: {
                    text: '四川省分数线',
                    left: 'center',
                    top: '0%'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#6a7985'
                        }
                    }
                },
                legend: {
                    data: ['理科', '文科'],
                    top: '8%'
                },
                toolbox: {
                    feature: {
                        saveAsImage: {}
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '0',
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        data: ['2019', '2020', '2021']
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        min: function (value) {
                            return value.min - 10;
                        },
                        max: function (value) {
                            return value.max + 10;
                        },
                        // intervel: 50,
                    }
                ],
                series: [
                    {
                        name: '理科',
                        type: 'line',
                        emphasis: {
                            focus: 'series'
                        },
                        data: [0, 0, 0]
                    },
                    {
                        name: '文科',
                        type: 'line',
                        emphasis: {
                            focus: 'series'
                        },
                        data: [0, 0, 0]
                    }
                ]
            });
        }

        const updateScoreChart = (curVal) => {
            scoreChart.setOption({
                series: [
                    { data: curVal.score_li },
                    { data: curVal.score_wen },
                ]
            });
        }

        const initLevelChart = () => {
            levelChart = echarts.init(document.getElementById('level-chart'));
            levelChart.setOption({
                //标题样式
                title: {
                    text: "学术水平",
                    textStyle: {
                        color: 'black',
                    },
                    top: '4%',
                    left: 'center'
                },
                grid: {
                    top: '18%',
                    left: '18%',//原来是10%，修改为20%
                    right: '2%',
                    bottom: '3%'
                },
                color: ['#3398DB'],
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                xAxis: {
                    type: 'value',
                    axisLabel: {
                        show: true,
                        color: 'white',
                        fontSize: 12,
                        formatter: function (value) {
                            if (value >= 10000) {
                                value = value / 10000 + 'w';
                            }
                            return value;
                        }
                    },
                    //y轴线设置显示
                    axisLine: {
                        show: true
                    },
                },
                yAxis: {
                    type: 'category',
                    inverse: true,
                    data: ['重点实验室', "国家重点学科", "硕士点", "博士点"],

                },
                series: [{
                    label: {
                        show: true,
                        // rotate: 90,
                        formatter: '{c}',
                        fontSize: 16,
                        color: 'white',
                        rich: {
                            name: {}
                        }
                    },
                    emphasis: {
                        focus: 'series'
                    },
                    data: [],
                    type: 'bar',
                    barMaxWidth: "60%",
                }]
            });
        }

        const updateLevelChart = (curVal) => {
            levelChart.setOption({
                series: [{
                    data: [curVal.num_lab, curVal.num_subject, curVal.num_master, curVal.num_doctor]
                }]
            });
        }

        const initRateBar = () => {
            rateBar = echarts.init(document.getElementById('rate-bar'));
            rateBar.setOption({
                grid: {   // 直角坐标系内绘图网格
                    left: '20',  //grid 组件离容器侧的距离,
                    //left的值可以是80这样具体像素值，
                    //也可以是'80%'这样相对于容器高度的百分比
                    top: '50',
                    right: '20',
                    bottom: '0',
                    containLabel: true   //gid区域是否包含坐标轴的刻度标签。为true的时候，
                    // left/right/top/bottom/width/height决定的是包括了坐标轴标签在内的
                    //所有内容所形成的矩形的位置.常用于【防止标签溢出】的场景
                },
                xAxis: {  //直角坐标系grid中的x轴,
                    //一般情况下单个grid组件最多只能放上下两个x轴,
                    //多于两个x轴需要通过配置offset属性防止同个位置多个x轴的重叠。
                    type: 'value',//坐标轴类型,分别有：
                    //'value'-数值轴；'category'-类目轴;
                    //'time'-时间轴;'log'-对数轴
                    splitLine: { show: false },//坐标轴在 grid 区域中的分隔线
                    axisLabel: { show: false },//坐标轴刻度标签
                    axisTick: { show: false },//坐标轴刻度
                    axisLine: { show: false },//坐标轴轴线
                },
                yAxis: {
                    type: 'category',
                    axisTick: { show: false },
                    axisLine: { show: false },
                    axisLabel: {
                        color: 'black',
                        fontSize: 15
                    },
                    data: ['就业率', '深造率', '出国率']//类目数据，在类目轴（type: 'category'）中有效。
                    //如果没有设置 type，但是设置了axis.data,则认为type 是 'category'。
                },
                color: ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83'],
                series: [//系列列表。每个系列通过 type 决定自己的图表类型
                    {
                        name: '%',//系列名称
                        type: 'bar',//柱状、条形图
                        barWidth: 15,//柱条的宽度,默认自适应
                        data: [20, 40, 60],//系列中数据内容数组
                        label: { //图形上的文本标签
                            show: true,
                            position: 'right',//标签的位置
                            offset: [-40, -40],  //标签文字的偏移，此处表示向上偏移40
                            formatter: '{c}{a}',//标签内容格式器 {a}-系列名,{b}-数据名,{c}-数据值
                            color: 'black',//标签字体颜色
                            fontSize: 15  //标签字号
                        },
                        itemStyle: {//图形样式
                            //emphasis图形在高亮状态下的样式
                            borderRadius: 7,//柱条圆角半径,单位px.
                            //此处统一设置4个角的圆角大小;
                            //也可以分开设置[10,10,10,10]顺时针左上、右上、右下、左下
                            color: function (params) {
                                var colorList = [
                                    new echarts.graphic.LinearGradient(
                                        0, 0, 1, 0,
                                        [{
                                            offset: 0,
                                            color: '#52E5E7'//柱图渐变色起点颜色
                                        },
                                        {
                                            offset: 1,
                                            color: '#130CB7'//柱图渐变色终点颜色
                                        }
                                        ]
                                    ),
                                    new echarts.graphic.LinearGradient(
                                        0, 0, 1, 0,
                                        [{
                                            offset: 0,
                                            color: '#FFE985'//柱图渐变色起点颜色
                                        },
                                        {
                                            offset: 1,
                                            color: '#FA742B'//柱图渐变色终点颜色
                                        }
                                        ]
                                    ),
                                    new echarts.graphic.LinearGradient(
                                        0, 0, 1, 0,
                                        [{
                                            offset: 0,
                                            color: '#81FBB8'//柱图渐变色起点颜色
                                        },
                                        {
                                            offset: 1,
                                            color: '#28C76F'//柱图渐变色终点颜色
                                        }
                                        ]
                                    )
                                ];

                                return colorList[params.dataIndex]
                            },
                        },
                        zlevel: 1//柱状图所有图形的 zlevel 值,
                        //zlevel 大的 Canvas 会放在 zlevel 小的 Canvas 的上面
                    },
                    {
                        name: '进度条背景',
                        type: 'bar',
                        barGap: '-100%',//不同系列的柱间距离，为百分比。
                        // 在同一坐标系上，此属性会被多个 'bar' 系列共享。
                        // 此属性应设置于此坐标系中最后一个 'bar' 系列上才会生效，
                        //并且是对此坐标系中所有 'bar' 系列生效。
                        barWidth: 15,
                        data: [100, 100, 100],
                        color: '#e6e6e6',//柱条颜色
                        itemStyle: {
                            borderRadius: 7,
                        }
                    }
                ]
            });
        }

        const updateRateBar = (curVal) => {
            rateBar.setOption({
                series: [{
                    data: [curVal.jobrate, curVal.postgraduate, curVal.abroad]
                }]
            });
        }

        const initScaleBar = () => {
            let dom = document.getElementById('scale-bar');
            scaleBar = echarts.init(dom);
            scaleBar.setOption({
                title: {
                    text: "男女比例",
                    textStyle: {
                        color: 'black',
                    },
                    top: '4%',
                    left: 'center'
                },
                grid: {   // 直角坐标系内绘图网格
                    left: '0',  //grid 组件离容器左侧的距离,
                    //left的值可以是80这样具体像素值，
                    //也可以是'80%'这样相对于容器高度的百分比
                    top: '0',
                    right: '0',
                    bottom: '0',
                    containLabel: true   //gid区域是否包含坐标轴的刻度标签。为true的时候，
                    // left/right/top/bottom/width/height决定的是包括了坐标轴标签在内的
                    //所有内容所形成的矩形的位置.常用于【防止标签溢出】的场景
                },
                xAxis: {  //直角坐标系grid中的x轴,
                    //一般情况下单个grid组件最多只能放上下两个x轴,
                    //多于两个x轴需要通过配置offset属性防止同个位置多个x轴的重叠。
                    type: 'value',//坐标轴类型,分别有：
                    //'value'-数值轴；'category'-类目轴;
                    //'time'-时间轴;'log'-对数轴
                    splitLine: { show: false },//坐标轴在 grid 区域中的分隔线
                    axisLabel: { show: false },//坐标轴刻度标签
                    axisTick: { show: false },//坐标轴刻度
                    axisLine: { show: false },//坐标轴轴线
                },
                yAxis: {
                    type: 'category',
                    axisTick: { show: false },
                    axisLine: { show: false },
                    axisLabel: {
                        color: 'black',
                        fontSize: 25
                    },
                    data: ['']//类目数据，在类目轴（type: 'category'）中有效。
                    //如果没有设置 type，但是设置了axis.data,则认为type 是 'category'。
                },
                series: [//系列列表。每个系列通过 type 决定自己的图表类型
                    {
                        name: '%',//系列名称
                        type: 'bar',//柱状、条形图
                        barWidth: 10,//柱条的宽度,默认自适应
                        data: [20],//系列中数据内容数组
                        // label: { //图形上的文本标签
                        //     show: true,
                        //     position: 'right',//标签的位置
                        //     offset: [0, -40],  //标签文字的偏移，此处表示向上偏移40
                        //     formatter: '{c}{a}',//标签内容格式器 {a}-系列名,{b}-数据名,{c}-数据值
                        //     color: 'black',//标签字体颜色
                        //     fontSize: 36  //标签字号
                        // },
                        itemStyle: {//图形样式

                            //emphasis图形在高亮状态下的样式
                            borderRadius: [10, 0, 0, 10],//柱条圆角半径,单位px.
                            //此处统一设置4个角的圆角大小;
                            //也可以分开设置[10,10,10,10]顺时针左上、右上、右下、左下
                            color: '#22B6ED',
                        },
                        zlevel: 1//柱状图所有图形的 zlevel 值,
                        //zlevel 大的 Canvas 会放在 zlevel 小的 Canvas 的上面
                    },
                    {
                        name: '进度条背景',
                        type: 'bar',
                        barGap: '-100%',//不同系列的柱间距离，为百分比。
                        // 在同一坐标系上，此属性会被多个 'bar' 系列共享。
                        // 此属性应设置于此坐标系中最后一个 'bar' 系列上才会生效，
                        //并且是对此坐标系中所有 'bar' 系列生效。
                        barWidth: 10,
                        data: [100],
                        color: '#FFB6C1',//柱条颜色
                        itemStyle: {

                            borderRadius: 10,
                        }
                    }
                ]
            });
        }

        const updateScaleBar = (curVal) => {
            if (!scaleBar) return;
            if (curVal.men_rate == "") scaleBar.dispose();
            scaleBar.setOption({
                series: [{
                    data: [curVal.men_rate]
                }]
            });
        }

        return {
            type,
            year,
            spQuery,
            getEachSp,
            specialData,
            getSchoolDetail,
            detail,
            // main
        }

    },
};
</script>

<style scoped>
.common-card {
    border-radius: 10px;
    box-shadow: 0 0 13px #e6e6e6;
    margin: 10px;
    padding: 10px;
}

.detail-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: auto;
    width: 80%;
    height: 100%;
    background-color: #FFFFFF;
}

#tag-card {
    width: 100%;
    height: 200px;
    /* background-color: aquamarine; */
    background-image: linear-gradient(135deg, #4C83FF 10%, #2AFADF 100%);
    display: flex;
    flex-direction: row;
}

.logo-wrap {
    float: left;
    background: #FFFFFF;
    padding: 20px;
    margin: 20px;
    border-radius: 40px;
}

.logo {
    width: 100%;
    height: 100%;
}

.right-content {
    padding: 10px
}

.name-pos {
    font-size: xx-large;
    color: #FFFFFF;
    margin: 20px;
}

.tag-line {
    display: flex;
    margin-top: 50px;
    margin-left: 10px;
}

.tag {
    /* background-color: #4CAF50; */
    /* border-color: #3faff3; */
    border-radius: 40vh;
    color: #3faff3;
    padding: 10px 15px;
    margin: 5px;
    text-align: center;
    text-decoration: none;
    border: 2px solid #3faff3;
    display: inline-block;
    cursor: pointer;
    font-weight: bold;
    background-color: #FFFFFF;
    /* background-image: linear-gradient( 135deg, #3C8CE7 10%, #00EAFF 100%); */
}

#pic-intro {
    display: flex;
}

.pic-wrap {
    background: #FFFFFF;
    /* padding: 20px; */
    margin: 20px;
    border-radius: 40px;
}

.vid-img {
    width: 460px;
    height: 259px;
    border-radius: 40px;
}

#intro {
    display: flex;
    flex-direction: column;
    padding: 10px;
}

.round-wrap {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
}

.round-wrap>* {
    /* width: 100px;
    height: 100px; */
    display: flex;
    flex-direction: column;
    align-items: center;
    font-weight: bold;
}

.round-wrap>*>* {
    width: 100px;
    height: 100px;
}

.content-wrap {
    padding: 20px;
}

/* .table-wrap {
    display: flex;
    flex-direction: row;
    justify-content: center;
} */

#score-chart {
    width: 400px;
    height: 300px;
}

#level-chart {
    width: 400px;
    height: 300px;
}

/* .bar-wrap {
    display: flex;
    flex-direction: row;
    justify-content: center;
} */

#rate-bar {
    width: 400px;
    height: 250px;
    margin-right: 50px;
}

.boy-girl {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 400px;
}

#scale-bar {
    width: 200px;
    height: 150px;
}

.score-table {
    width: 90%;
}

.tables {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    width: 100%;
}

.table-left {
    width: 100%;
}

.table-right {
    display: flex;
    flex-direction: column;
    align-content: stretch;
}
</style>
