import { AdSetting, Book, Insight } from '../types';

export const HERO_IMAGE_PATH = '/src/assets/images/hero_mountain_reader_1795361233616.jpg';

export const DEFAULT_BOOKS: Book[] = [
  {
    id: 'bhagavad-gita',
    title: 'Bhagavad Gita',
    subtitle: 'Timeless lessons for modern life.',
    author: 'Vyasa',
    category: 'Spirituality & Gita',
    coverUrl: '/src/assets/images/cover_bhagavad_gita_1795361233599.jpg',
    coverStyle: 'gita',
    readTime: '14 min read',
    featured: true,
    displayOrder: 1,
    quote:
      'You have the right to work, but never to the fruit of work. Let not the fruits of action be your motive, nor let your attachment be to inaction.',
    pdfUrl: 'https://www.gita-society.com/bhagavad-gita-in-english-source-file.pdf',
    summary: `Set on the battlefield of Kurukshetra at the threshold of a great moral crisis, the Bhagavad Gita is a 700-verse dialogue between Prince Arjuna and his charioteer, Lord Krishna. Overwhelmed by doubt, grief, and conflicting duties, Arjuna lowers his bow—mirroring the inner paralysis every human faces when confronted with difficult choices.

Krishna responds not with blind dogma, but with a luminous synthesis of action (Karma Yoga), wisdom (Jnana Yoga), and devotion (Bhakti Yoga). He teaches that clarity comes when we release anxiety over outcomes and anchor our mind in righteous effort.

For modern readers navigating career pressure, emotional turbulence, and restless ambition, the Gita offers an enduring blueprint for equanimity: perform your work with total excellence while remaining inwardly free from ego, fear, and comparison.`,
    keyTakeaways: [
      'Focus fully on your effort (Karma) while detaching your peace of mind from uncontrollable results.',
      'True steadiness (Sthitaprajna) means remaining balanced through both praise and criticism, gain and loss.',
      'Self-mastery begins with disciplining the restless mind through daily awareness and reflection.',
      'Your unique duty (Swadharma) lived authentically is greater than imitating someone else’s path.',
    ],
  },
  {
    id: 'essentialism',
    title: 'Essentialism',
    subtitle: 'Less but better.',
    author: 'Greg McKeown',
    category: 'Self-Improvement',
    coverUrl: '',
    coverStyle: 'essentialism',
    readTime: '10 min read',
    featured: true,
    displayOrder: 2,
    quote:
      'If you don’t prioritize your life, someone else will. The way of the Essentialist is the relentless pursuit of less but better.',
    pdfUrl: 'https://archive.org/details/essentialism-the-disciplined-pursuit-of-less',
    summary: `Modern life rewards busyness over meaningful contribution. We say yes to too many requests, spread our energy across twenty priorities, and end up making millimeter progress in every direction. Greg McKeown challenges this trap with a simple yet radical discipline: Essentialism.

Essentialism is not about getting more things done in less time—it is about getting only the right things done. By systematically evaluating where our time and energy create the highest impact, we learn to say a graceful, firm "no" to trivial distractions.

Through practical habits like creating buffer margins, protecting quiet thinking space, and removing obstacles from our highest goals, Essentialism helps you reclaim sovereignty over your calendar and attention.`,
    keyTakeaways: [
      'Distinguish the vital few from the trivial many—almost everything is noise.',
      'A clear "no" spoken gracefully protects your deepest yes.',
      'Design space in your schedule for deep thinking, reading, and unexpected setbacks.',
      'Small, frictionless routines make essential execution effortless over time.',
    ],
  },
  {
    id: 'meditations',
    title: 'Meditations',
    subtitle: 'Find peace within.',
    author: 'Marcus Aurelius',
    category: 'Philosophy',
    coverUrl: '/src/assets/images/cover_meditations_1795361233542.jpg',
    coverStyle: 'meditations',
    readTime: '12 min read',
    featured: true,
    displayOrder: 3,
    quote:
      'You have power over your mind — not outside events. Realize this, and you will find strength.',
    pdfUrl: 'https://classics.mit.edu/Antoninus/meditations.html',
    summary: `Never intended for publication, Meditations is the private journal of Roman Emperor Marcus Aurelius—written by candlelight in military tents along the Danube frontier. Facing plagues, betrayals, and the immense burden of empire, Marcus wrote reminders to himself on how to remain calm, just, and humble.

Across twelve short books, he returns again and again to Stoic clarity: external events cannot harm your character unless you consent to let them disturb your judgment. Anger, vanity, and fear dissolve when viewed against the vastness of time and nature.

Reading Meditations feels like sitting beside a wise mentor who reminds you that every morning is a privilege, every obstacle is raw material for virtue, and true peace is always an internal fortress.`,
    keyTakeaways: [
      'Separate what is in your control (your thoughts and actions) from what is not (other people and outcomes).',
      'The impediment to action advances action—what stands in the way becomes the way.',
      'Do not waste time arguing what a good person should be; simply be one today.',
      'Reflect on impermanence to let go of petty grudges and value the present moment.',
    ],
  },
  {
    id: 'mans-search-for-meaning',
    title: "Man's Search for Meaning",
    subtitle: 'Find meaning in life.',
    author: 'Viktor E. Frankl',
    category: 'Psychology & Mind',
    coverUrl: '/src/assets/images/cover_mans_search_1795361233510.jpg',
    coverStyle: 'meaning',
    readTime: '11 min read',
    featured: true,
    displayOrder: 4,
    quote:
      'Between stimulus and response there is a space. In that space is our power to choose our response. In our response lies our growth and our freedom.',
    pdfUrl: 'https://archive.org/details/mans-search-for-meaning-viktor-frankl',
    summary: `Austrian psychiatrist and neurologist Viktor E. Frankl survived years in Nazi concentration camps, losing nearly his entire family. Yet out of unimaginable suffering, he observed a profound psychological truth: the prisoners most likely to endure were not always the physically strongest, but those who still held onto a purpose waiting for them in the future.

In the first half of the book, Frankl recounts camp life with unflinching honesty and compassion. In the second half, he introduces Logotherapy—the idea that our primary human drive is not pleasure or power, but the search for meaning.

Frankl shows that meaning can be discovered through three avenues: creative work we give to the world, love and experiences we receive, and the courageous attitude we choose when facing unavoidable suffering.`,
    keyTakeaways: [
      'Everything can be taken from a person except the last human freedom: choosing one’s attitude.',
      'Happiness cannot be pursued directly; it ensues as the unintended side-effect of dedication to a cause.',
      'Having a clear "why" to live for allows us to bear almost any "how".',
      'Meaning arises through meaningful work, deep connection, and resilience in hardship.',
    ],
  },
  {
    id: 'atomic-habits',
    title: 'Atomic Habits',
    subtitle: 'Small changes, big results.',
    author: 'James Clear',
    category: 'Self-Improvement',
    coverUrl: '',
    coverStyle: 'atomic',
    readTime: '9 min read',
    featured: true,
    displayOrder: 5,
    quote:
      'You do not rise to the level of your goals. You fall to the level of your systems.',
    pdfUrl: 'https://archive.org/details/atomic-habits-by-james-clear',
    summary: `We often assume massive life transformation requires dramatic willpower or overnight breakthroughs. James Clear proves the opposite: improving by just 1% every day compounds into extraordinary change over months and years, while tiny negative habits compound into quiet decline.

Breaking habit formation into four simple laws—Make it Obvious, Make it Attractive, Make it Easy, and Make it Satisfying—Clear shifts the focus away from fragile motivation toward thoughtful environment design and identity.

Instead of asking "What do I want to achieve?", Clear invites you to ask "Who do I wish to become?" Every small reading session, walk, or honest conversation is a vote cast for your future identity.`,
    keyTakeaways: [
      'Small 1% daily improvements compound into remarkable long-term transformation.',
      'Build systems and reshape your physical environment rather than relying on willpower alone.',
      'Use the Two-Minute Rule to lower friction and simply show up consistently.',
      'Identity-based habits endure: become a reader rather than just trying to finish one book.',
    ],
  },
  {
    id: 'sapiens',
    title: 'Sapiens',
    subtitle: 'A brief history of humankind.',
    author: 'Yuval Noah Harari',
    category: 'History & Culture',
    coverUrl: '',
    coverStyle: 'custom',
    readTime: '15 min read',
    featured: false,
    displayOrder: 6,
    quote:
      'Large numbers of strangers can cooperate successfully by believing in common myths.',
    pdfUrl: 'https://archive.org/details/sapiens-a-brief-history-of-humankind',
    summary: `How did an ordinary ape species living on the East African savanna come to dominate Earth, build cathedrals, invent money, and split the atom? Yuval Noah Harari traces 70,000 years of human history across three defining revolutions: Cognitive, Agricultural, and Scientific.

Harari reveals that humanity’s superpower is collective imagination—our unique ability to create and believe shared stories such as nations, laws, currencies, and human rights. Understanding how our institutions were shaped gives us perspective on what truly creates human well-being today.`,
    keyTakeaways: [
      'Shared stories and collective trust enabled large-scale human cooperation.',
      'Material progress and technological speed have not automatically guaranteed greater inner contentment.',
      'Studying history frees us to question inherited assumptions we treat as natural laws.',
    ],
  },
  {
    id: 'cosmos',
    title: 'Cosmos',
    subtitle: 'A journey through space and wonder.',
    author: 'Carl Sagan',
    category: 'Science & Knowledge',
    coverUrl: '',
    coverStyle: 'custom',
    readTime: '13 min read',
    featured: false,
    displayOrder: 7,
    quote:
      'Somewhere, something incredible is waiting to be known.',
    pdfUrl: 'https://archive.org/details/cosmos-carl-sagan',
    summary: `Blending poetic prose with scientific rigor, astronomer Carl Sagan connects the story of cosmic evolution with the dawn of human curiosity. From the ancient Library of Alexandria to modern planetary probes, Sagan celebrates the courage of asking questions and testing ideas against reality.

Cosmos reminds us that the iron in our blood and calcium in our bones were forged inside ancient stars—making science not cold machinery, but an intimate doorway into awe and humility.`,
    keyTakeaways: [
      'Scientific curiosity and poetic wonder belong together.',
      'Skepticism balanced with openness protects us from dogma while fueling discovery.',
      'Seeing Earth as a fragile pale blue dot invites global stewardship and compassion.',
    ],
  },
];

