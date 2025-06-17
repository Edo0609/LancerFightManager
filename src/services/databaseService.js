import { ref, get } from 'firebase/database';
import { database } from '../firebase/config';

// Get default mechs from Realtime Database
export const getDefaultMechs = async () => {
  try {
    const mechsRef = ref(database, 'defaultMechs');
    const snapshot = await get(mechsRef);
    
    if (snapshot.exists()) {
      const mechsData = snapshot.val();
      return Object.values(mechsData);
    }
    return [];
  } catch (error) {
    console.error('Error getting default mechs:', error);
    return [];
  }
};

export const getDefaultWeapons = async () => {
  try {
    const weaponsRef = ref(database, 'defaultWeapons');
    const snapshot = await get(weaponsRef);
    
    if (snapshot.exists()) {
      const weaponsData = snapshot.val();
      return Object.values(weaponsData);
    }
    return [];
  } catch (error) {
    console.error('Error getting default weapons:', error);
    return [];
  }
}; 

export const getDefaultSystems = async () => {
  try {
    const systemsRef = ref(database, 'defaultSystems');
    const snapshot = await get(systemsRef);
    return snapshot.val() || [];
  } catch (error) {
    console.error('Error fetching default systems:', error);
    return [];
  }
}; 