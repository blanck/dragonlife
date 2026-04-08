import type { Category, Question } from './types';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function makeChoices(correct: number, count = 4): string[] {
  const choices = new Set<number>([correct]);
  while (choices.size < count) {
    const offset = randInt(1, Math.max(5, Math.abs(correct) + 3));
    const wrong = correct + (Math.random() < 0.5 ? offset : -offset);
    if (wrong !== correct) choices.add(wrong);
  }
  const arr = shuffle([...choices]);
  return arr.map((n) => Number.isInteger(n) ? n.toString() : n.toFixed(2));
}

function makeChoicesStr(correct: string, distractors: string[]): { choices: string[]; correctIndex: number } {
  const pool = shuffle([...new Set([correct, ...distractors])].slice(0, 4));
  return { choices: pool, correctIndex: pool.indexOf(correct) };
}

function generateArithmetic(level: number): Question {
  let a: number, b: number, answer: number, text: string;

  if (level <= 2) {
    a = randInt(1, 10 + level * 5);
    b = randInt(1, 10 + level * 5);
    if (Math.random() < 0.5) {
      answer = a + b;
      text = `${a} + ${b} = ?`;
    } else {
      answer = a - b;
      text = `${a} - ${b} = ?`;
    }
  } else if (level <= 4) {
    a = randInt(2, 12);
    b = randInt(2, 12);
    answer = a * b;
    text = `${a} × ${b} = ?`;
  } else {
    a = randInt(2, 12);
    b = randInt(2, 12);
    const product = a * b;
    answer = a;
    text = `${product} ÷ ${b} = ?`;
  }

  const choices = makeChoices(answer);
  return {
    text,
    choices,
    correctIndex: choices.indexOf(answer.toString()),
    difficulty: level,
  };
}

function generateFractions(level: number): Question {
  if (level <= 2) {
    const denom = randInt(2, 8);
    const num1 = randInt(1, denom - 1);
    const num2 = randInt(1, denom - 1);
    const ansNum = num1 + num2;
    const text = `${num1}/${denom} + ${num2}/${denom} = ?`;
    const correct = ansNum >= denom ? `${Math.floor(ansNum / denom)} ${ansNum % denom}/${denom}` : `${ansNum}/${denom}`;
    const distractors = [
      `${ansNum + 1}/${denom}`,
      `${Math.abs(ansNum - 1)}/${denom}`,
      `${ansNum}/${denom + 1}`,
    ];
    const { choices, correctIndex } = makeChoicesStr(correct, distractors);
    return { text, choices, correctIndex, difficulty: level };
  } else {
    const val = randInt(10, 90);
    const text = `What is ${val}% of ${100}?`;
    const answer = val;
    const choices = makeChoices(answer);
    return { text, choices, correctIndex: choices.indexOf(answer.toString()), difficulty: level };
  }
}

function generateAlgebra(level: number): Question {
  if (level <= 2) {
    const x = randInt(1, 15);
    const b = randInt(1, 20);
    const result = x + b;
    const text = `x + ${b} = ${result}. What is x?`;
    const choices = makeChoices(x);
    return { text, choices, correctIndex: choices.indexOf(x.toString()), difficulty: level };
  } else if (level <= 4) {
    const x = randInt(1, 10);
    const a = randInt(2, 6);
    const b = randInt(1, 15);
    const result = a * x + b;
    const text = `${a}x + ${b} = ${result}. What is x?`;
    const choices = makeChoices(x);
    return { text, choices, correctIndex: choices.indexOf(x.toString()), difficulty: level };
  } else {
    const x = randInt(-10, 10);
    const a = randInt(2, 5);
    const b = randInt(1, 20);
    const result = a * x - b;
    const text = `${a}x - ${b} = ${result}. What is x?`;
    const choices = makeChoices(x);
    return { text, choices, correctIndex: choices.indexOf(x.toString()), difficulty: level };
  }
}