export const DEFAULT_INSIGHTS: Insight[] = [
  {
    id: 'weekly-aristotle',
    title: 'The Architecture of Habit',
    type: 'wisdom',
    content:
      'You are what you repeatedly do. Excellence, then, is not an act, but a habit.',
    source: 'Aristotle',
    featuredWeekly: true,
  },
  {
    id: 'gita-2-47',
    title: 'Bhagavad Gita — Chapter 2, Verse 47',
    type: 'shloka',
    content:
      'Karmanye vadhikaraste ma phaleshu kadachana | Ma karmaphalaheturbhurma te sangostvakarmani — You have a right to perform your prescribed duties, but you are not entitled to the fruits of your actions.',
    source: 'Bhagavad Gita 2.47',
    featuredWeekly: false,
  },
  {
    id: 'gita-6-5',
    title: 'Bhagavad Gita — Chapter 6, Verse 5',
    type: 'shloka',
    content:
      'Uddhared atmanatmanam natmanam avasadayet — Elevate yourself through the power of your mind, and do not degrade yourself; for the mind can be both the friend and the enemy of the self.',
    source: 'Bhagavad Gita 6.5',
    featuredWeekly: false,
  },
  {
    id: 'reading-list-clarity',
    title: '5 Books for Calm Decision-Making',
    type: 'reading_list',
    content:
      'Start with Meditations for emotional steadiness, Essentialism for subtracting noise, Bhagavad Gita for detached action, Atomic Habits for daily execution, and Man’s Search for Meaning for enduring purpose.',
    source: 'Soul & Soch Editorial Desk',
    featuredWeekly: false,
  },
  {
    id: 'thought-silence',
    title: 'Why Slow Reading Matters in an Age of Feeds',
    type: 'insight',
    content:
      'Algorithms optimize for immediate reaction; great books cultivate delayed wisdom. Spending twenty quiet minutes with a book rewires attention back toward depth, nuance, and independent thought.',
    source: 'Soul & Soch Journal',
    featuredWeekly: false,
  },
];

