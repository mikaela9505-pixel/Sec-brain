import { create } from 'zustand';
import type {
  AppState,
  Character,
  Relation,
  Scene,
  Subplot,
  Chapter,
  Place,
  WorldEvent,
  Snapshot,
  StickyNote,
  ProjectSettings,
} from '../types';

const STORAGE_KEY = 'book-planner-data';

const seedData: Omit<AppState, 'activeView'> = {
  project: {
    title: 'Skuggans Barn',
    description: 'En mörk fantasy-roman om en ung kvinna som ärver förmågan att se de döda.',
    wordCountGoal: 80000,
    genre: 'Mörk Fantasy',
    targetAudience: 'Unga vuxna / Vuxna',
  },
  characters: [
    {
      id: 'char-1',
      name: 'Elara Dusk',
      role: 'protagonist',
      age: 22,
      appearance: 'Lång och smal med silvergrått hår och violetta ögon. Bär alltid ett gammalt halsband av svart glas.',
      personality: 'Introspektiv, bestämd och ibland oförsiktig. Har ett starkt rättvisepatos.',
      backstory: 'Uppvuxen i ett litet fiskesamhälle, förlorade sin mor tidigt och har sedan dess sökt svar på frågor om döden och vad som kommer efter.',
      motivations: 'Förstå sin förmåga och hitta sin försvunna bror.',
      fears: 'Att bli som de skuggor hon ser — fastnade mellan världarna.',
      speechStyle: 'Eftertänksam och precis. Talar sällan i onödan.',
      tags: ['protagonist', 'synsk', 'sökande'],
      imageBase64: undefined,
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-20T14:30:00Z',
    },
    {
      id: 'char-2',
      name: 'Kael Thornwood',
      role: 'supporting',
      age: 28,
      appearance: 'Bred axlar, mörkt hår och ett ärr längs vänster kind. Klär sig alltid i jordfärgade toner.',
      personality: 'Skyddande, lojal och ibland för ärlig. Gömmer sin mjukhet bakom ett hårt yttre.',
      backstory: 'Tidigare soldat som lämnade armén efter ett trauma. Nu arbetar han som väktare och guide i gränsmarkerna.',
      motivations: 'Skydda de svaga och sona sina tidigare misstag.',
      fears: 'Att åter förlora någon han borde ha skyddat.',
      speechStyle: 'Korthuggad och direkt. Väljer ord noggrant.',
      tags: ['allierad', 'krigare', 'beskyddare'],
      imageBase64: undefined,
      createdAt: '2024-01-15T10:05:00Z',
      updatedAt: '2024-01-18T09:00:00Z',
    },
    {
      id: 'char-3',
      name: 'Mara Vesper',
      role: 'antagonist',
      age: 45,
      appearance: 'Elegant med rödsvart hår och kalla gröna ögon. Alltid klädd i djupt lila och svart.',
      personality: 'Intelligent, karismatisk och iskall. Tror att ordning kräver offer.',
      backstory: 'En gång en ärbar läkare, förvandlades hon av förlust och desperation. Söker nu kontroll över dödens gräns.',
      motivations: 'Öppna porten mellan världarna permanent för att återförena sig med sin döde son.',
      fears: 'Att misslyckas och aldrig se sin son igen.',
      speechStyle: 'Formell och precis med en underliggande glöd av passion.',
      tags: ['antagonist', 'nekromant', 'sorjande'],
      imageBase64: undefined,
      createdAt: '2024-01-15T10:10:00Z',
      updatedAt: '2024-01-19T11:00:00Z',
    },
    {
      id: 'char-4',
      name: 'Finn Ashby',
      role: 'supporting',
      age: 19,
      appearance: 'Liten och kvick med lockigt rödhår och bruna ögon fulla av nyfikenhet.',
      personality: 'Entusiastisk, pratglad och briljant med siffror och mekanismer.',
      backstory: 'Elaras barndomsvän som alltid trodde på hennes förmåga när ingen annan gjorde det.',
      motivations: 'Hjälpa Elara och bevisa sin egen värde.',
      fears: 'Att vara en börda för dem han älskar.',
      speechStyle: 'Snabb och upprymd, hoppar gärna mellan ämnen.',
      tags: ['allierad', 'uppfinnare', 'vän'],
      imageBase64: undefined,
      createdAt: '2024-01-16T08:00:00Z',
      updatedAt: '2024-01-16T08:00:00Z',
    },
  ],
  relations: [
    {
      id: 'rel-1',
      fromId: 'char-1',
      toId: 'char-2',
      type: 'friend',
      description: 'Elaras trovärdigaste allierade, med ett visst romantiskt spänning.',
    },
    {
      id: 'rel-2',
      fromId: 'char-1',
      toId: 'char-3',
      type: 'enemy',
      description: 'Mara vill utnyttja Elaras förmåga för sina egna syften.',
    },
    {
      id: 'rel-3',
      fromId: 'char-1',
      toId: 'char-4',
      type: 'friend',
      description: 'Barndomsvänner med djup lojalitet mot varandra.',
    },
    {
      id: 'rel-4',
      fromId: 'char-2',
      toId: 'char-3',
      type: 'rival',
      description: 'Kael misstror Mara djupt och hon föraktar hans principfasthet.',
    },
  ],
  subplots: [
    {
      id: 'subplot-main',
      title: 'Huvudhandling',
      color: '#B8975A',
      description: 'Elaras resa att förstå sin kraft och stoppa Mara.',
    },
    {
      id: 'subplot-1',
      title: 'Den försvunne brodern',
      color: '#7B9BC8',
      description: 'Jakten på Elaras försvunne bror Lars.',
    },
    {
      id: 'subplot-2',
      title: 'Kaels förtid',
      color: '#8BAE9B',
      description: 'Gradvis avslöjande av vad Kael gjorde som soldat.',
    },
  ],
  scenes: [
    {
      id: 'scene-1',
      title: 'Uppvaknandet',
      summary: 'Elara vaknar ur en mardröm och inser att skuggorna hon sett hela livet börjar tala till henne.',
      povCharacterId: 'char-1',
      subplotId: 'subplot-main',
      placeId: 'place-1',
      chapterId: 'chap-1',
      characterIds: ['char-1'],
      emotionalTone: 'mysterious',
      status: 'written',
      order: 1,
      tags: ['öppning', 'vision'],
      createdAt: '2024-01-20T10:00:00Z',
      updatedAt: '2024-01-22T15:00:00Z',
    },
    {
      id: 'scene-2',
      title: 'Mötet vid hamnen',
      summary: 'Elara träffar Kael för första gången när hon följer en skugga ner till hamnen.',
      povCharacterId: 'char-1',
      subplotId: 'subplot-main',
      placeId: 'place-2',
      chapterId: 'chap-1',
      characterIds: ['char-1', 'char-2'],
      emotionalTone: 'tense',
      status: 'written',
      order: 2,
      tags: ['karaktärsmöte', 'hamnen'],
      createdAt: '2024-01-20T11:00:00Z',
      updatedAt: '2024-01-23T10:00:00Z',
    },
    {
      id: 'scene-3',
      title: 'Finns uppfinning',
      summary: 'Finn visar Elara en apparat han byggt som påstås kunna mäta andlig energi.',
      povCharacterId: 'char-4',
      subplotId: 'subplot-main',
      placeId: 'place-1',
      chapterId: 'chap-2',
      characterIds: ['char-1', 'char-4'],
      emotionalTone: 'hopeful',
      status: 'planned',
      order: 3,
      tags: ['uppfinning', 'hopp'],
      createdAt: '2024-01-21T09:00:00Z',
      updatedAt: '2024-01-21T09:00:00Z',
    },
    {
      id: 'scene-4',
      title: 'Brev från ingenstans',
      summary: 'Elara hittar ett brev undertecknat av sin försvunne bror Lars.',
      povCharacterId: 'char-1',
      subplotId: 'subplot-1',
      placeId: 'place-1',
      chapterId: 'chap-2',
      characterIds: ['char-1'],
      emotionalTone: 'mysterious',
      status: 'planned',
      order: 4,
      tags: ['bror', 'mysterium', 'brev'],
      createdAt: '2024-01-21T10:00:00Z',
      updatedAt: '2024-01-21T10:00:00Z',
    },
    {
      id: 'scene-5',
      title: 'Maras erbjudande',
      summary: 'Mara Vesper söker upp Elara med ett lockande — och farligt — erbjudande.',
      povCharacterId: 'char-1',
      subplotId: 'subplot-main',
      placeId: 'place-2',
      chapterId: 'chap-3',
      characterIds: ['char-1', 'char-3'],
      emotionalTone: 'tense',
      status: 'idea',
      order: 5,
      tags: ['antagonist', 'erbjudande', 'konfrontation'],
      createdAt: '2024-01-22T08:00:00Z',
      updatedAt: '2024-01-22T08:00:00Z',
    },
    {
      id: 'scene-6',
      title: 'Kaels hemlighet',
      summary: 'Kael berättar för Elara vad som verkligen hände under slaget vid Ashenvale.',
      povCharacterId: 'char-2',
      subplotId: 'subplot-2',
      placeId: 'place-2',
      chapterId: 'chap-3',
      characterIds: ['char-1', 'char-2'],
      emotionalTone: 'sad',
      status: 'idea',
      order: 6,
      tags: ['avslöjande', 'förtid', 'förtroende'],
      createdAt: '2024-01-22T09:00:00Z',
      updatedAt: '2024-01-22T09:00:00Z',
    },
  ],
  chapters: [
    {
      id: 'chap-1',
      title: 'Skuggornas röster',
      order: 1,
      status: 'draft',
      summary: 'Elara lever ett vanligt liv i fiskesamhället Ashport när skuggorna hon alltid sett plötsligt börjar tala.',
      notes: 'Etablera Elaras normalitet, visa kontrasten med det övernaturliga. Sluta med ett cliffhanger vid hamnmötet.',
      content: 'Havet var svart som bläck när Elara vaknade. Mardrömmen lade sig tungt, bilderna lämnade fingeravtryck av rädsla längs hennes ryggkota. Hon kände hur luften i rummet vibrerade på det där sättet den aldrig borde göra — tätt och tungt, som strax före ett åskväder.\n\nHon satte sig upp i sängen och stirrade mot rummets skuggor. Tre av dem var för täta, för verkliga. Hon kunde se konturerna av ansikten i dem.\n\nDet var inte nytt. Det hade aldrig varit nytt.\n\nVad som var nytt var att en av dem öppnade munnen.',
      wordCountGoal: 5000,
      povCharacterId: 'char-1',
      sceneIds: ['scene-1', 'scene-2'],
      tags: ['öppning', 'presentation'],
      createdAt: '2024-01-20T08:00:00Z',
      updatedAt: '2024-01-25T16:00:00Z',
    },
    {
      id: 'chap-2',
      title: 'Det som göms i ljuset',
      order: 2,
      status: 'planned',
      summary: 'Elara och Finn undersöker den andliga apparaten medan ett mystiskt brev från hennes bror dyker upp.',
      notes: 'Visa dynamiken mellan Elara och Finn. Introducera subplot om brodern. Finn bör kännas lättsam mot bakgrundens mörker.',
      content: '',
      wordCountGoal: 6000,
      povCharacterId: 'char-1',
      sceneIds: ['scene-3', 'scene-4'],
      tags: ['mysterium', 'vänskap'],
      createdAt: '2024-01-21T08:00:00Z',
      updatedAt: '2024-01-21T08:00:00Z',
    },
    {
      id: 'chap-3',
      title: 'Vart mörker lutar',
      order: 3,
      status: 'idea',
      summary: 'Mara gör sin entré och Kael delar en hemlighet som förändrar allt.',
      notes: 'Maras scen ska vara elegant och hotfull. Kaels avslöjande ska komma organiskt, inte forcerat.',
      content: '',
      wordCountGoal: 7000,
      povCharacterId: 'char-1',
      sceneIds: ['scene-5', 'scene-6'],
      tags: ['antagonist', 'avslöjande'],
      createdAt: '2024-01-22T08:00:00Z',
      updatedAt: '2024-01-22T08:00:00Z',
    },
  ],
  places: [
    {
      id: 'place-1',
      name: 'Ashport',
      description: 'Ett gammalt fiskesamhälle vid ett dimmigt hav. Hus av grå sten, trånga gränder och alltid närvaron av salt och röta i luften.',
      type: 'Stad',
      notes: 'Bör kännas isolerat och lite kusligt. Invånarna är vidskepliga och undviker att tala om övernaturliga ting.',
      characterIds: ['char-1', 'char-4'],
      sceneIds: ['scene-1', 'scene-3', 'scene-4'],
      tags: ['hemmiljö', 'kust', 'mörk'],
      createdAt: '2024-01-15T12:00:00Z',
    },
    {
      id: 'place-2',
      name: 'Hamnen i Ashport',
      description: 'Den gamla hamnen med sina svarta pirer som sträcker sig ut i dimman. Skuggorna är alltid tätare här.',
      type: 'Plats',
      notes: 'Viktig plats för Elaras förmåga. Skuggorna dras till vatten.',
      characterIds: ['char-1', 'char-2', 'char-3'],
      sceneIds: ['scene-2', 'scene-5'],
      tags: ['hamn', 'övernaturlig', 'dimma'],
      createdAt: '2024-01-15T12:30:00Z',
    },
  ],
  worldEvents: [
    {
      id: 'event-1',
      title: 'Slaget vid Ashenvale',
      description: 'En blodig militär konflikt för fem år sedan som lämnade många döda och Kael traumatiserad.',
      date: '2019-06-15',
      type: 'backstory',
      characterIds: ['char-2'],
      tags: ['krig', 'trauma', 'förtid'],
      createdAt: '2024-01-18T10:00:00Z',
    },
    {
      id: 'event-2',
      title: 'Lars Dusks försvinnande',
      description: 'Elaras yngre bror försvann utan spår för tre år sedan. Myndigheterna la ned fallet.',
      date: '2021-03-22',
      type: 'backstory',
      characterIds: ['char-1'],
      tags: ['försvinnande', 'bror', 'mysterium'],
      createdAt: '2024-01-18T10:30:00Z',
    },
    {
      id: 'event-3',
      title: 'Sprickorna börjar visa sig',
      description: 'Invånare i tre städer rapporterar om skuggfigurer och röster. Mara sätter sin plan i rörelse.',
      date: '2024-01-01',
      type: 'world_event',
      characterIds: ['char-3'],
      tags: ['övernaturligt', 'varsel', 'kris'],
      createdAt: '2024-01-19T09:00:00Z',
    },
  ],
  snapshots: [],
  stickyNotes: [
    {
      id: 'note-1',
      content: 'Kom ihåg: Elaras förmåga ska kännas som en börda, inte en gåva. Visa kostnaderna.',
      color: '#FFF9C4',
      createdAt: '2024-01-20T10:00:00Z',
      updatedAt: '2024-01-20T10:00:00Z',
    },
    {
      id: 'note-2',
      content: 'Mara behöver fler sympatiska drag. Hon tror genuint att hon gör rätt.',
      color: '#F8D7DA',
      createdAt: '2024-01-21T11:00:00Z',
      updatedAt: '2024-01-21T11:00:00Z',
    },
    {
      id: 'note-3',
      content: 'Finn och Kael behöver en scen tillsammans — bra komik i deras olikhet.',
      color: '#D1F2EB',
      createdAt: '2024-01-22T09:00:00Z',
      updatedAt: '2024-01-22T09:00:00Z',
    },
  ],
};

