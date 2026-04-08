export interface User {
  username: string;
  grade: number;
  coins: number;
  categoryProgress: Record<string, CategoryProgress>;
  createdAt: string;
}

export interface CategoryProgress {
  level: number;
  totalCorrect: number;
  totalAttempted: number;
}

export type Category =
  | 'arithmetic'
  | 'algebra'
  | 'fractions'
  | 'geometry'
  | 'probability'
  | 'trigonometry';

export interface CategoryInfo {
  id: Category;
  name: string;
  icon: string;
  description: string;
  minGrade: number;
}

export interface Question {
  text: string;
  choices: string[];
  correctIndex: number;
  difficulty: number;
}

export type Screen =
  | 'welcome'
  | 'register'
  | 'home'
  | 'categories'
  | 'challenge';
