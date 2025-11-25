import { performGetRequest, performPostRequest, performPostRequest_FormData } from '#/constants/axios-utils';
import { MyToast, responseHandler, multipleMassage } from '#/Utils';
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
                 RootNavigation.replace('DashBoard'); 
                 RootNavigation.reset('DashBoard'); 
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
    RootNavigation.replace('Login');
    RootNavigation.reset('Login')
    // MyToast('Logged out successfully');
    dispatch(common_state());
}
);

export const get_support_tickets = createAsyncThunk('user/get_support_tickets', async (data, { dispatch, getState }) => {
   dispatch(common_state({ isLoading: true }));
    const support_tickets = getState()?.user?.support_tickets;
    await performGetRequest(API.get_support_tickets + data?.url).then(res => {
        const apiResponse = responseHandler(res);
        console.log('apiResponse?.data?.data', apiResponse?.data?.data)
        if (apiResponse?.data.success) {
            const newSupportTickets = apiResponse?.data?.data?.tickets || [];
            let finalSupportTickets = [];
            if (data?.data?.page === 1) {
                finalSupportTickets = newSupportTickets;
            } else {
                finalSupportTickets = support_tickets?.length > 0 ? [...support_tickets, ...newSupportTickets] : newSupportTickets;
            }
            dispatch(set_support_tickets({
                items: finalSupportTickets,
                support_total_pages: apiResponse?.data?.data?.pagination?.totalPages || 0,
                support_current_page: apiResponse?.data?.data?.pagination?.page || 1,
            }));
        }
        dispatch(common_state());
    }).catch(error => {
        console.log('failure', error);
        const apiResponse = responseHandler(error.response);
        MyToast(apiResponse?.data?.message ?? '');
        dispatch(common_state());
    });
});

export const create_support_ticket = createAsyncThunk('user/create_support_ticket', async (data, { dispatch }) => {
    dispatch(common_state({ isLoading: true }));
    await performPostRequest_FormData(API.create_support_ticket, data).then(res => {
        const apiResponse = responseHandler(res);
        console.log('apiResponse?.data?.data', apiResponse?.data?.data)
        if (apiResponse?.data.success) {
            MyToast(apiResponse?.data?.message ?? '');
             dispatch(get_support_tickets({ url: '?page=1', data: { page: 1, } }))
        }
    }).catch(error => {
        console.log('failure', error)
        const apiResponse = responseHandler(error?.response);
        MyToast(apiResponse?.data?.message ?? 'Oops! Something went wrong. Please try again later.');
        multipleMassage(apiResponse?.data?.errors ?? '');
    }).finally(() => {
        dispatch(common_state());
    })
})

const usersSlice = createSlice({
    name: 'user',
    initialState: {
        user_data: null,
        user_token: '',
        isLoading: false,
        device_token: '',
        support_tickets: [],
        support_total_pages: 0,
        support_current_page: 1,
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
        set_device_token: (state, action) => {
            state.device_token = action?.payload?.device_token ?? '';
        },
        set_support_tickets: (state, action) => {
            state.support_tickets = action?.payload?.items ?? state.support_tickets;
            state.support_total_pages = action?.payload?.support_total_pages ?? state.support_total_pages;
            state.support_current_page = action?.payload?.support_current_page ?? state.support_current_page;
        },

    },
});

export const { login_state, common_state, set_device_token, set_support_tickets } = usersSlice.actions;
export default usersSlice.reducer;
