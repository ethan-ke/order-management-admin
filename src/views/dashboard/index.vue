<template>
  <div class="dashboard-container">
    <div>
      <el-table
        :data="statistics"
        stripe
        show-summary
        style="width: 100%"
      >
        <el-table-column fixed prop="name" label="Merchant name" width="180" align="center" />
        <el-table-column prop="today_income" label="Today's salary" width="180" align="right" />
        <el-table-column prop="total_amount" label="Total amount of the month" width="220" align="right" />
        <el-table-column prop="actual_salary" label="Actual salary" width="180" align="right" />
        <el-table-column prop="last_month_total_amount" label="Last month's total amount" width="240" align="right" />
        <el-table-column prop="actual_salary_last_month" label="Actual salary last month" width="240" align="right" />
      </el-table>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getStatistics } from '@/api/home'

export default {
  name: 'Dashboard',
  data() {
    return {
      statistics: []
    }
  },
  computed: {
    ...mapGetters([
      'username'
    ])
  },
  created() {
    this.fetchStatistics()
  },
  methods: {
    fetchStatistics() {
      getStatistics().then(res => {
        this.statistics = res.data
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
