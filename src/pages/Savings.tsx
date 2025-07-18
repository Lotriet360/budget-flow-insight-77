import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, PiggyBank, Calendar, Edit2, X, Target } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface SavingsItem {
  id: string;
  category: string;
  amount: number;
  target: number;
  description: string;
  date: string;
  account: string;
}

interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  description: string;
}

const Savings = () => {
  const [savingsItems, setSavingsItems] = useState<SavingsItem[]>([
    {
      id: '1',
      category: 'Emergency Fund',
      amount: 5000,
      target: 10000,
      description: 'Emergency fund savings',
      date: '2024-01-01',
      account: 'FNB Savings'
    },
    {
      id: '2',
      category: 'Vacation',
      amount: 1500,
      target: 4000,
      description: 'Summer vacation fund',
      date: '2024-01-15',
      account: 'Capitec Goal Save'
    }
  ]);

  const [goals, setGoals] = useState<Goal[]>([
    {
      id: '1',
      name: 'House Down Payment',
      targetAmount: 50000,
      currentAmount: 15000,
      targetDate: '2025-12-31',
      description: 'Saving for house down payment'
    },
    {
      id: '2',
      name: 'Vacation Fund',
      targetAmount: 8000,
      currentAmount: 3200,
      targetDate: '2024-08-15',
      description: 'Europe vacation fund'
    }
  ]);

  const [editingItem, setEditingItem] = useState<SavingsItem | null>(null);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [newItem, setNewItem] = useState({
    category: '',
    amount: '',
    target: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    account: ''
  });

  const [newGoal, setNewGoal] = useState({
    name: '',
    targetAmount: '',
    currentAmount: '',
    targetDate: new Date().toISOString().split('T')[0],
    description: ''
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isGoalDialogOpen, setIsGoalDialogOpen] = useState(false);
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [selectedAccount, setSelectedAccount] = useState<string>('all');

  const savingsCategories = ['Emergency Fund', 'Vacation', 'House Down Payment', 'Car', 'Education', 'Wedding', 'Other'];
  const accountOptions = ['FNB Savings', 'Capitec Goal Save', 'TymeBank Savings', 'Standard Bank Savings', 'Other'];

  const clearFilters = () => {
    setDateFrom(undefined);
    setDateTo(undefined);
    setSelectedAccount('all');
  };

  const hasActiveFilters = dateFrom || dateTo || selectedAccount !== 'all';

  const handleAddItem = () => {
    if (newItem.category && newItem.amount && newItem.target) {
      const item: SavingsItem = {
        id: Date.now().toString(),
        category: newItem.category,
        amount: parseFloat(newItem.amount),
        target: parseFloat(newItem.target),
        description: newItem.description,
        date: newItem.date,
        account: newItem.account
      };
      
      setSavingsItems([...savingsItems, item]);
      setNewItem({
        category: '',
        amount: '',
        target: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        account: ''
      });
      setIsDialogOpen(false);
    }
  };

  const handleEditItem = () => {
    if (editingItem && editingItem.category && editingItem.amount && editingItem.target) {
      setSavingsItems(savingsItems.map(item => 
        item.id === editingItem.id ? editingItem : item
      ));
      setEditingItem(null);
      setIsDialogOpen(false);
    }
  };

  const handleDeleteItem = (id: string) => {
    setSavingsItems(savingsItems.filter(item => item.id !== id));
  };

  const handleAddGoal = () => {
    if (newGoal.name && newGoal.targetAmount) {
      const goal: Goal = {
        id: Date.now().toString(),
        name: newGoal.name,
        targetAmount: parseFloat(newGoal.targetAmount),
        currentAmount: parseFloat(newGoal.currentAmount) || 0,
        targetDate: newGoal.targetDate,
        description: newGoal.description
      };
      
      setGoals([...goals, goal]);
      setNewGoal({
        name: '',
        targetAmount: '',
        currentAmount: '',
        targetDate: new Date().toISOString().split('T')[0],
        description: ''
      });
      setIsGoalDialogOpen(false);
    }
  };

  const handleEditGoal = () => {
    if (editingGoal && editingGoal.name && editingGoal.targetAmount) {
      setGoals(goals.map(goal => 
        goal.id === editingGoal.id ? editingGoal : goal
      ));
      setEditingGoal(null);
      setIsGoalDialogOpen(false);
    }
  };

  const handleDeleteGoal = (id: string) => {
    setGoals(goals.filter(goal => goal.id !== id));
  };

  const openEditDialog = (item: SavingsItem) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  const openAddDialog = () => {
    setEditingItem(null);
    setNewItem({
      category: '',
      amount: '',
      target: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      account: ''
    });
    setIsDialogOpen(true);
  };

  const openEditGoalDialog = (goal: Goal) => {
    setEditingGoal(goal);
    setIsGoalDialogOpen(true);
  };

  const openAddGoalDialog = () => {
    setEditingGoal(null);
    setNewGoal({
      name: '',
      targetAmount: '',
      currentAmount: '',
      targetDate: new Date().toISOString().split('T')[0],
      description: ''
    });
    setIsGoalDialogOpen(true);
  };

  const filteredItems = savingsItems.filter(item => {
    const itemDate = new Date(item.date);
    if (dateFrom && itemDate < dateFrom) return false;
    if (dateTo && itemDate > dateTo) return false;
    if (selectedAccount !== 'all' && item.account !== selectedAccount) return false;
    return true;
  });

  const savingsTotal = filteredItems.reduce((sum, item) => sum + item.amount, 0);
  const totalTargets = filteredItems.reduce((sum, item) => sum + item.target, 0);

  const isEditing = !!editingItem;
  const isEditingGoal = !!editingGoal;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/50 to-financial-savings/10">
      <PageHeader 
        title="Savings" 
        subtitle="Track your savings goals and progress"
      />
      
      <div className="p-6 space-y-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-card via-card to-financial-savings/10">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold bg-gradient-to-r from-financial-savings to-financial-savings/80 bg-clip-text text-transparent">Total Savings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-financial-savings">${savingsTotal.toLocaleString()}</div>
              <p className="text-sm text-muted-foreground mt-2">Saved amount</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-card via-card to-accent/10">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold bg-gradient-to-r from-accent to-accent/80 bg-clip-text text-transparent">Savings Targets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-accent">${totalTargets.toLocaleString()}</div>
              <p className="text-sm text-muted-foreground mt-2">Target amount</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-card via-card to-primary/10">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-primary">
                {totalTargets > 0 ? ((savingsTotal / totalTargets) * 100).toFixed(1) : '0'}%
              </div>
              <p className="text-sm text-muted-foreground mt-2">Target completion</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-card via-card to-financial-savings/10">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-foreground">Active Goals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-financial-savings">{goals.length}</div>
              <p className="text-sm text-muted-foreground mt-2">Goals set</p>
            </CardContent>
          </Card>
        </div>

        {/* Date Filters and Add Buttons */}
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

          <div className="flex gap-2">
            <Dialog open={isGoalDialogOpen} onOpenChange={setIsGoalDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={openAddGoalDialog} variant="outline" className="border-0 shadow-sm">
                  <Target className="w-4 h-4 mr-2" />
                  Add Goal
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>{isEditingGoal ? 'Edit Goal' : 'Add New Goal'}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="goalName">Goal Name</Label>
                    <Input
                      id="goalName"
                      placeholder="Goal name"
                      value={isEditingGoal ? editingGoal?.name : newGoal.name}
                      onChange={(e) => 
                        isEditingGoal 
                          ? setEditingGoal(prev => prev ? {...prev, name: e.target.value} : null)
                          : setNewGoal({...newGoal, name: e.target.value})
                      }
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="currentAmount">Current Amount</Label>
                      <Input
                        id="currentAmount"
                        type="number"
                        placeholder="0.00"
                        value={isEditingGoal ? editingGoal?.currentAmount : newGoal.currentAmount}
                        onChange={(e) => 
                          isEditingGoal 
                            ? setEditingGoal(prev => prev ? {...prev, currentAmount: parseFloat(e.target.value) || 0} : null)
                            : setNewGoal({...newGoal, currentAmount: e.target.value})
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="targetAmount">Target Amount</Label>
                      <Input
                        id="targetAmount"
                        type="number"
                        placeholder="0.00"
                        value={isEditingGoal ? editingGoal?.targetAmount : newGoal.targetAmount}
                        onChange={(e) => 
                          isEditingGoal 
                            ? setEditingGoal(prev => prev ? {...prev, targetAmount: parseFloat(e.target.value) || 0} : null)
                            : setNewGoal({...newGoal, targetAmount: e.target.value})
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="targetDate">Target Date</Label>
                    <Input
                      id="targetDate"
                      type="date"
                      value={isEditingGoal ? editingGoal?.targetDate : newGoal.targetDate}
                      onChange={(e) => 
                        isEditingGoal 
                          ? setEditingGoal(prev => prev ? {...prev, targetDate: e.target.value} : null)
                          : setNewGoal({...newGoal, targetDate: e.target.value})
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="goalDescription">Description</Label>
                    <Input
                      id="goalDescription"
                      placeholder="Goal description"
                      value={isEditingGoal ? editingGoal?.description : newGoal.description}
                      onChange={(e) => 
                        isEditingGoal 
                          ? setEditingGoal(prev => prev ? {...prev, description: e.target.value} : null)
                          : setNewGoal({...newGoal, description: e.target.value})
                      }
                    />
                  </div>

                  <Button 
                    onClick={isEditingGoal ? handleEditGoal : handleAddGoal} 
                    className="w-full"
                  >
                    {isEditingGoal ? 'Update Goal' : 'Add Goal'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={openAddDialog} className="bg-primary hover:bg-primary/90 shadow-sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Savings
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>{isEditing ? 'Edit Savings' : 'Add New Savings'}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select 
                      value={isEditing ? editingItem?.category : newItem.category} 
                      onValueChange={(value) => 
                        isEditing 
                          ? setEditingItem(prev => prev ? {...prev, category: value} : null)
                          : setNewItem({...newItem, category: value})
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {savingsCategories.map(cat => (
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
                          ? setEditingItem(prev => prev ? {...prev, account: value} : null)
                          : setNewItem({...newItem, account: value})
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
                      <Label htmlFor="amount">Current Amount</Label>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="0.00"
                        value={isEditing ? editingItem?.amount : newItem.amount}
                        onChange={(e) => 
                          isEditing 
                            ? setEditingItem(prev => prev ? {...prev, amount: parseFloat(e.target.value) || 0} : null)
                            : setNewItem({...newItem, amount: e.target.value})
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="target">Target Amount</Label>
                      <Input
                        id="target"
                        type="number"
                        placeholder="0.00"
                        value={isEditing ? editingItem?.target : newItem.target}
                        onChange={(e) => 
                          isEditing 
                            ? setEditingItem(prev => prev ? {...prev, target: parseFloat(e.target.value) || 0} : null)
                            : setNewItem({...newItem, target: e.target.value})
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      placeholder="Description"
                      value={isEditing ? editingItem?.description : newItem.description}
                      onChange={(e) => 
                        isEditing 
                          ? setEditingItem(prev => prev ? {...prev, description: e.target.value} : null)
                          : setNewItem({...newItem, description: e.target.value})
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
                          ? setEditingItem(prev => prev ? {...prev, date: e.target.value} : null)
                          : setNewItem({...newItem, date: e.target.value})
                      }
                    />
                  </div>

                  <Button 
                    onClick={isEditing ? handleEditItem : handleAddItem} 
                    className="w-full"
                  >
                    {isEditing ? 'Update Savings' : 'Add Savings'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Goals Section */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-financial-savings" />
              Goals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {goals.map((goal) => (
                <div key={goal.id} className="flex items-center justify-between p-4 border border-border rounded-xl hover:shadow-sm transition-all bg-card">
                  <div className="flex-1">
                    <h3 className="font-semibold">{goal.name}</h3>
                    <p className="text-sm text-muted-foreground">{goal.description}</p>
                    <p className="text-xs text-muted-foreground">Target: {new Date(goal.targetDate).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-foreground">${goal.currentAmount.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">of ${goal.targetAmount.toLocaleString()}</p>
                    <div className="w-32 bg-muted rounded-full h-2 mt-2">
                      <div 
                        className="h-2 rounded-full bg-financial-savings"
                        style={{ width: `${Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {((goal.currentAmount / goal.targetAmount) * 100).toFixed(1)}% complete
                    </p>
                  </div>
                  <div className="flex gap-1 ml-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditGoalDialog(goal)}
                      className="text-primary hover:text-primary/80"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteGoal(goal.id)}
                      className="text-financial-expense hover:text-financial-expense/80"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Savings Items */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PiggyBank className="w-5 h-5 text-financial-savings" />
              Savings Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 border border-border rounded-xl hover:shadow-sm transition-all bg-card">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{item.category}</h3>
                      <Badge variant="outline" className="text-financial-savings border-financial-savings/20 bg-financial-savings/10">
                        Savings
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                    <p className="text-xs text-muted-foreground">{new Date(item.date).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-foreground">${item.amount.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Target: ${item.target.toLocaleString()}</p>
                    <div className="w-32 bg-muted rounded-full h-2 mt-2">
                      <div 
                        className="h-2 rounded-full bg-financial-savings"
                        style={{ width: `${Math.min((item.amount / item.target) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {((item.amount / item.target) * 100).toFixed(1)}% complete
                    </p>
                  </div>
                  <div className="flex gap-1 ml-2">
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
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Savings;
