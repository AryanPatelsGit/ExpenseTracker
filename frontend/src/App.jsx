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
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">Expense Tracker</h1>

      <div className="mb-6 flex gap-2 flex-wrap">
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={form.amount}
          onChange={handleChange}
          className="border rounded px-3 py-2"
        />
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="border rounded px-3 py-2"
        >
          <option>Groceries</option>
          <option>Transport</option>
          <option>Utilities</option>
          <option>Dining</option>
          <option>Other</option>
        </select>
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="border rounded px-3 py-2"
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="border rounded px-3 py-2"
        />
      </div>

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700">
        Add Expense
      </button>

    <div className="mb-6 grid grid-cols-2 gap-4">
      <div className="border rounded p-4">
        <h2 className="font-bold mb-2"> By category </h2>
        {categoryTotals.map((row, index) => (
          <div key={index} className="flex justify-between">
            <span> {row[0]} </span>
            <span> ${row[1]} </span>
          </div>
        ))}
      </div>

      <div className="border rounded p-4">
        <h2 className="font-bold mb-2"> By month </h2>
        {monthTotals.map((row, index) => (
          <div key={index} className="flex justify-between">
            <span> {row[0]} </span>
            <span> ${row[1]} </span>
          </div>
        ))}
      </div>
    </div>

      <ul>
        {expenses.map(expense => (
          <li key={expense.id} className="border-b py-2">
            <span>
              {expense.category} — ${expense.amount} — {expense.date}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(expense)}
                className="bg-yellow-500 text-white rounded px-3 py-1 text-sm hover:bg-yellow-600">
                  Edit
              </button>
              <button
              onClick={() => handleDelete(expense.id)}
              className="bg-red-500 text-white rounded px-3 py-1 text-sm hover:bg-red-600">
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