
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, PiggyBank, TrendingUp, Calendar } from "lucide-react";
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

  const handleDeleteItem = (id: string) => {
    setSavingsItems(savingsItems.filter(item => item.id !== id));
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

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader 
        title="Savings & Investment" 
        subtitle="Track your savings goals and investment portfolio"
      />
      
      <div className="p-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Savings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">${savingsTotal.toLocaleString()}</div>
              <p className="text-xs text-gray-500 mt-1">
                Saved amount
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Investments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">${investmentTotal.toLocaleString()}</div>
              <p className="text-xs text-gray-500 mt-1">
                Invested amount
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Portfolio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">${(savingsTotal + investmentTotal).toLocaleString()}</div>
              <p className="text-xs text-gray-500 mt-1">
                Combined value
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Target Goals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">${totalTargets.toLocaleString()}</div>
              <p className="text-xs text-gray-500 mt-1">
                Total targets
              </p>
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
                    "w-[240px] justify-start text-left font-normal",
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
                    "w-[240px] justify-start text-left font-normal",
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
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Savings/Investment</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select value={newItem.type} onValueChange={(value: 'savings' | 'investment') => setNewItem({...newItem, type: value})}>
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
                  <Select value={newItem.category} onValueChange={(value) => setNewItem({...newItem, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {(newItem.type === 'savings' ? savingsCategories : investmentCategories).map(cat => (
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
                      value={newItem.amount}
                      onChange={(e) => setNewItem({...newItem, amount: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="target">Target Amount</Label>
                    <Input
                      id="target"
                      type="number"
                      placeholder="0.00"
                      value={newItem.target}
                      onChange={(e) => setNewItem({...newItem, target: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    placeholder="Description"
                    value={newItem.description}
                    onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newItem.date}
                    onChange={(e) => setNewItem({...newItem, date: e.target.value})}
                  />
                </div>

                <Button onClick={handleAddItem} className="w-full">
                  Add Item
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Savings & Investment Items */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PiggyBank className="w-5 h-5 text-green-600" />
              Savings & Investment Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg hover:shadow-sm transition-shadow">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{item.category}</h3>
                      <Badge variant="outline" className={item.type === 'savings' ? 'text-green-600 border-green-600' : 'text-blue-600 border-blue-600'}>
                        {item.type === 'savings' ? 'Savings' : 'Investment'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{item.description}</p>
                    <p className="text-xs text-gray-500">{new Date(item.date).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">${item.amount.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">Target: ${item.target.toLocaleString()}</p>
                    <div className="w-32 bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${Math.min((item.amount / item.target) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {((item.amount / item.target) * 100).toFixed(1)}% complete
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteItem(item.id)}
                    className="ml-2 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
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
