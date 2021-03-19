<!--
    @Author  :   zhangxiaojian
    @Time    :   2021/03/03 17:22:00
 -->
<template>
    <div>
        <table>
            <tr>
                <td>ID</td>
                <td>NAME</td>
                <td>AGE</td>
            </tr>
            <tr v-for="item in users">
                <td>{{item.id}}</td>
                <td>{{item.name}}</td>
                <td>{{item.age}}</td>
            </tr>
        </table>
        {{msg}}
        <el-button type="primary" @click="tests()"></el-button>
    </div>
</template>
<script>
    const axios = require('axios').default;

    export default {
        name: "Test.vue",
        data() {
            return {
                msg: 'hello',
                users: [
                    {
                        id: 1,
                        name: "zxj",
                        age: 19
                    },
                    {
                        id: 2,
                        name: "lc",
                        age: 18
                    },
                    {
                        id: 3,
                        name: "ww",
                        age: 17
                    }
                ]
            }
        },
        created() {
            // const _this = this;
            axios.get("http://localhost:8888/tests").then((resp) => {
                    console.log(resp);
                    this.users = resp.data.records;
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        methods: {
            // http://localhost:8888/tests/findByPage/' + currentPage
            tests() {
                axios.get('http://localhost:8888/tests')
                    .then(
                        function (resp) {
                            console.log(resp);
                            // _this.tableData = resp.data.data
                        }
                    )
            }
        },
    }
</script>
<style scoped>

</style>