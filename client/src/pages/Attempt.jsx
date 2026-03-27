import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import useBehaviorTracker from '../hooks/useBehaviorTracker';

export default function Attempt() {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [reasoningText, setReasoningText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [pageState, setPageState] = useState('loading'); // 'loading' | 'ready' | 'result'

  const { token } = useAuth();
  const navigate = useNavigate();
  const { recordFirstInput, recordEdit, getMetrics, resetTracker } = useBehaviorTracker();

  const fetchQuestions = async () => {
    try {
      setPageState('loading');
      const response = await api.get('/questions');
      setQuestions(response.data.questions);
      setPageState('ready');
    } catch (err) {
      toast.error('Failed to load questions');
      navigate('/dashboard');
    }
  };

  // Fetch questions on mount
  useEffect(() => {
    fetchQuestions();
  }, []);

  // Reset tracker when question changes
  useEffect(() => {
    resetTracker();
    setSelectedAnswer('');
    setReasoningText('');
  }, [currentIndex]);

  const handleMcqSelect = (option) => {
    recordFirstInput();
    if (selectedAnswer && selectedAnswer !== option) {
      recordEdit();
    }
    setSelectedAnswer(option);
  };

  const handleShortAnswerChange = (e) => {
    const val = e.target.value;
    recordFirstInput();
    if (selectedAnswer) {
      recordEdit();
    }
    setSelectedAnswer(val);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const metrics = getMetrics();

    try {
      const payload = {
        questionId: questions[currentIndex]._id,
        timeToFirstInput: metrics.timeToFirstInput,
        editCount: metrics.editCount,
        totalTime: metrics.totalTime,
        finalAnswer: selectedAnswer,
        reasoningText: reasoningText
      };

      const response = await api.post('/attempts', payload);
      setResult(response.data.attempt);
      setPageState('result');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Submission failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setPageState('ready');
      setResult(null);
    } else {
      setCurrentIndex(questions.length); // Trigger completion screen
    }
  };

  const handlePracticeAgain = () => {
    setCurrentIndex(0);
    setResult(null);
    fetchQuestions();
  };

  if (currentIndex >= questions.length && questions.length > 0) {
    return (
      <div style={{ maxWidth: '600px', margin: '50px auto', padding: '40px', backgroundColor: '#fff', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', textAlign: 'center' }}>
        <div style={{ fontSize: '80px', marginBottom: '20px' }}>✅</div>
        <h1 style={{ fontSize: '2.2rem', color: '#2c3e50', marginBottom: '15px' }}>You've completed all questions!</h1>
        <p style={{ fontSize: '1.2rem', color: '#7f8c8d', marginBottom: '40px', lineHeight: '1.6' }}>
          Great work. Check your dashboard to see your full cognitive profile.
        </p>
        <div style={{ display: 'grid', gap: '15px' }}>
          <button 
            onClick={() => navigate('/dashboard')}
            style={{ padding: '16px', backgroundColor: '#3498db', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s' }}
          >
            View My Dashboard
          </button>
          <button 
            onClick={handlePracticeAgain}
            style={{ padding: '16px', backgroundColor: '#f8f9fa', color: '#2c3e50', border: '2px solid #eee', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s' }}
          >
            Practice Again
          </button>
        </div>
      </div>
    );
  }

  if (pageState === 'loading') {
    return <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>Loading questions...</div>;
  }

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  if (pageState === 'ready') {
    return (
      <div style={{ maxWidth: '800px', margin: '20px auto', padding: '0 20px' }}>
        {/* Progress Bar */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '0.9rem' }}>
            <span>Question {currentIndex + 1} of {questions.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div style={{ width: '100%', height: '8px', backgroundColor: '#e0e0e0', borderRadius: '4px' }}>
            <div style={{ width: `${progress}%`, height: '100%', backgroundColor: '#007bff', borderRadius: '4px', transition: 'width 0.3s' }}></div>
          </div>
        </div>

        {/* Question Card */}
        <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <span style={{ backgroundColor: '#e9ecef', padding: '4px 10px', borderRadius: '15px', fontSize: '0.8rem', fontWeight: 'bold' }}>
              {currentQuestion.subject}
            </span>
            <span style={{ backgroundColor: '#fff3cd', padding: '4px 10px', borderRadius: '15px', fontSize: '0.8rem', fontWeight: 'bold' }}>
              {currentQuestion.difficulty}
            </span>
          </div>

          <h2 style={{ marginBottom: '25px', color: '#333' }}>{currentQuestion.questionText}</h2>

          {/* Answer Input */}
          <div style={{ marginBottom: '30px' }}>
            {currentQuestion.type === 'mcq' ? (
              <div style={{ display: 'grid', gap: '10px' }}>
                {currentQuestion.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleMcqSelect(opt)}
                    style={{
                      padding: '15px',
                      textAlign: 'left',
                      border: '2px solid',
                      borderColor: selectedAnswer === opt ? '#007bff' : '#dee2e6',
                      backgroundColor: selectedAnswer === opt ? '#e7f1ff' : '#fff',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      transition: 'all 0.2s'
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            ) : (
              <input
                type="text"
                value={selectedAnswer}
                onChange={handleShortAnswerChange}
                placeholder="Type your answer here..."
                style={{ width: '100%', padding: '15px', borderRadius: '8px', border: '2px solid #dee2e6', fontSize: '1rem' }}
              />
            )}
          </div>

          {/* Reasoning */}
          <div style={{ marginBottom: '30px' }}>
            <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>Explain your thinking (optional)</label>
            <textarea
              value={reasoningText}
              onChange={(e) => setReasoningText(e.target.value)}
              placeholder="Walk through how you approached this problem..."
              style={{ width: '100%', padding: '15px', borderRadius: '8px', border: '2px solid #dee2e6', minHeight: '100px', fontSize: '1rem', fontFamily: 'inherit' }}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={!selectedAnswer || isSubmitting}
            style={{
              width: '100%',
              padding: '15px',
              backgroundColor: !selectedAnswer || isSubmitting ? '#6c757d' : '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              cursor: (!selectedAnswer || isSubmitting) ? 'not-allowed' : 'pointer'
            }}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Answer'}
          </button>
        </div>
      </div>
    );
  }

  if (pageState === 'result' && result) {
    return (
      <div style={{ maxWidth: '800px', margin: '20px auto', padding: '0 20px' }}>
        <div style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', textAlign: 'center' }}>
          <div style={{ fontSize: '64px', marginBottom: '10px' }}>{result.isCorrect ? '✅' : '❌'}</div>
          <h1 style={{ color: result.isCorrect ? '#28a745' : '#dc3545', marginBottom: '10px' }}>
            {result.isCorrect ? 'Correct!' : 'Incorrect'}
          </h1>
          {!result.isCorrect && (
            <p style={{ fontSize: '1.2rem', marginBottom: '20px' }}>
              Correct answer: <strong style={{color: '#333'}}>{currentQuestion.correctAnswer}</strong>
            </p>
          )}

          <hr style={{ margin: '30px 0', border: '0', borderTop: '1px solid #eee' }} />

          {/* Cognitive Analysis */}
          <div style={{ textAlign: 'left', marginBottom: '30px' }}>
            <h3 style={{ marginBottom: '20px' }}>🧠 Your Cognitive Analysis</h3>
            <div style={{ display: 'grid', gap: '10px' }}>
              {[
                { label: 'Hesitation', score: result.hesitationScore },
                { label: 'Confidence', score: result.confidenceScore },
                { label: 'Impulsivity', score: result.impulsivityScore },
                { label: 'Reasoning', score: result.reasoningScore },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '6px' }}>
                  <span style={{ fontWeight: '500' }}>{item.label} Score:</span>
                  <span style={{ fontWeight: 'bold' }}>{item.score !== null ? `${item.score} / 100` : 'N/A'}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', backgroundColor: '#e9ecef', borderRadius: '6px', marginTop: '5px' }}>
                <span style={{ fontWeight: 'bold' }}>Detected Pattern:</span>
                <span style={{ fontWeight: 'bold', color: '#007bff', textTransform: 'capitalize' }}>
                  {result.cognitivePattern?.replace('-', ' ')}
                </span>
              </div>
            </div>
          </div>

          {/* Feedback */}
          <div style={{ textAlign: 'left', marginBottom: '40px' }}>
            <h3 style={{ marginBottom: '15px' }}>💡 Feedback</h3>
            <div style={{ padding: '20px', backgroundColor: '#e7f1ff', borderRadius: '8px', borderLeft: '5px solid #007bff', lineHeight: '1.6' }}>
              {result.feedback}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '15px' }}>
            <button
              onClick={handleNext}
              style={{ flex: 1, padding: '15px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer' }}
            >
              {currentIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              style={{ flex: 1, padding: '15px', backgroundColor: '#fff', color: '#333', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer' }}
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
