<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button v-waves class="filter-item" type="primary" size="small" icon="el-icon-circle-plus-outline" @click="handleCreate">
        Create
      </el-button>
    </div>
    <el-table
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column label="ID" width="50">
        <template v-slot="{ row }">
          {{ row.id }}
        </template>
      </el-table-column>
      <el-table-column label="Merchant Name" align="center">
        <template v-slot="{ row }">
          {{ row.username }}
        </template>
      </el-table-column>
      <el-table-column label="Commission Rate" width="200px" align="center">
        <template v-slot="{ row }">
          {{ row.commission_rate }}
        </template>
      </el-table-column>
      <el-table-column label="Created At" width="200px" align="center">
        <template v-slot="{row}">
          <span>{{ row.created_at }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Updated At" width="200px" align="center">
        <template v-slot="{row}">
          <span>{{ row.updated_at }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Operation" width="200">
        <template v-slot="{row}">
          <el-button plain size="mini" @click="merchantEdit(row)">
            Edit
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="Merchant info" width="30%" :visible.sync="dialogFormVisible">
      <el-form ref="postForm" :model="postForm" label-position="right" label-width="140px" style="width: 80%; margin-left:50px;">
        <el-form-item label="Commission Ratio">
          <el-input v-model="postForm.commission_rate" />
        </el-form-item>
        <el-form-item label="Password">
          <el-input v-model="merchantForm.password" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="onSubmit()">Confirm</el-button>
      </div>
    </el-dialog>

    <el-dialog title="Merchant info" width="35%" :visible.sync="merchantFormVisible">
      <el-form ref="merchantForm" :model="merchantForm" label-position="right" label-width="140px">
        <el-form-item label="Username">
          <el-input v-model="merchantForm.username" />
        </el-form-item>
        <el-form-item label="Password">
          <el-input v-model="merchantForm.password" />
        </el-form-item>
        <el-form-item label="Commission Ratio">
          <el-input v-model="merchantForm.commission_rate" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="merchantFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="onSubmitMerchant()">Confirm</el-button>
      </div>
    </el-dialog>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="fetchData" />
  </div>
</template>

<script>
import { getMerchants, getMerchant, updateMerchant, createMerchant } from '@/api/merchant'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import waves from '@/directive/waves'
export default {
  name: 'MerchantIndex',
  directives: { waves },
  components: { Pagination },
  data() {
    return {
      total: 0,
      listQuery: {
        page: 1,
        limit: 20
      },
      postForm: {
        commission_rate: ''
      },
      merchantForm: {
        username: null,
        password: null,
        commission_rate: null
      },
      list: null,
      listLoading: true,
      dialogFormVisible: false,
      merchantFormVisible: false,
      merchant: {}
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getMerchants(this.listQuery).then(response => {
        this.list = response.data.data
        this.total = response.data.total
        this.listLoading = false
      })
    },
    merchantEdit(row) {
      getMerchant(row.id).then(response => {
        this.postForm = response.data
        this.listLoading = false
      })
      this.dialogFormVisible = true
    },
    onSubmit() {
      updateMerchant(this.postForm.id, this.postForm).then(() => {
        this.$message.success('Success')
        this.fetchData()
        this.dialogFormVisible = false
      })
    },
    onSubmitMerchant() {
      createMerchant(this.merchantForm).then(() => {
        this.$message.success('Success')
        this.fetchData()
        this.merchantFormVisible = false
      })
    },
    handleCreate() {
      this.merchantFormVisible = true
    }
  }
}
</script>
<style>
.filter-container {
  margin-bottom: 1rem;
}
</style>
