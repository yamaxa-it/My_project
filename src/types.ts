export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  name?: string;
  age?: number;
  englishLevel: string;
  germanLevel: string;
  goal: string;
  studyTimePerDay: number;
  onboarded: boolean;
  createdAt: any;
  updatedAt: any;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'completed' | 'verified';
  type: 'diagnostic' | 'grammar' | 'vocabulary' | 'listening' | 'speaking';
  dueDate?: string;
  createdAt: string;
  completedAt?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}
