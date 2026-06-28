package com.aryan.expensetracker;

import org.springframework.data.jpa.repository.*;
import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    @Query("SELECT e.category, SUM(e.amount) FROM Expense e GROUP BY e.category")
    List<Object[]> getTotalsByCategory();

    @Query("SELECT FUNCTION('TO_CHAR', e.date, 'YYYY-MM') AS month, SUM(e.amount)" + "FROM Expense e GROUP BY FUNCTION('TO_CHAR', e.date, 'YYYY-MM') ORDER BY month")
    List<Object[]> getTotalsByMonth();
}
