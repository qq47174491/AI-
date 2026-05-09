import WelcomeCard from '../components/WelcomeCard'
import StatsCards from '../components/StatsCards'
import RecentActivity from '../components/RecentActivity'
import SupplierDistribution from '../components/SupplierDistribution'
import TodoList from '../components/TodoList'
import RiskWarning from '../components/RiskWarning'

export default function Dashboard() {
  return (
    <div>
      <WelcomeCard />
      <StatsCards />
      
      <div className="grid grid-cols-12 gap-6 mt-6">
        <div className="col-span-8 space-y-6">
          <RecentActivity />
          <SupplierDistribution />
        </div>
        <div className="col-span-4 space-y-6">
          <TodoList />
          <RiskWarning />
        </div>
      </div>
    </div>
  )
}
