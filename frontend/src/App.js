import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UserPlus, Trash2, Edit2, Users, CheckCircle, XCircle } from 'lucide-react';

function App() {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '', age: '' });
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);

  // --- UPDATED TO RELATIVE PATH ---
  const fetchUsers = async () => {
    try {
      // Changed from 'http://localhost:5000/users' to '/users'
      const res = await axios.get('/users'); 
      setUsers(res.data);
    } catch (err) {
      setError("Failed to fetch users from database.");
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  // --- UPDATED TO RELATIVE PATHS ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // Changed to relative path
        await axios.put(`/users/${editingId}`, formData); 
        setEditingId(null);
      } else {
        // Changed to relative path
        await axios.post('/users', formData); 
      }
      
      setFormData({ name: '', email: '', age: '' });
      setError('');
      fetchUsers(); 
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
    }
  };

  const startEdit = (user) => {
    setEditingId(user._id);
    setFormData({ name: user.name, email: user.email, age: user.age });
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ name: '', email: '', age: '' });
  };

  // --- UPDATED TO RELATIVE PATH ---
  const deleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        // Changed to relative path
        await axios.delete(`/users/${id}`); 
        fetchUsers();
      } catch (err) {
        alert(err.response?.data?.message || "Delete failed");
      }
    }
  };

  // ... (Rest of your component styling and JSX remains exactly the same)
  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
      <h1 style={{ color: '#333', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Users size={32} /> User Management System
      </h1>
      
      <form onSubmit={handleSubmit} style={{ background: '#fff', padding: '25px', borderRadius: '12px', marginBottom: '30px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
        <h3 style={{ marginTop: 0 }}>{editingId ? "📝 Update User Info" : "➕ Add New User"}</h3>
        {error && <p style={{ color: '#d9534f', fontWeight: 'bold' }}>{error}</p>}
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          <input placeholder="Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required style={inputStyle} />
          <input placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required style={inputStyle} />
          <input placeholder="Age" type="number" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} style={inputStyle} />
          
          <button type="submit" style={{ ...btnStyle, backgroundColor: editingId ? '#007bff' : '#4CAF50' }}>
            {editingId ? <><CheckCircle size={16} /> Update User</> : <><UserPlus size={16} /> Add User</>}
          </button>
          
          {editingId && (
            <button type="button" onClick={cancelEdit} style={{ ...btnStyle, backgroundColor: '#6c757d' }}>
              <XCircle size={16} /> Cancel
            </button>
          )}
        </div>
      </form>

      <h3 style={{ color: '#555' }}>Database Records ({users.length})</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {users.map(user => (
          <div key={user._id} style={cardStyle}>
            <div>
              <h4 style={{ margin: '0 0 5px 0' }}>{user.name}</h4>
              <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>{user.email}</p>
              <p style={{ margin: '5px 0 0 0', fontSize: '0.85rem' }}>Age: {user.age || 'N/A'}</p>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => startEdit(user)} style={iconBtnStyle} title="Edit User">
                <Edit2 size={18} color="#007bff" />
              </button>
              <button onClick={() => deleteUser(user._id)} style={iconBtnStyle} title="Delete User">
                <Trash2 size={18} color="#ff4d4d" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const inputStyle = { padding: '12px', borderRadius: '6px', border: '1px solid #ddd', flex: '1', minWidth: '200px' };
const btnStyle = { padding: '12px 20px', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' };
const cardStyle = { background: '#fff', padding: '20px', borderRadius: '10px', borderLeft: '6px solid #4CAF50', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const iconBtnStyle = { background: 'none', border: 'none', cursor: 'pointer', padding: '5px' };

export default App;