
export type UserRole = 'Слідкуючий' | 'Генерал СЦЗ' | 'Полковник СЦЗ' | 'Підполковник СЦЗ' | 'Майор СЦЗ' | 'Гість';

export type ForumPrefix = 'База знань' | 'Важливе' | 'Розглянуто' | 'Схвалено' | 'Відмовлено' | 'Очікує' | 'На розгляді';

export interface ForumThread {
  id: string;
  prefix: ForumPrefix;
  title: string;
  content: string;
  author: string;
  authorId: string;
  authorAvatar?: string;
  date: string;
  replies: number;
  views: number;
  lastReplyUser: string;
  lastReplyDate: string;
}

export interface Application {
  id: string;
  userId: string;
  userName: string;
  age: number;
  discord: string;
  playTime: string;
  motivation: string;
  experience: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  password?: string;
  avatar?: string;
  banner?: string;
  color?: string;
  bio?: string;
  fontFamily?: string;
  frameColor1?: string;
  frameColor2?: string;
  infoBgColor?: string;
  frameShape?: 'round' | 'square';
  interviewStatus?: 'none' | 'pending' | 'approved' | 'rejected';
  hasBeenNotified?: boolean;
  appointmentTime?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  summary: string;
  imageUrl: string;
  category: 'operational' | 'civil' | 'announcement';
  author?: string;
  authorId?: string;
}

export interface OperationalStat {
  label: string;
  value: number;
  change: number;
}

export interface Message {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface SafetyGuide {
  id: string;
  title: string;
  icon: string;
  description: string;
  steps: string[];
}

export interface HeroData {
  title: string;
  highlight: string;
  description: string;
  buttonText: string;
}

export interface RecruitmentData {
  title: string;
  description: string;
  buttonText: string;
}

export interface StyledText {
  text: string;
  color: string;
  fontWeight: string;
  isUppercase: boolean;
  isItalic: boolean;
}
