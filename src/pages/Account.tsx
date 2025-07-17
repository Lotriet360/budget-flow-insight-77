
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, CreditCard, Edit2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface BankAccount {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'credit' | 'investment';
  balance: number;
  bank: string;
  accountNumber: string;
}

const Account = () => {
  const [accounts, setAccounts] = useState<BankAccount[]>([
    {
      id: '1',
      name: 'Main Checking',
      type: 'checking',
      balance: 5240.50,
      bank: 'Chase Bank',
      accountNumber: '****4567'
    },
    {
      id: '2',
      name: 'Emergency Savings',
      type: 'savings',
      balance: 15000.00,
      bank: 'Bank of America',
      accountNumber: '****8901'
    },
    {
      id: '3',
      name: 'Credit Card',
      type: 'credit',
      balance: -1250.75,
      bank: 'American Express',
      accountNumber: '****2345'
    }
  ]);

  const [editingAccount, setEditingAccount] = useState<BankAccount | null>(null);
  const [newAccount, setNewAccount] = useState({
    name: '',
    type: 'checking' as BankAccount['type'],
    balance: '',
    bank: '',
    accountNumber: ''
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const accountTypes = [
    { value: 'checking', label: 'Checking Account' },
    { value: 'savings', label: 'Savings Account' },
    { value: 'credit', label: 'Credit Card' },
    { value: 'investment', label: 'Investment Account' }
  ];

  const handleAddAccount = () => {
    if (newAccount.name && newAccount.bank && newAccount.accountNumber) {
      const account: BankAccount = {
        id: Date.now().toString(),
        name: newAccount.name,
        type: newAccount.type,
        balance: parseFloat(newAccount.balance) || 0,
        bank: newAccount.bank,
        accountNumber: newAccount.accountNumber
      };
      
      setAccounts([...accounts, account]);
      setNewAccount({
        name: '',
        type: 'checking',
        balance: '',
        bank: '',
        accountNumber: ''
      });
      setIsDialogOpen(false);
    }
  };

  const handleEditAccount = () => {
    if (editingAccount && editingAccount.name && editingAccount.bank) {
      setAccounts(accounts.map(account => 
        account.id === editingAccount.id ? editingAccount : account
      ));
      setEditingAccount(null);
      setIsDialogOpen(false);
    }
  };

  const handleDeleteAccount = (id: string) => {
    setAccounts(accounts.filter(account => account.id !== id));
  };

  const openEditDialog = (account: BankAccount) => {
    setEditingAccount(account);
    setIsDialogOpen(true);
  };

  const openAddDialog = () => {
    setEditingAccount(null);
    setNewAccount({
      name: '',
      type: 'checking',
      balance: '',
      bank: '',
      accountNumber: ''
    });
    setIsDialogOpen(true);
  };

  const totalBalance = accounts.reduce((sum, account) => {
    return account.type === 'credit' ? sum + account.balance : sum + account.balance;
  }, 0);

  const checkingBalance = accounts.filter(acc => acc.type === 'checking').reduce((sum, acc) => sum + acc.balance, 0);
  const savingsBalance = accounts.filter(acc => acc.type === 'savings').reduce((sum, acc) => sum + acc.balance, 0);
  const creditBalance = accounts.filter(acc => acc.type === 'credit').reduce((sum, acc) => sum + acc.balance, 0);

  const isEditing = !!editingAccount;

  const getAccountTypeColor = (type: BankAccount['type']) => {
    switch (type) {
      case 'checking': return 'text-blue-600 border-blue-600/20 bg-blue-600/10';
      case 'savings': return 'text-financial-savings border-financial-savings/20 bg-financial-savings/10';
      case 'credit': return 'text-financial-expense border-financial-expense/20 bg-financial-expense/10';
      case 'investment': return 'text-financial-investment border-financial-investment/20 bg-financial-investment/10';
      default: return 'text-gray-600 border-gray-600/20 bg-gray-600/10';
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <PageHeader 
        title="Transacting Accounts" 
        subtitle="Manage your bank accounts and cards"
      />
      
      <div className="p-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">${totalBalance.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">All accounts</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Checking</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">${checkingBalance.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">Available funds</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Savings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-financial-savings">${savingsBalance.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">Saved amount</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Credit</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-financial-expense">${Math.abs(creditBalance).toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">Outstanding debt</p>
            </CardContent>
          </Card>
        </div>

        {/* Add Account Button */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-foreground">Your Accounts</h2>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openAddDialog} className="bg-primary hover:bg-primary/90 shadow-sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Account
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{isEditing ? 'Edit Account' : 'Add New Account'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="accountName">Account Name</Label>
                  <Input
                    id="accountName"
                    placeholder="Account name"
                    value={isEditing ? editingAccount?.name : newAccount.name}
                    onChange={(e) => 
                      isEditing 
                        ? setEditingAccount(prev => prev ? {...prev, name: e.target.value} : null)
                        : setNewAccount({...newAccount, name: e.target.value})
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="accountType">Account Type</Label>
                  <Select 
                    value={isEditing ? editingAccount?.type : newAccount.type} 
                    onValueChange={(value: BankAccount['type']) => 
                      isEditing 
                        ? setEditingAccount(prev => prev ? {...prev, type: value} : null)
                        : setNewAccount({...newAccount, type: value})
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {accountTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="bank">Bank Name</Label>
                  <Input
                    id="bank"
                    placeholder="Bank name"
                    value={isEditing ? editingAccount?.bank : newAccount.bank}
                    onChange={(e) => 
                      isEditing 
                        ? setEditingAccount(prev => prev ? {...prev, bank: e.target.value} : null)
                        : setNewAccount({...newAccount, bank: e.target.value})
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="accountNumber">Account Number</Label>
                  <Input
                    id="accountNumber"
                    placeholder="****1234"
                    value={isEditing ? editingAccount?.accountNumber : newAccount.accountNumber}
                    onChange={(e) => 
                      isEditing 
                        ? setEditingAccount(prev => prev ? {...prev, accountNumber: e.target.value} : null)
                        : setNewAccount({...newAccount, accountNumber: e.target.value})
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="balance">Current Balance</Label>
                  <Input
                    id="balance"
                    type="number"
                    placeholder="0.00"
                    value={isEditing ? editingAccount?.balance : newAccount.balance}
                    onChange={(e) => 
                      isEditing 
                        ? setEditingAccount(prev => prev ? {...prev, balance: parseFloat(e.target.value) || 0} : null)
                        : setNewAccount({...newAccount, balance: e.target.value})
                    }
                  />
                </div>

                <Button 
                  onClick={isEditing ? handleEditAccount : handleAddAccount} 
                  className="w-full"
                >
                  {isEditing ? 'Update Account' : 'Add Account'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Account Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accounts.map((account) => (
            <Card key={account.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-card">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-primary" />
                    <Badge variant="outline" className={getAccountTypeColor(account.type)}>
                      {account.type.charAt(0).toUpperCase() + account.type.slice(1)}
                    </Badge>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditDialog(account)}
                      className="text-primary hover:text-primary/80 h-8 w-8 p-0"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteAccount(account.id)}
                      className="text-financial-expense hover:text-financial-expense/80 h-8 w-8 p-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <CardTitle className="text-lg font-semibold">{account.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Balance</p>
                    <p className={`text-2xl font-bold ${account.balance >= 0 ? 'text-financial-savings' : 'text-financial-expense'}`}>
                      ${Math.abs(account.balance).toLocaleString()}
                    </p>
                    {account.type === 'credit' && account.balance < 0 && (
                      <p className="text-xs text-financial-expense">Outstanding debt</p>
                    )}
                  </div>
                  <div className="border-t pt-3">
                    <p className="text-sm text-muted-foreground">Bank</p>
                    <p className="font-medium">{account.bank}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Account Number</p>
                    <p className="font-mono text-sm">{account.accountNumber}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {accounts.length === 0 && (
          <Card className="border-0 shadow-sm">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <CreditCard className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No accounts added yet</h3>
              <p className="text-muted-foreground text-center mb-4">
                Add your first transacting account to get started with tracking your finances.
              </p>
              <Button onClick={openAddDialog}>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Account
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Account;
