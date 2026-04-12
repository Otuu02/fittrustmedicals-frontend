// src/app/api/wallet/route.ts
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// Mock wallet data - replace with your database
let walletData = {
  balance: 0,
  totalEarned: 0,
  totalWithdrawn: 0,
  pendingWithdrawals: 0,
};

let transactions: any[] = [];
let bankAccounts: any[] = [];

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      data: {
        balance: walletData.balance,
        totalEarned: walletData.totalEarned,
        totalWithdrawn: walletData.totalWithdrawn,
        pendingWithdrawals: walletData.pendingWithdrawals,
        transactions: transactions.slice(0, 20),
        bankAccounts: bankAccounts,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch wallet data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, amount, bankDetails } = await request.json();

    if (action === 'withdraw') {
      if (walletData.balance < amount) {
        return NextResponse.json(
          { success: false, error: 'Insufficient balance' },
          { status: 400 }
        );
      }

      // Process withdrawal via Paystack Transfer API
      const withdrawalResult = await processWithdrawal(amount, bankDetails);

      if (withdrawalResult.success) {
        walletData.balance -= amount;
        walletData.totalWithdrawn += amount;
        walletData.pendingWithdrawals -= amount;
        
        transactions.push({
          id: Date.now(),
          type: 'debit',
          amount: amount,
          status: 'completed',
          reference: withdrawalResult.reference,
          createdAt: new Date(),
          description: 'Withdrawal to bank',
        });

        return NextResponse.json({
          success: true,
          message: 'Withdrawal initiated successfully',
          data: { balance: walletData.balance },
        });
      } else {
        return NextResponse.json(
          { success: false, error: withdrawalResult.error },
          { status: 400 }
        );
      }
    }

    if (action === 'addBankAccount') {
      // Add bank account for withdrawals
      const bankAccount = {
        id: Date.now(),
        ...bankDetails,
        createdAt: new Date(),
      };
      bankAccounts.push(bankAccount);
      
      return NextResponse.json({
        success: true,
        message: 'Bank account added successfully',
        data: bankAccount,
      });
    }

    if (action === 'removeBankAccount') {
      bankAccounts = bankAccounts.filter(acc => acc.id !== bankDetails.accountId);
      return NextResponse.json({
        success: true,
        message: 'Bank account removed successfully',
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Wallet operation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

async function processWithdrawal(amount: number, bankDetails: any) {
  try {
    // First, create transfer recipient
    const recipientResponse = await axios.post(
      'https://api.paystack.co/transferrecipient',
      {
        type: 'nuban',
        name: bankDetails.accountName,
        account_number: bankDetails.accountNumber,
        bank_code: bankDetails.bankCode,
        currency: 'NGN',
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const recipientCode = recipientResponse.data.data.recipient_code;

    // Initiate transfer
    const transferResponse = await axios.post(
      'https://api.paystack.co/transfer',
      {
        source: 'balance',
        amount: amount * 100,
        recipient: recipientCode,
        reason: 'Wallet withdrawal',
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return { 
      success: true, 
      reference: transferResponse.data.data.reference 
    };
  } catch (error: any) {
    console.error('Withdrawal failed:', error.response?.data || error.message);
    return { 
      success: false, 
      error: error.response?.data?.message || 'Withdrawal failed' 
    };
  }
}