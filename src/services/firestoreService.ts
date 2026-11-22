import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { DEFAULT_AD_SETTINGS, DEFAULT_BOOKS, DEFAULT_INSIGHTS } from '../data/defaultBooks';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { AdSetting, AdSlotKey, Book, BookCategory, CoverStyle, Insight, Subscriber } from '../types';

export function sanitizeSlugId(raw: string): string {
  const cleaned = raw
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9_\-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
  return cleaned || `item-${Date.now()}`;
}

export function sanitizeUrl(url: string): string {
  const trimmed = url.trim().slice(0, 1000);
  if (!trimmed) return '';
  if (
    trimmed.startsWith('https://') ||
    trimmed.startsWith('http://') ||
    trimmed.startsWith('/src/assets/') ||
    trimmed.startsWith('/assets/')
  ) {
    return trimmed;
  }
  if (trimmed.startsWith('#')) {
    return '';
  }
  return `https://${trimmed}`;
}

export function subscribeBooks(
  onData: (books: Book[]) => void,
  onLoaded?: () => void
) {
  const q = query(collection(db, 'books'), orderBy('displayOrder', 'asc'));
  return onSnapshot(
    q,
    (snapshot) => {
      const items: Book[] = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Book, 'id'>),
      }));
      onData(items);
      onLoaded?.();
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, 'books');
    }
  );
}

export function subscribeInsights(onData: (insights: Insight[]) => void) {
  const q = query(collection(db, 'insights'));
  return onSnapshot(
    q,
    (snapshot) => {
      const items: Insight[] = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Insight, 'id'>),
      }));
      onData(items);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, 'insights');
    }
  );
}

export function subscribeAdSettings(onData: (ads: Record<AdSlotKey, AdSetting>) => void) {
  return onSnapshot(
    collection(db, 'adSettings'),
    (snapshot) => {
      const map: Record<string, AdSetting> = {};
      DEFAULT_AD_SETTINGS.forEach((item) => {
        map[item.slotKey] = item;
      });
      snapshot.docs.forEach((d) => {
        const data = d.data() as Omit<AdSetting, 'id'>;
        map[data.slotKey] = { id: d.id, ...data };
      });
      onData(map as Record<AdSlotKey, AdSetting>);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, 'adSettings');
    }
  );
}

