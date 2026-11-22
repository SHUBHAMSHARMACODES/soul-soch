export type BookCategory =
  | 'Books & Literature'
  | 'Spirituality & Gita'
  | 'Psychology & Mind'
  | 'Philosophy'
  | 'Science & Knowledge'
  | 'Self-Improvement'
  | 'History & Culture';

export const BOOK_CATEGORIES: BookCategory[] = [
  'Books & Literature',
  'Spirituality & Gita',
  'Psychology & Mind',
  'Philosophy',
  'Science & Knowledge',
  'Self-Improvement',
  'History & Culture',
];

export type CoverStyle =
  | 'gita'
  | 'essentialism'
  | 'meditations'
  | 'meaning'
  | 'atomic'
  | 'custom';

export interface Book {
  id: string;
  title: string;
  subtitle: string;
  author: string;
  category: BookCategory;
  coverUrl: string;
  coverStyle: CoverStyle;
  summary: string;
  keyTakeaways: string[];
  quote: string;
  pdfUrl: string;
  readTime: string;
  featured: boolean;
  displayOrder: number;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export type InsightType = 'wisdom' | 'shloka' | 'insight' | 'reading_list';

export interface Insight {
  id: string;
  title: string;
  type: InsightType;
  content: string;
  source: string;
  featuredWeekly: boolean;
  createdAt?: unknown;
}

export type AdSlotKey =
  | 'adsense_global'
  | 'slot_banner'
  | 'slot_sidebar'
  | 'slot_reader';

export interface AdSetting {
  id: string;
  slotKey: AdSlotKey;
  enabled: boolean;
  mode: 'adsense' | 'sponsor';
  adsenseClientId: string;
  adsenseSlotId: string;
  sponsorTitle: string;
  sponsorDescription: string;
  sponsorCtaText: string;
  sponsorUrl: string;
  sponsorImageUrl: string;
  updatedAt?: unknown;
}

export interface Subscriber {
  id: string;
  email: string;
  createdAt?: unknown;
}
