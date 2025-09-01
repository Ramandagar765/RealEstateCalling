import { performGetRequest, performPostRequest } from '#/constants/axios-utils';
import { MyToast, responseHandler } from '#/Utils';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { API } from '#/shared/API-end-points';
import RootNavigation from '#/navigation/RootNavigation';
import { log_out } from '#/screens/User/store';

// Fetch dashboard stats
export const fetchDashboardStats = createAsyncThunk('dashboard/fetchStats', async (_, { dispatch }) => {
    console.log('fetching dashboard stats');
    dispatch(common_state({ isLoading: true }));
    await performGetRequest(API.dashboard).then(res => {
        const apiResponse = responseHandler(res);
        console.log('apiResponse?.data?.data', apiResponse?.data?.data)
        if (apiResponse?.data?.success) dispatch(setStats(apiResponse?.data?.data));
        dispatch(common_state())
    }).catch(error => {
        console.log('failure', error);
        const apiResponse = responseHandler(error.response);
        MyToast(apiResponse?.data?.message ?? '');
        dispatch(common_state());
    });
});

// Fetch assigned contacts
export const fetchContacts = createAsyncThunk('dashboard/fetchContacts', async (params = {}, { dispatch }) => {
    console.log('fetchContacts params', params);
    dispatch(common_state({ isLoading: true }));
    const queryParams = new URLSearchParams({
        page: params.page || 1,
        size: params.size || 50,
    });

    await performGetRequest(`${API.contacts}?${queryParams}`).then(res => {
        const apiResponse = responseHandler(res);
        console.log('apiResponse?.data?.data', apiResponse?.data?.data)
        if (apiResponse?.data.success) {
            dispatch(setContacts(apiResponse?.data?.data));
        }
        dispatch(common_state());
    }).catch(error => {
        console.log('failure', error);
        const apiResponse = responseHandler(error.response);
        MyToast(apiResponse?.data?.message ?? '');
        dispatch(common_state());
    });
});

// Fetch successful calls
export const fetchSuccessfulCalls = createAsyncThunk('dashboard/fetchSuccessfulCalls', async (params = {}, { dispatch }) => {
    console.log('fetchSuccessfulCalls params', params);
    dispatch(common_state({ isLoading: true }));
    const queryParams = new URLSearchParams({
        page: params.page || 1,
        size: params.size || 20
    });

    await performGetRequest(`${API.successfulCalls}?${queryParams}`).then(res => {
        const apiResponse = responseHandler(res);
        console.log('successfulCalls response', apiResponse?.data?.data)
        if (apiResponse?.data.success) {
            dispatch(setSuccessfulCalls(apiResponse?.data?.data));
        }
        dispatch(common_state());
    }).catch(error => {
        console.log('failure', error);
        const apiResponse = responseHandler(error.response);
        MyToast(apiResponse?.data?.message ?? '');
        dispatch(common_state());
    });
});

// Fetch rescheduled calls
export const fetchRescheduledCalls = createAsyncThunk('dashboard/fetchRescheduledCalls', async (params = {}, { dispatch }) => {
    console.log('fetchRescheduledCalls params', params);
    dispatch(common_state({ isLoading: true }));
    const queryParams = new URLSearchParams({
        page: params.page || 1,
        size: params.size || 20
    });

    await performGetRequest(`${API.rescheduledCalls}?${queryParams}`).then(res => {
        const apiResponse = responseHandler(res);
        console.log('rescheduledCalls response', apiResponse?.data?.data)
        if (apiResponse?.data.success) {
            dispatch(setRescheduledCalls(apiResponse?.data?.data));
        }
        dispatch(common_state());
    }).catch(error => {
        console.log('failure', error);
        const apiResponse = responseHandler(error.response);
        MyToast(apiResponse?.data?.message ?? '');
        dispatch(common_state());
    });
});