export const DEFAULT_AD_SETTINGS: AdSetting[] = [
  {
    id: 'adsense_global',
    slotKey: 'adsense_global',
    enabled: false,
    mode: 'adsense',
    adsenseClientId: '',
    adsenseSlotId: '',
    sponsorTitle: '',
    sponsorDescription: '',
    sponsorCtaText: '',
    sponsorUrl: '',
    sponsorImageUrl: '',
  },
  {
    id: 'slot_banner',
    slotKey: 'slot_banner',
    enabled: true,
    mode: 'sponsor',
    adsenseClientId: '',
    adsenseSlotId: '',
    sponsorTitle: 'Curated Wisdom Editions & Online Reading Partner',
    sponsorDescription:
      'Ad slot ready for Google AdSense (728×90 Leaderboard) or your featured book partner banner. Configure anytime from your Admin Studio.',
    sponsorCtaText: 'Explore Free PDFs',
    sponsorUrl: '#knowledge-section',
    sponsorImageUrl: '',
  },
  {
    id: 'slot_sidebar',
    slotKey: 'slot_sidebar',
    enabled: true,
    mode: 'sponsor',
    adsenseClientId: '',
    adsenseSlotId: '',
    sponsorTitle: 'Sidebar Sponsor / AdSense (300×250)',
    sponsorDescription:
      'High-visibility editorial sidebar placement. Switch to Google AdSense or add an affiliate book link in Admin.',
    sponsorCtaText: 'Browse Philosophy',
    sponsorUrl: '#popular-books',
    sponsorImageUrl: '',
  },
  {
    id: 'slot_reader',
    slotKey: 'slot_reader',
    enabled: true,
    mode: 'sponsor',
    adsenseClientId: '',
    adsenseSlotId: '',
    sponsorTitle: 'Reader Companion Placement',
    sponsorDescription:
      'In-article ad placement shown between book summaries and the Online PDF link.',
    sponsorCtaText: 'View Reading Lists',
    sponsorUrl: '#knowledge-section',
    sponsorImageUrl: '',
  },
];
