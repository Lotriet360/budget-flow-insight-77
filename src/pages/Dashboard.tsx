
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
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <PageHeader 
        title="Dashboard" 
        subtitle="Overview of your financial health"
      />
      
      <div className="p-8 space-y-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-xl bg-gradient-to-br from-financial-savings/10 to-financial-savings/5 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Balance</CardTitle>
              <div className="p-2 rounded-full bg-financial-savings/20">
                <PiggyBank className="h-5 w-5 text-financial-savings" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-financial-savings to-financial-savings/80 bg-clip-text text-transparent">
                ${totalBalance.toLocaleString()}
              </div>
              <p className="text-xs text-financial-savings font-medium mt-1">
                +2.5% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-gradient-to-br from-financial-income/10 to-financial-income/5 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">This Month Income</CardTitle>
              <div className="p-2 rounded-full bg-financial-income/20">
                <TrendingUp className="h-5 w-5 text-financial-income" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-financial-income">${currentMonthIncome.toLocaleString()}</div>
              <p className="text-xs text-financial-income font-medium mt-1">
                +5.2% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-gradient-to-br from-financial-expense/10 to-financial-expense/5 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">This Month Expenses</CardTitle>
              <div className="p-2 rounded-full bg-financial-expense/20">
                <TrendingDown className="h-5 w-5 text-financial-expense" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-financial-expense">${currentMonthExpenses.toLocaleString()}</div>
              <p className="text-xs text-financial-expense font-medium mt-1">
                +8.1% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-gradient-to-br from-primary/10 to-primary/5 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Savings This Month</CardTitle>
              <div className="p-2 rounded-full bg-primary/20">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">${currentMonthSavings.toLocaleString()}</div>
              <p className="text-xs text-primary font-medium mt-1">
                {((currentMonthSavings / currentMonthIncome) * 100).toFixed(1)}% savings rate
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Monthly Overview */}
          <Card className="border-0 shadow-xl bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">Monthly Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }} 
                  />
                  <Bar dataKey="income" fill="hsl(var(--income))" name="Income" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expenses" fill="hsl(var(--expense))" name="Expenses" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="savings" fill="hsl(var(--savings))" name="Savings" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Expense Breakdown */}
          <Card className="border-0 shadow-xl bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">Expense Breakdown</CardTitle>
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
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Accounts Overview */}
        <Card className="border-0 shadow-xl bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {accounts.map((account) => (
                <div key={account.name} className="p-6 border rounded-xl hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-muted/30 to-muted/10 transform hover:scale-105">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-foreground text-lg">{account.name}</p>
                      <p className="text-sm text-muted-foreground capitalize">{account.type}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                        ${account.balance.toLocaleString()}
                      </p>
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