// Fetch unsuccessful calls
export const fetchUnsuccessfulCalls = createAsyncThunk('dashboard/fetchUnsuccessfulCalls', async (params = {}, { dispatch }) => {
    console.log('fetchUnsuccessfulCalls params', params);
    dispatch(common_state({ isLoading: true }));
    const queryParams = new URLSearchParams({
        page: params.page || 1,
        size: params.size || 20
    });

    await performGetRequest(`${API.unsuccessfulCalls}?${queryParams}`).then(res => {
        const apiResponse = responseHandler(res);
        console.log('unsuccessfulCalls response', apiResponse?.data?.data)
        if (apiResponse?.data.success) {
            dispatch(setUnsuccessfulCalls(apiResponse?.data?.data));
        }
        dispatch(common_state());
    }).catch(error => {
        console.log('failure', error);
        const apiResponse = responseHandler(error.response);
        MyToast(apiResponse?.data?.message ?? '');
        dispatch(common_state());
    });
});

// Fetch closed deals
export const fetchClosedDeals = createAsyncThunk('dashboard/fetchClosedDeals', async (params = {}, { dispatch }) => {
    console.log('fetchClosedDeals params', params);
    dispatch(common_state({ isLoading: true }));
    const queryParams = new URLSearchParams({
        page: params.page || 1,
        size: params.size || 20
    });

    await performGetRequest(`${API.closedDeals}?${queryParams}`).then(res => {
        const apiResponse = responseHandler(res);
        console.log('closedDeals response', apiResponse?.data?.data)
        if (apiResponse?.data.success) {
            dispatch(setClosedDeals(apiResponse?.data?.data));
        }
        dispatch(common_state());
    }).catch(error => {
        console.log('failure', error);
        const apiResponse = responseHandler(error.response);
        MyToast(apiResponse?.data?.message ?? '');
        dispatch(common_state());
    });
});

// Record call with new structure
export const recordCall = createAsyncThunk('dashboard/recordCall', async (data, { dispatch }) => {
    console.log('recording call with data', data);
    dispatch(common_state({ isLoading: true }));

    // Use the data as-is, no need to clean up since we're using correct backend format

    await performPostRequest(API.recordCall, data).then(res => {
        const apiResponse = responseHandler(res);
        console.log('recordCall response', apiResponse?.data?.data)
        if (apiResponse?.data.success) {
            dispatch(fetchContacts({ page: 1, size: 20 }));
            dispatch(fetchDashboardStats());
            if (data.status === 'successful') {
                if (data.outcome === 'deal_closed') {
                    dispatch(fetchClosedDeals({ page: 1, size: 20 }));
                } else if (data.outcome === 'interested') {
                    dispatch(fetchRescheduledCalls({ page: 1, size: 20 }));
                }
            } else {
                dispatch(fetchUnsuccessfulCalls({ page: 1, size: 20 }));
            }

            MyToast('Operation successful');
        }
        dispatch(common_state())
    }).catch(error => {
        console.log('failure', error);
        const apiResponse = responseHandler(error.response);
        MyToast(apiResponse?.data?.message ?? '');
        dispatch(common_state());
    });
});


export const verify_token = createAsyncThunk('auth/verify_token', async (_, { dispatch }) => {
    dispatch(common_state({ isLoading: true }));
    await performGetRequest(API.verifyToken).then(res => {
        const apiResponse = responseHandler(res);
        console.log('verifyToken apiResponse?.data', apiResponse?.data)
        if (apiResponse?.data.success) {
            RootNavigation.navigate('DashBoard');
        } else {
            dispatch(common_state());
            dispatch(log_out());
            RootNavigation.navigate('Login');
        }
        dispatch(common_state());
    }).catch(error => {
        RootNavigation.replace('Login');
        const apiResponse = responseHandler(error?.response);
        dispatch(common_state());
        dispatch(log_out());
    });
});

export const team_dashboard = createAsyncThunk('dashboard/team_dashboard', async (_, { dispatch }) => {
    console.log('fetching dashboard stats');
    dispatch(common_state({ isLoading: true }));
    await performGetRequest(API.team_members).then(res => {
        const apiResponse = responseHandler(res);
        dispatch(set_team_dashboard(apiResponse?.data?.data || null));
    }).catch(error => {
        console.log('failure', error);
        const apiResponse = responseHandler(error.response);
        MyToast(apiResponse?.data?.message ?? '');
        dispatch(common_state());
    });
});

