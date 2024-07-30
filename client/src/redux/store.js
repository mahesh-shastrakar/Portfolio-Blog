// Importing the necessary packages and files

import { configureStore, combineReducers } from "@reduxjs/toolkit";

// Importing the userReducer and themeReducer from the userSlice and themeSlice files
import userReducer from "./user/userSlice";
import themeReducer from "./theme/themeSlice";

// Importing the persistReducer and storage from redux-persist to persist the redux store data
import persistReducer from "redux-persist/es/persistReducer";
import storage from "redux-persist/es/storage";
import persistedStore from "redux-persist/es/persistStore";

// Combining the userReducer and themeReducer using the combineReducers function from redux toolkit to create the rootReducer
const rootReducer = combineReducers({
  user: userReducer,
  theme: themeReducer,
});

// Creating a persistConfig object with key, storage, and version properties to persist the redux store data
const persistConfig = {
  key: "root",
  storage,
  version: 1,
};

// Creating a persistedReducer using the persistReducer function from redux-persist with the persistConfig and rootReducer as arguments
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Creating a store using the configureStore function from redux toolkit with the persistedReducer as an argument and disabling the serializableCheck
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// exporting the store and persistor
export const persistor = persistedStore(store);