export async function saveBook(
  bookData: {
    id?: string;
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
  },
  isEdit: boolean
): Promise<string> {
  const id = isEdit && bookData.id ? bookData.id : `${sanitizeSlugId(bookData.title)}-${Date.now().toString(36)}`;
  const path = `books/${id}`;

  const payload = {
    title: bookData.title.trim().slice(0, 160),
    subtitle: bookData.subtitle.trim().slice(0, 240),
    author: bookData.author.trim().slice(0, 120),
    category: bookData.category,
    coverUrl: sanitizeUrl(bookData.coverUrl),
    coverStyle: bookData.coverStyle,
    summary: bookData.summary.trim().slice(0, 15000),
    keyTakeaways: bookData.keyTakeaways
      .map((t) => t.trim().slice(0, 300))
      .filter(Boolean)
      .slice(0, 10),
    quote: bookData.quote.trim().slice(0, 500),
    pdfUrl: sanitizeUrl(bookData.pdfUrl),
    readTime: (bookData.readTime.trim() || '10 min read').slice(0, 40),
    featured: Boolean(bookData.featured),
    displayOrder: Math.max(0, Math.min(100000, Number(bookData.displayOrder) || 0)),
  };

  try {
    if (isEdit) {
      await updateDoc(doc(db, 'books', id), {
        ...payload,
        updatedAt: serverTimestamp(),
      });
    } else {
      await setDoc(doc(db, 'books', id), {
        ...payload,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
    return id;
  } catch (error) {
    handleFirestoreError(error, isEdit ? OperationType.UPDATE : OperationType.CREATE, path);
  }
}

export async function removeBook(bookId: string): Promise<void> {
  const path = `books/${bookId}`;
  try {
    await deleteDoc(doc(db, 'books', bookId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function saveInsight(
  insight: Omit<Insight, 'id' | 'createdAt'> & { id?: string },
  isEdit: boolean
): Promise<void> {
  const id = isEdit && insight.id ? insight.id : `${sanitizeSlugId(insight.title)}-${Date.now().toString(36)}`;
  const path = `insights/${id}`;

  const payload = {
    title: insight.title.trim().slice(0, 160),
    type: insight.type,
    content: insight.content.trim().slice(0, 4000),
    source: insight.source.trim().slice(0, 160),
    featuredWeekly: Boolean(insight.featuredWeekly),
  };

  try {
    if (isEdit) {
      await updateDoc(doc(db, 'insights', id), payload);
    } else {
      await setDoc(doc(db, 'insights', id), {
        ...payload,
        createdAt: serverTimestamp(),
      });
    }
  } catch (error) {
    handleFirestoreError(error, isEdit ? OperationType.UPDATE : OperationType.CREATE, path);
  }
}

export async function removeInsight(insightId: string): Promise<void> {
  const path = `insights/${insightId}`;
  try {
    await deleteDoc(doc(db, 'insights', insightId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function saveAdSetting(setting: Omit<AdSetting, 'id' | 'updatedAt'>): Promise<void> {
  const id = setting.slotKey;
  const path = `adSettings/${id}`;

  const payload = {
    slotKey: setting.slotKey,
    enabled: Boolean(setting.enabled),
    mode: setting.mode,
    adsenseClientId: setting.adsenseClientId.trim().slice(0, 80),
    adsenseSlotId: setting.adsenseSlotId.trim().slice(0, 80),
    sponsorTitle: setting.sponsorTitle.trim().slice(0, 120),
    sponsorDescription: setting.sponsorDescription.trim().slice(0, 300),
    sponsorCtaText: setting.sponsorCtaText.trim().slice(0, 60),
    sponsorUrl: sanitizeUrl(setting.sponsorUrl),
    sponsorImageUrl: sanitizeUrl(setting.sponsorImageUrl),
    updatedAt: serverTimestamp(),
  };

  try {
    await setDoc(doc(db, 'adSettings', id), payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function addSubscriber(email: string): Promise<void> {
  const cleanEmail = email.trim().toLowerCase().slice(0, 160);
  const id = `sub-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
  const path = `subscribers/${id}`;
  try {
    await setDoc(doc(db, 'subscribers', id), {
      email: cleanEmail,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function fetchSubscribers(): Promise<Subscriber[]> {
  try {
    const snap = await getDocs(collection(db, 'subscribers'));
    return snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<Subscriber, 'id'>),
    }));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'subscribers');
  }
}

export async function removeSubscriber(subscriberId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'subscribers', subscriberId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `subscribers/${subscriberId}`);
  }
}

export async function seedStarterContent(): Promise<void> {
  try {
    for (const book of DEFAULT_BOOKS) {
      await setDoc(doc(db, 'books', book.id), {
        title: book.title,
        subtitle: book.subtitle,
        author: book.author,
        category: book.category,
        coverUrl: book.coverUrl,
        coverStyle: book.coverStyle,
        summary: book.summary,
        keyTakeaways: book.keyTakeaways,
        quote: book.quote,
        pdfUrl: book.pdfUrl,
        readTime: book.readTime,
        featured: book.featured,
        displayOrder: book.displayOrder,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }

    for (const insight of DEFAULT_INSIGHTS) {
      await setDoc(doc(db, 'insights', insight.id), {
        title: insight.title,
        type: insight.type,
        content: insight.content,
        source: insight.source,
        featuredWeekly: insight.featuredWeekly,
        createdAt: serverTimestamp(),
      });
    }

    for (const ad of DEFAULT_AD_SETTINGS) {
      await setDoc(doc(db, 'adSettings', ad.slotKey), {
        slotKey: ad.slotKey,
        enabled: ad.enabled,
        mode: ad.mode,
        adsenseClientId: ad.adsenseClientId,
        adsenseSlotId: ad.adsenseSlotId,
        sponsorTitle: ad.sponsorTitle,
        sponsorDescription: ad.sponsorDescription,
        sponsorCtaText: ad.sponsorCtaText,
        sponsorUrl: ad.sponsorUrl,
        sponsorImageUrl: ad.sponsorImageUrl,
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'seedStarterContent');
  }
}
