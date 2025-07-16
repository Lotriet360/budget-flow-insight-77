
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, TrendingUp, Calendar } from "lucide-react";
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
    if (newItem.category && newItem.amount && newItem.planned) {
      const item: IncomeItem = {
        id: Date.now().toString(),
        category: newItem.category,
        amount: parseFloat(newItem.amount),
        planned: parseFloat(newItem.planned),
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

  const handleDeleteItem = (id: string) => {
    setIncomeItems(incomeItems.filter(item => item.id !== id));
  };

  const filteredItems = incomeItems.filter(item => {
    const itemDate = new Date(item.date);
    if (dateFrom && itemDate < dateFrom) return false;
    if (dateTo && itemDate > dateTo) return false;
    return true;
  });

  const totalIncome = filteredItems.reduce((sum, item) => sum + item.amount, 0);
  const plannedIncome = filteredItems.reduce((sum, item) => sum + item.planned, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader 
        title="Income" 
        subtitle="Track your planned vs actual income"
      />
      
      <div className="p-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Income</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">${totalIncome.toLocaleString()}</div>
              <p className="text-xs text-gray-500 mt-1">
                This period
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Planned Income</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">${plannedIncome.toLocaleString()}</div>
              <p className="text-xs text-gray-500 mt-1">
                Expected
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Variance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${totalIncome - plannedIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${(totalIncome - plannedIncome).toLocaleString()}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Actual vs Planned
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
                Add Income
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Income</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={newItem.category} onValueChange={(value) => setNewItem({...newItem, category: value})}>
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
                      value={newItem.planned}
                      onChange={(e) => setNewItem({...newItem, planned: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="amount">Actual Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="0.00"
                      value={newItem.amount}
                      onChange={(e) => setNewItem({...newItem, amount: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    placeholder="Income description"
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
                  Add Income
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Income Items */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Income Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg hover:shadow-sm transition-shadow">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{item.category}</h3>
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        Income
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{item.description}</p>
                    <p className="text-xs text-gray-500">{new Date(item.date).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">${item.amount.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">Planned: ${item.planned.toLocaleString()}</p>
                    <p className={`text-xs ${item.amount >= item.planned ? 'text-green-600' : 'text-red-600'}`}>
                      {item.amount >= item.planned ? '+' : ''}${(item.amount - item.planned).toLocaleString()}
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

export default Income;
