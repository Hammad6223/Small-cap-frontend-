import { configureStore } from '@reduxjs/toolkit';
import DisclaimerSlice from './Slices/disclaimer';
import tradeSlice from './Slices/tradeSlice';
import policySlice from './Slices/policySlice';
import termSlice from './Slices/termSlice';
import authSlice from './Slices/authSlice';
import todayspick from './Slices/todayspick';
import notificationSlice from './Slices/notificationSlice';
import newsSlice from './Slices/newsSlice';
import sectionSlice from './Slices/sectionSlice';
import watchlistSlice from './Slices/watchlistSlice';


const store= configureStore({
    reducer:{
        auth:authSlice,
        disclaimer:DisclaimerSlice,
        trade:tradeSlice,
        policy:policySlice,
        term:termSlice,
        todaysPick:todayspick,
        notification:notificationSlice,
        news:newsSlice,
        section:sectionSlice,
        watchlist:watchlistSlice
    }
})




export default store;