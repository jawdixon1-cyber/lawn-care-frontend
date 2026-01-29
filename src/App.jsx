import React, { useState, useEffect } from 'react';
import { LogOut, Plus, Edit, Trash2, X, BookOpen, CheckSquare } from 'lucide-react';

const API_URL = 'https://lawn-care-backend-production.up.railway.app';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('standards');
  const [sopType, setSopType] = useState('service');
  
  const [standards, setStandards] = useState([]);
  const [sops, setSOPs] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [showStandardForm, setShowStandardForm] = useState(false);
  const [showSOPForm, setShowSOPForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [selectedStandard, setSelectedStandard] = useState(null);
  const [selectedSOP, setSelectedSOP] = useState(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    if (token) {
      fetchUser();
      fetchStandards();
      fetchSOPs();
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const res = await fetch(`${API_URL}/api/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        handleLogout();
      }
    } catch (err) {
      console.error('Error fetching user:', err);
    }
  };

  const fetchStandards = async () => {
    try {
      const res = await fetch(`${API_URL}/api/standards`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setStandards(data);
      }
    } catch (err) {
      console.error('Error fetching standards:', err);
    }
  };

  const fetchSOPs = async () => {
    try {
      const res = await fetch(`${API_URL}/api/sops`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSOPs(data);
      }
    } catch (err) {
      console.error('Error fetching SOPs:', err);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoading(true);
    
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setUser(data.user);
      } else {
        setLoginError(data.error || 'Login failed');
      }
    } catch (err) {
      setLoginError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setStandards([]);
    setSOPs([]);
  };

  const saveStandard = async (formData) => {
    setLoading(true);
    try {
      const url = editingItem 
        ? `${API_URL}/api/standards/${editingItem.id}`
        : `${API_URL}/api/standards`;
      
      const res = await fetch(url, {
        method: editingItem ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        await fetchStandards();
        setShowStandardForm(false);
        setEditingItem(null);
      }
    } catch (err) {
      alert('Error saving standard');
    } finally {
      setLoading(false);
    }
  };

  const deleteStandard = async (id) => {
    if (!confirm('Delete this standard?')) return;
    
    try {
      const res = await fetch(`${API_URL}/api/standards/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (res.ok) {
        await fetchStandards();
      }
    } catch (err) {
      alert('Error deleting standard');
    }
  };

  const saveSOP = async (formData) => {
    setLoading(true);
    try {
      const url = editingItem 
        ? `${API_URL}/api/sops/${editingItem.id}`
        : `${API_URL}/api/sops`;
      
      const res = await fetch(url, {
        method: editingItem ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        await fetchSOPs();
        setShowSOPForm(false);
        setEditingItem(null);
      }
    } catch (err) {
      alert('Error saving SOP');
    } finally {
      setLoading(false);
    }
  };

  const deleteSOP = async (id) => {
    if (!confirm('Delete this SOP?')) return;
    
    try {
      const res = await fetch(`${API_URL}/api/sops/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (res.ok) {
        await fetchSOPs();
      }
    } catch (err) {
      alert('Error deleting SOP');
    }
  };

  if (!token || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">🏡</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Lawn Care Hub</h1>
            <p className="text-gray-600 mt-2">Operations Dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="owner@lawncare.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="••••••••"
                required
              />
            </div>

            {loginError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Default: owner@lawncare.com / password123</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-stone-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white text-xl">
                🏡
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Lawn Care Hub</h1>
                <p className="text-xs text-gray-500">{user.name} • {user.role}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm">Logout</span>
            </button>
          </div>

          <nav className="flex space-x-2 mt-4">
            <button
              onClick={() => setCurrentView('standards')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                currentView === 'standards'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <CheckSquare className="w-4 h-4 inline mr-2" />
              Standards
            </button>
            <button
              onClick={() => setCurrentView('howto')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                currentView === 'howto'
                  ? 'bg-green-100 text-green-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <BookOpen className="w-4 h-4 inline mr-2" />
              How-To Guides
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {currentView === 'standards' && (
          <StandardsView
            standards={standards}
            user={user}
            onAdd={() => { setEditingItem(null); setShowStandardForm(true); }}
            onEdit={(std) => { setEditingItem(std); setShowStandardForm(true); }}
            onDelete={deleteStandard}
            onView={setSelectedStandard}
          />
        )}

        {currentView === 'howto' && (
          <SOPsView
            sops={sops}
            sopType={sopType}
            setSopType={setSopType}
            user={user}
            onAdd={() => { setEditingItem(null); setShowSOPForm(true); }}
            onEdit={(sop) => { setEditingItem(sop); setShowSOPForm(true); }}
            onDelete={deleteSOP}
            onView={setSelectedSOP}
          />
        )}
      </main>

      {showStandardForm && (
        <StandardForm
          standard={editingItem}
          onSave={saveStandard}
          onClose={() => { setShowStandardForm(false); setEditingItem(null); }}
          loading={loading}
        />
      )}

      {showSOPForm && (
        <SOPForm
          sop={editingItem}
          onSave={saveSOP}
          onClose={() => { setShowSOPForm(false); setEditingItem(null); }}
          loading={loading}
        />
      )}

      {selectedStandard && (
        <ViewModal item={selectedStandard} onClose={() => setSelectedStandard(null)} color="blue" />
      )}

      {selectedSOP && (
        <ViewModal item={selectedSOP} onClose={() => setSelectedSOP(null)} color="green" />
      )}
    </div>
  );
};

const StandardsView = ({ standards, user, onAdd, onEdit, onDelete, onView }) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Standards & Policies</h2>
        <p className="text-gray-600 mt-1">What's expected of our team</p>
      </div>
      {user.role === 'owner' && (
        <button onClick={onAdd} className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus className="w-5 h-5" />
          <span>Add Standard</span>
        </button>
      )}
    </div>

    <div className="grid md:grid-cols-2 gap-6">
      {standards.map((standard) => (
        <div
          key={standard.id}
          className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 shadow-md border-2 border-blue-200 hover:shadow-xl transition-all cursor-pointer group"
          onClick={() => onView(standard)}
        >
          <div className="flex items-start justify-between mb-3">
            <span className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">
              {standard.category}
            </span>
            {user.role === 'owner' && (
              <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={(e) => { e.stopPropagation(); onEdit(standard); }} className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <Edit className="w-4 h-4" />
                </button>
                <button onClick={(e) => { e.stopPropagation(); onDelete(standard.id); }} className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">{standard.title}</h3>
          <p className="text-gray-700 text-sm line-clamp-3">{standard.content}</p>
        </div>
      ))}
    </div>

    {standards.length === 0 && (
      <div className="text-center py-12">
        <p className="text-gray-500">No standards yet. Add your first one!</p>
      </div>
    )}
  </div>
);

const SOPsView = ({ sops, sopType, setSopType, user, onAdd, onEdit, onDelete, onView }) => {
  const filtered = sops.filter(sop => 
    sopType === 'service' ? sop.category === 'Service Work' : sop.category === 'Equipment & Maintenance'
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">How-To Guides</h2>
          <p className="text-gray-600 mt-1">Step-by-step procedures</p>
        </div>
        {user.role === 'owner' && (
          <button onClick={onAdd} className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            <Plus className="w-5 h-5" />
            <span>Add Guide</span>
          </button>
        )}
      </div>

      <div className="flex space-x-2 bg-white rounded-xl p-2 shadow-md border border-gray-200 w-fit">
        <button
          onClick={() => setSopType('service')}
          className={`px-6 py-3 rounded-lg font-semibold transition-all ${
            sopType === 'service' ? 'bg-green-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          🏡 Service Work
        </button>
        <button
          onClick={() => setSopType('maintenance')}
          className={`px-6 py-3 rounded-lg font-semibold transition-all ${
            sopType === 'maintenance' ? 'bg-orange-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          🔧 Equipment & Maintenance
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {filtered.map((sop) => (
          <div
            key={sop.id}
            className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-xl transition-all cursor-pointer group"
            onClick={() => onView(sop)}
          >
            <div className="flex items-start justify-between mb-3">
              <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                sopType === 'service' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
              }`}>
                {sop.category}
              </span>
              {user.role === 'owner' && (
                <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={(e) => { e.stopPropagation(); onEdit(sop); }} className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); onDelete(sop.id); }} className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{sop.title}</h3>
            <p className="text-gray-600 text-sm line-clamp-3">{sop.content}</p>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No guides yet. Add your first one!</p>
        </div>
      )}
    </div>
  );
};

const StandardForm = ({ standard, onSave, onClose, loading }) => {
  const [formData, setFormData] = useState({
    title: standard?.title || '',
    category: standard?.category || '',
    content: standard?.content || ''
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-5 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold">{standard ? 'Edit' : 'Add'} Standard</h3>
            <button onClick={onClose} className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
            <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg" required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
            <input type="text" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg" required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Content</label>
            <textarea value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg min-h-[300px]" required />
          </div>
          <div className="flex space-x-3">
            <button type="submit" disabled={loading} className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50">
              {loading ? 'Saving...' : 'Save Standard'}
            </button>
            <button type="button" onClick={onClose} className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const SOPForm = ({ sop, onSave, onClose, loading }) => {
  const [formData, setFormData] = useState({
    title: sop?.title || '',
    category: sop?.category || 'Service Work',
    content: sop?.content || ''
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-5 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold">{sop ? 'Edit' : 'Add'} Guide</h3>
            <button onClick={onClose} className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
            <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg" required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
            <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg" required>
              <option value="Service Work">Service Work</option>
              <option value="Equipment & Maintenance">Equipment & Maintenance</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Content</label>
            <textarea value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg min-h-[300px]" required />
          </div>
          <div className="flex space-x-3">
            <button type="submit" disabled={loading} className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50">
              {loading ? 'Saving...' : 'Save Guide'}
            </button>
            <button type="button" onClick={onClose} className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ViewModal = ({ item, onClose, color }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={onClose}>
    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
      <div className={`sticky top-0 bg-gradient-to-r from-${color}-600 to-${color}-700 text-white px-6 py-5 rounded-t-2xl`}>
        <div className="flex items-center justify-between">
          <div>
            <span className="px-3 py-1 bg-white bg-opacity-20 text-white text-xs font-semibold rounded-full">{item.category}</span>
            <h3 className="text-2xl font-bold mt-3">{item.title}</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg">
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>
      <div className="px-6 py-6">
        <pre className="whitespace-pre-wrap font-sans text-gray-700 leading-relaxed">{item.content}</pre>
      </div>
    </div>
  </div>
);

export default App;