function loadFromStorage(): Omit<AppState, 'activeView'> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // ignore
  }
  return seedData;
}

function saveToStorage(state: Omit<AppState, 'activeView'>) {
  try {
    const { project, characters, relations, scenes, subplots, chapters, places, worldEvents, snapshots, stickyNotes } = state;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ project, characters, relations, scenes, subplots, chapters, places, worldEvents, snapshots, stickyNotes }));
  } catch {
    // ignore
  }
}

function generateId() {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

interface StoreActions {
  setActiveView: (view: string) => void;

  updateProject: (settings: Partial<ProjectSettings>) => void;

  addCharacter: (char: Omit<Character, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCharacter: (id: string, char: Partial<Character>) => void;
  deleteCharacter: (id: string) => void;

  addRelation: (rel: Omit<Relation, 'id'>) => void;
  updateRelation: (id: string, rel: Partial<Relation>) => void;
  deleteRelation: (id: string) => void;

  addScene: (scene: Omit<Scene, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateScene: (id: string, scene: Partial<Scene>) => void;
  deleteScene: (id: string) => void;

  addSubplot: (subplot: Omit<Subplot, 'id'>) => void;
  updateSubplot: (id: string, subplot: Partial<Subplot>) => void;
  deleteSubplot: (id: string) => void;

  addChapter: (chapter: Omit<Chapter, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateChapter: (id: string, chapter: Partial<Chapter>) => void;
  deleteChapter: (id: string) => void;
  reorderChapters: (chapters: Chapter[]) => void;

  addPlace: (place: Omit<Place, 'id' | 'createdAt'>) => void;
  updatePlace: (id: string, place: Partial<Place>) => void;
  deletePlace: (id: string) => void;

  addWorldEvent: (event: Omit<WorldEvent, 'id' | 'createdAt'>) => void;
  updateWorldEvent: (id: string, event: Partial<WorldEvent>) => void;
  deleteWorldEvent: (id: string) => void;

  addSnapshot: (snapshot: Omit<Snapshot, 'id' | 'createdAt'>) => void;
  deleteSnapshot: (id: string) => void;

  addStickyNote: (note: Omit<StickyNote, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateStickyNote: (id: string, note: Partial<StickyNote>) => void;
  deleteStickyNote: (id: string) => void;

  importData: (data: Omit<AppState, 'activeView'>) => void;
  resetData: () => void;
}

type Store = AppState & StoreActions;

const now = () => new Date().toISOString();

const persisted = loadFromStorage();

export const useStore = create<Store>((set, get) => {
  const persist = (update: Partial<AppState>) => {
    set(update as Partial<Store>);
    const state = get();
    saveToStorage({
      project: state.project,
      characters: state.characters,
      relations: state.relations,
      scenes: state.scenes,
      subplots: state.subplots,
      chapters: state.chapters,
      places: state.places,
      worldEvents: state.worldEvents,
      snapshots: state.snapshots,
      stickyNotes: state.stickyNotes,
    });
  };

  return {
    ...persisted,
    activeView: 'dashboard',

    setActiveView: (view) => set({ activeView: view }),

    updateProject: (settings) => persist({ project: { ...get().project, ...settings } }),

    addCharacter: (char) => persist({
      characters: [...get().characters, { ...char, id: generateId(), createdAt: now(), updatedAt: now() }],
    }),
    updateCharacter: (id, char) => persist({
      characters: get().characters.map(c => c.id === id ? { ...c, ...char, updatedAt: now() } : c),
    }),
    deleteCharacter: (id) => persist({
      characters: get().characters.filter(c => c.id !== id),
      relations: get().relations.filter(r => r.fromId !== id && r.toId !== id),
    }),

    addRelation: (rel) => persist({ relations: [...get().relations, { ...rel, id: generateId() }] }),
    updateRelation: (id, rel) => persist({ relations: get().relations.map(r => r.id === id ? { ...r, ...rel } : r) }),
    deleteRelation: (id) => persist({ relations: get().relations.filter(r => r.id !== id) }),

    addScene: (scene) => persist({
      scenes: [...get().scenes, { ...scene, id: generateId(), createdAt: now(), updatedAt: now() }],
    }),
    updateScene: (id, scene) => persist({
      scenes: get().scenes.map(s => s.id === id ? { ...s, ...scene, updatedAt: now() } : s),
    }),
    deleteScene: (id) => persist({ scenes: get().scenes.filter(s => s.id !== id) }),

    addSubplot: (subplot) => persist({ subplots: [...get().subplots, { ...subplot, id: generateId() }] }),
    updateSubplot: (id, subplot) => persist({ subplots: get().subplots.map(s => s.id === id ? { ...s, ...subplot } : s) }),
    deleteSubplot: (id) => persist({ subplots: get().subplots.filter(s => s.id !== id) }),

    addChapter: (chapter) => persist({
      chapters: [...get().chapters, { ...chapter, id: generateId(), createdAt: now(), updatedAt: now() }],
    }),
    updateChapter: (id, chapter) => persist({
      chapters: get().chapters.map(c => c.id === id ? { ...c, ...chapter, updatedAt: now() } : c),
    }),
    deleteChapter: (id) => persist({ chapters: get().chapters.filter(c => c.id !== id) }),
    reorderChapters: (chapters) => persist({ chapters }),

    addPlace: (place) => persist({
      places: [...get().places, { ...place, id: generateId(), createdAt: now() }],
    }),
    updatePlace: (id, place) => persist({ places: get().places.map(p => p.id === id ? { ...p, ...place } : p) }),
    deletePlace: (id) => persist({ places: get().places.filter(p => p.id !== id) }),

    addWorldEvent: (event) => persist({
      worldEvents: [...get().worldEvents, { ...event, id: generateId(), createdAt: now() }],
    }),
    updateWorldEvent: (id, event) => persist({ worldEvents: get().worldEvents.map(e => e.id === id ? { ...e, ...event } : e) }),
    deleteWorldEvent: (id) => persist({ worldEvents: get().worldEvents.filter(e => e.id !== id) }),

    addSnapshot: (snapshot) => persist({
      snapshots: [...get().snapshots, { ...snapshot, id: generateId(), createdAt: now() }],
    }),
    deleteSnapshot: (id) => persist({ snapshots: get().snapshots.filter(s => s.id !== id) }),

    addStickyNote: (note) => persist({
      stickyNotes: [...get().stickyNotes, { ...note, id: generateId(), createdAt: now(), updatedAt: now() }],
    }),
    updateStickyNote: (id, note) => persist({
      stickyNotes: get().stickyNotes.map(n => n.id === id ? { ...n, ...note, updatedAt: now() } : n),
    }),
    deleteStickyNote: (id) => persist({ stickyNotes: get().stickyNotes.filter(n => n.id !== id) }),

    importData: (data) => persist(data),
    resetData: () => persist({ ...seedData }),
  };
});
