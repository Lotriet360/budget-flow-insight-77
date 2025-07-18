
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  CreditCard,
  PiggyBank,
  AlertCircle,
  Target,
  Calendar,
  Moon,
  Sun,
  Bell,
  Wallet,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  AlertTriangle
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  AreaChart,
  Area,
  ComposedChart
} from 'recharts';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

// Sample Data
const monthlyData = [
  { month: 'Jul', income: 5200, expenses: 4100, savings: 1100, netWorth: 45000 },
  { month: 'Aug', income: 5400, expenses: 4300, savings: 1100, netWorth: 46100 },
  { month: 'Sep', income: 5100, expenses: 4200, savings: 900, netWorth: 47000 },
  { month: 'Oct', income: 5600, expenses: 4400, savings: 1200, netWorth: 48200 },
  { month: 'Nov', income: 5800, expenses: 4600, savings: 1200, netWorth: 49400 },
  { month: 'Dec', income: 6000, expenses: 4800, savings: 1200, netWorth: 50600 },
];

const incomeBreakdown = [
  { source: 'Salary', amount: 4800, color: '#3B82F6', recurring: true },
  { source: 'Freelance', amount: 800, color: '#10B981', recurring: false },
  { source: 'Dividends', amount: 300, color: '#F59E0B', recurring: true },
  { source: 'Other', amount: 100, color: '#8B5CF6', recurring: false },
];

const expenseCategories = [
  { name: 'Housing', amount: 1800, budget: 2000, color: '#3B82F6' },
  { name: 'Food & Dining', amount: 650, budget: 700, color: '#10B981' },
  { name: 'Transportation', amount: 420, budget: 500, color: '#F59E0B' },
  { name: 'Entertainment', amount: 280, budget: 250, color: '#EF4444' },
  { name: 'Utilities', amount: 180, budget: 200, color: '#8B5CF6' },
  { name: 'Shopping', amount: 340, budget: 300, color: '#EC4899' },
  { name: 'Healthcare', amount: 120, budget: 150, color: '#06B6D4' },
  { name: 'Other', amount: 210, budget: 200, color: '#6B7280' },
];

const savingsGoals = [
  { name: 'Emergency Fund', current: 12000, target: 15000, color: '#3B82F6' },
  { name: 'Vacation', current: 3200, target: 5000, color: '#10B981' },
  { name: 'New Car', current: 8500, target: 25000, color: '#F59E0B' },
  { name: 'House Down Payment', current: 45000, target: 80000, color: '#8B5CF6' },
];

const investments = [
  { type: 'Stocks', value: 28500, allocation: 60, growth: 12.4 },
  { type: 'Bonds', value: 9500, allocation: 20, growth: 4.2 },
  { type: 'Real Estate', value: 7125, allocation: 15, growth: 8.1 },
  { type: 'Crypto', value: 2375, allocation: 5, growth: -15.2 },
];

const debts = [
  { name: 'Credit Card', balance: 2400, total: 5000, minPayment: 120, dueDate: '2024-01-15', rate: 18.9 },
  { name: 'Student Loan', balance: 15600, total: 25000, minPayment: 280, dueDate: '2024-01-08', rate: 4.5 },
  { name: 'Car Loan', balance: 8200, total: 20000, minPayment: 385, dueDate: '2024-01-20', rate: 3.2 },
];

const cashFlowData = [
  { date: 'Week 1', income: 1500, expenses: 1200, net: 300 },
  { date: 'Week 2', income: 1500, expenses: 1400, net: 100 },
  { date: 'Week 3', income: 1500, expenses: 1100, net: 400 },
  { date: 'Week 4', income: 1500, expenses: 1300, net: 200 },
];

const upcomingBills = [
  { name: 'Rent', amount: 1800, date: '2024-01-01', category: 'Housing' },
  { name: 'Credit Card Payment', amount: 120, date: '2024-01-15', category: 'Debt' },
  { name: 'Internet', amount: 80, date: '2024-01-10', category: 'Utilities' },
  { name: 'Car Insurance', amount: 150, date: '2024-01-20', category: 'Insurance' },
];

