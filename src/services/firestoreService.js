import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  addDoc
} from 'firebase/firestore';
import { firestore } from '../firebase/config';

// Save a new mech for a user
export const saveUserMech = async (userId, mechData) => {
  try {
    const mechRef = doc(collection(firestore, 'users', userId, 'mechs'));
    await setDoc(mechRef, {
      ...mechData,
      id: mechRef.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    return mechRef.id;
  } catch (error) {
    console.error('Error saving mech:', error);
    throw error;
  }
};

// Get all mechs for a user
export const getUserMechs = async (userId) => {
  try {
    const mechsRef = collection(firestore, 'users', userId, 'mechs');
    const snapshot = await getDocs(mechsRef);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting user mechs:', error);
    return [];
  }
};

// Save a game session
export const saveGameSession = async (userId, sessionData) => {
  try {
    const sessionsRef = collection(firestore, 'users', userId, 'sessions');
    const docRef = await addDoc(sessionsRef, {
      ...sessionData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving game session:', error);
    throw error;
  }
};

// Get all game sessions for a user
export const getUserSessions = async (userId) => {
  try {
    const sessionsRef = collection(firestore, 'users', userId, 'sessions');
    const querySnapshot = await getDocs(sessionsRef);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting user sessions:', error);
    throw error;
  }
};

// Update a game session
export const updateGameSession = async (userId, sessionId, sessionData) => {
  try {
    const sessionRef = doc(firestore, 'users', userId, 'sessions', sessionId);
    await updateDoc(sessionRef, {
      ...sessionData,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating game session:', error);
    throw error;
  }
};

// Delete a game session
export const deleteGameSession = async (userId, sessionId) => {
  try {
    const sessionRef = doc(firestore, 'users', userId, 'sessions', sessionId);
    await deleteDoc(sessionRef);
  } catch (error) {
    console.error('Error deleting game session:', error);
    throw error;
  }
};

// Save a custom weapon
export const saveCustomWeapon = async (userId, weaponData) => {
  try {
    const weaponRef = doc(collection(firestore, 'users', userId, 'weapons'));
    await setDoc(weaponRef, {
      ...weaponData,
      id: weaponRef.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    return weaponRef.id;
  } catch (error) {
    console.error('Error saving custom weapon:', error);
    throw error;
  }
};

// Get all custom weapons for a user
export const getUserWeapons = async (userId) => {
  try {
    const weaponsRef = collection(firestore, 'users', userId, 'weapons');
    const snapshot = await getDocs(weaponsRef);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting user weapons:', error);
    return [];
  }
};

export const getUserSystems = async (userId) => {
  try {
    const systemsRef = collection(firestore, 'users', userId, 'systems');
    const snapshot = await getDocs(systemsRef);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching user systems:', error);
    return [];
  }
};

export const saveCustomSystem = async (userId, systemData) => {
  try {
    const systemsRef = collection(firestore, 'users', userId, 'systems');
    const docRef = await addDoc(systemsRef, {
      ...systemData,
      createdAt: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving custom system:', error);
    throw error;
  }
}; 