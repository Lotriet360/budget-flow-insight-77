
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

interface InvestmentItem {
  id: string;
  category: string;
  amount: number;
  target: number;
  description: string;
  date: string;
}

const Investment = () => {
  const [investmentItems, setInvestmentItems] = useState<InvestmentItem[]>([
    {
      id: '1',
      category: 'Stock Market',
      amount: 2500,
      target: 5000,
      description: 'Index fund investment',
      date: '2024-01-05'
    },
    {
      id: '2',
      category: 'Cryptocurrency',
      amount: 1200,
      target: 3000,
      description: 'Bitcoin and Ethereum',
      date: '2024-01-10'
    }
  ]);

  const [editingItem, setEditingItem] = useState<InvestmentItem | null>(null);
  const [newItem, setNewItem] = useState({
    category: '',
    amount: '',
    target: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();

  const investmentCategories = ['Stock Market', 'Bonds', 'Real Estate', 'Cryptocurrency', 'Retirement', 'Mutual Funds', 'ETFs', 'Other'];

  const clearFilters = () => {
    setDateFrom(undefined);
    setDateTo(undefined);
  };

  const hasActiveFilters = dateFrom || dateTo;

  const handleAddItem = () => {
    if (newItem.category && newItem.amount && newItem.target) {
      const item: InvestmentItem = {
        id: Date.now().toString(),
        category: newItem.category,
        amount: parseFloat(newItem.amount),
        target: parseFloat(newItem.target),
        description: newItem.description,
        date: newItem.date
      };
      
      setInvestmentItems([...investmentItems, item]);
      setNewItem({
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
      setInvestmentItems(investmentItems.map(item => 
        item.id === editingItem.id ? editingItem : item
      ));
      setEditingItem(null);
      setIsDialogOpen(false);
    }
  };

  const handleDeleteItem = (id: string) => {
    setInvestmentItems(investmentItems.filter(item => item.id !== id));
  };

  const openEditDialog = (item: InvestmentItem) => {
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
      date: new Date().toISOString().split('T')[0]
    });
    setIsDialogOpen(true);
  };

  const filteredItems = investmentItems.filter(item => {
    const itemDate = new Date(item.date);
    if (dateFrom && itemDate < dateFrom) return false;
    if (dateTo && itemDate > dateTo) return false;
    return true;
  });

  const investmentTotal = filteredItems.reduce((sum, item) => sum + item.amount, 0);
  const totalTargets = filteredItems.reduce((sum, item) => sum + item.target, 0);
  const averageReturn = filteredItems.length > 0 ? (investmentTotal / filteredItems.length).toFixed(2) : '0';

  const isEditing = !!editingItem;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/50 to-financial-investment/10">
      <PageHeader 
        title="Investment Portfolio" 
        subtitle="Track and manage your investment portfolio"
      />
      
      <div className="p-6 space-y-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-card via-card to-financial-investment/10">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold bg-gradient-to-r from-financial-investment to-financial-investment/80 bg-clip-text text-transparent">Total Investments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-financial-investment">${investmentTotal.toLocaleString()}</div>
              <p className="text-sm text-muted-foreground mt-2">Current value</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-card via-card to-accent/10">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold bg-gradient-to-r from-accent to-accent/80 bg-clip-text text-transparent">Investment Targets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-accent">${totalTargets.toLocaleString()}</div>
              <p className="text-sm text-muted-foreground mt-2">Target value</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-card via-card to-primary/10">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">Average Investment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-primary">${averageReturn}</div>
              <p className="text-sm text-muted-foreground mt-2">Per investment</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-card via-card to-financial-savings/10">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-foreground">Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-financial-savings">
                {totalTargets > 0 ? ((investmentTotal / totalTargets) * 100).toFixed(1) : '0'}%
              </div>
              <p className="text-sm text-muted-foreground mt-2">Target completion</p>
            </CardContent>
          </Card>
        </div>

        {/* Date Filters and Add Button */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex gap-2 items-center">
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
                Add Investment
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{isEditing ? 'Edit Investment' : 'Add New Investment'}</DialogTitle>
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
                      {investmentCategories.map(cat => (
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
                  {isEditing ? 'Update Investment' : 'Add Investment'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Investment Items */}
        <Card className="border-0 shadow-xl bg-gradient-to-br from-card via-card to-financial-investment/10 backdrop-blur-sm">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <TrendingUp className="w-6 h-6 text-financial-investment" />
              <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">Investment Portfolio</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-6 border border-border/50 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] bg-gradient-to-r from-card via-card to-muted/20 backdrop-blur-sm">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{item.category}</h3>
                      <Badge variant="outline" className="text-financial-investment border-financial-investment/20 bg-financial-investment/10">
                        Investment
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
                        className="h-2 rounded-full bg-financial-investment"
                        style={{ width: `${Math.min((item.amount / item.target) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {((item.amount / item.target) * 100).toFixed(1)}% of target
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

export default Investment;
