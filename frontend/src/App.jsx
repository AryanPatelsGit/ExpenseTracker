import { useState, useEffect } from 'react';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({
    amount: '',
    category: 'Groceries',
    date: '',
    description: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [categoryTotals, setCategoryTotals] = useState([]);
  const [monthTotals, setMonthTotals] = useState([]);

  const fetchExpenses = () => {
    fetch('http://localhost:8080/api/expenses')
      .then(response => response.json())
      .then(data => setExpenses(data))
      .catch(error => console.error('Error fetching expenses:', error));
  };

  const fetchSummaries = () => {
    fetch('http://localhost:8080/api/expenses/summary/category')
      .then(res => res.json())
      .then(data => setCategoryTotals(data))
      .catch(err => console.error('Error fetching category totals:', err))

    fetch('http://localhost:8080/api/expenses/summary/month')
      .then(res => res.json())
      .then(data => setMonthTotals(data))
      .catch(err => console.error('Error fetching month totals:', err))
  };
    useEffect(() => {
      fetchExpenses();
      fetchSummaries();
    }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    const url = editingId ? `http://localhost:8080/api/expenses/${editingId}` : 'http://localhost:8080/api/expenses';

    const method = editingId ? 'PUT' : 'POST';

    fetch(url, {
      method: method,
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        ...form,
        amount: parseFloat(form.amount)
      })
    })
    .then(response => response.json())
    .then(() => {
      fetchExpenses();
      fetchSummaries();
      setForm({ amount: '', category: '', date: '', description: ''});
      setEditingId(null);
    })
    .catch(error => console.error('Error saving expense:', error));
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:8080/api/expenses/${id}`, {
      method: 'DELETE'
    })
    .then(() => {
      fetchExpenses();
      fetchSummaries();
    })
    .catch(error => console.error('Error deleting expense:', error));
  };

  const handleEdit = (expense) => {
    setForm({
      amount: expense.amount,
      category: expense.category,
      date: expense.date,
      description: expense.description
    });
    setEditingId(expense.id);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold mb-6 gradient-text">Expense Tracker</h1>

      <div className="mb-6 flex gap-2 flex-wrap">
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={form.amount}
          onChange={handleChange}
          className="glass-input flex-1 min-w-[90px]"
        />
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="glass-input flex-1 min-w-[90px]"
        >
          <option className="text-black"> Groceries </option>
          <option className="text-black"> Transport </option>
          <option className="text-black"> Utilities </option>
          <option className="text-black"> Dining </option>
          <option className="text-black"> Other </option>
        </select>
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="glass-input flex-1 min-w-[90px]"
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="glass-input flex-1 min-w-[120px]"
        />
      </div>

      <button onClick={handleSubmit} className="btn-add mb-6 w-full">
        {editingId ? 'Update' : 'Add'}
      </button>

    <div className="mb-6 grid grid-cols-2 gap-3">
      <div className="glass-card">
        <h2 className="text-sm text-gray-400 mb-2"> By category </h2>
        {categoryTotals.map((row, index) => (
          <div key={index} className="flex justify-between text-gray-100 py-0.5">
            <span> {row[0]} </span>
            <span> ${row[1]} </span>
          </div>
        ))}
      </div>

      <div className="glass-card">
        <h2 className="text-sm text-gray-400 mb-2"> By month </h2>
        {monthTotals.map((row, index) => (
          <div key={index} className="flex justify-between text-gray-100 py-0.5">
            <span> {row[0]} </span>
            <span> ${row[1]} </span>
          </div>
        ))}
      </div>
    </div>

      <ul>
        {expenses.map(expense => (
          <li key={expense.id} className="flex justify-between items-center py-3 border-b border-white/10">
            <span className="text-gray-100">
              {expense.category} — ${expense.amount} — {expense.date}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(expense)}
                className="btn-edit">
                  Edit
              </button>
              <button
              onClick={() => handleDelete(expense.id)}
              className="btn-delete">
                Delete
            </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;