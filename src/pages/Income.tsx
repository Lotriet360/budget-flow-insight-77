import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, TrendingUp, Calendar, Edit2, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface IncomeItem {
  id: string;
  category: string;
  amount: number;
  account: string; // ✅ new
  planned: number;
  description: string;
  date: string;
}

const Income = () => {
  const [incomeItems, setIncomeItems] = useState<IncomeItem[]>([
    {
      id: '1',
      category: 'Salary',
      amount: 4200,
      planned: 4000,
      description: 'Monthly salary',
      date: '2024-01-01',
      account: ""
    },
    {
      id: '2',
      category: 'Freelance',
      amount: 800,
      planned: 600,
      description: 'Freelance project',
      date: '2024-01-10',
      account: ""
    }
  ]);

  const [editingItem, setEditingItem] = useState<IncomeItem | null>(null);
  const [newItem, setNewItem] = useState({
    category: '',
    amount: '',
    account: '',
    planned: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [selectedAccount, setSelectedAccount] = useState<string>('all');

  const incomeCategories = ['Salary', 'Freelance', 'Investment', 'Business', 'Other'];
  const accountOptions = ['FNB Cheque', 'Capitec Savings', 'TymeBank', 'Cash', 'Other'];

  const clearFilters = () => {
    setDateFrom(undefined);
    setDateTo(undefined);
    setSelectedAccount('all');
  };

  const hasActiveFilters = dateFrom || dateTo || selectedAccount !== 'all';

  const handleAddItem = () => {
    if (newItem.category && (newItem.amount || newItem.planned)) {
      const item: IncomeItem = {
        id: Date.now().toString(),
        category: newItem.category,
        amount: parseFloat(newItem.amount) || 0,
        planned: parseFloat(newItem.planned) || 0,
        description: newItem.description,
        date: newItem.date,
        account: newItem.account,
        
      };

      setIncomeItems([...incomeItems, item]);
      setNewItem({
        category: '',
        amount: '',
        account: '',
        planned: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
      });
      setIsDialogOpen(false);
    }
  };

  const handleEditItem = () => {
    if (editingItem && editingItem.category && (editingItem.amount || editingItem.planned)) {
      setIncomeItems(incomeItems.map(item =>
        item.id === editingItem.id ? editingItem : item
      ));
      setEditingItem(null);
      setIsDialogOpen(false);
    }
  };

  const handleDeleteItem = (id: string) => {
    setIncomeItems(incomeItems.filter(item => item.id !== id));
  };

  const openEditDialog = (item: IncomeItem) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  const openAddDialog = () => {
    setEditingItem(null);
    setNewItem({
      category: '',
      amount: '',
      account: '',
      planned: '',
      description: '',
      date: new Date().toISOString().split('T')[0]
    });
    setIsDialogOpen(true);
  };

  const filteredItems = incomeItems.filter(item => {
    const itemDate = new Date(item.date);
    if (dateFrom && itemDate < dateFrom) return false;
    if (dateTo && itemDate > dateTo) return false;
    if (selectedAccount !== 'all' && item.account !== selectedAccount) return false;
    return true;
  });

  const totalIncome = filteredItems.reduce((sum, item) => sum + item.amount, 0);
  const plannedIncome = filteredItems.reduce((sum, item) => sum + item.planned, 0);

  const isEditing = !!editingItem;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/50 to-financial-income/10">
      <PageHeader
        title="Income"
        subtitle="Track your planned vs actual income"
      />

      <div className="p-6 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-card via-card to-financial-income/10">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold bg-gradient-to-r from-financial-income to-financial-income/80 bg-clip-text text-transparent">Total Income</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-financial-income">${totalIncome.toLocaleString()}</div>
              <p className="text-sm text-muted-foreground mt-2">This period</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-card via-card to-primary/10">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">Planned Income</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-primary">${plannedIncome.toLocaleString()}</div>
              <p className="text-sm text-muted-foreground mt-2">Expected</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-card via-card to-accent/10">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-foreground">Variance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-4xl font-bold ${totalIncome - plannedIncome >= 0 ? 'text-financial-income' : 'text-financial-expense'}`}>
                ${(totalIncome - plannedIncome).toLocaleString()}
              </div>
              <p className="text-sm text-muted-foreground mt-2">Actual vs Planned</p>
            </CardContent>
          </Card>
        </div>

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
                  className={cn(
                    "w-[240px] justify-start text-left font-normal border-0 shadow-sm",
                    !dateFrom && "text-muted-foreground"
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {dateFrom ? format(dateFrom, "PPP") : <span>From date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 z-50 bg-popover border border-border shadow-xl" align="start">
                <CalendarComponent
                  mode="single"
                  selected={dateFrom}
                  onSelect={setDateFrom}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-[240px] justify-start text-left font-normal border-0 shadow-sm",
                    !dateTo && "text-muted-foreground"
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {dateTo ? format(dateTo, "PPP") : <span>To date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 z-50 bg-popover border border-border shadow-xl" align="start">
                <CalendarComponent
                  mode="single"
                  selected={dateTo}
                  onSelect={setDateTo}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>

            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="border-0 shadow-sm"
              >
                <X className="w-4 h-4 mr-2" />
                Clear
              </Button>
            )}
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openAddDialog} className="bg-primary hover:bg-primary/90 shadow-sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Income
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{isEditing ? 'Edit Income' : 'Add New Income'}</DialogTitle>
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
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {incomeCategories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                    <SelectTrigger>
                      <SelectValue placeholder="Select account" />
                    </SelectTrigger>
                    <SelectContent className="z-50 bg-popover border border-border shadow-xl">
                      {accountOptions.map(account => (
                        <SelectItem key={account} value={account}>{account}</SelectItem>
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
                    placeholder="Income description"
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

                <Button
                  onClick={isEditing ? handleEditItem : handleAddItem}
                  className="w-full"
                >
                  {isEditing ? 'Update Income' : 'Add Income'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="border-0 shadow-xl bg-gradient-to-br from-card via-card to-financial-income/10 backdrop-blur-sm">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <TrendingUp className="w-6 h-6 text-financial-income" />
              <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">Income Items</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto p-0">
            <table className="min-w-full text-sm">
              <thead className="bg-muted border-b text-muted-foreground text-left">
                <tr>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Account</th>
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3 text-right">Planned</th>
                  <th className="px-4 py-3 text-right">Actual</th>
                  <th className="px-4 py-3 text-right">Variance</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => {
                  const variance = item.amount - item.planned;
                  const varianceClass = variance >= 0 ? 'text-financial-income' : 'text-financial-expense';

                  return (
                    <tr key={item.id} className="border-b hover:bg-muted/20 transition-all">
                      <td className="px-4 py-3 font-medium">
                        <div className="flex items-center gap-2">
                          {item.category}
                          <Badge variant="outline" className="text-financial-income border-financial-income/20 bg-financial-income/10">
                            Income
                          </Badge>
                        </div>
                      </td>
                      <td className="px-4 py-3">{item.account}</td>
                      <td className="px-4 py-3">{item.description}</td>
                      <td className="px-4 py-3">{new Date(item.date).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-right">${item.planned.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right">${item.amount.toLocaleString()}</td>
                      <td className={`px-4 py-3 text-right font-medium ${varianceClass}`}>
                        {variance >= 0 ? '+' : ''}${variance.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditDialog(item)}
                            className="text-primary hover:text-primary/80"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteItem(item.id)}
                            className="text-financial-expense hover:text-financial-expense/80"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {filteredItems.length === 0 && (
              <div className="p-6 text-center text-sm text-muted-foreground">
                No income items found for the selected period.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Income;
