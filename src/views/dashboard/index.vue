<template>
  <div class="dashboard-container">
    <div>
      <el-table
        :data="statistics"
        stripe
        style="width: 100%"
      >
        <el-table-column
          prop="name"
          label="Merchant name"
          width="180"
        />
        <el-table-column prop="today_income" label="Today income" width="180" />
        <el-table-column prop="monthly_income" label="Monthly income" width="180" />
        <el-table-column prop="total_amount" label="Total amount of the month" width="220" />
        <el-table-column prop="last_month_income" label="Last month's income" width="200" />
        <el-table-column prop="last_month_total_amount" label="Last month's total amount" width="240" />
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
