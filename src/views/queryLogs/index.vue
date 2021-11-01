<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="listQuery.merchant_id" placeholder="Merchant" clearable class="filter-item mr-1" style="width: 130px">
        <el-option v-for="(item, index) in merchants" :key="index" :label="item.username" :value="item.id" />
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        Search
      </el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      fit
      border
      stripe
      highlight-current-row
    >
      <el-table-column label="ID" width="150" align="center">
        <template slot-scope="{ row }">
          {{ row.id }}
        </template>
      </el-table-column>
      <el-table-column label="Customer Phone" align="center">
        <template slot-scope="{ row }">
          {{ row.phone }}
        </template>
      </el-table-column>
      <el-table-column label="Merchant name" width="130" align="center">
        <template slot-scope="{ row }">
          {{ row.merchant.username }}
        </template>
      </el-table-column>
      <el-table-column label="Created At" width="200px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.created_at }}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="fetchData" />
  </div>
</template>

<script>
import { getMerchants, queryLogs } from '@/api/merchant'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
export default {
  name: 'QueryLogsIndex',
  components: { Pagination },
  data() {
    return {
      total: 0,
      merchants: [],
      listQuery: {
        page: 1,
        limit: 20,
        merchant_id: undefined,
        room_number: undefined
      },
      list: null,
      listLoading: true
    }
  },
  created() {
    this.fetchData()
    this.fetchMerchants()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      queryLogs(this.listQuery).then(response => {
        this.list = response.data.data
        this.total = response.data.total
        this.listLoading = false
      })
    },
    fetchMerchants() {
      getMerchants(this.listQuery).then(response => {
        this.merchants = response.data.data
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.fetchData()
    }
  }
}
</script>

<style lang="scss" scoped>
.mr-1 {
  margin-right: 1rem;
}
.filter-container {
  margin-bottom: 1rem;
}
</style>
