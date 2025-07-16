
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  CreditCard,
  PiggyBank,
  AlertCircle 
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const monthlyData = [
  { month: 'Jan', income: 4000, expenses: 3200, savings: 800 },
  { month: 'Feb', income: 4200, expenses: 3400, savings: 800 },
  { month: 'Mar', income: 4100, expenses: 3600, savings: 500 },
  { month: 'Apr', income: 4300, expenses: 3300, savings: 1000 },
  { month: 'May', income: 4500, expenses: 3500, savings: 1000 },
  { month: 'Jun', income: 4400, expenses: 3800, savings: 600 },
];

const expenseBreakdown = [
  { name: 'Housing', value: 1200, color: '#3B82F6' },
  { name: 'Food', value: 600, color: '#10B981' },
  { name: 'Transportation', value: 400, color: '#F59E0B' },
  { name: 'Entertainment', value: 300, color: '#EF4444' },
  { name: 'Utilities', value: 200, color: '#8B5CF6' },
  { name: 'Other', value: 300, color: '#6B7280' },
];

const accounts = [
  { name: 'Checking Account', balance: 2500, type: 'checking' },
  { name: 'Savings Account', balance: 15000, type: 'savings' },
  { name: 'Investment Account', balance: 8500, type: 'investment' },
];

const Dashboard = () => {
  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
  const currentMonthIncome = monthlyData[monthlyData.length - 1].income;
  const currentMonthExpenses = monthlyData[monthlyData.length - 1].expenses;
  const currentMonthSavings = monthlyData[monthlyData.length - 1].savings;

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader 
        title="Dashboard" 
        subtitle="Overview of your financial health"
      />
      
      <div className="p-6 space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Balance</CardTitle>
              <PiggyBank className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">${totalBalance.toLocaleString()}</div>
              <p className="text-xs text-green-600 mt-1">
                +2.5% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">This Month Income</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">${currentMonthIncome.toLocaleString()}</div>
              <p className="text-xs text-green-600 mt-1">
                +5.2% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">This Month Expenses</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">${currentMonthExpenses.toLocaleString()}</div>
              <p className="text-xs text-red-600 mt-1">
                +8.1% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Savings This Month</CardTitle>
              <DollarSign className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">${currentMonthSavings.toLocaleString()}</div>
              <p className="text-xs text-blue-600 mt-1">
                {((currentMonthSavings / currentMonthIncome) * 100).toFixed(1)}% savings rate
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Monthly Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="income" fill="#10B981" name="Income" />
                  <Bar dataKey="expenses" fill="#EF4444" name="Expenses" />
                  <Bar dataKey="savings" fill="#3B82F6" name="Savings" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Expense Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Expense Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={expenseBreakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {expenseBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Accounts Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {accounts.map((account) => (
                <div key={account.name} className="p-4 border rounded-lg hover:shadow-sm transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{account.name}</p>
                      <p className="text-sm text-gray-500 capitalize">{account.type}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">${account.balance.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
