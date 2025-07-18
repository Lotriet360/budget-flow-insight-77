import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, TrendingDown, Calendar, Edit2, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface ExpenseItem {
  id: string;
  category: string;
  amount: number;
  planned: number;
  description: string;
  date: string;
  account: string;
}

const Expenses = () => {
  const [expenseItems, setExpenseItems] = useState<ExpenseItem[]>([
    {
      id: '1',
      category: 'Housing',
      amount: 1200,
      planned: 1200,
      description: 'Rent payment',
      date: '2024-01-01',
      account: ""
    },
    {
      id: '2',
      category: 'Food',
      amount: 650,
      planned: 500,
      description: 'Groceries and dining',
      date: '2024-01-05',
      account: ""
    }
  ]);

  const [editingItem, setEditingItem] = useState<ExpenseItem | null>(null);
  const [newItem, setNewItem] = useState({
    category: '',
    amount: '',
    planned: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    account: '' // ✅ Add this
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [selectedAccount, setSelectedAccount] = useState<string>('all');

  const expenseCategories = ['Housing', 'Food', 'Transportation', 'Entertainment', 'Utilities', 'Healthcare', 'Shopping', 'Other'];
  const accountOptions = ['FNB Cheque', 'Capitec Savings', 'TymeBank', 'Standard Bank Credit', 'Cash', 'Other'];
  
  const clearFilters = () => {
    setDateFrom(undefined);
    setDateTo(undefined);
    setSelectedAccount('all');
  };

  const hasActiveFilters = dateFrom || dateTo || selectedAccount !== 'all';

  const handleAddItem = () => {
    if (newItem.category && (newItem.amount || newItem.planned)) {
      const item: ExpenseItem = {
        id: Date.now().toString(),
        category: newItem.category,
        amount: parseFloat(newItem.amount) || 0,
        planned: parseFloat(newItem.planned) || 0,
        description: newItem.description,
        date: newItem.date,
        account: newItem.account
      };

      setExpenseItems([...expenseItems, item]);
      setNewItem({
        category: '',
        amount: '',
        planned: '',
        description: '',
        account:'',
        date: new Date().toISOString().split('T')[0]
      });
      setIsDialogOpen(false);
    }
  };

  const handleEditItem = () => {
    if (editingItem && editingItem.category && (editingItem.amount || editingItem.planned)) {
      setExpenseItems(expenseItems.map(item =>
        item.id === editingItem.id ? editingItem : item
      ));
      setEditingItem(null);
      setIsDialogOpen(false);
    }
  };

  const handleDeleteItem = (id: string) => {
    setExpenseItems(expenseItems.filter(item => item.id !== id));
  };

  const openEditDialog = (item: ExpenseItem) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  const openAddDialog = () => {
    setEditingItem(null);
    setNewItem({
      category: '',
      amount: '',
      planned: '',
      description: '',
      account:'',
      date: new Date().toISOString().split('T')[0]
    });
    setIsDialogOpen(true);
  };

  const filteredItems = expenseItems.filter(item => {
    const itemDate = new Date(item.date);
    if (dateFrom && itemDate < dateFrom) return false;
    if (dateTo && itemDate > dateTo) return false;
    if (selectedAccount !== 'all' && item.account !== selectedAccount) return false;
    return true;
  });

  const totalExpenses = filteredItems.reduce((sum, item) => sum + item.amount, 0);
  const plannedExpenses = filteredItems.reduce((sum, item) => sum + item.planned, 0);

  const isEditing = !!editingItem;

    return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/50 to-accent/10">
      <PageHeader title="Expenses" subtitle="Track your planned vs actual expenses" />

      <div className="p-6 space-y-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-card via-card to-muted/20">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold bg-gradient-to-r from-financial-expense to-financial-expense/80 bg-clip-text text-transparent">Total Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-financial-expense">${totalExpenses.toLocaleString()}</div>
              <p className="text-sm text-muted-foreground mt-2">This period</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-card via-card to-primary/10">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">Planned Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-primary">${plannedExpenses.toLocaleString()}</div>
              <p className="text-sm text-muted-foreground mt-2">Budgeted</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-card via-card to-financial-income/10">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-foreground">Variance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-4xl font-bold ${totalExpenses <= plannedExpenses ? 'text-financial-income' : 'text-financial-expense'}`}>
                ${(plannedExpenses - totalExpenses).toLocaleString()}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {totalExpenses <= plannedExpenses ? 'Under budget' : 'Over budget'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Add Button */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex gap-2 items-center flex-wrap">
            <Select value={selectedAccount} onValueChange={setSelectedAccount}>
              <SelectTrigger className="w-[200px] border-0 shadow-sm">
                <SelectValue placeholder="All Accounts" />
              </SelectTrigger>
              <SelectContent className="z-50 bg-popover border border-border shadow-xl">
                <SelectItem value="all">All Accounts</SelectItem>
                {accountOptions.map(account => (
                  <SelectItem key={account} value={account}>{account}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-[240px] justify-start text-left font-normal border-0 shadow-sm", !dateFrom && "text-muted-foreground")}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {dateFrom ? format(dateFrom, "PPP") : <span>From date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 z-50 bg-popover border border-border shadow-xl" align="start">
                <CalendarComponent mode="single" selected={dateFrom} onSelect={setDateFrom} initialFocus className="p-3 pointer-events-auto" />
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-[240px] justify-start text-left font-normal border-0 shadow-sm", !dateTo && "text-muted-foreground")}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {dateTo ? format(dateTo, "PPP") : <span>To date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 z-50 bg-popover border border-border shadow-xl" align="start">
                <CalendarComponent mode="single" selected={dateTo} onSelect={setDateTo} initialFocus className="p-3 pointer-events-auto" />
              </PopoverContent>
            </Popover>

            {hasActiveFilters && (
              <Button variant="outline" size="sm" onClick={clearFilters} className="border-0 shadow-sm">
                <X className="w-4 h-4 mr-2" />
                Clear
              </Button>
            )}
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openAddDialog} className="bg-primary hover:bg-primary/90 shadow-sm">
                <Plus className="w-4 h-4 mr-2" /> Add Expense
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{isEditing ? 'Edit Expense' : 'Add New Expense'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={isEditing ? editingItem?.category : newItem.category}
                    onValueChange={(value) =>
                      isEditing
                        ? setEditingItem(prev => prev ? { ...prev, category: value } : null)
                        : setNewItem({ ...newItem, category: value })
                    }
                  >
                    <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                    <SelectContent>
                      {expenseCategories.map(cat => (
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
                      value={isEditing ? editingItem?.planned : newItem.planned}
                      onChange={(e) =>
                        isEditing
                          ? setEditingItem(prev => prev ? { ...prev, planned: parseFloat(e.target.value) || 0 } : null)
                          : setNewItem({ ...newItem, planned: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="account">Account</Label>
                    <Select
                      value={isEditing ? editingItem?.account : newItem.account}
                      onValueChange={(value) =>
                        isEditing
                          ? setEditingItem(prev => prev ? { ...prev, account: value } : null)
                          : setNewItem({ ...newItem, account: value })
                      }
                    >
                      <SelectTrigger><SelectValue placeholder="Select account" /></SelectTrigger>
                      <SelectContent className="z-50 bg-popover border border-border shadow-xl">
                        {['FNB Cheque', 'Capitec Savings', 'TymeBank', 'Standard Bank Credit', 'Cash', 'Other'].map(account => (
                          <SelectItem key={account} value={account}>{account}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
</div>
                  <div>
                    <Label htmlFor="amount">Actual Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="0.00"
                      value={isEditing ? editingItem?.amount : newItem.amount}
                      onChange={(e) =>
                        isEditing
                          ? setEditingItem(prev => prev ? { ...prev, amount: parseFloat(e.target.value) || 0 } : null)
                          : setNewItem({ ...newItem, amount: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    placeholder="Expense description"
                    value={isEditing ? editingItem?.description : newItem.description}
                    onChange={(e) =>
                      isEditing
                        ? setEditingItem(prev => prev ? { ...prev, description: e.target.value } : null)
                        : setNewItem({ ...newItem, description: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={isEditing ? editingItem?.date : newItem.date}
                    onChange={(e) =>
                      isEditing
                        ? setEditingItem(prev => prev ? { ...prev, date: e.target.value } : null)
                        : setNewItem({ ...newItem, date: e.target.value })
                    }
                  />
                </div>

                <Button onClick={isEditing ? handleEditItem : handleAddItem} className="w-full">
                  {isEditing ? 'Update Expense' : 'Add Expense'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Expense Table */}
        <Card className="border-0 shadow-xl bg-gradient-to-br from-card via-card to-muted/20 backdrop-blur-sm">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <TrendingDown className="w-6 h-6 text-financial-expense" />
              <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">Expense Items</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border">
                <thead>
                  <tr className="bg-muted/20">
                    <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Category</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Account</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Description</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Date</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-muted-foreground uppercase">Actual</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-muted-foreground uppercase">Planned</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-muted-foreground uppercase">Variance</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-muted-foreground uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-border">
                  {filteredItems.map(item => {
                    const variance = item.planned - item.amount;
                    const isUnder = item.amount <= item.planned;
                    return (
                      <tr key={item.id}>
                        <td className="px-4 py-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{item.category}</span>
                            <Badge variant="outline" className="text-financial-expense border-financial-expense/20 bg-financial-expense/10">
                              Expense
                            </Badge>
                          </div>
                        </td>
                        <td className="px-4 py-2 text-sm text-muted-foreground">{item.account}</td>
                        <td className="px-4 py-2 text-sm text-muted-foreground">{item.description}</td>
                        <td className="px-4 py-2 text-sm text-muted-foreground">{new Date(item.date).toLocaleDateString()}</td>
                        <td className="px-4 py-2 text-right font-bold text-financial-expense">${item.amount.toLocaleString()}</td>
                        <td className="px-4 py-2 text-right font-medium text-primary">${item.planned.toLocaleString()}</td>
                        <td className={`px-4 py-2 text-right text-sm ${isUnder ? 'text-financial-income' : 'text-financial-expense'}`}>
                          {isUnder ? 'Under' : 'Over'} ${Math.abs(variance).toLocaleString()}
                        </td>
                        <td className="px-4 py-2 text-center space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => openEditDialog(item)} className="text-primary hover:text-primary/80">
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteItem(item.id)} className="text-financial-expense hover:text-financial-expense/80">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Expenses;
