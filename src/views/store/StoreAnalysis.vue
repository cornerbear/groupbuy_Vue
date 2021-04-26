<!--
    @Author  :   zhangxiaojian
    @Time    :   2021/04/25 15:40:00
 -->
<template>
    <div>
        <div class="header">
            <el-card>
            </el-card>
        </div>

        <div>
            <div id="day" :style="{ width: '600px', height: '400px', float: 'left' }"></div>
            <div id="month" :style="{ width: '600px', height: '400px', float:'left' }"></div>
        </div>

    </div>
</template>

<script>

    import * as echarts from 'echarts';

    export default {
        data() {
            return {
            }
        },

        mounted() {
            //this.$root => app
            let day = echarts.init(
                document.getElementById("day")
            );
            this.getRequest("/store/analysis/day").then((resp) => {
                // 当日
                day.setOption({
                    title: { text: "当日数据分析" },
                    tooltip: {},
                    legend: {
                        data: ['销量', '售额']
                    },
                    xAxis: {
                        data: resp.data.goodsNames,
                    },
                    yAxis: [{
                        name: '销量/件',
                        type: 'value'
                    }, {
                        name: '售额/元',
                        type: 'value'
                    }],
                    series: [
                        {
                            name: "销量",
                            type: "bar",
                            data: resp.data.goodsSales,
                        },
                        {
                            name: "售额",
                            type: "bar",
                            yAxisIndex: 1,
                            data: resp.data.goodsMoneys,
                        },
                    ],
                });
            });

            let month = echarts.init(
                document.getElementById("month")
            );
            this.getRequest("/store/analysis/month").then((resp) => {
                // 当日
                month.setOption({
                    title: { text: "当月数据分析" },
                    tooltip: {},
                    legend: {
                        data: ['销量', '售额']
                    },
                    xAxis: {
                        data: resp.data.goodsNames,
                    },
                    yAxis: [{
                        name: '销量/件',
                        type: 'value'
                    }, {
                        name: '售额/元',
                        type: 'value'
                    }],
                    series: [
                        {
                            name: "销量",
                            type: "bar",
                            data: resp.data.goodsSales,
                        },
                        {
                            name: "售额",
                            type: "bar",
                            yAxisIndex: 1,
                            data: resp.data.goodsMoneys,
                        },
                    ],
                });
            });
        },
        methods: {
        },
        created() {
        },
    }
</script>
<style>
    .header {
        margin-bottom: 5px;
    }
</style>