<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" type="success" icon="el-icon-circle-plus-outline" @click="handleGirlForm()">
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
      <el-table-column label="ID" width="80" align="center">
        <template slot-scope="{ row }">
          {{ row.id }}
        </template>
      </el-table-column>
      <el-table-column label="Name" align="center">
        <template slot-scope="{ row }">
          {{ row.name }}
        </template>
      </el-table-column>
      <el-table-column label="Room" align="center" width="140">
        <template slot-scope="{ row }">
          {{ row.room }}
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
          <el-button type="primary" size="mini" @click="handleGirlForm(scope.row, scope.$index)">
            Edit
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="Girl info" width="40%" :visible.sync="dialogFormVisible">
      <el-form ref="girlForm" :rules="rules" :model="girlForm" label-position="left" label-width="130px" style="width: 80%; margin-left:50px;">
        <el-form-item label="Name" prop="name">
          <el-input v-model="girlForm.name" />
        </el-form-item>
        <el-form-item label="Room" prop="room">
          <el-input v-model="girlForm.room" width="300px" />
        </el-form-item>
        <el-form-item label="Status">
          <el-radio-group v-model="girlForm.status" class="filter-item">
            <el-radio v-for="(item, index) in statusOptions" :key="index" :label="index"> {{ item }} </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">Confirm</el-button>
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchGirls, fetchGirl, updateGirl, createGirl } from '@/api/girl'
const defaultGirlForm = {
  id: undefined,
  name: '',
  room: '',
  status: 0
}
export default {
  name: 'GirlIndex',
  filters: {
    statusText(status) {
      const statusMap = {
        0: 'Holiday',
        1: 'Available',
        2: 'Busy'
      }
      return statusMap[status]
    },
    statusType(status) {
      const statusMap = {
        0: 'primary',
        1: 'success',
        2: 'warning'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      type: '',
      tableKey: 0,
      merchants: [],
      list: null,
      updateLoading: false,
      multipleSelection: [],
      updateItemParameters: {
        status: undefined,
        items: []
      },
      dialogFormVisible: false,
      girlForm: Object.assign({}, defaultGirlForm),
      tempGirl: {},
      listLoading: true,
      statusOptions: ['Holiday', 'Available', 'Busy'],
      rules: {
        name: [{ required: true, trigger: 'blur' }],
        room: [{ required: true, trigger: 'blur' }]
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      fetchGirls(this.listQuery).then(response => {
        this.list = response.data
        this.listLoading = false
      })
    },
    handleGirlForm(row, index) {
      if (index !== undefined) {
        this.girlForm = row
        fetchGirl(row.id).then(res => {
          this.girlForm = res.data
        })
      } else {
        this.girlForm = defaultGirlForm
      }
      this.dialogFormVisible = true
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleFilter() {
      this.listQuery.page = 1
      this.fetchData()
    },
    submitForm() {
      if (this.girlForm.id !== undefined) {
        this.$refs.girlForm.validate(valid => {
          if (valid) {
            updateGirl(this.girlForm.id, this.girlForm).then(() => {
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
        this.$refs.girlForm.validate(valid => {
          if (valid) {
            createGirl(this.girlForm).then(() => {
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
