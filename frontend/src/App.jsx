import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

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
  const [loading, setLoading] = useState(true);

  const fetchExpenses = () => {
    fetch('http://localhost:8080/api/expenses')
      .then(response => response.json())
      .then(data => {
        setExpenses(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching expenses:', error);
        setLoading(false);
      });
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

  const chartData = categoryTotals.map(row => ({
    name: row[0],
    value: row[1]
  }));

  const COLORS = ['#f0997b', '#85b7eb', '#9d7bdd', '#1d9e75', '#efb45a'];

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

    <div className="glass-card mb-6 flex justify-center">
        <PieChart width={400} height={300}>
          <defs>
            {[
              ['#f0997b', '#d85a30'],
              ['#85b7eb', '#378add'],
              ['#b5a8f0', '#7f77dd'],
              ['#5dcaa5', '#1d9e75'],
              ['#f4c775', '#ef9f27'],
            ].map((pair, i) => (
              <linearGradient key={i} id={`g${i}`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={pair[0]} stopOpacity={0.9} />
                <stop offset="100%" stopColor={pair[1]} stopOpacity={0.45} />
              </linearGradient>
            ))}
          </defs>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            innerRadius={55}
            paddingAngle={3}
            stroke="rgba(255,255,255,0.15)"
            strokeWidth={1}
            label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
            labelLine={false}
            >
              {chartData.map((entry, index) => (
                <Cell key={index} fill={`url(#g${index % 5})`} />
              ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: 'rgba(20,22,30,0.95)',
              border: '0.5px solid rgba(255,255,255,0.15)',
              borderRadius: '10px',
              color: 'white'
            }}
            itemStyle={{ color: 'white'}}
          />
          <Legend wrapperStyle={{ color: 'white' }} />
        </PieChart>
    </div>

      {loading ? (
        <p className="text-gray-400 text-center py-8"> Loading expenses... </p>
      ) : expenses.length === 0 ? (
        <p className="text-gray-400 text-center py-8"> No expense yet. Add your first one above. </p>
      ) : (
        <ul>
          {expenses.map(expense => (
            <li key={expense.id} className="flex justify-between items-center py-3 border-b border-white/10">
              <span className="text-gray-100">
                {expense.category} - ${expense.amount} - {expense.date}
              </span>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(expense)} className="btn-edit"> Edit </button>
                <button onClick={() => handleDelete(expense)} className="btn-delete"> Delete </button>
              </div>
            </li>
          ))}
        </ul>
      )
    }
    </div>
  );
}

export default App;