function generateGeometry(level: number): Question {
  if (level <= 2) {
    const side = randInt(2, 15);
    const answer = side * side;
    const text = `What is the area of a square with side ${side}?`;
    const choices = makeChoices(answer);
    return { text, choices, correctIndex: choices.indexOf(answer.toString()), difficulty: level };
  } else if (level <= 4) {
    const r = randInt(2, 10);
    const answer = Math.round(Math.PI * r * r * 100) / 100;
    const text = `Area of a circle with radius ${r}? (round to 2 decimals)`;
    const choices = [answer, Math.round(2 * Math.PI * r * 100) / 100, Math.round(Math.PI * r * 100) / 100, Math.round(Math.PI * r * r * r * 100) / 100]
      .map((n) => n.toFixed(2));
    const shuffled = shuffle(choices);
    return { text, choices: shuffled, correctIndex: shuffled.indexOf(answer.toFixed(2)), difficulty: level };
  } else {
    const b = randInt(3, 15);
    const h = randInt(3, 15);
    const answer = (b * h) / 2;
    const text = `Area of a triangle with base ${b} and height ${h}?`;
    const choices = makeChoices(answer);
    return { text, choices, correctIndex: choices.indexOf(answer.toString()), difficulty: level };
  }
}

function generateProbability(level: number): Question {
  if (level <= 2) {
    const total = randInt(4, 10);
    const favorable = randInt(1, total - 1);
    const text = `A bag has ${total} balls, ${favorable} are red. What's the probability of picking a red ball?`;
    const correct = `${favorable}/${total}`;
    const distractors = [
      `${total - favorable}/${total}`,
      `${favorable}/${total + 1}`,
      `${favorable + 1}/${total}`,
    ];
    const { choices, correctIndex } = makeChoicesStr(correct, distractors);
    return { text, choices, correctIndex, difficulty: level };
  } else {
    const die1 = randInt(1, 6);
    const target = die1 + randInt(1, 6);
    const ways = Math.min(target - 1, 13 - target, 6);
    const text = `Rolling two dice, how many ways can you get a sum of ${target}?`;
    const choices = makeChoices(Math.max(ways, 0));
    return { text, choices, correctIndex: choices.indexOf(Math.max(ways, 0).toString()), difficulty: level };
  }
}

function generateTrigonometry(level: number): Question {
  const angles = [
    { deg: 0, sin: '0', cos: '1', tan: '0' },
    { deg: 30, sin: '1/2', cos: '√3/2', tan: '1/√3' },
    { deg: 45, sin: '√2/2', cos: '√2/2', tan: '1' },
    { deg: 60, sin: '√3/2', cos: '1/2', tan: '√3' },
    { deg: 90, sin: '1', cos: '0', tan: 'undefined' },
  ];
  const angle = angles[randInt(0, angles.length - 1)];

  if (level <= 2) {
    const correct = angle.sin;
    const text = `What is sin(${angle.deg}°)?`;
    const distractors = angles.filter((a) => a.sin !== correct).map((a) => a.sin);
    const { choices, correctIndex } = makeChoicesStr(correct, distractors);
    return { text, choices, correctIndex, difficulty: level };
  } else {
    const fn = Math.random() < 0.5 ? 'cos' : 'tan';
    const correct = fn === 'cos' ? angle.cos : angle.tan;
    const text = `What is ${fn}(${angle.deg}°)?`;
    const distractors = angles.filter((a) => (fn === 'cos' ? a.cos : a.tan) !== correct).map((a) => fn === 'cos' ? a.cos : a.tan);
    const { choices, correctIndex } = makeChoicesStr(correct, distractors);
    return { text, choices, correctIndex, difficulty: level };
  }
}

const generators: Record<Category, (level: number) => Question> = {
  arithmetic: generateArithmetic,
  fractions: generateFractions,
  algebra: generateAlgebra,
  geometry: generateGeometry,
  probability: generateProbability,
  trigonometry: generateTrigonometry,
};

export function generateQuestion(category: Category, level: number): Question {
  return generators[category](level);
}
