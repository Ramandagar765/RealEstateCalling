import { performPostRequest, } from '#/constants/axios-utils';
import { MyToast, responseHandler } from '#/Utils';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { API } from '#/shared/API-end-points';
import RootNavigation from '#/navigation/RootNavigation';

export const doLogin = createAsyncThunk('user/doLogin',async (data, { dispatch }) => {
        console.log('data', data);
        dispatch(login_state({ isLoading: true, }),);
        await performPostRequest(API.login,data).then(res => {
            const apiResponse = responseHandler(res);
            console.log('apiResponse?.data?.data?.user',apiResponse?.data?.data?.user)
            if (apiResponse?.data.success) {
                dispatch(login_state({ 
                    user_data: apiResponse?.data?.data?.user,
                    user_token: apiResponse?.data?.data?.token,
                 }));
                 RootNavigation.navigate('DashBoard'); 
            }
            dispatch(common_state())
        }).catch(error => {
            console.log('failure', error);
            const apiResponse = responseHandler(error.response);
            MyToast(apiResponse?.data?.message ?? '');
            dispatch(common_state());
        });
    },
);

export const log_out = createAsyncThunk('user/log_out', async (_, { dispatch }) => {
    dispatch(login_state({ isLoading: true, user_data: null, user_token: '' }));
    RootNavigation.navigate('Login');
    MyToast('Logged out successfully');
    dispatch(common_state());
}
);

const usersSlice = createSlice({
    name: 'user',
    initialState: {
        user_data: null,
        user_token: '',
        isLoading: false,
    },
    reducers: {
        login_state: (state, action) => {
            console.log('action?.payload', action?.payload);
            state.isLoading = action?.payload?.isLoading ?? false;
            state.user_data = action?.payload?.user_data ?? null;
            state.user_token = action?.payload?.user_token ?? '';
        },
        common_state: (state, action) => {
            state.isLoading = action?.payload?.isLoading ?? false;
        },

    },
});

export const { login_state, common_state } = usersSlice.actions;
export default usersSlice.reducer;
