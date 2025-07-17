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
  creditLimit?: number;
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
      accountNumber: '****2345',
      creditLimit: 5000
    }
  ]);

  const [editingAccount, setEditingAccount] = useState<BankAccount | null>(null);
  const [newAccount, setNewAccount] = useState({
    name: '',
    type: 'checking' as BankAccount['type'],
    balance: '',
    bank: '',
    accountNumber: '',
    creditLimit: ''
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
        accountNumber: newAccount.accountNumber,
        creditLimit: parseFloat(newAccount.creditLimit || '0') || undefined
      };
      
      setAccounts([...accounts, account]);
      setNewAccount({
        name: '',
        type: 'checking',
        balance: '',
        bank: '',
        accountNumber: '',
        creditLimit: ''
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
      accountNumber: '',
      creditLimit: ''
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

  const getAvailableBalance = (account: BankAccount) => {
    if (account.type === 'credit' && account.creditLimit) {
      return account.creditLimit + account.balance; // balance is negative for credit cards
    }
    return account.balance;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <PageHeader 
        title="Transacting Accounts" 
        subtitle="Manage your bank accounts and cards"
      />
      
      <div className="p-8 space-y-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-0 shadow-xl bg-gradient-to-br from-primary/5 to-primary/10 hover:shadow-2xl transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                ${totalBalance.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">All accounts</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-500/5 to-blue-500/10 hover:shadow-2xl transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Checking</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">${checkingBalance.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">Available funds</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-gradient-to-br from-financial-savings/5 to-financial-savings/10 hover:shadow-2xl transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Savings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-financial-savings">${savingsBalance.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">Saved amount</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-gradient-to-br from-financial-expense/5 to-financial-expense/10 hover:shadow-2xl transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Credit Available</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-financial-expense">
                ${accounts.filter(acc => acc.type === 'credit').reduce((sum, acc) => sum + getAvailableBalance(acc), 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Available credit</p>
            </CardContent>
          </Card>
        </div>

        {/* Add Account Button */}
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">Your Accounts</h2>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openAddDialog} className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
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

                 <div>
                  <Label htmlFor="creditLimit">Credit Limit</Label>
                  <Input
                    id="creditLimit"
                    type="number"
                    placeholder="5000"
                    value={isEditing ? editingAccount?.creditLimit : newAccount.creditLimit}
                    onChange={(e) => 
                      isEditing 
                        ? setEditingAccount(prev => prev ? {...prev, creditLimit: parseFloat(e.target.value) || 0} : null)
                        : setNewAccount({...newAccount, creditLimit: e.target.value})
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {accounts.map((account) => (
            <Card key={account.id} className="border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm transform hover:scale-105 hover:-translate-y-2">
              <CardHeader className="pb-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent"></div>
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-primary/10">
                      <CreditCard className="w-5 h-5 text-primary" />
                    </div>
                    <Badge variant="outline" className={`${getAccountTypeColor(account.type)} font-medium`}>
                      {account.type.charAt(0).toUpperCase() + account.type.slice(1)}
                    </Badge>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditDialog(account)}
                      className="text-primary hover:text-primary/80 h-8 w-8 p-0 hover:bg-primary/10 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteAccount(account.id)}
                      className="text-financial-expense hover:text-financial-expense/80 h-8 w-8 p-0 hover:bg-financial-expense/10 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <CardTitle className="text-xl font-bold relative">{account.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-gradient-to-r from-muted/50 to-muted/30">
                    {account.type === 'credit' ? (
                      <>
                        <p className="text-sm text-muted-foreground">Available Balance</p>
                        <p className="text-2xl font-bold text-financial-savings">
                          ${getAvailableBalance(account).toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Used: ${Math.abs(account.balance).toLocaleString()} of ${account.creditLimit?.toLocaleString() || '0'}
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-sm text-muted-foreground">Balance</p>
                        <p className={`text-2xl font-bold ${account.balance >= 0 ? 'text-financial-savings' : 'text-financial-expense'}`}>
                          ${Math.abs(account.balance).toLocaleString()}
                        </p>
                      </>
                    )}
                  </div>
                  <div className="border-t border-border/50 pt-4 space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground font-medium">Bank</p>
                      <p className="font-semibold text-foreground">{account.bank}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground font-medium">Account Number</p>
                      <p className="font-mono text-sm bg-muted/50 px-2 py-1 rounded">{account.accountNumber}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {accounts.length === 0 && (
          <Card className="border-0 shadow-xl bg-gradient-to-br from-muted/20 to-muted/10">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="p-4 rounded-full bg-primary/10 mb-6">
                <CreditCard className="w-16 h-16 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">No accounts added yet</h3>
              <p className="text-muted-foreground text-center mb-6 max-w-md">
                Add your first transacting account to get started with tracking your finances.
              </p>
              <Button onClick={openAddDialog} className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg">
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
