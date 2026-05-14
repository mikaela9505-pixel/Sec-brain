export type CharacterRole = 'protagonist' | 'supporting' | 'antagonist' | 'mentioned';
export type RelationType = 'friend' | 'enemy' | 'romantic' | 'family' | 'mentor' | 'rival';
export type ChapterStatus = 'idea' | 'planned' | 'draft' | 'revised' | 'done';
export type EmotionalTone = 'tense' | 'hopeful' | 'sad' | 'joyful' | 'mysterious' | 'neutral';
export type SceneStatus = 'idea' | 'planned' | 'written' | 'revised';

export interface Character {
  id: string;
  name: string;
  role: CharacterRole;
  age?: number;
  appearance: string;
  personality: string;
  backstory: string;
  motivations: string;
  fears: string;
  speechStyle: string;
  imageBase64?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Relation {
  id: string;
  fromId: string;
  toId: string;
  type: RelationType;
  description?: string;
}

export interface Scene {
  id: string;
  title: string;
  summary: string;
  povCharacterId?: string;
  subplotId?: string;
  placeId?: string;
  chapterId?: string;
  characterIds: string[];
  emotionalTone: EmotionalTone;
  status: SceneStatus;
  order: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Subplot {
  id: string;
  title: string;
  color: string;
  description?: string;
}

export interface Chapter {
  id: string;
  title: string;
  order: number;
  status: ChapterStatus;
  summary: string;
  notes: string;
  content: string;
  wordCountGoal?: number;
  povCharacterId?: string;
  sceneIds: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Place {
  id: string;
  name: string;
  description: string;
  type: string;
  notes: string;
  characterIds: string[];
  sceneIds: string[];
  tags: string[];
  createdAt: string;
}

export interface WorldEvent {
  id: string;
  title: string;
  description: string;
  date?: string;
  type: 'crisis' | 'turning_point' | 'world_event' | 'backstory';
  characterIds: string[];
  tags: string[];
  createdAt: string;
}

export interface Snapshot {
  id: string;
  entityId: string;
  entityType: 'character' | 'chapter' | 'scene';
  data: string;
  label: string;
  createdAt: string;
}

export interface StickyNote {
  id: string;
  content: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectSettings {
  title: string;
  description: string;
  wordCountGoal: number;
  genre: string;
  targetAudience: string;
}

export interface AppState {
  project: ProjectSettings;
  characters: Character[];
  relations: Relation[];
  scenes: Scene[];
  subplots: Subplot[];
  chapters: Chapter[];
  places: Place[];
  worldEvents: WorldEvent[];
  snapshots: Snapshot[];
  stickyNotes: StickyNote[];
  activeView: string;
}
