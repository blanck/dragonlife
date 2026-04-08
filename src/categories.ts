import type { CategoryInfo } from './types';

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'arithmetic',
    name: 'Arithmetic',
    icon: '➕',
    description: 'Addition, subtraction, multiplication & division',
    minGrade: 1,
  },
  {
    id: 'fractions',
    name: 'Fractions',
    icon: '🔢',
    description: 'Fractions, decimals & percentages',
    minGrade: 3,
  },
  {
    id: 'algebra',
    name: 'Algebra',
    icon: '🔤',
    description: 'Solve for x, expressions & equations',
    minGrade: 5,
  },
  {
    id: 'geometry',
    name: 'Geometry',
    icon: '📐',
    description: 'Shapes, areas, volumes & angles',
    minGrade: 3,
  },
  {
    id: 'probability',
    name: 'Probability',
    icon: '🎲',
    description: 'Chance, combinations & statistics',
    minGrade: 5,
  },
  {
    id: 'trigonometry',
    name: 'Trigonometry',
    icon: '📊',
    description: 'Sin, cos, tan & triangles',
    minGrade: 8,
  },
];
