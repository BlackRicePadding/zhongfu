<template>
    <el-button @click="exportToExcel">导出excel</el-button>
</template>

<script>
import Blob from './Blob'
import Export2Excel from './Export2Excel.js'
export default {
    name: 'dolExcel',
    props: {
        tHeader,
        filterVal,
        tableData,
        title,
    },
	methods: {
		exportToExcel() {
            //excel数据导出
            require.ensure([], () => {
                let list = this.tableData;
                let data = this.formatJson(this.filterVal, list);
                let name = this.title + new Date().getTime();
                Export2Excel(this.tHeader, data, name);
            })
        },
        formatJson(filterVal, jsonData) {
            return jsonData.map(v => filterVal.map(j => v[j]))
        }
	}
}
</script>
