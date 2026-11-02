// bankTransaction.js

class BankAccount {
  constructor(initialBalance) {
    this.balance = initialBalance;
  }

  deposit(amount) {
    // BUG #1: Negative deposits are allowed
    this.balance += amount;
  }

  withdraw(amount) {
    // BUG #2: No insufficient balance check
    this.balance -= amount;
  }

  transfer(amount, targetAccount) {
    // BUG #3: Amount added before withdrawal
    targetAccount.balance += amount;
    this.balance -= amount;
  }

  getBalance() {
    return this.balance;
  }
}

// Demo
const accountA = new BankAccount(1000);
const accountB = new BankAccount(500);

accountA.deposit(-200); // Should not be allowed
accountA.withdraw(2000); // Should fail

accountA.transfer(300, accountB);

if (accountA.getBalance() = 0) { // BUG #4: Assignment instead of comparison
  console.log("Account is empty");
}

console.log("Account A:", accountA.getBalance());
console.log("Account B:", accountB.getBalance());