const Dashboard = () => {
  const [dateFilter, setDateFilter] = useState("thisMonth");
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Calculations
  const currentMonth = monthlyData[monthlyData.length - 1];
  const previousMonth = monthlyData[monthlyData.length - 2];
  const netWorth = currentMonth.netWorth;
  const netWorthChange = ((currentMonth.netWorth - previousMonth.netWorth) / previousMonth.netWorth * 100);
  const savingsRate = (currentMonth.savings / currentMonth.income * 100);
  const totalInvestments = investments.reduce((sum, inv) => sum + inv.value, 0);
  const totalDebt = debts.reduce((sum, debt) => sum + debt.balance, 0);
  const cashFlow = currentMonth.income - currentMonth.expenses;

  // Alerts
  const alerts = [
    ...(expenseCategories.filter(cat => cat.amount > cat.budget).map(cat => ({
      type: 'warning',
      message: `Over budget in ${cat.name}: $${cat.amount - cat.budget} over limit`,
    }))),
    ...debts.filter(debt => new Date(debt.dueDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)).map(debt => ({
      type: 'info',
      message: `${debt.name} payment due ${debt.dueDate}`,
    })),
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-background">
      <PageHeader 
        title="Financial Dashboard" 
        subtitle="Complete overview of your financial health"
      />
      
      <div className="p-4 space-y-6">
        {/* Header Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-center gap-3">
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="thisMonth">This Month</SelectItem>
                <SelectItem value="last3Months">Last 3 Months</SelectItem>
                <SelectItem value="last6Months">Last 6 Months</SelectItem>
                <SelectItem value="thisYear">This Year</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Filter className="h-3 w-3 mr-1" />
              Filters
            </Button>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsDarkMode(!isDarkMode)}
          >
            {isDarkMode ? <Sun className="h-3 w-3" /> : <Moon className="h-3 w-3" />}
          </Button>
        </div>

        {/* 1. Overview / Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Net Worth - Large Card */}
          <Card className="lg:col-span-2 border-0 shadow-lg bg-gradient-to-br from-primary/20 to-primary/5 hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-muted-foreground flex items-center gap-2">
                <Wallet className="h-4 w-4" />
                Net Worth
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="text-3xl font-bold text-primary">
                  ${netWorth.toLocaleString()}
                </div>
                <div className="flex items-center gap-2">
                  {netWorthChange > 0 ? (
                    <ArrowUpRight className="h-3 w-3 text-green-500" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 text-red-500" />
                  )}
                  <span className={`text-xs ${netWorthChange > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {Math.abs(netWorthChange).toFixed(1)}% vs last month
                  </span>
                </div>
                <Progress value={75} className="h-1.5" />
                <p className="text-xs text-muted-foreground">75% of annual goal</p>
              </div>
            </CardContent>
          </Card>

          {/* Income */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500/20 to-green-500/5 hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-muted-foreground">Total Income</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-xl font-bold text-green-600">${currentMonth.income.toLocaleString()}</div>
              <div className="flex items-center gap-1 mt-1">
                <ArrowUpRight className="h-3 w-3 text-green-500" />
                <span className="text-xs text-green-500">+5.2%</span>
              </div>
            </CardContent>
          </Card>

          {/* Expenses */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-red-500/20 to-red-500/5 hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-muted-foreground">Total Expenses</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-xl font-bold text-red-600">${currentMonth.expenses.toLocaleString()}</div>
              <div className="flex items-center gap-1 mt-1">
                <ArrowUpRight className="h-3 w-3 text-red-500" />
                <span className="text-xs text-red-500">+3.1%</span>
              </div>
            </CardContent>
          </Card>

          {/* Savings Rate */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500/20 to-blue-500/5 hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-muted-foreground">Savings Rate</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-xl font-bold text-blue-600">{savingsRate.toFixed(1)}%</div>
              <div className="flex items-center gap-1 mt-1">
                <ArrowUpRight className="h-3 w-3 text-green-500" />
                <span className="text-xs text-green-500">+2.3%</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 2. Income & 3. Expense Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Income Breakdown */}
          <Card className="border-0 shadow-lg bg-card/80 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <BarChart3 className="h-4 w-4" />
                Income Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {incomeBreakdown.map((source) => (
                  <div key={source.source} className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: source.color }}
                      />
                      <span className="font-medium text-sm">{source.source}</span>
                      {source.recurring && <Badge variant="secondary" className="text-xs h-4">Recurring</Badge>}
                    </div>
                    <span className="font-semibold text-sm">${source.amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <ResponsiveContainer width="100%" height={160}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                    <Tooltip />
                    <Line type="monotone" dataKey="income" stroke="#10B981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Expense Breakdown */}
          <Card className="border-0 shadow-lg bg-card/80 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <PieChartIcon className="h-4 w-4" />
                Expense Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={expenseCategories}
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="amount"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    fontSize={10}
                  >
                    {expenseCategories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              
              {/* Top 5 Categories */}
              <div className="mt-3 space-y-1">
                <h4 className="font-medium text-xs text-muted-foreground">Top Spending Categories</h4>
                {expenseCategories.slice(0, 5).map((category) => (
                  <div key={category.name} className="flex items-center justify-between text-xs">
                    <span>{category.name}</span>
                    <span className="font-semibold">${category.amount}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 4. Budget Tracker */}
        <Card className="border-0 shadow-lg bg-card/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Target className="h-4 w-4" />
              Budget Tracker
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {expenseCategories.map((category) => {
                const percentage = (category.amount / category.budget) * 100;
                const isOverBudget = percentage > 100;
                
                return (
                  <div key={category.name} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-xs">{category.name}</span>
                      {isOverBudget && <AlertTriangle className="h-3 w-3 text-red-500" />}
                    </div>
                    <Progress 
                      value={Math.min(percentage, 100)} 
                      className="h-1.5"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>${category.amount}</span>
                      <span>${category.budget}</span>
                    </div>
                    <div className={`text-xs font-medium ${isOverBudget ? 'text-red-500' : 'text-green-500'}`}>
                      {isOverBudget ? `${(percentage - 100).toFixed(1)}% over` : `${(100 - percentage).toFixed(1)}% remaining`}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* 5. Savings & Goals + 6. Investments */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Savings Goals */}
          <Card className="border-0 shadow-lg bg-card/80 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <PiggyBank className="h-4 w-4" />
                Savings Goals
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 gap-4">
                {savingsGoals.map((goal) => {
                  const percentage = (goal.current / goal.target) * 100;
                  
                  return (
                    <div key={goal.name} className="text-center space-y-2">
                      <div className="w-16 h-16 mx-auto">
                        <CircularProgressbar
                          value={percentage}
                          text={`${percentage.toFixed(0)}%`}
                          styles={buildStyles({
                            pathColor: goal.color,
                            textColor: goal.color,
                            trailColor: '#f3f4f6',
                          })}
                        />
                      </div>
                      <div>
                        <p className="font-medium text-xs">{goal.name}</p>
                        <p className="text-xs text-muted-foreground">
                          ${goal.current.toLocaleString()} / ${goal.target.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Savings Trend */}
              <div className="mt-4">
                <h4 className="font-medium text-xs mb-2">Savings Trend</h4>
                <ResponsiveContainer width="100%" height={120}>
                  <AreaChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" fontSize={10} />
                    <YAxis fontSize={10} />
                    <Tooltip />
                    <Area type="monotone" dataKey="savings" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Investments */}
          <Card className="border-0 shadow-lg bg-card/80 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <LineChartIcon className="h-4 w-4" />
                Investment Portfolio
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="text-center">
                  <div className="text-2xl font-bold">${totalInvestments.toLocaleString()}</div>
                  <div className="text-xs text-green-500 flex items-center justify-center gap-1">
                    <ArrowUpRight className="h-3 w-3" />
                    +8.2% YTD
                  </div>
                </div>
                
                {/* Asset Allocation */}
                <div className="space-y-2">
                  <h4 className="font-medium text-xs">Asset Allocation</h4>
                  {investments.map((investment) => (
                    <div key={investment.type} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>{investment.type}</span>
                        <span className="font-medium">{investment.allocation}%</span>
                      </div>
                      <Progress value={investment.allocation} className="h-1.5" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>${investment.value.toLocaleString()}</span>
                        <span className={investment.growth > 0 ? 'text-green-500' : 'text-red-500'}>
                          {investment.growth > 0 ? '+' : ''}{investment.growth}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 7. Debt Overview + 8. Cash Flow */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Debt Overview */}
          <Card className="border-0 shadow-lg bg-card/80 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <CreditCard className="h-4 w-4" />
                Debt Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="text-center">
                  <div className="text-xl font-bold text-red-600">${totalDebt.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">Total Outstanding Debt</div>
                </div>
                
                {debts.map((debt) => {
                  const progress = ((debt.total - debt.balance) / debt.total) * 100;
                  
                  return (
                    <div key={debt.name} className="space-y-2 p-3 border rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-sm">{debt.name}</span>
                        <Badge variant="outline" className="text-xs h-4">{debt.rate}% APR</Badge>
                      </div>
                      <Progress value={progress} className="h-1.5" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Paid: ${(debt.total - debt.balance).toLocaleString()}</span>
                        <span>Remaining: ${debt.balance.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>Min Payment: ${debt.minPayment}</span>
                        <span>Due: {debt.dueDate}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Cash Flow Forecast */}
          <Card className="border-0 shadow-lg bg-card/80 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4" />
                Cash Flow & Upcoming Bills
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                {/* Cash Flow Chart */}
                <ResponsiveContainer width="100%" height={160}>
                  <ComposedChart data={cashFlowData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" fontSize={10} />
                    <YAxis fontSize={10} />
                    <Tooltip />
                    <Bar dataKey="income" fill="#10B981" />
                    <Bar dataKey="expenses" fill="#EF4444" />
                    <Line type="monotone" dataKey="net" stroke="#3B82F6" strokeWidth={2} />
                  </ComposedChart>
                </ResponsiveContainer>
                
                {/* Upcoming Bills */}
                <div>
                  <h4 className="font-medium text-xs mb-2">Upcoming Bills</h4>
                  <div className="space-y-1">
                    {upcomingBills.map((bill, index) => (
                      <div key={index} className="flex justify-between items-center p-2 rounded bg-muted/30">
                        <div>
                          <span className="font-medium text-xs">{bill.name}</span>
                          <p className="text-xs text-muted-foreground">{bill.date}</p>
                        </div>
                        <span className="font-semibold text-xs">${bill.amount}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
