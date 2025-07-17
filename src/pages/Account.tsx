
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, CreditCard, Edit2, User, Building, Phone, Mail } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface BankAccount {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'credit' | 'investment';
  balance: number;
  bank: string;
  accountNumber: string;
}

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
}

const Account = () => {
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main Street',
    city: 'New York',
    country: 'United States'
  });

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
  const [isProfileEditing, setIsProfileEditing] = useState(false);

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
        title="Account Management" 
        subtitle="Manage your profile and bank accounts"
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

        {/* Profile Section */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Profile Information
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsProfileEditing(!isProfileEditing)}
              className="border-0 shadow-sm"
            >
              <Edit2 className="w-4 h-4 mr-2" />
              {isProfileEditing ? 'Cancel' : 'Edit'}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-6">
              <Avatar className="w-20 h-20">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback className="text-lg font-semibold">
                  {userProfile.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={userProfile.name}
                    onChange={(e) => setUserProfile({...userProfile, name: e.target.value})}
                    disabled={!isProfileEditing}
                    className={!isProfileEditing ? "bg-muted" : ""}
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={userProfile.email}
                    onChange={(e) => setUserProfile({...userProfile, email: e.target.value})}
                    disabled={!isProfileEditing}
                    className={!isProfileEditing ? "bg-muted" : ""}
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={userProfile.phone}
                    onChange={(e) => setUserProfile({...userProfile, phone: e.target.value})}
                    disabled={!isProfileEditing}
                    className={!isProfileEditing ? "bg-muted" : ""}
                  />
                </div>
                
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={userProfile.address}
                    onChange={(e) => setUserProfile({...userProfile, address: e.target.value})}
                    disabled={!isProfileEditing}
                    className={!isProfileEditing ? "bg-muted" : ""}
                  />
                </div>
                
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={userProfile.city}
                    onChange={(e) => setUserProfile({...userProfile, city: e.target.value})}
                    disabled={!isProfileEditing}
                    className={!isProfileEditing ? "bg-muted" : ""}
                  />
                </div>
                
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={userProfile.country}
                    onChange={(e) => setUserProfile({...userProfile, country: e.target.value})}
                    disabled={!isProfileEditing}
                    className={!isProfileEditing ? "bg-muted" : ""}
                  />
                </div>
              </div>
            </div>
            
            {isProfileEditing && (
              <div className="flex gap-2 mt-4">
                <Button onClick={() => setIsProfileEditing(false)}>
                  Save Changes
                </Button>
                <Button variant="outline" onClick={() => setIsProfileEditing(false)}>
                  Cancel
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add Account Button */}
        <div className="flex justify-end">
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

        {/* Bank Accounts */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" />
              Bank Accounts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {accounts.map((account) => (
                <div key={account.id} className="flex items-center justify-between p-4 border border-border rounded-xl hover:shadow-sm transition-all bg-card">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{account.name}</h3>
                      <Badge variant="outline" className={getAccountTypeColor(account.type)}>
                        {account.type.charAt(0).toUpperCase() + account.type.slice(1)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{account.bank}</p>
                    <p className="text-xs text-muted-foreground">Account: {account.accountNumber}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold text-lg ${account.balance >= 0 ? 'text-financial-savings' : 'text-financial-expense'}`}>
                      ${Math.abs(account.balance).toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {account.type === 'credit' ? 'Outstanding' : 'Available'}
                    </p>
                  </div>
                  <div className="flex gap-1 ml-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditDialog(account)}
                      className="text-primary hover:text-primary/80"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteAccount(account.id)}
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

export default Account;
