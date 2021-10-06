<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.phone" placeholder="Phone" style="width: 130px;" class="filter-item mr-1" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.name" placeholder="Name" style="width: 130px;" class="filter-item mr-1" @keyup.enter.native="handleFilter" />
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
      <el-table-column label="ID" width="120" align="center">
        <template slot-scope="{ row }">
          {{ row.id }}
        </template>
      </el-table-column>
      <el-table-column label="Phone" align="center">
        <template slot-scope="{ row }">
          {{ row.phone }}
        </template>
      </el-table-column>
      <el-table-column label="Name" align="center">
        <template slot-scope="{ row }">
          {{ row.name }}
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
import { fetchCustomers } from '@/api/customer'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
export default {
  name: 'OrdersIndex',
  components: { Pagination },
  filters: {
    statusText(status) {
      const statusMap = {
        0: 'Bad',
        1: 'Normal'
      }
      return statusMap[status]
    },
    statusType(status) {
      const statusMap = {
        0: 'warning',
        1: 'primary'
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
        limit: 20,
        phone: undefined,
        name: undefined
      },
      list: null,
      listLoading: true
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      fetchCustomers(this.listQuery).then(response => {
        this.list = response.data.data
        this.total = response.data.total
        this.listLoading = false
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
