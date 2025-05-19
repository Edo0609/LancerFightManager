import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getDefaultMechs } from '../services/databaseService';
import {
  getUserMechs,
  saveUserMech,
  getUserSessions,
  saveGameSession,
  updateGameSession,
  deleteGameSession,
  getUserWeapons,
  saveCustomWeapon
} from '../services/firestoreService';

const DatabaseContext = createContext();

export function useDatabase() {
  return useContext(DatabaseContext);
}

export function DatabaseProvider({ children }) {
  const { currentUser } = useAuth();
  const [defaultMechs, setDefaultMechs] = useState([]);
  const [userMechs, setUserMechs] = useState([]);
  const [userSessions, setUserSessions] = useState([]);
  const [userWeapons, setUserWeapons] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load default mechs
  useEffect(() => {
    const loadDefaultMechs = async () => {
      try {
        const mechs = await getDefaultMechs();
        setDefaultMechs(mechs);
      } catch (error) {
        console.error('Error loading default mechs:', error);
      }
    };

    loadDefaultMechs();
  }, []);

  // Load user data when user is authenticated
  useEffect(() => {
    const loadUserData = async () => {
      if (currentUser) {
        setLoading(true);
        try {
          const [mechs, sessions, weapons] = await Promise.all([
            getUserMechs(currentUser.uid),
            getUserSessions(currentUser.uid),
            getUserWeapons(currentUser.uid)
          ]);
          setUserMechs(mechs);
          setUserSessions(sessions);
          setUserWeapons(weapons);
        } catch (error) {
          console.error('Error loading user data:', error);
        }
        setLoading(false);
      } else {
        setUserMechs([]);
        setUserSessions([]);
        setUserWeapons([]);
      }
    };

    loadUserData();
  }, [currentUser]);

  // Save a new mech
  const saveMech = async (mechData) => {
    if (!currentUser) throw new Error('User must be logged in to save mechs');
    const mechId = await saveUserMech(currentUser.uid, mechData);
    const newMech = { ...mechData, id: mechId };
    setUserMechs(prev => [...prev, newMech]);
    return mechId;
  };

  // Save a game session
  const saveSession = async (sessionData) => {
    if (!currentUser) throw new Error('User must be logged in to save sessions');
    const sessionId = await saveGameSession(currentUser.uid, sessionData);
    const newSession = { ...sessionData, id: sessionId };
    setUserSessions(prev => [...prev, newSession]);
    return sessionId;
  };

  // Update a game session
  const updateSession = async (sessionId, sessionData) => {
    if (!currentUser) throw new Error('User must be logged in to update sessions');
    await updateGameSession(currentUser.uid, sessionId, sessionData);
    setUserSessions(prev => 
      prev.map(session => 
        session.id === sessionId 
          ? { ...session, ...sessionData, updatedAt: new Date().toISOString() }
          : session
      )
    );
  };

  // Delete a game session
  const deleteSession = async (sessionId) => {
    if (!currentUser) throw new Error('User must be logged in to delete sessions');
    await deleteGameSession(currentUser.uid, sessionId);
    setUserSessions(prev => prev.filter(session => session.id !== sessionId));
  };

  // Save a custom weapon
  const saveWeapon = async (weaponData) => {
    if (!currentUser) throw new Error('User must be logged in to save weapons');
    const weaponId = await saveCustomWeapon(currentUser.uid, weaponData);
    const newWeapon = { ...weaponData, id: weaponId };
    setUserWeapons(prev => [...prev, newWeapon]);
    return weaponId;
  };

  const value = {
    defaultMechs,
    userMechs,
    userSessions,
    userWeapons,
    loading,
    saveMech,
    saveSession,
    updateSession,
    deleteSession,
    saveWeapon
  };

  return (
    <DatabaseContext.Provider value={value}>
      {children}
    </DatabaseContext.Provider>
  );
} 