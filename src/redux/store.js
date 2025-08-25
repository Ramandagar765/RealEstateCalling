import AsyncStorage from '@react-native-async-storage/async-storage';
import {configureStore, combineReducers} from '@reduxjs/toolkit';
import rootReducer from './rootReducer';
import {persistStore, persistReducer} from 'redux-persist';
import logger from 'redux-logger';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';

const reducers = combineReducers(rootReducer);

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['user'],
  stateReconciler: autoMergeLevel2,
};

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(logger),
});
 
 
const persistor = persistStore(store);
// Enable hot reloading for the store
if (module.hot) { 
  module.hot.accept(() => {
    const nextRootReducer = require('./rootReducer').default;
    store.replaceReducer(persistReducer(persistConfig, combineReducers(nextRootReducer)));
  });
}
export {store, persistor}; 
