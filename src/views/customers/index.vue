<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.phone" placeholder="Phone number" style="width: 200px;" class="filter-item mr-1" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.name" placeholder="Name" style="width: 130px;" class="filter-item mr-1" @keyup.enter.native="handleFilter" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        Search
      </el-button>
      <el-button :loading="updateLoading" class="filter-item" type="primary" icon="el-icon-circle-check" @click="bulkUpdateStatus(1)">
        Normal
      </el-button>
      <el-button :loading="updateLoading" class="filter-item" type="warning" icon="el-icon-circle-close" @click="bulkUpdateStatus(0)">
        Bad
      </el-button>
      <el-button class="filter-item" type="success" icon="el-icon-circle-plus-outline" @click="handleCustomerForm()">
        Create
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
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
      <el-table-column label="Name" min-width="140" align="center">
        <template slot-scope="{ row }">
          {{ row.name }}
        </template>
      </el-table-column>
      <el-table-column label="Creator" align="center" width="140">
        <template slot-scope="{ row }">
          {{ row.admin_name }}
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
      <el-table-column label="操作" align="center" width="140" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleCustomerForm(scope.row, scope.$index)">
            Edit
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="Customer info" width="40%" :visible.sync="dialogFormVisible">
      <el-form ref="customerForm" :rules="rules" :model="customerForm" label-position="left" label-width="130px" style="width: 80%; margin-left:50px;">
        <el-form-item label="Name" prop="name">
          <el-input v-model="customerForm.name" />
        </el-form-item>
        <el-form-item label="Phone number" prop="phone">
          <el-input v-model="customerForm.phone" width="300px" />
        </el-form-item>
        <el-form-item label="Status">
          <el-radio-group v-model="customerForm.status" class="filter-item">
            <el-radio v-for="(item, index) in statusOptions" :key="index" :label="index"> {{ item }} </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">Confirm</el-button>
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
      </div>
    </el-dialog>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="fetchData" />
  </div>
</template>

<script>
import { fetchCustomers, fetchCustomer, bulkUpdateItem, updateCustomer, createCustomer } from '@/api/customer'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
const defaultCustomerForm = {
  id: undefined,
  phone: '',
  name: '',
  status: 0
}
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
      type: '',
      tableKey: 0,
      total: 0,
      merchants: [],
      listQuery: {
        page: 1,
        limit: 20,
        phone: undefined,
        name: undefined
      },
      list: null,
      updateLoading: false,
      multipleSelection: [],
      updateItemParameters: {
        status: undefined,
        items: []
      },
      dialogFormVisible: false,
      customerForm: Object.assign({}, defaultCustomerForm),
      tempCustomer: {},
      listLoading: true,
      statusOptions: ['Bad', 'Normal'],
      rules: {
        phone: [{ required: true, trigger: 'blur' }]
      }
    }
  },
  watch: {
    'customerForm.phone': {
      handler: function(val) {
        this.customerForm.phone = val.replace(/\s*/g, '')
      }
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
        this.total = response.data.meta.total
        this.listLoading = false
      })
    },
    handleCustomerForm(row, index) {
      if (index !== undefined) {
        this.customerForm = row
        fetchCustomer(row.id).then(res => {
          this.customerForm = res.data
        })
      } else {
        this.customerForm = defaultCustomerForm
      }
      this.dialogFormVisible = true
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    bulkUpdateStatus(status) {
      const multipleSelection = this.multipleSelection
      if (Object.keys(multipleSelection).length === 0) {
        this.$message({
          message: 'Must select customer!',
          type: 'warning'
        })
        return
      }
      this.updateItemParameters.status = status
      this.updateItemParameters.items = multipleSelection.map((item) => {
        return item.id
      })
      bulkUpdateItem(this.updateItemParameters).then(() => {
        multipleSelection.map((item) => {
          item.status = status
          return item
        })
        this.$message({
          message: 'Success',
          type: 'success'
        })
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.fetchData()
    },
    submitForm() {
      if (this.customerForm.id !== undefined) {
        this.$refs.customerForm.validate(valid => {
          if (valid) {
            updateCustomer(this.customerForm.id, this.customerForm).then(() => {
              this.loading = true
              this.$notify({
                message: 'Success',
                type: 'success',
                duration: 2000
              })
              this.fetchData()
              this.dialogFormVisible = false
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      } else {
        this.$refs.customerForm.validate(valid => {
          if (valid) {
            createCustomer(this.customerForm).then(() => {
              this.loading = true
              this.$notify({
                message: 'Success',
                type: 'success',
                duration: 2000
              })
              this.fetchData()
              this.dialogFormVisible = false
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }
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
