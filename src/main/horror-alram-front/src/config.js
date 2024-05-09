export const FIREBASE_CONFIG = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: "horror-alarm.firebaseapp.com",
  projectId: "horror-alarm",
  storageBucket: "horror-alarm.appspot.com",
  messagingSenderId: process.env.REACT_APP_MEASUREMENT_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

export const SUPABASE_CONFIG = {
  anonKey: process.env.REACT_APP_SUPABASE_ANON_KEY,
  url: process.env.REACT_APP_SUPABASE_URL
};
