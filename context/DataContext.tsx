
import React, { createContext, useContext, useState, useEffect } from 'react';
import { NewsItem, OperationalStat, SafetyGuide, HeroData, UserRole, UserAccount, RecruitmentData, Application, ForumThread } from '../types';
import { LATEST_NEWS, OPERATIONAL_STATS, SAFETY_GUIDES, NAV_LINKS } from '../constants';

const DEFAULT_HERO: HeroData = {
  title: "ДСНС: Стань",
  highlight: "Героєм ГУ",
  description: "Офіційний портал фракції ДСНС. Подавай рапорт на підвищення, вивчай тен-коди та рятуй життя на вулицях віртуальної України.",
  buttonText: "ПОДАТИ ЗАЯВУ"
};

const DEFAULT_RECRUITMENT: RecruitmentData = {
  title: "МРІЄШ ПРО КАР'ЄРУ РЯТУВАЛЬНИКА?",
  description: "Ми шукаємо адекватних та активних гравців, які готові розвивати RP-процес. Стабільна зарплатня, круті авто та дружній колектив чекають на тебе.",
  buttonText: "ПОДАТИ ЗАЯВКУ НА ФОРУМІ"
};

interface FooterData {
  about: string;
  email: string;
  copyright: string;
}

const DEFAULT_FOOTER: FooterData = {
  about: "Найкраща фракція проекту. Ми не просто граємо, ми створюємо атмосферу безпеки та взаємодопомоги у віртуальному світі.",
  email: "suport.dsns.ug@gmail.com",
  copyright: "© 2024 Faction DSNU Team. Не є офіційним сайтом ДСНС України. Розроблено для UKRAINE GTA."
};

const SUPER_ADMINS = ['admin@dsns.gov'];

interface DataContextType {
  news: NewsItem[];
  stats: OperationalStat[];
  guides: SafetyGuide[];
  forumThreads: ForumThread[];
  heroData: HeroData;
  recruitment: RecruitmentData;
  footerData: FooterData;
  marqueeTexts: string[];
  navLinks: typeof NAV_LINKS;
  isEditMode: boolean;
  isMaintenanceOpen: boolean;
  currentUser: UserAccount | null;
  users: UserAccount[];
  applications: Application[];
  setEditMode: (val: boolean) => void;
  setMaintenanceOpen: (val: boolean) => void;
  triggerMaintenance: () => void;
  setCurrentUser: (user: UserAccount | null) => void;
  updateCurrentUser: (userData: Partial<UserAccount>) => void;
  updateUserRole: (userId: string, newRole: UserRole) => void;
  registerUser: (user: UserAccount) => void;
  submitApplication: (app: Application) => void;
  updateApplicationStatus: (appId: string, status: 'approved' | 'rejected') => void;
  addForumThread: (thread: ForumThread) => void;
  deleteForumThread: (threadId: string) => void;
  updateNews: (news: NewsItem[]) => void;
  updateStats: (stats: OperationalStat[]) => void;
  updateGuides: (guides: SafetyGuide[]) => void;
  updateHero: (data: HeroData) => void;
  updateRecruitment: (data: RecruitmentData) => void;
  updateFooter: (data: FooterData) => void;
  updateMarquee: (texts: string[]) => void;
  updateNavLinks: (links: typeof NAV_LINKS) => void;
  globalStateUpdate: (newState: any) => void;
  resetToDefaults: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const loadFromStorage = (key: string, defaultValue: any) => {
  if (typeof window === 'undefined') return defaultValue;
  const saved = localStorage.getItem(key);
  if (!saved) return defaultValue;
  try {
    return JSON.parse(saved);
  } catch {
    return defaultValue;
  }
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, _setCurrentUser] = useState<UserAccount | null>(() => loadFromStorage('ugta_dsns_current_user', null));
  const [isEditMode, _setEditMode] = useState<boolean>(() => loadFromStorage('ugta_dsns_edit_mode', false));
  const [isMaintenanceOpen, setMaintenanceOpen] = useState(false);
  const [news, setNews] = useState<NewsItem[]>(() => loadFromStorage('ugta_dsns_news', LATEST_NEWS));
  const [stats, setStats] = useState<OperationalStat[]>(() => loadFromStorage('ugta_dsns_stats', OPERATIONAL_STATS));
  const [guides, setGuides] = useState<SafetyGuide[]>(() => loadFromStorage('ugta_dsns_guides', SAFETY_GUIDES));
  const [forumThreads, setForumThreads] = useState<ForumThread[]>(() => loadFromStorage('ugta_dsns_forum', []));
  const [heroData, setHeroData] = useState<HeroData>(() => loadFromStorage('ugta_dsns_hero', DEFAULT_HERO));
  const [recruitment, setRecruitment] = useState<RecruitmentData>(() => loadFromStorage('ugta_dsns_recruit', DEFAULT_RECRUITMENT));
  const [footerData, setFooterData] = useState<FooterData>(() => loadFromStorage('ugta_dsns_footer', DEFAULT_FOOTER));
  const [marqueeTexts, setMarqueeTexts] = useState<string[]>(() => loadFromStorage('ugta_dsns_marquee', [
    "ОБОВ'ЯЗКОВО ДОТРИМУЙТЕСЬ ПРАВИЛ ROLEPLAY ТА СТАТУТУ ДСНС",
    "ПЕРЕВІРЯЙТЕ ФОРУМ НА НАЯВНІСТЬ НОВИХ ТЕН-КОДІВ",
    "СЛУЖИМО НА БЛАГО UKRAINE GTA"
  ]));
  const [navLinks, setNavLinks] = useState(() => loadFromStorage('ugta_dsns_nav', NAV_LINKS));
  const [applications, setApplications] = useState<Application[]>(() => loadFromStorage('ugta_dsns_apps', []));
  
