
import React from 'react';
import { Shield, Flame, Map, Info, Phone, AlertTriangle, Wind, MessageSquare, ExternalLink } from 'lucide-react';
import { NewsItem, OperationalStat, SafetyGuide } from './types';

export const NAV_LINKS = [
  { name: 'Головна', href: '#' },
  { name: 'Форум', href: 'https://forum.ukraine-gta.com.ua/forums/%D0%94%D0%A1%D0%9D%D0%A1.170/', target: '_blank' },
  { name: 'Статут', href: '#guides' },
  { name: 'Спецзв\'язок', href: '#contacts' },
];

export const OPERATIONAL_STATS: OperationalStat[] = [
  { label: 'Гравців у фракції', value: 154, change: 8 },
  { label: 'Викликів (за тиждень)', value: 842, change: 15 },
  { label: 'Пожеж на зміні', value: 124, change: -5 },
  { label: 'Пройдено співбесід', value: 45, change: 12 },
];

// Список новин тепер порожній за запитом
export const LATEST_NEWS: NewsItem[] = [];

export const SAFETY_GUIDES: SafetyGuide[] = [
  {
    id: 'statut',
    title: 'Статут Фракції',
    icon: 'Shield',
    description: 'Головні правила поведінки рятувальника в ігровому світі.',
    steps: [
      'Дотримуватись субординації з вищим складом.',
      'Заборонено використовувати спецсигнали без виклику.',
      'Робоча зміна: з 09:00 до 21:00.',
      'Обов\'язково робити доповіді в рацію кожні 10 хвилин.'
    ]
  },
  {
    id: 'rp-terms',
    title: 'RP Терміни та Коди',
    icon: 'MessageSquare',
    description: 'Словник для проходження співбесіди та спілкування.',
    steps: [
      'Код 1: Стан стабільний. Код 2: Потрібна допомога.',
      'Тен-коди: 10-4 (Прийнято), 10-10 (Негативно).',
      'RP (RolePlay) - гра по ролях.',
      'MG (MetaGaming) - використання OOC інфо в IC чат.'
    ]
  },
  {
    id: 'fire-fight',
    title: 'Гасіння Пожеж',
    icon: 'Flame',
    description: 'Алгоритм дій при надходженні виклику (системного вогню).',
    steps: [
      'Взяти спорядження (вогнегасник/лопату).',
      'Виїхати на маркер у складі екіпажу 2+ осіб.',
      'По прибуттю доповісти: "Прибули на місце, починаємо гасіння".',
      'Після завершення: "Пожежу ліквідовано, повертаємось в ГУ".'
    ]
  }
];
