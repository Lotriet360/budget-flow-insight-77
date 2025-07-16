
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, TrendingUp, Calendar, Edit2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface IncomeItem {
  id: string;
  category: string;
  amount: number;
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
      date: '2024-01-01'
    },
    {
      id: '2',
      category: 'Freelance',
      amount: 800,
      planned: 600,
      description: 'Freelance project',
      date: '2024-01-10'
    }
  ]);

  const [editingItem, setEditingItem] = useState<IncomeItem | null>(null);
  const [newItem, setNewItem] = useState({
    category: '',
    amount: '',
    planned: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();

  const incomeCategories = ['Salary', 'Freelance', 'Investment', 'Business', 'Other'];

  const handleAddItem = () => {
    if (newItem.category && (newItem.amount || newItem.planned)) {
      const item: IncomeItem = {
        id: Date.now().toString(),
        category: newItem.category,
        amount: parseFloat(newItem.amount) || 0,
        planned: parseFloat(newItem.planned) || 0,
        description: newItem.description,
        date: newItem.date
      };
      
      setIncomeItems([...incomeItems, item]);
      setNewItem({
        category: '',
        amount: '',
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
    return true;
  });

  const totalIncome = filteredItems.reduce((sum, item) => sum + item.amount, 0);
  const plannedIncome = filteredItems.reduce((sum, item) => sum + item.planned, 0);

  const currentItem = editingItem || newItem;
  const isEditing = !!editingItem;

  return (
    <div className="min-h-screen bg-muted/30">
      <PageHeader 
        title="Income" 
        subtitle="Track your planned vs actual income"
      />
      
      <div className="p-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Income</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-financial-income">${totalIncome.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">This period</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Planned Income</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">${plannedIncome.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">Expected</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Variance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${totalIncome - plannedIncome >= 0 ? 'text-financial-income' : 'text-financial-expense'}`}>
                ${(totalIncome - plannedIncome).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Actual vs Planned</p>
            </CardContent>
          </Card>
        </div>

        {/* Date Filters and Add Button */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex gap-2">
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
              <PopoverContent className="w-auto p-0" align="start">
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
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={dateTo}
                  onSelect={setDateTo}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
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
                        ? setEditingItem(prev => prev ? {...prev, category: value} : null)
                        : setNewItem({...newItem, category: value})
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
                          ? setEditingItem(prev => prev ? {...prev, planned: parseFloat(e.target.value) || 0} : null)
                          : setNewItem({...newItem, planned: e.target.value})
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
                          ? setEditingItem(prev => prev ? {...prev, amount: parseFloat(e.target.value) || 0} : null)
                          : setNewItem({...newItem, amount: e.target.value})
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
                  {isEditing ? 'Update Income' : 'Add Income'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Income Items */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-financial-income" />
              Income Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 border border-border rounded-xl hover:shadow-sm transition-all bg-card">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{item.category}</h3>
                      <Badge variant="outline" className="text-financial-income border-financial-income/20 bg-financial-income/10">
                        Income
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                    <p className="text-xs text-muted-foreground">{new Date(item.date).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-financial-income">${item.amount.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Planned: ${item.planned.toLocaleString()}</p>
                    <p className={`text-xs ${item.amount >= item.planned ? 'text-financial-income' : 'text-financial-expense'}`}>
                      {item.amount >= item.planned ? '+' : ''}${(item.amount - item.planned).toLocaleString()}
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

export default Income;
