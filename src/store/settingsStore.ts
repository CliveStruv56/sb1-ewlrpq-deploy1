import { create } from 'zustand';
import { collection, doc, getDoc, setDoc, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface Option {
  id: string;
  name: string;
  price: number;
}

interface Settings {
  options: Option[];
  loading: boolean;
  error: string | null;
  fetchOptions: () => Promise<void>;
  addOption: (name: string, price: number) => Promise<void>;
  updateOption: (id: string, name: string, price: number) => Promise<void>;
  deleteOption: (id: string) => Promise<void>;
}

export const useSettingsStore = create<Settings>((set, get) => ({
  options: [],
  loading: false,
  error: null,

  fetchOptions: async () => {
    set({ loading: true, error: null });
    try {
      const optionsRef = collection(db, 'options');
      const snapshot = await getDocs(optionsRef);
      const options = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Option[];
      set({ options, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch options', loading: false });
    }
  },

  addOption: async (name: string, price: number) => {
    set({ loading: true, error: null });
    try {
      const optionsRef = collection(db, 'options');
      await setDoc(doc(optionsRef), { name, price });
      await get().fetchOptions();
    } catch (error) {
      set({ error: 'Failed to add option', loading: false });
    }
  },

  updateOption: async (id: string, name: string, price: number) => {
    set({ loading: true, error: null });
    try {
      const optionRef = doc(db, 'options', id);
      await updateDoc(optionRef, { name, price });
      await get().fetchOptions();
    } catch (error) {
      set({ error: 'Failed to update option', loading: false });
    }
  },

  deleteOption: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const optionRef = doc(db, 'options', id);
      await updateDoc(optionRef, { deleted: true });
      await get().fetchOptions();
    } catch (error) {
      set({ error: 'Failed to delete option', loading: false });
    }
  }
}));