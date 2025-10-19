import { createSlice } from '@reduxjs/toolkit';

const appSlice = createSlice({
    name: 'app',
    initialState: {
        mode: 'data', // 'data' or 'leads'
    },
    reducers: {
        setAppMode: (state, action) => {
            state.mode = action.payload; // 'data' or 'leads'
        },
    }
});

export const { setAppMode } = appSlice.actions;
export default appSlice.reducer;

