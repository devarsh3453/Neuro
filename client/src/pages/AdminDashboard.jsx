import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  const [overview, setOverview] = useState(null);
  const [students, setStudents] = useState([]);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    if (user && user.role !== 'admin') {
      alert('Access denied: Admins only');
      navigate('/');
      return;
    }

    const fetchAdminData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [ovRes, stRes, quRes] = await Promise.all([
          api.get('/analytics/overview'),
          api.get('/analytics/students'),
          api.get('/analytics/questions'),
        ]);
        setOverview(ovRes.data);
        setStudents(stRes.data.students || []);
        setQuestions(quRes.data.questions || []);
      } catch (err) {
        console.error('Error fetching admin data:', err);
        setError('Failed to load dashboard data. Please ensure you are logged in as an admin.');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [user, navigate]);

  if (loading) return <Spinner />;

  if (error) {
    return (
      <div style={styles.errorContainer}>
        <p style={styles.errorText}>{error}</p>
        <button style={styles.retryButton} onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  const getAccuracyColor = (rate) => {
    if (rate >= 70) return '#27ae60';
    if (rate >= 40) return '#f39c12';
    return '#e74c3c';
  };

  const renderOverview = () => (
    <div style={styles.tabContent}>
      <div style={styles.statsRow}>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>Total Students</div>
          <div style={styles.statValue}>{overview?.totalStudents || 0}</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>Total Questions</div>
          <div style={styles.statValue}>{overview?.totalQuestions || 0}</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>Total Attempts</div>
          <div style={styles.statValue}>{overview?.totalAttempts || 0}</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>Overall Accuracy</div>
          <div style={{ ...styles.statValue, color: getAccuracyColor(overview?.overallAccuracy) }}>
            {overview?.overallAccuracy || 0}%
          </div>
        </div>
      </div>

      <div style={styles.highlightsGrid}>
        <div style={styles.highlightBox}>
          <h3 style={styles.highlightLabel}>🔥 Most Attempted Question</h3>
          {overview?.mostAttemptedQuestion ? (
            <>
              <p style={styles.highlightText}>
                {overview.mostAttemptedQuestion.questionText.slice(0, 80)}...
              </p>
              <div style={styles.highlightMeta}>
                <span style={styles.badge}>{overview.mostAttemptedQuestion.subject}</span>
                <span style={styles.metaLabel}>Attempted {overview.mostAttemptedQuestion.attemptCount} times</span>
              </div>
            </>
          ) : <p>No data yet</p>}
        </div>

        <div style={styles.highlightBox}>
          <h3 style={styles.highlightLabel}>🧠 Hardest Question</h3>
          {overview?.hardestQuestion ? (
            <>
              <p style={styles.highlightText}>
                {overview.hardestQuestion.questionText.slice(0, 80)}...
              </p>
              <div style={styles.highlightMeta}>
                <span style={styles.badge}>{overview.hardestQuestion.subject}</span>
                <span style={{ ...styles.metaLabel, color: '#e74c3c', fontWeight: 'bold' }}>
                    Accuracy: {overview.hardestQuestion.accuracyRate}%
                </span>
              </div>
            </>
          ) : <p>No data yet (requires min 2 attempts)</p>}
        </div>
      </div>
    </div>
  );

  const renderStudents = () => (
    <div style={styles.tabContent}>
      <h2 style={styles.sectionHeading}>All Students ({students.length})</h2>
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Attempts</th>
              <th style={styles.th}>Accuracy</th>
              <th style={styles.th}>Confidence</th>
              <th style={styles.th}>Avg Edits</th>
            </tr>
          </thead>
          <tbody>
            {students.map(s => (
              <tr key={s.id} style={styles.tr}>
                <td style={styles.td}>{s.name}</td>
                <td style={styles.td}>{s.email}</td>
                <td style={styles.td}>{s.totalAttempts}</td>
                <td style={{ ...styles.td, color: getAccuracyColor(s.accuracyRate), fontWeight: 'bold' }}>
                    {s.accuracyRate}%
                </td>
                <td style={styles.td}>{s.confidenceLevel}</td>
                <td style={styles.td}>{s.avgEditCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderQuestions = () => (
    <div style={styles.tabContent}>
      <h2 style={styles.sectionHeading}>Question Analytics ({questions.length})</h2>
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Question</th>
              <th style={styles.th}>Subject</th>
              <th style={styles.th}>Difficulty</th>
              <th style={styles.th}>Attempts</th>
              <th style={styles.th}>Accuracy %</th>
              <th style={styles.th}>Avg Time to Input</th>
            </tr>
          </thead>
          <tbody>
            {questions.map(q => (
              <tr key={q.id} style={styles.tr}>
                <td style={styles.td}>{q.questionText.slice(0, 55)}...</td>
                <td style={styles.td}><span style={styles.badge}>{q.subject}</span></td>
                <td style={styles.td}>
                    <span style={{ 
                        ...styles.badge, 
                        backgroundColor: q.difficulty === 'easy' ? '#d4edda' : q.difficulty === 'medium' ? '#fff3cd' : '#f8d7da',
                        color: q.difficulty === 'easy' ? '#155724' : q.difficulty === 'medium' ? '#856404' : '#721c24'
                    }}>
                        {q.difficulty}
                    </span>
                </td>
                <td style={styles.td}>{q.totalAttempts}</td>
                <td style={{ ...styles.td, fontWeight: 'bold' }}>{q.accuracyRate}%</td>
                <td style={styles.td}>{q.avgTimeToFirstInput}ms</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Admin Dashboard</h1>
        <p style={styles.subtitle}>NeuroTrace Class Analytics</p>
      </header>

      <div style={styles.tabBar}>
        <button 
          style={{ ...styles.tabButton, ...(activeTab === 'overview' ? styles.activeTab : {}) }}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          style={{ ...styles.tabButton, ...(activeTab === 'students' ? styles.activeTab : {}) }}
          onClick={() => setActiveTab('students')}
        >
          Students
        </button>
        <button 
          style={{ ...styles.tabButton, ...(activeTab === 'questions' ? styles.activeTab : {}) }}
          onClick={() => setActiveTab('questions')}
        >
          Questions
        </button>
      </div>

      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'students' && renderStudents()}
      {activeTab === 'questions' && renderQuestions()}
    </div>
  );
}

const styles = {
  container: { padding: '40px 20px', maxWidth: '1100px', margin: '0 auto', textAlign: 'left' },
  header: { marginBottom: '30px' },
  title: { fontSize: '2.5rem', margin: '0 0 5px 0', color: '#333' },
  subtitle: { fontSize: '1.1rem', color: '#666', margin: 0 },
  
  tabBar: { display: 'flex', gap: '10px', borderBottom: '2px solid #eee', marginBottom: '30px' },
  tabButton: { 
    padding: '12px 24px', fontSize: '1rem', border: 'none', background: 'none', 
    cursor: 'pointer', color: '#666', transition: '0.2s', borderBottom: '3px solid transparent' 
  },
  activeTab: { color: '#3498db', borderBottomColor: '#3498db', fontWeight: '600' },

  tabContent: { animation: 'fadeIn 0.3s ease-in' },
  statsRow: { display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '30px' },
  statCard: { 
    flex: '1 1 200px', background: '#fff', padding: '20px', borderRadius: '12px', 
    boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #eee', textAlign: 'center' 
  },
  statLabel: { fontSize: '0.85rem', color: '#888', textTransform: 'uppercase', marginBottom: '8px' },
  statValue: { fontSize: '1.8rem', fontWeight: 'bold' },

  highlightsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' },
  highlightBox: { 
    background: '#fff', padding: '25px', borderRadius: '15px', border: '1px solid #eee', 
    boxShadow: '0 2px 8px rgba(0,0,0,0.03)' 
  },
  highlightLabel: { fontSize: '1.1rem', margin: '0 0 15px 0', color: '#2c3e50' },
  highlightText: { fontSize: '1rem', color: '#444', lineHeight: '1.5', marginBottom: '15px' },
  highlightMeta: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  metaLabel: { fontSize: '0.9rem', color: '#7f8c8d' },

  badge: { 
    padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', 
    backgroundColor: '#f0f2f5', color: '#555', fontWeight: '600' 
  },

  sectionHeading: { fontSize: '1.5rem', marginBottom: '20px', color: '#333' },
  tableWrapper: { overflowX: 'auto', background: '#fff', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.03)' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
  th: { padding: '15px', borderBottom: '2px solid #f0f0f0', color: '#666', fontWeight: '600', fontSize: '0.9rem' },
  td: { padding: '15px', borderBottom: '1px solid #f9f9f9', color: '#444', fontSize: '0.9rem' },
  tr: { transition: 'background-color 0.1s' },

  errorContainer: { textAlign: 'center', padding: '50px' },
  errorText: { color: '#e74c3c', marginBottom: '20px' },
  retryButton: { padding: '10px 20px', backgroundColor: '#3498db', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }
};
