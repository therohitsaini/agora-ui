import { configureStore } from '@reduxjs/toolkit';
import userReducer from './users/UserSlice';


export const store = configureStore({
    reducer: {
        users: userReducer,
        consultantUsers: userReducer,
    },
});
