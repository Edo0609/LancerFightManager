# Lancer Fight Manager

Lancer Fight Manager is a web application built with React and Vite, designed to assist players and game masters in managing combat encounters for the Lancer RPG system. It provides tools for:

*   **Mech Management**: Create, view, and manage details of player and enemy mechs, including their stats, systems, and weapons.
*   **Combat Tracking**: Facilitate combat flow with features for tracking health, stress, structure, and heat.
*   **Dice Rolling**: Integrated dice roller for various in-game checks and attacks.
*   **Weapon and System Management**: Configure and track the effects of different weapons and systems.
*   **Session Management**: Save and load combat sessions to resume games later.

## Installation

To get Lancer Fight Manager up and running on your local machine, follow these steps:

### Prerequisites

*   **Node.js**: Lancer Fight Manager requires Node.js (which includes npm) to run. You can download the latest LTS version from the official Node.js website: [https://nodejs.org/](https://nodejs.org/)
*   **Git**: You will need Git to clone the repository. Download it from: [https://git-scm.com/downloads](https://git-scm.com/downloads)

### Step-by-Step Installation

1.  **Clone the Repository**:
    Open your terminal or command prompt and clone the project repository using Git:

    ```bash
    git clone https://github.com/Edo0609/LancerFightManager.git
    ```

2.  **Navigate to the Project Directory**:
    Change into the newly created project directory:

    ```bash
    cd LancerFightManager
    ```

3.  **Install Dependencies**:
    Install all the necessary project dependencies using npm:

    ```bash
    npm install
    ```

4.  **Run the Application**:
    Once the dependencies are installed, you can start the development server:

    ```bash
    npm run dev
    ```

    This will start the application, and it will typically be accessible in your web browser at `http://localhost:5173/` (or another port if 5173 is in use).

### Building for Production

To create an optimized production build of the application, use the following command:

```bash
npm run build
```

This will compile the application into the `dist` directory, which can then be deployed to a web server.

## Technologies Used

*   **React**: A JavaScript library for building user interfaces.
*   **Vite**: A fast front-end build tool.
*   **npm**: Node package manager for managing project dependencies.
*   **Firebase**: Used for database and authentication services.


## Firebase Setup

This project uses Firebase for authentication and data storage. You need to set up a Firebase project and configure it.

#### Steps:

1. Go to [Firebase Console](https://console.firebase.google.com/) and create a new project.
2. In your project, add a new web app to get your Firebase config.
3. Enable **Authentication** (Email/Password), **Realtime Database**, and **Firestore** in the Firebase console.
4. Copy your Firebase config and update `src/firebase/config.js`:

```js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  databaseURL: "YOUR_DATABASE_URL",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);
export const firestore = getFirestore(app);
export default app;
```

Replace the values in `firebaseConfig` with your own from the Firebase console.

## Contributing

This project was made as the final project for my class. Do with it as you will, it will remain open to the public.

## License

Lancer Fight Manager is not an official Lancer product; it is a third party work, 
and is not affiliated with Massif Press. Lancer Fight Manager is published via the 
Lancer Third Party License.