  const [users, setUsers] = useState<UserAccount[]>(() => {
    const loaded = loadFromStorage('ugta_dsns_users', []);
    SUPER_ADMINS.forEach(email => {
      if (!loaded.some((u: UserAccount) => u.email === email)) {
        loaded.push({ id: 'root', name: 'Адмін', email, role: 'Слідкуючий', color: '#EF4444', frameShape: 'round' });
      }
    });
    return loaded;
  });

  const triggerMaintenance = () => setMaintenanceOpen(true);

  const setCurrentUser = (user: UserAccount | null) => {
    _setCurrentUser(user);
    if (user) {
      localStorage.setItem('ugta_dsns_current_user', JSON.stringify(user));
      const updatedUsers = users.map(u => u.id === user.id ? user : u);
      setUsers(updatedUsers);
      localStorage.setItem('ugta_dsns_users', JSON.stringify(updatedUsers));
    } else {
      localStorage.removeItem('ugta_dsns_current_user');
      localStorage.removeItem('ugta_dsns_edit_mode');
    }
  };

  const addForumThread = (thread: ForumThread) => {
    const updated = [thread, ...forumThreads];
    setForumThreads(updated);
    localStorage.setItem('ugta_dsns_forum', JSON.stringify(updated));
  };

  const deleteForumThread = (threadId: string) => {
    const updated = forumThreads.filter(t => t.id !== threadId);
    setForumThreads(updated);
    localStorage.setItem('ugta_dsns_forum', JSON.stringify(updated));
  };

  const setEditMode = (val: boolean) => {
    _setEditMode(val);
    localStorage.setItem('ugta_dsns_edit_mode', JSON.stringify(val));
  };

