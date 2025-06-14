import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice.js";
import shipSlice from "./shipSlice.js";
import portSlice from "./portSlice.js";
import scheduleSlice from "./scheduleSlice.js";
import socketSlice from "./socketSlice.js";
import chatSlice from "./chatSlice.js";
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
};
const rootReducer = combineReducers({
  user: userSlice,
  ship: shipSlice,
  port: portSlice,
  schedule: scheduleSlice,
  socketio: socketSlice,
  chat:chatSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export default store;
