import { ref, set } from 'firebase/database';
import { database } from '../firebase/config';

// Function to update default mechs with base64 images
export const updateDefaultMechsWithImages = async (mechsWithImages) => {
  try {
    const mechsRef = ref(database, 'defaultMechs');
    await set(mechsRef, mechsWithImages);
    console.log('Default mechs updated successfully');
  } catch (error) {
    console.error('Error updating default mechs:', error);
    throw error;
  }
};