  const updateCurrentUser = (userData: Partial<UserAccount>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...userData };
    _setCurrentUser(updated);
    localStorage.setItem('ugta_dsns_current_user', JSON.stringify(updated));
    const updatedUsers = users.map(u => u.id === currentUser.id ? updated : u);
    setUsers(updatedUsers);
    localStorage.setItem('ugta_dsns_users', JSON.stringify(updatedUsers));
  };

  const updateUserRole = (userId: string, newRole: UserRole) => {
    const updatedUsers = users.map(u => u.id === userId ? { ...u, role: newRole } : u);
    setUsers(updatedUsers);
    localStorage.setItem('ugta_dsns_users', JSON.stringify(updatedUsers));
    if (currentUser && currentUser.id === userId) {
      const updatedSelf = { ...currentUser, role: newRole };
      _setCurrentUser(updatedSelf);
      localStorage.setItem('ugta_dsns_current_user', JSON.stringify(updatedSelf));
    }
  };

  const registerUser = (user: UserAccount) => {
    const updated = [...users, user];
    setUsers(updated);
    localStorage.setItem('ugta_dsns_users', JSON.stringify(updated));
  };

  const submitApplication = (app: Application) => {
    const updated = [app, ...applications];
    setApplications(updated);
    localStorage.setItem('ugta_dsns_apps', JSON.stringify(updated));
    if (currentUser && currentUser.id === app.userId) {
      updateCurrentUser({ interviewStatus: 'pending' });
    }
  };

  const updateApplicationStatus = (appId: string, status: 'approved' | 'rejected') => {
    const updatedApps = applications.map(a => a.id === appId ? { ...a, status } : a);
    setApplications(updatedApps);
    localStorage.setItem('ugta_dsns_apps', JSON.stringify(updatedApps));

    const app = applications.find(a => a.id === appId);
    if (app) {
      const updatedUsers = users.map(u => u.id === app.userId ? { ...u, interviewStatus: status, hasBeenNotified: false } : u);
      setUsers(updatedUsers);
      localStorage.setItem('ugta_dsns_users', JSON.stringify(updatedUsers));
      if (currentUser && currentUser.id === app.userId) {
        updateCurrentUser({ interviewStatus: status, hasBeenNotified: false });
      }
    }
  };

  const globalStateUpdate = (newState: any) => {
    if (newState.news) { setNews(newState.news); localStorage.setItem('ugta_dsns_news', JSON.stringify(newState.news)); }
    if (newState.heroData) { setHeroData(newState.heroData); localStorage.setItem('ugta_dsns_hero', JSON.stringify(newState.heroData)); }
    if (newState.stats) { setStats(newState.stats); localStorage.setItem('ugta_dsns_stats', JSON.stringify(newState.stats)); }
    if (newState.recruitment) { setRecruitment(newState.recruitment); localStorage.setItem('ugta_dsns_recruit', JSON.stringify(newState.recruitment)); }
    if (newState.footerData) { setFooterData(newState.footerData); localStorage.setItem('ugta_dsns_footer', JSON.stringify(newState.footerData)); }
    if (newState.marqueeTexts) { setMarqueeTexts(newState.marqueeTexts); localStorage.setItem('ugta_dsns_marquee', JSON.stringify(newState.marqueeTexts)); }
    if (newState.navLinks) { setNavLinks(newState.navLinks); localStorage.setItem('ugta_dsns_nav', JSON.stringify(newState.navLinks)); }
    if (newState.forumThreads) { setForumThreads(newState.forumThreads); localStorage.setItem('ugta_dsns_forum', JSON.stringify(newState.forumThreads)); }
  };

  const updateHero = (d: HeroData) => { setHeroData(d); localStorage.setItem('ugta_dsns_hero', JSON.stringify(d)); };
  const updateNews = (d: NewsItem[]) => { setNews(d); localStorage.setItem('ugta_dsns_news', JSON.stringify(d)); };
  const updateStats = (d: OperationalStat[]) => { setStats(d); localStorage.setItem('ugta_dsns_stats', JSON.stringify(d)); };
  const updateGuides = (d: SafetyGuide[]) => { setGuides(d); localStorage.setItem('ugta_dsns_guides', JSON.stringify(d)); };
  const updateRecruitment = (d: RecruitmentData) => { setRecruitment(d); localStorage.setItem('ugta_dsns_recruit', JSON.stringify(d)); };
  const updateFooter = (d: FooterData) => { setFooterData(d); localStorage.setItem('ugta_dsns_footer', JSON.stringify(d)); };
  const updateMarquee = (d: string[]) => { setMarqueeTexts(d); localStorage.setItem('ugta_dsns_marquee', JSON.stringify(d)); };
  const updateNavLinks = (d: typeof NAV_LINKS) => { setNavLinks(d); localStorage.setItem('ugta_dsns_nav', JSON.stringify(d)); };

  const resetToDefaults = () => { localStorage.clear(); window.location.reload(); };

  return (
    <DataContext.Provider value={{ 
      news, stats, guides, forumThreads, heroData, recruitment, footerData, marqueeTexts, navLinks, isEditMode, isMaintenanceOpen, currentUser, users, applications,
      setEditMode, setMaintenanceOpen, triggerMaintenance, setCurrentUser, updateCurrentUser, updateUserRole, registerUser, submitApplication, updateApplicationStatus,
      addForumThread, deleteForumThread, updateNews, updateStats, updateGuides, updateHero, updateRecruitment, updateFooter, updateMarquee, updateNavLinks, 
      globalStateUpdate, resetToDefaults 
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const c = useContext(DataContext);
  if (!c) throw new Error('ERR');
  return c;
};
