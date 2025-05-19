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