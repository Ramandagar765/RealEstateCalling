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
export const fetch_contacts = createAsyncThunk('dashboard/fetch_contacts', async (data, { dispatch, getState }) => {
    dispatch(common_state({ isLoading: true }));
    console.log('data',data)
    const contacts = getState()?.dashboard?.contacts;
    console.log('original contacts',contacts)
    await performGetRequest(API.contacts + data?.url).then(res => {
        const apiResponse = responseHandler(res);
        console.log('apiResponse?.data?.data', apiResponse?.data?.data)
        if (apiResponse?.data.success) {
            const newContacts = apiResponse?.data?.data?.items || [];
            let finalContacts = [];
            if (data?.data?.page === 1) {
                finalContacts = newContacts;
            } else {
                finalContacts = contacts?.length > 0 ? [...contacts, ...newContacts] : newContacts;
            }
            dispatch(setContacts({
                items: finalContacts,
                totalPages: apiResponse?.data?.data?.totalPages,
                currentPage: data?.data?.page,
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

// Fetch successful calls
export const fetchSuccessfulCalls = createAsyncThunk('dashboard/fetchSuccessfulCalls', async (params = {}, { dispatch }) => {
    console.log('fetchSuccessfulCalls params', params);
    dispatch(common_state({ isLoading: true }));
    const queryParams = new URLSearchParams({
        page: params.page || 1,
        size: params.size || 20
    });
    
    await performGetRequest(`${API.successfulCalls}?${params}`).then(res => {
        const apiResponse = responseHandler(res);
        console.log('successfulCalls response', apiResponse?.data?.data)
        if (apiResponse?.data.success) {
            if (params?.page === 1) {
            dispatch(setSuccessfulCalls(apiResponse?.data?.data));
            } else {
                dispatch(setSuccessfulCalls({
                    items: [...state.successfulCalls, ...apiResponse?.data?.data?.items],
                    totalPages: apiResponse?.data?.data?.totalPages,
                    currentPage: params?.page,
                }));
            }
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
export const fetchRescheduledCalls = createAsyncThunk('dashboard/fetchRescheduledCalls', async (data, { dispatch, getState }) => {
    dispatch(common_state({ isLoading: true }));
    console.log('fetchRescheduledCalls data', data);
    const rescheduledCalls = getState()?.dashboard?.rescheduledCalls;
    console.log('original rescheduledCalls', rescheduledCalls);
    await performGetRequest(API.rescheduledCalls + data?.url).then(res => {
        const apiResponse = responseHandler(res);
        console.log('rescheduledCalls apiResponse?.data?.data', apiResponse?.data?.data);
        if (apiResponse?.data.success) {
            const newRescheduledCalls = apiResponse?.data?.data?.items || [];
            let finalRescheduledCalls = [];
            if (data?.data?.page === 1) {
                finalRescheduledCalls = newRescheduledCalls;
            } else {
                finalRescheduledCalls = rescheduledCalls?.length > 0 ? [...rescheduledCalls, ...newRescheduledCalls] : newRescheduledCalls;
            }
            dispatch(setRescheduledCalls({
                items: finalRescheduledCalls,
                totalPages: apiResponse?.data?.data?.totalPages,
                currentPage: data?.data?.page,
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

// Fetch unsuccessful calls
export const fetchUnsuccessfulCalls = createAsyncThunk('dashboard/fetchUnsuccessfulCalls', async (data, { dispatch, getState }) => {
    dispatch(common_state({ isLoading: true }));
    console.log('fetchUnsuccessfulCalls data', data);
    const unsuccessfulCalls = getState()?.dashboard?.unsuccessfulCalls;
    console.log('original unsuccessfulCalls', unsuccessfulCalls);
    await performGetRequest(API.unsuccessfulCalls + data?.url).then(res => {
        const apiResponse = responseHandler(res);
        console.log('unsuccessfulCalls apiResponse?.data?.data', apiResponse?.data?.data);
        if (apiResponse?.data.success) {
            const newUnsuccessfulCalls = apiResponse?.data?.data?.items || [];
            let finalUnsuccessfulCalls = [];
            if (data?.data?.page === 1) {
                finalUnsuccessfulCalls = newUnsuccessfulCalls;
            } else {
                finalUnsuccessfulCalls = unsuccessfulCalls?.length > 0 ? [...unsuccessfulCalls, ...newUnsuccessfulCalls] : newUnsuccessfulCalls;
            }
            dispatch(setUnsuccessfulCalls({
                items: finalUnsuccessfulCalls,
                totalPages: apiResponse?.data?.data?.totalPages,
                currentPage: data?.data?.page,
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

// Fetch closed deals
export const fetchClosedDeals = createAsyncThunk('dashboard/fetchClosedDeals', async (data, { dispatch, getState }) => {
    dispatch(common_state({ isLoading: true }));
    console.log('fetchClosedDeals data', data);
    const closedDeals = getState()?.dashboard?.closedDeals;
    console.log('original closedDeals', closedDeals);
    await performGetRequest(API.closedDeals + data?.url).then(res => {
        const apiResponse = responseHandler(res);
        console.log('closedDeals apiResponse?.data?.data', apiResponse?.data?.data);
        if (apiResponse?.data.success) {
            const newClosedDeals = apiResponse?.data?.data?.items || [];
            let finalClosedDeals = [];
            if (data?.data?.page === 1) {
                finalClosedDeals = newClosedDeals;
            } else {
                finalClosedDeals = closedDeals?.length > 0 ? [...closedDeals, ...newClosedDeals] : newClosedDeals;
            }
            dispatch(setClosedDeals({
                items: finalClosedDeals,
                totalPages: apiResponse?.data?.data?.totalPages,
                currentPage: data?.data?.page,
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

// Record call with new structure
export const recordCall = createAsyncThunk('dashboard/recordCall', async (data, { dispatch }) => {
    console.log('recording call with data', data);
    dispatch(common_state({ isLoading: true }));
    
    // Use the data as-is, no need to clean up since we're using correct backend format
    
    await performPostRequest(API.recordCall, data).then(res => {
        const apiResponse = responseHandler(res);
        console.log('recordCall response', apiResponse?.data?.data)
        if (apiResponse?.data.success) {
             dispatch(fetch_contacts({ url: `?page=${1}`, data: { page: 1 } }))
            dispatch(fetchDashboardStats());
            if (data.status === 'successful') {
                if (data.outcome === 'deal_closed') {
                    dispatch(fetchClosedDeals({ url: `?page=${1}`, data: { page: 1 } }));
                } else if (data.outcome === 'interested') {
                    dispatch(fetchRescheduledCalls({ url: `?page=${1}`, data: { page: 1 } }));
                }
            } else {
                dispatch(fetchUnsuccessfulCalls({ url: `?page=${1}`, data: { page: 1 } }));
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
            RootNavigation.reset('DashBoard');
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

// Create new contact
export const createContact = createAsyncThunk('dashboard/createContact', async (contactData, { dispatch }) => {
    dispatch(common_state({ isLoading: true }));
    try {
        const res = await performPostRequest(API.contacts, contactData);
        const apiResponse = responseHandler(res);
        if (apiResponse?.data?.success) {
            dispatch(fetch_contacts({ url: `?page=${1}`, data: { page: 1 } }))
            RootNavigation.goBack()
        }
        MyToast(apiResponse?.data?.message ?? '');
        dispatch(common_state());
    } catch (error) {
        const apiResponse = responseHandler(error.response);
        console.log('createContact failure', apiResponse?.data?.message);
        MyToast(apiResponse?.data?.message ?? '');
        dispatch(common_state());
    }
});

// Fetch projects
export const fetchProjects = createAsyncThunk('dashboard/fetchProjects', async (_, { dispatch }) => {
    console.log('fetching projects');
    dispatch(common_state({ isLoading: true }));
    try {
        const res = await performGetRequest(API.projects);
        const apiResponse = responseHandler(res);
        console.log('projects response', apiResponse?.data?.data);
        if (apiResponse?.data?.success) {
            dispatch(setProjects(apiResponse?.data?.data || []));
        }
        dispatch(common_state());
    } catch (error) {
        console.log('fetchProjects failure', error);
        const apiResponse = responseHandler(error.response);
        MyToast(apiResponse?.data?.message ?? '');
        dispatch(common_state());
    }
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

        // Projects
        projects: [],

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
            state.contacts = action?.payload?.items || [];
            state.contactsTotalPages = action?.payload?.totalPages || 0;
            state.contactsCurrentPage = action?.payload?.currentPage || 1;
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
            state.team_members_dasboard = action?.payload || null;
            state.isLoading = false;
        },
        set_last_comment: (state, action) => {
            console.log('set_last_comment action.payload', action.payload);
            state.comments = action?.payload?.comments || [];
            state.isLoading = action?.payload?.isLoading || false;
        },
        setProjects: (state, action) => {
            console.log('setProjects action.payload', action.payload);
            state.projects = action.payload || [];
            state.isLoading = false;
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
    set_last_comment,
    setProjects
} = dashboardSlice.actions;

export default dashboardSlice.reducer;