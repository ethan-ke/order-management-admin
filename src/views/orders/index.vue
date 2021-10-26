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
      <el-table-column label="Price" width="130" align="center">
        <template slot-scope="{ row }">
          {{ row.price }}
        </template>
      </el-table-column>
      <el-table-column label="Room" width="130" align="center">
        <template slot-scope="{ row }">
          {{ row.room_number }}
        </template>
      </el-table-column>
      <el-table-column label="Merchant name" width="130" align="center">
        <template slot-scope="{ row }">
          {{ row.merchant_name }}
        </template>
      </el-table-column>
      <el-table-column label="Commission" width="130" align="center">
        <template slot-scope="{ row }">
          {{ row.commission }}
        </template>
      </el-table-column>
      <el-table-column label="Commission rate" width="140" align="center">
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
      <el-table-column align="center" label="Operation" width="140">
        <template slot-scope="{row}">
          <el-button plain size="mini" @click="orderEdit(row)">
            Edit
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="fetchData" />\
    <el-dialog title="Order info" width="30%" :visible.sync="dialogFormVisible">
      <el-form ref="postForm" :rules="rules" :model="postForm" label-position="right" label-width="140px" style="width: 80%;">
        <el-form-item label="Phone" prop="phone">
          <el-input v-model="postForm.phone" />
        </el-form-item>
        <el-form-item label="Price" prop="price">
          <el-input v-model="postForm.price" />
        </el-form-item>
        <el-form-item label="Status">
          <el-select v-model="postForm.status" placeholder="Select status">
            <el-option
              v-for="(item) in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="onSubmit()">Confirm</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getOrders, getOrder, updateOrder } from '@/api/order'
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
        limit: 20,
        merchant_id: undefined,
        room_number: undefined
      },
      dialogFormVisible: false,
      options: [
        {
          value: 1,
          label: 'Initial'
        },
        {
          value: 2,
          label: 'Canceled'
        },
        {
          value: 3,
          label: 'Finished'
        }
      ],
      value: '',
      rules: {
        phone: [{ required: true, trigger: 'blur' }],
        price: [{ required: true, trigger: 'blur' }]
      },
      postForm: {
        id: '',
        phone: '',
        price: '',
        status: 0
      },
      list: null,
      listLoading: true
    }
  },
  watch: {
    'postForm.phone': {
      handler: function(val) {
        this.postForm.phone = val.replace(/\s*/g, '')
      }
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
    orderEdit(row) {
      getOrder(row.id).then(response => {
        this.postForm = response.data
        this.listLoading = false
      })
      this.dialogFormVisible = true
    },
    handleFilter() {
      this.listQuery.page = 1
      this.fetchData()
    },
    onSubmit() {
      updateOrder(this.postForm.id, this.postForm).then(() => {
        this.$message.success('Success')
        this.fetchData()
        this.dialogFormVisible = false
      })
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
