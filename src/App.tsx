import { useState, useEffect, useCallback } from 'react';
import type { User, Screen, Category } from './types';
import { CATEGORIES } from './categories';
import { generateQuestion } from './questions';
import type { Question } from './types';
import { loadUser, saveUser, clearUser } from './storage';

const QUESTIONS_PER_ROUND = 5;
const BASE_COINS = 1;
const STREAK_BONUS = 0;

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [screen, setScreen] = useState<Screen>('welcome');

  // Register state
  const [regUsername, setRegUsername] = useState('');
  const [regGrade, setRegGrade] = useState(5);

  // Challenge state
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [question, setQuestion] = useState<Question | null>(null);
  const [questionNum, setQuestionNum] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [roundComplete, setRoundComplete] = useState(false);
  const [earnedCoins, setEarnedCoins] = useState(0);

  useEffect(() => {
    const saved = loadUser();
    if (saved) {
      setUser(saved);
      setScreen('home');
    }
  }, []);

  const persistUser = useCallback((u: User) => {
    setUser(u);
    saveUser(u);
  }, []);

  const handleRegister = () => {
    if (!regUsername.trim()) return;
    const newUser: User = {
      username: regUsername.trim(),
      grade: regGrade,
      coins: 0,
      categoryProgress: {},
      createdAt: new Date().toISOString(),
    };
    persistUser(newUser);
    setScreen('home');
  };

  const handleLogin = () => {
    const saved = loadUser();
    if (saved) {
      setUser(saved);
      setScreen('home');
    }
  };

  const handleLogout = () => {
    clearUser();
    setUser(null);
    setScreen('welcome');
  };

  const startChallenge = (cat: Category) => {
    setActiveCategory(cat);
    setQuestionNum(0);
    setCorrectCount(0);
    setStreak(0);
    setRoundComplete(false);
    setEarnedCoins(0);
    nextQuestion(cat, user!, 0);
    setScreen('challenge');
  };

  const nextQuestion = (cat: Category, u: User, qNum: number) => {
    const level = u.categoryProgress[cat]?.level ?? 1;
    const q = generateQuestion(cat, level);
    setQuestion(q);
    setQuestionNum(qNum);
    setSelected(null);
    setRevealed(false);
  };

  const handleAnswer = (choiceIdx: number) => {
    if (revealed || !question || !user || !activeCategory) return;
    setSelected(choiceIdx);
    setRevealed(true);

    const isCorrect = choiceIdx === question.correctIndex;
    const newStreak = isCorrect ? streak + 1 : 0;
    const coinsEarned = isCorrect ? BASE_COINS + (newStreak > 1 ? STREAK_BONUS * (newStreak - 1) : 0) : 0;
    const newCorrect = correctCount + (isCorrect ? 1 : 0);

    setStreak(newStreak);
    setCorrectCount(newCorrect);
    setEarnedCoins((prev) => prev + coinsEarned);

    const progress = user.categoryProgress[activeCategory] ?? { level: 1, totalCorrect: 0, totalAttempted: 0 };
    const updatedProgress = {
      ...progress,
      totalCorrect: progress.totalCorrect + (isCorrect ? 1 : 0),
      totalAttempted: progress.totalAttempted + 1,
    };

    // Level up: 4+ correct in a round
    const isLastQuestion = questionNum + 1 >= QUESTIONS_PER_ROUND;
    if (isLastQuestion && newCorrect >= 4) {
      updatedProgress.level = Math.min(updatedProgress.level + 1, 10);
    }

    const updatedUser: User = {
      ...user,
      coins: user.coins + coinsEarned,
      categoryProgress: {
        ...user.categoryProgress,
        [activeCategory]: updatedProgress,
      },
    };
    persistUser(updatedUser);

    // Auto-advance after delay
    setTimeout(() => {
      if (isLastQuestion) {
        setRoundComplete(true);
      } else {
        nextQuestion(activeCategory, updatedUser, questionNum + 1);
      }
    }, 1200);
  };

  const availableCategories = CATEGORIES.filter((c) => user && c.minGrade <= user.grade + 2);

  // --- SCREENS ---

  if (screen === 'welcome') {
    return (
      <div className="screen center">
        <div className="spacer" />
        <div className="title-dragon">🐉</div>
        <div className="title-text">DragonLife</div>
        <p className="subtitle">Master math. Earn coins. Level up.</p>
        <div className="stack" style={{ maxWidth: 320 }}>
          <button className="btn btn-primary" onClick={() => setScreen('register')}>
            Get Started
          </button>
          <button className="btn btn-secondary" onClick={handleLogin}>
            I already have an account
          </button>
        </div>
        <div className="spacer" />
      </div>
    );
  }

  if (screen === 'register') {
    return (
      <div className="screen">
        <button className="back-btn" onClick={() => setScreen('welcome')} style={{ alignSelf: 'flex-start' }}>
          ← Back
        </button>
        <div style={{ marginTop: 24, marginBottom: 32, textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: 8 }}>🐉</div>
          <h2>Create Your Account</h2>
        </div>
        <div className="stack stack-lg">
          <div className="stack stack-sm">
            <label className="label">Username</label>
            <input
              className="input"
              placeholder="Enter a username..."
              value={regUsername}
              onChange={(e) => setRegUsername(e.target.value)}
              maxLength={20}
              autoFocus
            />
          </div>
          <div className="stack stack-sm">
            <label className="label">What grade are you in?</label>
            <div className="select-wrapper">
              <select className="select" value={regGrade} onChange={(e) => setRegGrade(Number(e.target.value))}>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((g) => (
                  <option key={g} value={g}>
                    Grade {g}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button
            className="btn btn-primary"
            onClick={handleRegister}
            disabled={!regUsername.trim()}
            style={{ marginTop: 16 }}
          >
            Start Playing
          </button>
        </div>
      </div>
    );
  }

  if (screen === 'home' && user) {
    return (
      <div className="screen">
        <div className="header">
          <h1>DragonLife</h1>
          <div className="coins">
            <span className="coins-icon">🪙</span>
            {user.coins}
          </div>
        </div>
        <div className="card" style={{ marginBottom: 24, textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', marginBottom: 4 }}>Welcome back,</p>
          <h2 style={{ fontSize: '1.5rem' }}>{user.username}</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: 4 }}>
            Grade {user.grade}
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setScreen('categories')} style={{ marginBottom: 24 }}>
          Start Challenge
        </button>
        <div className="card" style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 8 }}>
            Coin Shop coming soon...
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            Collect coins from math challenges and spend them on fun games!
          </p>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          Log out
        </button>
      </div>
    );
  }

  if (screen === 'categories' && user) {
    return (
      <div className="screen">
        <div className="header">
          <button className="back-btn" onClick={() => setScreen('home')}>
            ← Back
          </button>
          <div className="coins">
            <span className="coins-icon">🪙</span>
            {user.coins}
          </div>
        </div>
        <h2 style={{ marginBottom: 20, textAlign: 'center' }}>Choose a Category</h2>
        <div className="stack">
          {availableCategories.map((cat) => {
            const progress = user.categoryProgress[cat.id];
            return (
              <div
                key={cat.id}
                className="card card-interactive category-card"
                onClick={() => startChallenge(cat.id)}
              >
                <div className="category-icon">{cat.icon}</div>
                <div className="category-info">
                  <h3>{cat.name}</h3>
                  <p>{cat.description}</p>
                  {progress && (
                    <p className="category-level">
                      Level {progress.level} · {progress.totalCorrect}/{progress.totalAttempted} correct
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (screen === 'challenge' && user && question && activeCategory) {
    if (roundComplete) {
      const passed = correctCount >= 4;
      return (
        <div className="result-overlay">
          <div className="result-card">
            <div className="result-emoji">{passed ? '🎉' : '💪'}</div>
            <div className="result-title">
              {passed ? 'Round Complete!' : 'Keep Practicing!'}
            </div>
            <p style={{ color: 'var(--text-muted)', marginBottom: 8 }}>
              {correctCount}/{QUESTIONS_PER_ROUND} correct
            </p>
            {earnedCoins > 0 && (
              <div className="result-coins">+{earnedCoins} 🪙</div>
            )}
            {passed && (
              <p style={{ color: 'var(--secondary)', fontSize: '0.9rem', marginBottom: 16 }}>
                Level up!
              </p>
            )}
            <div className="stack">
              <button className="btn btn-primary" onClick={() => startChallenge(activeCategory)}>
                Play Again
              </button>
              <button className="btn btn-secondary" onClick={() => setScreen('categories')}>
                Other Categories
              </button>
              <button className="btn btn-secondary" onClick={() => setScreen('home')}>
                Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="screen">
        <div className="header">
          <button className="back-btn" onClick={() => setScreen('categories')}>
            ← Back
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {streak > 1 && <span className="streak">🔥 {streak} streak</span>}
            <div className="coins">
              <span className="coins-icon">🪙</span>
              {user.coins}
            </div>
          </div>
        </div>

        <div className="question-meta">
          <span>
            {CATEGORIES.find((c) => c.id === activeCategory)?.name} · Level{' '}
            {user.categoryProgress[activeCategory]?.level ?? 1}
          </span>
          <span>
            {questionNum + 1} / {QUESTIONS_PER_ROUND}
          </span>
        </div>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${((questionNum + 1) / QUESTIONS_PER_ROUND) * 100}%` }}
          />
        </div>

        <div className="question-box">
          <div className="question-text">{question.text}</div>
        </div>

        <div className="stack" style={{ marginTop: 16 }}>
          {question.choices.map((choice, idx) => {
            let cls = 'btn btn-choice';
            if (revealed) {
              if (idx === question.correctIndex) cls += ' correct';
              else if (idx === selected) cls += ' incorrect';
            } else if (idx === selected) {
              cls += ' selected';
            }
            return (
              <button
                key={idx}
                className={cls}
                onClick={() => handleAnswer(idx)}
                disabled={revealed}
              >
                {choice}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return null;
}
