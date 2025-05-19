import { ref, set } from 'firebase/database';
import { database } from '../firebase/config';
import { imageToBase64 } from '../utils/imageUtils';

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

// Example usage:
/*
const mechsWithImages = [
  {
    name: "BERSERKER",
    image: "data:image/png;base64,...", // Your base64 string here
    Hull: 3,
    Agility: 2,
    // ... other stats
  },
  // ... other mechs
];

updateDefaultMechsWithImages(mechsWithImages);
*/ 