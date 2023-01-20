import { combineReducers } from '@reduxjs/toolkit';
import { auth } from './auth';
import { favorite } from './favorite';

export const reducers = combineReducers({ auth, favorite });
