
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit2, Trash2, TrendingUp, TrendingDown } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  planned: number;
  description: string;
  date: string;
}

const IncomeExpense = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      type: 'income',
      category: 'Salary',
      amount: 4200,
      planned: 4000,
      description: 'Monthly salary',
      date: '2024-01-01'
    },
    {
      id: '2',
      type: 'expense',
      category: 'Housing',
      amount: 1200,
      planned: 1200,
      description: 'Rent payment',
      date: '2024-01-01'
    },
    {
      id: '3',
      type: 'expense',
      category: 'Food',
      amount: 650,
      planned: 500,
      description: 'Groceries and dining',
      date: '2024-01-05'
    },
    {
      id: '4',
      type: 'income',
      category: 'Freelance',
      amount: 800,
      planned: 600,
      description: 'Freelance project',
      date: '2024-01-10'
    }
  ]);

  const [newTransaction, setNewTransaction] = useState({
    type: 'income' as 'income' | 'expense',
    category: '',
    amount: '',
    planned: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const incomeCategories = ['Salary', 'Freelance', 'Investment', 'Other'];
  const expenseCategories = ['Housing', 'Food', 'Transportation', 'Entertainment', 'Utilities', 'Healthcare', 'Other'];

  const handleAddTransaction = () => {
    if (newTransaction.category && newTransaction.amount && newTransaction.planned) {
      const transaction: Transaction = {
        id: Date.now().toString(),
        type: newTransaction.type,
        category: newTransaction.category,
        amount: parseFloat(newTransaction.amount),
        planned: parseFloat(newTransaction.planned),
        description: newTransaction.description,
        date: newTransaction.date
      };
      
      setTransactions([...transactions, transaction]);
      setNewTransaction({
        type: 'income',
        category: '',
        amount: '',
        planned: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
      });
      setIsDialogOpen(false);
    }
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const incomeTransactions = transactions.filter(t => t.type === 'income');
  const expenseTransactions = transactions.filter(t => t.type === 'expense');

  const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);
  const plannedIncome = incomeTransactions.reduce((sum, t) => sum + t.planned, 0);
  const plannedExpenses = expenseTransactions.reduce((sum, t) => sum + t.planned, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader 
        title="Income & Expenses" 
        subtitle="Track your planned vs actual income and expenses"
      />
      
      <div className="p-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Income</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">${totalIncome.toLocaleString()}</div>
              <p className="text-xs text-gray-500 mt-1">
                Planned: ${plannedIncome.toLocaleString()}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">${totalExpenses.toLocaleString()}</div>
              <p className="text-xs text-gray-500 mt-1">
                Planned: ${plannedExpenses.toLocaleString()}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Net Income</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${totalIncome - totalExpenses >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${(totalIncome - totalExpenses).toLocaleString()}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Planned: ${(plannedIncome - plannedExpenses).toLocaleString()}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Variance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${(totalIncome - totalExpenses) - (plannedIncome - plannedExpenses) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${((totalIncome - totalExpenses) - (plannedIncome - plannedExpenses)).toLocaleString()}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Actual vs Planned
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Add Transaction Button */}
        <div className="flex justify-end">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Transaction
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Transaction</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select value={newTransaction.type} onValueChange={(value: 'income' | 'expense') => setNewTransaction({...newTransaction, type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="income">Income</SelectItem>
                      <SelectItem value="expense">Expense</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={newTransaction.category} onValueChange={(value) => setNewTransaction({...newTransaction, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {(newTransaction.type === 'income' ? incomeCategories : expenseCategories).map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="planned">Planned Amount</Label>
                    <Input
                      id="planned"
                      type="number"
                      placeholder="0.00"
                      value={newTransaction.planned}
                      onChange={(e) => setNewTransaction({...newTransaction, planned: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="amount">Actual Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="0.00"
                      value={newTransaction.amount}
                      onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    placeholder="Transaction description"
                    value={newTransaction.description}
                    onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newTransaction.date}
                    onChange={(e) => setNewTransaction({...newTransaction, date: e.target.value})}
                  />
                </div>

                <Button onClick={handleAddTransaction} className="w-full">
                  Add Transaction
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Transactions */}
        <Tabs defaultValue="income" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="income">Income</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
          </TabsList>

          <TabsContent value="income" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  Income Transactions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {incomeTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg hover:shadow-sm transition-shadow">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{transaction.category}</h3>
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            Income
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{transaction.description}</p>
                        <p className="text-xs text-gray-500">{new Date(transaction.date).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">${transaction.amount.toLocaleString()}</p>
                        <p className="text-sm text-gray-500">Planned: ${transaction.planned.toLocaleString()}</p>
                        <p className={`text-xs ${transaction.amount >= transaction.planned ? 'text-green-600' : 'text-red-600'}`}>
                          {transaction.amount >= transaction.planned ? '+' : ''}${(transaction.amount - transaction.planned).toLocaleString()}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteTransaction(transaction.id)}
                        className="ml-2 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="expenses" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingDown className="w-5 h-5 text-red-600" />
                  Expense Transactions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {expenseTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg hover:shadow-sm transition-shadow">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{transaction.category}</h3>
                          <Badge variant="outline" className="text-red-600 border-red-600">
                            Expense
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{transaction.description}</p>
                        <p className="text-xs text-gray-500">{new Date(transaction.date).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-red-600">${transaction.amount.toLocaleString()}</p>
                        <p className="text-sm text-gray-500">Planned: ${transaction.planned.toLocaleString()}</p>
                        <p className={`text-xs ${transaction.amount <= transaction.planned ? 'text-green-600' : 'text-red-600'}`}>
                          {transaction.amount <= transaction.planned ? 'Under' : 'Over'} by ${Math.abs(transaction.amount - transaction.planned).toLocaleString()}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteTransaction(transaction.id)}
                        className="ml-2 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default IncomeExpense;
