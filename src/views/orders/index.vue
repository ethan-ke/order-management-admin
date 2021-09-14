<template>
  <div class="app-container">
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
      listQuery: {
        page: 1,
        limit: 10,
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
      getOrders(this.listQuery).then(response => {
        this.list = response.data.data
        this.total = response.data.meta.total
        this.listLoading = false
      })
    },
    newsEdit(id) {
      this.$router.push('/hktinon/edit/' + id)
    }
  }
}
</script>
