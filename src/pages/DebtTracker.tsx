
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Plus, DollarSign, Calendar, TrendingDown, AlertCircle } from "lucide-react";
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
    },
    {
      id: '3',
      name: 'Car Loan',
      type: 'Auto Loan',
      originalAmount: 20000,
      currentBalance: 12800,
      interestRate: 4.2,
      minPayment: 350,
      dueDate: '2024-02-10',
      payments: [
        { id: '4', amount: 350, date: '2024-01-10', note: 'Monthly payment' }
      ]
    }
  ]);

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
              currentBalance: debt.currentBalance - payment.amount
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

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader 
        title="Debt Tracker" 
        subtitle="Monitor your debts and track payments"
      />
      
      <div className="p-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Debt</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">${totalDebt.toLocaleString()}</div>
              <p className="text-xs text-gray-500 mt-1">
                Across {debts.length} accounts
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Paid</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">${totalPaid.toLocaleString()}</div>
              <p className="text-xs text-gray-500 mt-1">
                {((totalPaid / totalOriginalDebt) * 100).toFixed(1)}% of original debt
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Min Monthly Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">${totalMinPayments.toLocaleString()}</div>
              <p className="text-xs text-gray-500 mt-1">
                Minimum required
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {((totalPaid / totalOriginalDebt) * 100).toFixed(1)}%
              </div>
              <Progress value={(totalPaid / totalOriginalDebt) * 100} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Dialog open={isDebtDialogOpen} onOpenChange={setIsDebtDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Debt
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Debt</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Debt Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Credit Card - Visa"
                    value={newDebt.name}
                    onChange={(e) => setNewDebt({...newDebt, name: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select value={newDebt.type} onValueChange={(value) => setNewDebt({...newDebt, type: value})}>
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
                      value={newDebt.originalAmount}
                      onChange={(e) => setNewDebt({...newDebt, originalAmount: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="currentBalance">Current Balance</Label>
                    <Input
                      id="currentBalance"
                      type="number"
                      placeholder="0.00"
                      value={newDebt.currentBalance}
                      onChange={(e) => setNewDebt({...newDebt, currentBalance: e.target.value})}
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
                      value={newDebt.interestRate}
                      onChange={(e) => setNewDebt({...newDebt, interestRate: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="minPayment">Min Payment</Label>
                    <Input
                      id="minPayment"
                      type="number"
                      placeholder="0.00"
                      value={newDebt.minPayment}
                      onChange={(e) => setNewDebt({...newDebt, minPayment: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={newDebt.dueDate}
                    onChange={(e) => setNewDebt({...newDebt, dueDate: e.target.value})}
                  />
                </div>

                <Button onClick={handleAddDebt} className="w-full">
                  Add Debt
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
              <Card key={debt.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{debt.name}</CardTitle>
                    <Badge variant="outline">{debt.type}</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
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
                      <span className="text-sm text-gray-600">{progress.toFixed(1)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Current Balance</span>
                      <span className="font-semibold text-red-600">${debt.currentBalance.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Original Amount</span>
                      <span className="font-semibold">${debt.originalAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Min Payment</span>
                      <span className="font-semibold">${debt.minPayment.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Recent Payments</span>
                      <span className="text-xs text-gray-500">{debt.payments.length} total</span>
                    </div>
                    {debt.payments.slice(-2).map((payment) => (
                      <div key={payment.id} className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">{new Date(payment.date).toLocaleDateString()}</span>
                        <span className="font-medium text-green-600">${payment.amount.toLocaleString()}</span>
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
          <DialogContent>
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
