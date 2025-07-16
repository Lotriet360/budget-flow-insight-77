
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, PiggyBank, Calendar, Edit2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface SavingsItem {
  id: string;
  type: 'savings' | 'investment';
  category: string;
  amount: number;
  target: number;
  description: string;
  date: string;
}

const Savings = () => {
  const [savingsItems, setSavingsItems] = useState<SavingsItem[]>([
    {
      id: '1',
      type: 'savings',
      category: 'Emergency Fund',
      amount: 5000,
      target: 10000,
      description: 'Emergency fund savings',
      date: '2024-01-01'
    },
    {
      id: '2',
      type: 'investment',
      category: 'Stock Market',
      amount: 2500,
      target: 5000,
      description: 'Index fund investment',
      date: '2024-01-05'
    }
  ]);

  const [editingItem, setEditingItem] = useState<SavingsItem | null>(null);
  const [newItem, setNewItem] = useState({
    type: 'savings' as 'savings' | 'investment',
    category: '',
    amount: '',
    target: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();

  const savingsCategories = ['Emergency Fund', 'Vacation', 'House Down Payment', 'Car', 'Other'];
  const investmentCategories = ['Stock Market', 'Bonds', 'Real Estate', 'Cryptocurrency', 'Retirement', 'Other'];

  const handleAddItem = () => {
    if (newItem.category && newItem.amount && newItem.target) {
      const item: SavingsItem = {
        id: Date.now().toString(),
        type: newItem.type,
        category: newItem.category,
        amount: parseFloat(newItem.amount),
        target: parseFloat(newItem.target),
        description: newItem.description,
        date: newItem.date
      };
      
      setSavingsItems([...savingsItems, item]);
      setNewItem({
        type: 'savings',
        category: '',
        amount: '',
        target: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
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

  const openEditDialog = (item: SavingsItem) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  const openAddDialog = () => {
    setEditingItem(null);
    setNewItem({
      type: 'savings',
      category: '',
      amount: '',
      target: '',
      description: '',
      date: new Date().toISOString().split('T')[0]
    });
    setIsDialogOpen(true);
  };

  const filteredItems = savingsItems.filter(item => {
    const itemDate = new Date(item.date);
    if (dateFrom && itemDate < dateFrom) return false;
    if (dateTo && itemDate > dateTo) return false;
    return true;
  });

  const savingsTotal = filteredItems.filter(item => item.type === 'savings').reduce((sum, item) => sum + item.amount, 0);
  const investmentTotal = filteredItems.filter(item => item.type === 'investment').reduce((sum, item) => sum + item.amount, 0);
  const totalTargets = filteredItems.reduce((sum, item) => sum + item.target, 0);

  const isEditing = !!editingItem;

  return (
    <div className="min-h-screen bg-muted/30">
      <PageHeader 
        title="Savings & Investment" 
        subtitle="Track your savings goals and investment portfolio"
      />
      
      <div className="p-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Savings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-financial-savings">${savingsTotal.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">Saved amount</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Investments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-financial-investment">${investmentTotal.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">Invested amount</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Portfolio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">${(savingsTotal + investmentTotal).toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">Combined value</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Target Goals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-financial-debt">${totalTargets.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">Total targets</p>
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
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{isEditing ? 'Edit Savings/Investment' : 'Add New Savings/Investment'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select 
                    value={isEditing ? editingItem?.type : newItem.type} 
                    onValueChange={(value: 'savings' | 'investment') => 
                      isEditing 
                        ? setEditingItem(prev => prev ? {...prev, type: value} : null)
                        : setNewItem({...newItem, type: value})
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="savings">Savings</SelectItem>
                      <SelectItem value="investment">Investment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

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
                      {((isEditing ? editingItem?.type : newItem.type) === 'savings' ? savingsCategories : investmentCategories).map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
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
                  {isEditing ? 'Update Item' : 'Add Item'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Savings & Investment Items */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PiggyBank className="w-5 h-5 text-financial-savings" />
              Savings & Investment Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 border border-border rounded-xl hover:shadow-sm transition-all bg-card">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{item.category}</h3>
                      <Badge variant="outline" className={item.type === 'savings' ? 'text-financial-savings border-financial-savings/20 bg-financial-savings/10' : 'text-financial-investment border-financial-investment/20 bg-financial-investment/10'}>
                        {item.type === 'savings' ? 'Savings' : 'Investment'}
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
                        className={`h-2 rounded-full ${item.type === 'savings' ? 'bg-financial-savings' : 'bg-financial-investment'}`}
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
