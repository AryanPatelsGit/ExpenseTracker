package com.aryan.expensetracker;

import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ExpenseService {
    
    private final ExpenseRepository expenseRepository;

    public ExpenseService(ExpenseRepository expenseRepository) {
        this.expenseRepository = expenseRepository;
    }

    public List<Expense> getAllExpenses() {
        return expenseRepository.findAll();
    }

    public Expense getExpenseById(Long id) {
        return expenseRepository.findById(id).orElse(null);
    }

    public Expense saveExpense(Expense expense) {
        return expenseRepository.save(expense);
    }

    public Expense updateExpense(Long id, Expense expense) {
        Expense existingExpense = expenseRepository.findById(id).orElse(null);
        existingExpense.setAmount(expense.getAmount());
        existingExpense.setDate(expense.getDate());
        existingExpense.setDescription(expense.getDescription());
        existingExpense.setCategory(expense.getCategory());
        return expenseRepository.save(existingExpense);
    }

    public void deleteExpense(Long id) {
        expenseRepository.deleteById(id);
    }
}
