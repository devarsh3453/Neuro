import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Spinner from '../components/Spinner';

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [profileRes, attemptsRes] = await Promise.all([
        api.get('/profile/my'),
        api.get('/attempts/my'),
      ]);
      setProfile(profileRes.data);
      const atts = attemptsRes.data.attempts || [];
      setAttempts(atts);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.response?.data?.message || 'Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <div style={styles.errorContainer}>
        <p style={styles.errorText}>{error}</p>
        <button style={styles.retryButton} onClick={fetchData}>Retry</button>
      </div>
    );
  }

  const getAccuracyColor = (rate) => {
    if (rate >= 70) return '#27ae60';
    if (rate >= 40) return '#f39c12';
    return '#e74c3c';
  };

  const getLevelColor = (level, type) => {
    const l = level?.toLowerCase() || '';
    if (type === 'confidence') {
        if (l === 'high') return '#27ae60';
        if (l === 'medium') return '#f39c12';
        return '#e74c3c'; // Low or Very Low
    }
    if (type === 'hesitation') {
        if (l === 'low') return '#27ae60';
        if (l === 'medium') return '#f39c12';
        return '#e74c3c'; // High or Very High
    }
    return 'inherit';
  };

  const latestFeedbackAttempt = attempts.find(a => a.feedback);

  return (
    <div style={styles.container}>
      {/* SECTION 1: Welcome Header */}
      <header style={styles.header}>
        <h1 style={styles.title}>Welcome back, {profile?.name || 'Student'}!</h1>
        <p style={styles.subtitle}>Here is your learning summary</p>
      </header>

      {/* SECTION 2: Stats Row */}
      <div style={styles.statsRow}>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>Total Attempts</div>
          <div style={styles.statValue}>{profile?.totalAttempts || 0}</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>Accuracy Rate</div>
          <div style={{ ...styles.statValue, color: getAccuracyColor(profile?.accuracyRate) }}>
            {profile?.accuracyRate || 0}%
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>Confidence Level</div>
          <div style={{ ...styles.statValue, color: getLevelColor(profile?.confidenceLevel, 'confidence') }}>
            {profile?.confidenceLevel || 'N/A'}
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>Hesitation Level</div>
          <div style={{ ...styles.statValue, color: getLevelColor(profile?.hesitationLevel, 'hesitation') }}>
            {profile?.hesitationLevel || 'N/A'}
          </div>
        </div>
      </div>

      {/* SECTION 3: Start Practicing Button */}
      <div style={styles.actionRow}>
        <button style={styles.practiceButton} onClick={() => navigate('/attempt')}>
          Start Practicing →
        </button>
      </div>

      {/* SECTION 4: Recent Attempts */}
      <section style={styles.section}>
        <h2 style={styles.sectionHeading}>Recent Attempts</h2>
        {attempts.length === 0 ? (
          <p style={styles.emptyText}>No attempts yet. Start practicing above!</p>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Question</th>
                  <th style={styles.th}>Subject</th>
                  <th style={styles.th}>Result</th>
                  <th style={styles.th}>Pattern</th>
                  <th style={styles.th}>Time</th>
                  <th style={styles.th}>Date</th>
                </tr>
              </thead>
              <tbody>
                {attempts.slice(0, 10).map((attempt) => (
                  <tr key={attempt._id} style={styles.tr}>
                    <td style={styles.td}>
                      {attempt.questionId?.questionText?.length > 50
                        ? attempt.questionId.questionText.substring(0, 50) + '...'
                        : attempt.questionId?.questionText || 'N/A'}
                    </td>
                    <td style={styles.td}>{attempt.questionId?.subject || 'N/A'}</td>
                    <td style={styles.td}>
                      {attempt.isCorrect ? '✅ Correct' : '❌ Wrong'}
                    </td>
                    <td style={styles.td}>
                      <span style={styles.badge}>{attempt.cognitivePattern}</span>
                    </td>
                    <td style={styles.td}>{attempt.totalTime}s</td>
                    <td style={styles.td}>
                      {new Date(attempt.attemptedAt).toLocaleDateString('en-GB')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* SECTION 5: Feedback Highlight */}
      {attempts.length > 0 && latestFeedbackAttempt && (
        <section style={styles.feedbackSection}>
            <div style={styles.feedbackBox}>
                <h3 style={styles.feedbackHeading}>Latest Feedback</h3>
                <p style={styles.feedbackText}>"{latestFeedbackAttempt.feedback}"</p>
                <p style={styles.feedbackSubtext}>
                    From your attempt on {latestFeedbackAttempt.questionId?.subject || 'Question'}
                </p>
            </div>
        </section>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '40px 20px',
    maxWidth: '1000px',
    margin: '0 auto',
    textAlign: 'left',
  },
  header: {
    marginBottom: '40px',
  },
  title: {
    fontSize: '2.5rem',
    margin: '0 0 10px 0',
    color: '#333',
  },
  subtitle: {
    fontSize: '1.1rem',
    color: '#666',
    margin: 0,
  },
  statsRow: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
    marginBottom: '40px',
  },
  statCard: {
    flex: '1 1 200px',
    background: '#fff',
    padding: '25px',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
    border: '1px solid #eee',
    textAlign: 'center',
    transition: 'transform 0.2s',
  },
  statLabel: {
    fontSize: '0.9rem',
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '10px',
  },
  statValue: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: '#333',
  },
  actionRow: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '50px',
  },
  practiceButton: {
    padding: '16px 32px',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    backgroundColor: '#3498db',
    color: '#fff',
    border: 'none',
    borderRadius: '50px',
    cursor: 'pointer',
    transition: 'background-color 0.2s, transform 0.1s',
    boxShadow: '0 4px 15px rgba(52, 152, 219, 0.3)',
  },
  section: {
    marginBottom: '40px',
  },
  sectionHeading: {
    fontSize: '1.5rem',
    marginBottom: '20px',
    color: '#333',
    borderBottom: '2px solid #f0f0f0',
    paddingBottom: '10px',
  },
  emptyText: {
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: '20px',
  },
  tableWrapper: {
    overflowX: 'auto',
    background: '#fff',
    borderRadius: '12px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
  },
  th: {
    padding: '15px',
    borderBottom: '2px solid #f0f0f0',
    color: '#666',
    fontWeight: '600',
    fontSize: '0.9rem',
  },
  td: {
    padding: '15px',
    borderBottom: '1px solid #f9f9f9',
    color: '#444',
    fontSize: '0.95rem',
  },
  tr: {
      transition: 'background-color 0.1s',
  },
  badge: {
    display: 'inline-block',
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '0.8rem',
    backgroundColor: '#f0f2f5',
    color: '#555',
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  feedbackSection: {
    marginTop: '20px',
  },
  feedbackBox: {
    background: 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)',
    padding: '30px',
    borderRadius: '15px',
    borderLeft: '5px solid #3498db',
    boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
  },
  feedbackHeading: {
    margin: '0 0 15px 0',
    fontSize: '1.3rem',
    color: '#2c3e50',
  },
  feedbackText: {
    fontSize: '1.1rem',
    lineHeight: '1.6',
    color: '#444',
    fontStyle: 'italic',
    marginBottom: '15px',
  },
  feedbackSubtext: {
    fontSize: '0.85rem',
    color: '#7f8c8d',
    margin: 0,
  },
  errorContainer: {
    textAlign: 'center',
    padding: '50px',
  },
  errorText: {
    color: '#e74c3c',
    marginBottom: '20px',
  },
  retryButton: {
    padding: '10px 20px',
    backgroundColor: '#3498db',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  }
};