export const last_comment = createAsyncThunk('dashboard/last_comment', async (_, { dispatch }) => {
    console.log('fetching last comment');
    dispatch(common_state({ isLoading: true }));
    await performGetRequest(API.lastcomment).then(res => {
        const apiResponse = responseHandler(res);
        console.log('last_comment apiResponse?.data', apiResponse?.data)
        if (apiResponse?.data.success) {
            // Handle last comment data if needed
            dispatch(set_last_comment({ 
                comments: apiResponse?.data?.data?.comments || [],
                isLoading: false 
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

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState: {
        isLoading: false,
        stats: {},

        // Assigned contacts list
        contacts: [],
        contactsTotalPages: 0,
        contactsCurrentPage: 1,

        // Successful calls list
        successfulCalls: [],
        successfulCallsTotalPages: 0,
        successfulCallsCurrentPage: 1,

        // Rescheduled calls list
        rescheduledCalls: [],
        rescheduledCallsTotalPages: 0,
        rescheduledCallsCurrentPage: 1,

        // Unsuccessful calls list
        unsuccessfulCalls: [],
        unsuccessfulCallsTotalPages: 0,
        unsuccessfulCallsCurrentPage: 1,

        // Closed deals list
        closedDeals: [],
        closedDealsTotalPages: 0,
        closedDealsCurrentPage: 1,


        // Team Members
        team_members_dasboard: null,

        // Last Comment
        comments: []
    },
    reducers: {
        common_state: (state, action) => {
            state.isLoading = action?.payload?.isLoading ?? false;
        },
        setStats: (state, action) => {
            state.stats = action.payload || {};
        },
        setContacts: (state, action) => {
            console.log('setContacts action.payload', action.payload);
            const data = action.payload || {};
            state.contacts = data.items || [];
            state.contactsTotalPages = data.totalPages || 0;
            state.contactsCurrentPage = data.currentPage || 1;
        },
        setSuccessfulCalls: (state, action) => {
            console.log('setSuccessfulCalls action.payload', action.payload);
            const data = action.payload || {};
            state.successfulCalls = data.items || [];
            state.successfulCallsTotalPages = data.totalPages || 0;
            state.successfulCallsCurrentPage = data.currentPage || 1;
        },
        setRescheduledCalls: (state, action) => {
            console.log('setRescheduledCalls action.payload', action.payload);
            const data = action.payload || {};
            state.rescheduledCalls = data.items || [];
            state.rescheduledCallsTotalPages = data.totalPages || 0;
            state.rescheduledCallsCurrentPage = data.currentPage || 1;
        },
        setUnsuccessfulCalls: (state, action) => {
            console.log('setUnsuccessfulCalls action.payload', action.payload);
            const data = action.payload || {};
            state.unsuccessfulCalls = data.items || [];
            state.unsuccessfulCallsTotalPages = data.totalPages || 0;
            state.unsuccessfulCallsCurrentPage = data.currentPage || 1;
        },
        setClosedDeals: (state, action) => {
            console.log('setClosedDeals action.payload', action.payload);
            const data = action.payload || {};
            state.closedDeals = data.items || [];
            state.closedDealsTotalPages = data.totalPages || 0;
            state.closedDealsCurrentPage = data.currentPage || 1;
        },
        set_team_dashboard: (state, action) => {
            state.team_members_dasboard = action.payload || null;
            state.isLoading = false;
        },
        set_last_comment: (state, action) => {
            console.log('set_last_comment action.payload', action.payload);
            state.comments = action?.payload?.comments || [];
            state.isLoading = action?.payload?.isLoading || false;
        }
    }
});

export const {
    setStats, 
    setContacts,
    setSuccessfulCalls,
    setRescheduledCalls,
    setUnsuccessfulCalls,
    setClosedDeals,
    common_state,
    set_team_dashboard,
    set_last_comment
} = dashboardSlice.actions;

export default dashboardSlice.reducer;