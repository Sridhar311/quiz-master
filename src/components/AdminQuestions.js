import React, { useState, useEffect } from 'react';
import {
  getCategories,
  addCategory,
  editCategory,
  deleteCategory,
  getQuestions,
  addQuestion,
  editQuestion,
  deleteQuestion
} from '../utils/api';
import '../components/AdminPanel.css';
import AdminUsers from './AdminUsers';

// Simple icon components
const EditIcon = () => <span role="img" aria-label="edit">✏️</span>;
const DeleteIcon = () => <span role="img" aria-label="delete">🗑️</span>;
const AddIcon = () => <span role="img" aria-label="add">➕</span>;
const CategoryIcon = () => <span role="img" aria-label="category">📂</span>;
const QuestionIcon = () => <span role="img" aria-label="question">❓</span>;

const SIDEBAR_LINKS = [
  { key: 'questions', label: 'All Questions', icon: <QuestionIcon /> },
  { key: 'add', label: 'Add Question', icon: <AddIcon /> },
  { key: 'categories', label: 'Categories', icon: <CategoryIcon /> },
  { key: 'users', label: 'Users', icon: <span role="img" aria-label="users">👥</span> },
];

function AdminQuestions({ user }) {
  const [activePage, setActivePage] = useState('questions');
  const [questions, setQuestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDir, setSortDir] = useState('desc');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [modalData, setModalData] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch questions and categories
  useEffect(() => {
    fetchQuestions();
    fetchCategories();
  }, []);

  async function fetchQuestions() {
    setLoading(true);
    try {
      let data = await getQuestions();
      // Sort
      data = data.sort((a, b) => {
        if (sortBy === 'createdAt') {
          return sortDir === 'desc' ? new Date(b.createdAt) - new Date(a.createdAt) : new Date(a.createdAt) - new Date(b.createdAt);
        } else if (sortBy === 'category') {
          return sortDir === 'desc' ? b.category.localeCompare(a.category) : a.category.localeCompare(b.category);
        } else {
          return 0;
        }
      });
      setQuestions(data);
    } catch (err) {
      setQuestions([]);
    }
    setLoading(false);
  }

  async function fetchCategories() {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      setCategories([]);
    }
  }

  // Toast helper
  function showToastMsg(msg) {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  }

  // Modal helpers
  function openModal(type, data = null) {
    setModalType(type);
    setModalData(data);
    setShowModal(true);
  }
  function closeModal() {
    setShowModal(false);
    setModalData(null);
  }

  // CRUD handlers
  async function handleAddQuestion(data) {
    await addQuestion(data);
    fetchQuestions();
    showToastMsg('Question added!');
    closeModal();
  }
  async function handleEditQuestion(id, data) {
    await editQuestion(id, data);
    fetchQuestions();
    showToastMsg('Question updated!');
    closeModal();
  }
  async function handleDeleteQuestion(id) {
    if (!window.confirm('Delete this question?')) return;
    await deleteQuestion(id);
    fetchQuestions();
    showToastMsg('Question deleted!');
  }
  async function handleAddCategory(name) {
    await addCategory(name);
    fetchCategories();
    showToastMsg('Category added!');
    closeModal();
  }
  async function handleEditCategory(id, name) {
    await editCategory(id, name);
    fetchCategories();
    showToastMsg('Category updated!');
    closeModal();
  }
  async function handleDeleteCategory(id) {
    if (!window.confirm('Delete this category?')) return;
    await deleteCategory(id);
    fetchCategories();
    showToastMsg('Category deleted!');
  }

  // Filtered and searched questions
  const filteredQuestions = questions.filter(q =>
    (!selectedCategory || q.category === selectedCategory) &&
    (q.question.toLowerCase().includes(search.toLowerCase()) ||
      q.options.some(opt => opt.toLowerCase().includes(search.toLowerCase())))
  );

  // Branding: initials from email
  const initials = user?.email ? user.email[0].toUpperCase() : 'A';

  return (
    <div className="admin-panel-container">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-logo">QuizAdmin</div>
        <div className="admin-sidebar-avatar">{initials}</div>
        <nav className="admin-sidebar-nav">
          {SIDEBAR_LINKS.map(link => (
            <div
              key={link.key}
              className={`admin-sidebar-link${activePage === link.key ? ' active' : ''}`}
              onClick={() => setActivePage(link.key)}
            >
              {link.icon} <span style={{ marginLeft: 10 }}>{link.label}</span>
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="admin-panel-content">
        {/* Header */}
        <div className="admin-panel-header">
          <div className="admin-panel-title">
            {activePage === 'questions' && 'All Questions'}
            {activePage === 'add' && 'Add Question'}
            {activePage === 'categories' && 'Categories'}
            {activePage === 'users' && 'Users'}
          </div>
          {activePage === 'questions' && (
            <button className="admin-panel-btn" onClick={() => openModal('add')}> <AddIcon /> Add Question</button>
          )}
          {activePage === 'categories' && (
            <button className="admin-panel-btn" onClick={() => openModal('addCategory')}> <AddIcon /> Add Category</button>
          )}
        </div>

        {/* Content */}
        {activePage === 'questions' && (
          <>
            <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
              <select
                className="admin-form-select"
                value={selectedCategory}
                onChange={e => { setSelectedCategory(e.target.value); fetchQuestions(); }}
                style={{ minWidth: 180 }}
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
              <input
                className="admin-form-input"
                placeholder="Search questions or options..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ minWidth: 220 }}
              />
              <select
                className="admin-form-select"
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
              >
                <option value="createdAt">Sort by Date</option>
                <option value="category">Sort by Category</option>
              </select>
              <select
                className="admin-form-select"
                value={sortDir}
                onChange={e => setSortDir(e.target.value)}
              >
                <option value="desc">Desc</option>
                <option value="asc">Asc</option>
              </select>
            </div>
            {loading ? (
              <div>Loading...</div>
            ) : (
              <div className="admin-card-list">
                {filteredQuestions.map(q => (
                  <div className="admin-card" key={q.id}>
                    <div style={{ fontWeight: 600 }}>{q.question}</div>
                    <div><b>Category:</b> {q.category}</div>
                    <div><b>Options:</b> {q.options.join(', ')}</div>
                    <div><b>Answer:</b> {q.answer}</div>
                    <div className="admin-table-actions">
                      <button className="admin-panel-btn" onClick={() => openModal('edit', q)}><EditIcon /> Edit</button>
                      <button className="admin-panel-btn" onClick={() => handleDeleteQuestion(q.id)}><DeleteIcon /> Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {activePage === 'add' && (
          <QuestionForm
            categories={categories}
            onSubmit={handleAddQuestion}
            onCancel={() => setActivePage('questions')}
          />
        )}

        {activePage === 'categories' && (
          <div>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map(cat => (
                  <tr key={cat.id}>
                    <td>{cat.name}</td>
                    <td className="admin-table-actions">
                      <button className="admin-panel-btn" onClick={() => openModal('editCategory', cat)}><EditIcon /> Edit</button>
                      <button className="admin-panel-btn" onClick={() => handleDeleteCategory(cat.id)}><DeleteIcon /> Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activePage === 'users' && (
          <AdminUsers />
        )}

        {/* Modal for add/edit question/category */}
        {showModal && (
          <div className="admin-modal-backdrop" onClick={closeModal}>
            <div className="admin-modal" onClick={e => e.stopPropagation()}>
              {modalType === 'add' && (
                <QuestionForm
                  categories={categories}
                  onSubmit={handleAddQuestion}
                  onCancel={closeModal}
                />
              )}
              {modalType === 'edit' && (
                <QuestionForm
                  categories={categories}
                  initialData={modalData}
                  onSubmit={data => handleEditQuestion(modalData.id, data)}
                  onCancel={closeModal}
                />
              )}
              {modalType === 'addCategory' && (
                <CategoryForm
                  onSubmit={handleAddCategory}
                  onCancel={closeModal}
                />
              )}
              {modalType === 'editCategory' && (
                <CategoryForm
                  initialData={modalData}
                  onSubmit={name => handleEditCategory(modalData.id, name)}
                  onCancel={closeModal}
                />
              )}
            </div>
          </div>
        )}

        {/* Toast notification */}
        {showToast && <div className="admin-toast">{toastMsg}</div>}
      </main>
    </div>
  );
}

// Question form component
function QuestionForm({ categories, initialData = {}, onSubmit, onCancel }) {
  const [question, setQuestion] = useState(initialData.question || '');
  const [options, setOptions] = useState(initialData.options || ['', '', '', '']);
  const [answer, setAnswer] = useState(initialData.answer || '');
  const [category, setCategory] = useState(initialData.category || (categories[0]?.name || ''));

  function handleChangeOption(idx, value) {
    const newOpts = [...options];
    newOpts[idx] = value;
    setOptions(newOpts);
  }
  function handleSubmit(e) {
    e.preventDefault();
    if (!question || !answer || !category || options.some(opt => !opt)) return;
    onSubmit({ question, options, answer, category });
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="admin-form-group">
        <label className="admin-form-label">Question</label>
        <input className="admin-form-input" value={question} onChange={e => setQuestion(e.target.value)} required />
      </div>
      <div className="admin-form-group">
        <label className="admin-form-label">Options</label>
        {options.map((opt, idx) => (
          <input
            key={idx}
            className="admin-form-input"
            value={opt}
            onChange={e => handleChangeOption(idx, e.target.value)}
            placeholder={`Option ${idx + 1}`}
            required
            style={{ marginBottom: 8 }}
          />
        ))}
      </div>
      <div className="admin-form-group">
        <label className="admin-form-label">Answer</label>
        <input className="admin-form-input" value={answer} onChange={e => setAnswer(e.target.value)} required />
      </div>
      <div className="admin-form-group">
        <label className="admin-form-label">Category</label>
        <select className="admin-form-select" value={category} onChange={e => setCategory(e.target.value)} required>
          {categories.map(cat => (
            <option key={cat.id} value={cat.name}>{cat.name}</option>
          ))}
        </select>
      </div>
      <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
        <button className="admin-panel-btn" type="submit"><AddIcon /> Save</button>
        <button className="admin-panel-btn" type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

// Category form component
function CategoryForm({ initialData = {}, onSubmit, onCancel }) {
  const [name, setName] = useState(initialData.name || '');
  function handleSubmit(e) {
    e.preventDefault();
    if (!name) return;
    onSubmit(name);
  }
  return (
    <form onSubmit={handleSubmit}>
      <div className="admin-form-group">
        <label className="admin-form-label">Category Name</label>
        <input className="admin-form-input" value={name} onChange={e => setName(e.target.value)} required />
      </div>
      <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
        <button className="admin-panel-btn" type="submit"><AddIcon /> Save</button>
        <button className="admin-panel-btn" type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

export default AdminQuestions; 