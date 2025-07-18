
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Plus, DollarSign, Calendar, TrendingDown, Edit2, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Debt {
  id: string;
  name: string;
  type: string;
  originalAmount: number;
  currentBalance: number;
  interestRate: number;
  minPayment: number;
  dueDate: string;
  payments: Payment[];
}

interface Payment {
  id: string;
  amount: number;
  date: string;
  note: string;
}

const DebtTracker = () => {
  const [debts, setDebts] = useState<Debt[]>([
    {
      id: '1',
      name: 'Credit Card - Visa',
      type: 'Credit Card',
      originalAmount: 5000,
      currentBalance: 3200,
      interestRate: 18.5,
      minPayment: 120,
      dueDate: '2024-02-15',
      payments: [
        { id: '1', amount: 300, date: '2024-01-15', note: 'Regular payment' },
        { id: '2', amount: 500, date: '2024-01-01', note: 'Extra payment' }
      ]
    },
    {
      id: '2',
      name: 'Student Loan',
      type: 'Student Loan',
      originalAmount: 25000,
      currentBalance: 18500,
      interestRate: 6.5,
      minPayment: 280,
      dueDate: '2024-02-20',
      payments: [
        { id: '3', amount: 300, date: '2024-01-20', note: 'Monthly payment' }
      ]
    }
  ]);

  const [editingDebt, setEditingDebt] = useState<Debt | null>(null);
  const [newDebt, setNewDebt] = useState({
    name: '',
    type: '',
    originalAmount: '',
    currentBalance: '',
    interestRate: '',
    minPayment: '',
    dueDate: ''
  });

  const [selectedDebt, setSelectedDebt] = useState<string | null>(null);
  const [newPayment, setNewPayment] = useState({
    amount: '',
    date: new Date().toISOString().split('T')[0],
    note: ''
  });

  const [isDebtDialogOpen, setIsDebtDialogOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);

  const debtTypes = ['Credit Card', 'Student Loan', 'Auto Loan', 'Mortgage', 'Personal Loan', 'Other'];

  const handleAddDebt = () => {
    if (newDebt.name && newDebt.type && newDebt.originalAmount && newDebt.currentBalance) {
      const debt: Debt = {
        id: Date.now().toString(),
        name: newDebt.name,
        type: newDebt.type,
        originalAmount: parseFloat(newDebt.originalAmount),
        currentBalance: parseFloat(newDebt.currentBalance),
        interestRate: parseFloat(newDebt.interestRate) || 0,
        minPayment: parseFloat(newDebt.minPayment) || 0,
        dueDate: newDebt.dueDate,
        payments: []
      };
      
      setDebts([...debts, debt]);
      setNewDebt({
        name: '',
        type: '',
        originalAmount: '',
        currentBalance: '',
        interestRate: '',
        minPayment: '',
        dueDate: ''
      });
      setIsDebtDialogOpen(false);
    }
  };

  const handleEditDebt = () => {
    if (editingDebt && editingDebt.name && editingDebt.type) {
      setDebts(debts.map(debt => 
        debt.id === editingDebt.id ? editingDebt : debt
      ));
      setEditingDebt(null);
      setIsDebtDialogOpen(false);
    }
  };

  const handleDeleteDebt = (id: string) => {
    setDebts(debts.filter(debt => debt.id !== id));
  };

  const openEditDebtDialog = (debt: Debt) => {
    setEditingDebt(debt);
    setIsDebtDialogOpen(true);
  };

  const openAddDebtDialog = () => {
    setEditingDebt(null);
    setNewDebt({
      name: '',
      type: '',
      originalAmount: '',
      currentBalance: '',
      interestRate: '',
      minPayment: '',
      dueDate: ''
    });
    setIsDebtDialogOpen(true);
  };

  const handleAddPayment = () => {
    if (selectedDebt && newPayment.amount) {
      const payment: Payment = {
        id: Date.now().toString(),
        amount: parseFloat(newPayment.amount),
        date: newPayment.date,
        note: newPayment.note
      };

      setDebts(debts.map(debt => 
        debt.id === selectedDebt 
          ? { 
              ...debt, 
              payments: [...debt.payments, payment],
              currentBalance: Math.max(0, debt.currentBalance - payment.amount)
            }
          : debt
      ));

      setNewPayment({
        amount: '',
        date: new Date().toISOString().split('T')[0],
        note: ''
      });
      setIsPaymentDialogOpen(false);
      setSelectedDebt(null);
    }
  };

  const totalDebt = debts.reduce((sum, debt) => sum + debt.currentBalance, 0);
  const totalOriginalDebt = debts.reduce((sum, debt) => sum + debt.originalAmount, 0);
  const totalPaid = totalOriginalDebt - totalDebt;
  const totalMinPayments = debts.reduce((sum, debt) => sum + debt.minPayment, 0);

  const getProgressPercentage = (debt: Debt) => {
    return ((debt.originalAmount - debt.currentBalance) / debt.originalAmount) * 100;
  };

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const isEditingDebt = !!editingDebt;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/50 to-financial-debt/10">
      <PageHeader 
        title="Debt Tracker" 
        subtitle="Monitor your debts and track payments"
      />
      
      <div className="p-6 space-y-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-card via-card to-financial-debt/10">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold bg-gradient-to-r from-financial-debt to-financial-debt/80 bg-clip-text text-transparent">Total Debt</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-financial-debt">${totalDebt.toLocaleString()}</div>
              <p className="text-sm text-muted-foreground mt-2">
                Across {debts.length} accounts
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-card via-card to-financial-income/10">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold bg-gradient-to-r from-financial-income to-financial-income/80 bg-clip-text text-transparent">Total Paid</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-financial-income">${totalPaid.toLocaleString()}</div>
              <p className="text-sm text-muted-foreground mt-2">
                {totalOriginalDebt > 0 ? ((totalPaid / totalOriginalDebt) * 100).toFixed(1) : 0}% of original debt
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-card via-card to-primary/10">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">Min Monthly Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-primary">${totalMinPayments.toLocaleString()}</div>
              <p className="text-sm text-muted-foreground mt-2">
                Minimum required
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-card via-card to-financial-investment/10">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-foreground">Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-financial-investment">
                {totalOriginalDebt > 0 ? ((totalPaid / totalOriginalDebt) * 100).toFixed(1) : 0}%
              </div>
              <Progress value={totalOriginalDebt > 0 ? (totalPaid / totalOriginalDebt) * 100 : 0} className="mt-3 h-3" />
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Dialog open={isDebtDialogOpen} onOpenChange={setIsDebtDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openAddDebtDialog} className="bg-primary hover:bg-primary/90 shadow-sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Debt
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{isEditingDebt ? 'Edit Debt' : 'Add New Debt'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Debt Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Credit Card - Visa"
                    value={isEditingDebt ? editingDebt?.name : newDebt.name}
                    onChange={(e) => 
                      isEditingDebt 
                        ? setEditingDebt(prev => prev ? {...prev, name: e.target.value} : null)
                        : setNewDebt({...newDebt, name: e.target.value})
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select 
                    value={isEditingDebt ? editingDebt?.type : newDebt.type} 
                    onValueChange={(value) => 
                      isEditingDebt 
                        ? setEditingDebt(prev => prev ? {...prev, type: value} : null)
                        : setNewDebt({...newDebt, type: value})
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select debt type" />
                    </SelectTrigger>
                    <SelectContent>
                      {debtTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="originalAmount">Original Amount</Label>
                    <Input
                      id="originalAmount"
                      type="number"
                      placeholder="0.00"
                      value={isEditingDebt ? editingDebt?.originalAmount : newDebt.originalAmount}
                      onChange={(e) => 
                        isEditingDebt 
                          ? setEditingDebt(prev => prev ? {...prev, originalAmount: parseFloat(e.target.value) || 0} : null)
                          : setNewDebt({...newDebt, originalAmount: e.target.value})
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="currentBalance">Current Balance</Label>
                    <Input
                      id="currentBalance"
                      type="number"
                      placeholder="0.00"
                      value={isEditingDebt ? editingDebt?.currentBalance : newDebt.currentBalance}
                      onChange={(e) => 
                        isEditingDebt 
                          ? setEditingDebt(prev => prev ? {...prev, currentBalance: parseFloat(e.target.value) || 0} : null)
                          : setNewDebt({...newDebt, currentBalance: e.target.value})
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="interestRate">Interest Rate (%)</Label>
                    <Input
                      id="interestRate"
                      type="number"
                      placeholder="0.00"
                      value={isEditingDebt ? editingDebt?.interestRate : newDebt.interestRate}
                      onChange={(e) => 
                        isEditingDebt 
                          ? setEditingDebt(prev => prev ? {...prev, interestRate: parseFloat(e.target.value) || 0} : null)
                          : setNewDebt({...newDebt, interestRate: e.target.value})
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="minPayment">Min Payment</Label>
                    <Input
                      id="minPayment"
                      type="number"
                      placeholder="0.00"
                      value={isEditingDebt ? editingDebt?.minPayment : newDebt.minPayment}
                      onChange={(e) => 
                        isEditingDebt 
                          ? setEditingDebt(prev => prev ? {...prev, minPayment: parseFloat(e.target.value) || 0} : null)
                          : setNewDebt({...newDebt, minPayment: e.target.value})
                      }
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={isEditingDebt ? editingDebt?.dueDate : newDebt.dueDate}
                    onChange={(e) => 
                      isEditingDebt 
                        ? setEditingDebt(prev => prev ? {...prev, dueDate: e.target.value} : null)
                        : setNewDebt({...newDebt, dueDate: e.target.value})
                    }
                  />
                </div>

                <Button 
                  onClick={isEditingDebt ? handleEditDebt : handleAddDebt} 
                  className="w-full"
                >
                  {isEditingDebt ? 'Update Debt' : 'Add Debt'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Debt Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {debts.map((debt) => {
            const progress = getProgressPercentage(debt);
            const daysUntilDue = getDaysUntilDue(debt.dueDate);
            
            return (
              <Card key={debt.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] bg-gradient-to-br from-card via-card to-muted/20 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{debt.name}</CardTitle>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDebtDialog(debt)}
                        className="text-primary hover:text-primary/80"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteDebt(debt.id)}
                        className="text-financial-expense hover:text-financial-expense/80"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <Badge variant="outline" className="w-fit">{debt.type}</Badge>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      {debt.interestRate}% APR
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {daysUntilDue > 0 ? `${daysUntilDue} days` : 'Overdue'}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Progress</span>
                      <span className="text-sm text-muted-foreground">{progress.toFixed(1)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Current Balance</span>
                      <span className="font-semibold text-financial-debt">${debt.currentBalance.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Original Amount</span>
                      <span className="font-semibold">${debt.originalAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Min Payment</span>
                      <span className="font-semibold">${debt.minPayment.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Recent Payments</span>
                      <span className="text-xs text-muted-foreground">{debt.payments.length} total</span>
                    </div>
                    {debt.payments.slice(-2).map((payment) => (
                      <div key={payment.id} className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">{new Date(payment.date).toLocaleDateString()}</span>
                        <span className="font-medium text-financial-income">${payment.amount.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>

                  <Button 
                    onClick={() => {
                      setSelectedDebt(debt.id);
                      setIsPaymentDialogOpen(true);
                    }}
                    className="w-full"
                    variant="outline"
                  >
                    Record Payment
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Payment Dialog */}
        <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Record Payment</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="amount">Payment Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={newPayment.amount}
                  onChange={(e) => setNewPayment({...newPayment, amount: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="date">Payment Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={newPayment.date}
                  onChange={(e) => setNewPayment({...newPayment, date: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="note">Note (optional)</Label>
                <Input
                  id="note"
                  placeholder="Payment note"
                  value={newPayment.note}
                  onChange={(e) => setNewPayment({...newPayment, note: e.target.value})}
                />
              </div>

              <Button onClick={handleAddPayment} className="w-full">
                Record Payment
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default DebtTracker;
