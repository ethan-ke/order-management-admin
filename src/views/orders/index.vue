<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.room_number" placeholder="Room" style="width: 130px;" class="filter-item mr-1" @keyup.enter.native="handleFilter" />
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
      border
      fit
      highlight-current-row
    >
      <el-table-column label="ID" width="50" align="center">
        <template slot-scope="{ row }">
          {{ row.id }}
        </template>
      </el-table-column>
      <el-table-column label="Customer Phone" align="center">
        <template slot-scope="{ row }">
          {{ row.phone }}
        </template>
      </el-table-column>
      <el-table-column label="Price" align="center">
        <template slot-scope="{ row }">
          {{ row.price }}
        </template>
      </el-table-column>
      <el-table-column label="Room" align="center">
        <template slot-scope="{ row }">
          {{ row.room_number }}
        </template>
      </el-table-column>
      <el-table-column label="Merchant name" align="center">
        <template slot-scope="{ row }">
          {{ row.merchant_name }}
        </template>
      </el-table-column>
      <el-table-column label="Commission" align="center">
        <template slot-scope="{ row }">
          {{ row.commission }}
        </template>
      </el-table-column>
      <el-table-column label="Commission rate" align="center">
        <template slot-scope="{ row }">
          {{ row.commission_rate }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="Status" width="110" align="center">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusType">
            {{ row.status | statusText }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Created At" width="200px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.created_at }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Updated At" width="200px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.updated_at }}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="fetchData" />
  </div>
</template>

<script>
import { getOrders } from '@/api/order'
import { getMerchants } from '@/api/merchant'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
export default {
  name: 'OrdersIndex',
  components: { Pagination },
  filters: {
    statusText(status) {
      const statusMap = {
        1: 'Initial',
        2: 'Canceled',
        3: 'Finished'
      }
      return statusMap[status]
    },
    statusType(status) {
      const statusMap = {
        1: 'primary',
        2: 'warning',
        3: 'success'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      total: 0,
      merchants: [],
      listQuery: {
        page: 1,
        limit: 10,
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
      getOrders(this.listQuery).then(response => {
        this.list = response.data.data
        this.total = response.data.meta.total
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

<style>
.mr-1 {
  margin-right: 1rem;
}
.filter-container {
  margin-bottom: 1rem;
}
</style>
