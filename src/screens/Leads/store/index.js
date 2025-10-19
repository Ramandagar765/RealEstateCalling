import { performGetRequest, performPostRequest } from '#/constants/axios-utils';
import { MyToast, responseHandler } from '#/Utils';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { API } from '#/shared/API-end-points';
import RootNavigation from '#/navigation/RootNavigation';

// Fetch leads dashboard stats
export const fetchLeadsDashboardStats = createAsyncThunk('leads/fetchStats', async (_, { dispatch }) => {
    console.log('fetching leads dashboard stats');
    dispatch(common_state({ isLoading: true }));
    await performGetRequest(API.leadsDashboard).then(res => {
        const apiResponse = responseHandler(res);
        console.log('leadsDashboard apiResponse?.data?.data', apiResponse?.data?.data)
        if (apiResponse?.data?.success) dispatch(setLeadsStats(apiResponse?.data?.data));
        dispatch(common_state())
    }).catch(error => {
        console.log('leads fetchStats failure', error);
        const apiResponse = responseHandler(error.response);
        MyToast(apiResponse?.data?.message ?? '');
        dispatch(common_state());
    });
});

// Fetch assigned leads
export const fetch_leads = createAsyncThunk('leads/fetch_leads', async (data, { dispatch, getState }) => {
    dispatch(common_state({ isLoading: true }));
    console.log('fetch_leads data', data)
    const leads = getState()?.leads?.leads;
    console.log('original leads', leads)
    await performGetRequest(API.leads + data?.url).then(res => {
        const apiResponse = responseHandler(res);
        console.log('fetch_leads apiResponse?.data?.data', apiResponse?.data?.data)
        if (apiResponse?.data.success) {
            const newLeads = apiResponse?.data?.data?.items || [];
            let finalLeads = [];
            if (data?.data?.page === 1) {
                finalLeads = newLeads;
            } else {
                finalLeads = leads?.length > 0 ? [...leads, ...newLeads] : newLeads;
            }
            dispatch(setLeads({
                items: finalLeads,
                totalPages: apiResponse?.data?.data?.totalPages,
                currentPage: data?.data?.page,
            }));
        }
        dispatch(common_state());
    }).catch(error => {
        console.log('fetch_leads failure', error);
        const apiResponse = responseHandler(error.response);
        MyToast(apiResponse?.data?.message ?? '');
        dispatch(common_state());
    });
});

// Fetch successful leads
export const fetchSuccessfulLeads = createAsyncThunk('leads/fetchSuccessfulLeads', async (params = {}, { dispatch }) => {
    console.log('fetchSuccessfulLeads params', params);
    dispatch(common_state({ isLoading: true }));
    
    await performGetRequest(`${API.successfulLeads}?${params}`).then(res => {
        const apiResponse = responseHandler(res);
        console.log('successfulLeads response', apiResponse?.data?.data)
        if (apiResponse?.data.success) {
            if (params?.page === 1) {
            dispatch(setSuccessfulLeads(apiResponse?.data?.data));
            } else {
                dispatch(setSuccessfulLeads({
                    items: [...state.successfulLeads, ...apiResponse?.data?.data?.items],
                    totalPages: apiResponse?.data?.data?.totalPages,
                    currentPage: params?.page,
                }));
            }
        }
        dispatch(common_state());
    }).catch(error => {
        console.log('fetchSuccessfulLeads failure', error);
        const apiResponse = responseHandler(error.response);
        MyToast(apiResponse?.data?.message ?? '');
        dispatch(common_state());
    });
});

// Fetch scheduled leads
export const fetchScheduledLeads = createAsyncThunk('leads/fetchScheduledLeads', async (data, { dispatch, getState }) => {
    dispatch(common_state({ isLoading: true }));
    console.log('fetchScheduledLeads data', data);
    const scheduledLeads = getState()?.leads?.scheduledLeads;
    console.log('original scheduledLeads', scheduledLeads);
    await performGetRequest(API.scheduledLeads + data?.url).then(res => {
        const apiResponse = responseHandler(res);
        console.log('scheduledLeads apiResponse?.data?.data', apiResponse?.data?.data);
        if (apiResponse?.data.success) {
            const newScheduledLeads = apiResponse?.data?.data?.items || [];
            let finalScheduledLeads = [];
            if (data?.data?.page === 1) {
                finalScheduledLeads = newScheduledLeads;
            } else {
                finalScheduledLeads = scheduledLeads?.length > 0 ? [...scheduledLeads, ...newScheduledLeads] : newScheduledLeads;
            }
            dispatch(setScheduledLeads({
                items: finalScheduledLeads,
                totalPages: apiResponse?.data?.data?.totalPages,
                currentPage: data?.data?.page,
            }));
        }
        dispatch(common_state());
    }).catch(error => {
        console.log('fetchScheduledLeads failure', error);
        const apiResponse = responseHandler(error.response);
        MyToast(apiResponse?.data?.message ?? '');
        dispatch(common_state());
    });
});

// Fetch unsuccessful leads
export const fetchUnsuccessfulLeads = createAsyncThunk('leads/fetchUnsuccessfulLeads', async (data, { dispatch, getState }) => {
    dispatch(common_state({ isLoading: true }));
    console.log('fetchUnsuccessfulLeads data', data);
    const unsuccessfulLeads = getState()?.leads?.unsuccessfulLeads;
    console.log('original unsuccessfulLeads', unsuccessfulLeads);
    await performGetRequest(API.unsuccessfulLeads + data?.url).then(res => {
        const apiResponse = responseHandler(res);
        console.log('unsuccessfulLeads apiResponse?.data?.data', apiResponse?.data?.data);
        if (apiResponse?.data.success) {
            const newUnsuccessfulLeads = apiResponse?.data?.data?.items || [];
            let finalUnsuccessfulLeads = [];
            if (data?.data?.page === 1) {
                finalUnsuccessfulLeads = newUnsuccessfulLeads;
            } else {
                finalUnsuccessfulLeads = unsuccessfulLeads?.length > 0 ? [...unsuccessfulLeads, ...newUnsuccessfulLeads] : newUnsuccessfulLeads;
            }
            dispatch(setUnsuccessfulLeads({
                items: finalUnsuccessfulLeads,
                totalPages: apiResponse?.data?.data?.totalPages,
                currentPage: data?.data?.page,
            }));
        }
        dispatch(common_state());
    }).catch(error => {
        console.log('fetchUnsuccessfulLeads failure', error);
        const apiResponse = responseHandler(error.response);
        MyToast(apiResponse?.data?.message ?? '');
        dispatch(common_state());
    });
});

// Fetch closed leads
export const fetchClosedLeads = createAsyncThunk('leads/fetchClosedLeads', async (data, { dispatch, getState }) => {
    dispatch(common_state({ isLoading: true }));
    console.log('fetchClosedLeads data', data);
    const closedLeads = getState()?.leads?.closedLeads;
    console.log('original closedLeads', closedLeads);
    await performGetRequest(API.closedLeads + data?.url).then(res => {
        const apiResponse = responseHandler(res);
        console.log('closedLeads apiResponse?.data?.data', apiResponse?.data?.data);
        if (apiResponse?.data.success) {
            const newClosedLeads = apiResponse?.data?.data?.items || [];
            let finalClosedLeads = [];
            if (data?.data?.page === 1) {
                finalClosedLeads = newClosedLeads;
            } else {
                finalClosedLeads = closedLeads?.length > 0 ? [...closedLeads, ...newClosedLeads] : newClosedLeads;
            }
            dispatch(setClosedLeads({
                items: finalClosedLeads,
                totalPages: apiResponse?.data?.data?.totalPages,
                currentPage: data?.data?.page,
            }));
        }
        dispatch(common_state());
    }).catch(error => {
        console.log('fetchClosedLeads failure', error);
        const apiResponse = responseHandler(error.response);
        MyToast(apiResponse?.data?.message ?? '');
        dispatch(common_state());
    });
});

// Record call on lead
export const recordLeadCall = createAsyncThunk('leads/recordLeadCall', async (data, { dispatch }) => {
    console.log('recording lead call with data', data);
    dispatch(common_state({ isLoading: true }));
    
    await performPostRequest(API.recordLeadCall, data).then(res => {
        const apiResponse = responseHandler(res);
        console.log('recordLeadCall response', apiResponse?.data?.data)
        if (apiResponse?.data.success) {
             dispatch(fetch_leads({ url: `?page=${1}`, data: { page: 1 } }))
            dispatch(fetchLeadsDashboardStats());
            
            if (data.status === 'successful') {
                // Refresh the specific outcome screen
                const outcomeRefreshMap = {
                    'interested': () => dispatch(fetchInterestedLeads({ url: `?page=${1}`, data: { page: 1 } })),
                    'follow_up': () => dispatch(fetchFollowUpLeads({ url: `?page=${1}`, data: { page: 1 } })),
                    'information_sharing': () => dispatch(fetchInformationSharingLeads({ url: `?page=${1}`, data: { page: 1 } })),
                    'site_visit_planned': () => dispatch(fetchSiteVisitPlannedLeads({ url: `?page=${1}`, data: { page: 1 } })),
                    'site_visit_done': () => dispatch(fetchSiteVisitDoneLeads({ url: `?page=${1}`, data: { page: 1 } })),
                    'ready_to_move': () => dispatch(fetchReadyToMoveLeads({ url: `?page=${1}`, data: { page: 1 } })),
                    'sales_closed': () => dispatch(fetchClosedLeads({ url: `?page=${1}`, data: { page: 1 } }))
                };
                
                const refreshFunction = outcomeRefreshMap[data.outcome];
                if (refreshFunction) refreshFunction();
            } else {
                dispatch(fetchUnsuccessfulLeads({ url: `?page=${1}`, data: { page: 1 } }));
            }
            
            MyToast('Operation successful');
        }
        dispatch(common_state())
    }).catch(error => {
        console.log('recordLeadCall failure', error);
        const apiResponse = responseHandler(error.response);
        MyToast(apiResponse?.data?.message ?? '');
        dispatch(common_state());
    });
});

// Fetch last comments on leads
export const last_lead_comment = createAsyncThunk('leads/last_lead_comment', async (_, { dispatch }) => {
    console.log('fetching last lead comment');
    dispatch(common_state({ isLoading: true }));
    await performGetRequest(API.lastLeadComments).then(res => {
        const apiResponse = responseHandler(res);
        console.log('last_lead_comment apiResponse?.data', apiResponse?.data)
        if (apiResponse?.data.success) {
            dispatch(set_last_lead_comment({
                comments: apiResponse?.data?.data?.comments || [],
                isLoading: false
            }));
        }
        dispatch(common_state());
    }).catch(error => {
        console.log('last_lead_comment failure', error);
        const apiResponse = responseHandler(error.response);
        MyToast(apiResponse?.data?.message ?? '');
        dispatch(common_state());
    });
});

// Fetch leads by outcome - Interested
export const fetchInterestedLeads = createAsyncThunk('leads/fetchInterestedLeads', async (data, { dispatch, getState }) => {
    dispatch(common_state({ isLoading: true }));
    const interestedLeads = getState()?.leads?.interestedLeads;
    await performGetRequest(API.interestedLeads + data?.url).then(res => {
        const apiResponse = responseHandler(res);
        if (apiResponse?.data.success) {
            const newLeads = apiResponse?.data?.data?.items || [];
            let finalLeads = data?.data?.page === 1 ? newLeads : [...(interestedLeads || []), ...newLeads];
            dispatch(setInterestedLeads({
                items: finalLeads,
                totalPages: apiResponse?.data?.data?.totalPages,
                currentPage: data?.data?.page,
            }));
        }
        dispatch(common_state());
    }).catch(error => {
        const apiResponse = responseHandler(error.response);
        MyToast(apiResponse?.data?.message ?? '');
        dispatch(common_state());
    });
});

// Fetch leads by outcome - Follow Up
export const fetchFollowUpLeads = createAsyncThunk('leads/fetchFollowUpLeads', async (data, { dispatch, getState }) => {
    dispatch(common_state({ isLoading: true }));
    const followUpLeads = getState()?.leads?.followUpLeads;
    await performGetRequest(API.followUpOutcomeLeads + data?.url).then(res => {
        const apiResponse = responseHandler(res);
        if (apiResponse?.data.success) {
            const newLeads = apiResponse?.data?.data?.items || [];
            let finalLeads = data?.data?.page === 1 ? newLeads : [...(followUpLeads || []), ...newLeads];
            dispatch(setFollowUpLeads({
                items: finalLeads,
                totalPages: apiResponse?.data?.data?.totalPages,
                currentPage: data?.data?.page,
            }));
        }
        dispatch(common_state());
    }).catch(error => {
        const apiResponse = responseHandler(error.response);
        MyToast(apiResponse?.data?.message ?? '');
        dispatch(common_state());
    });
});

// Fetch leads by outcome - Information Sharing
export const fetchInformationSharingLeads = createAsyncThunk('leads/fetchInformationSharingLeads', async (data, { dispatch, getState }) => {
    dispatch(common_state({ isLoading: true }));
    const informationSharingLeads = getState()?.leads?.informationSharingLeads;
    await performGetRequest(API.informationSharingLeads + data?.url).then(res => {
        const apiResponse = responseHandler(res);
        if (apiResponse?.data.success) {
            const newLeads = apiResponse?.data?.data?.items || [];
            let finalLeads = data?.data?.page === 1 ? newLeads : [...(informationSharingLeads || []), ...newLeads];
            dispatch(setInformationSharingLeads({
                items: finalLeads,
                totalPages: apiResponse?.data?.data?.totalPages,
                currentPage: data?.data?.page,
            }));
        }
        dispatch(common_state());
    }).catch(error => {
        const apiResponse = responseHandler(error.response);
        MyToast(apiResponse?.data?.message ?? '');
        dispatch(common_state());
    });
});

// Fetch leads by outcome - Site Visit Planned
export const fetchSiteVisitPlannedLeads = createAsyncThunk('leads/fetchSiteVisitPlannedLeads', async (data, { dispatch, getState }) => {
    dispatch(common_state({ isLoading: true }));
    const siteVisitPlannedLeads = getState()?.leads?.siteVisitPlannedLeads;
    await performGetRequest(API.siteVisitPlannedLeads + data?.url).then(res => {
        const apiResponse = responseHandler(res);
        if (apiResponse?.data.success) {
            const newLeads = apiResponse?.data?.data?.items || [];
            let finalLeads = data?.data?.page === 1 ? newLeads : [...(siteVisitPlannedLeads || []), ...newLeads];
            dispatch(setSiteVisitPlannedLeads({
                items: finalLeads,
                totalPages: apiResponse?.data?.data?.totalPages,
                currentPage: data?.data?.page,
            }));
        }
        dispatch(common_state());
    }).catch(error => {
        const apiResponse = responseHandler(error.response);
        MyToast(apiResponse?.data?.message ?? '');
        dispatch(common_state());
    });
});

// Fetch leads by outcome - Site Visit Done
export const fetchSiteVisitDoneLeads = createAsyncThunk('leads/fetchSiteVisitDoneLeads', async (data, { dispatch, getState }) => {
    dispatch(common_state({ isLoading: true }));
    const siteVisitDoneLeads = getState()?.leads?.siteVisitDoneLeads;
    await performGetRequest(API.siteVisitDoneLeads + data?.url).then(res => {
        const apiResponse = responseHandler(res);
        if (apiResponse?.data.success) {
            const newLeads = apiResponse?.data?.data?.items || [];
            let finalLeads = data?.data?.page === 1 ? newLeads : [...(siteVisitDoneLeads || []), ...newLeads];
            dispatch(setSiteVisitDoneLeads({
                items: finalLeads,
                totalPages: apiResponse?.data?.data?.totalPages,
                currentPage: data?.data?.page,
            }));
        }
        dispatch(common_state());
    }).catch(error => {
        const apiResponse = responseHandler(error.response);
        MyToast(apiResponse?.data?.message ?? '');
        dispatch(common_state());
    });
});

// Fetch leads by outcome - Ready to Move
export const fetchReadyToMoveLeads = createAsyncThunk('leads/fetchReadyToMoveLeads', async (data, { dispatch, getState }) => {
    dispatch(common_state({ isLoading: true }));
    const readyToMoveLeads = getState()?.leads?.readyToMoveLeads;
    await performGetRequest(API.readyToMoveLeads + data?.url).then(res => {
        const apiResponse = responseHandler(res);
        if (apiResponse?.data.success) {
            const newLeads = apiResponse?.data?.data?.items || [];
            let finalLeads = data?.data?.page === 1 ? newLeads : [...(readyToMoveLeads || []), ...newLeads];
            dispatch(setReadyToMoveLeads({
                items: finalLeads,
                totalPages: apiResponse?.data?.data?.totalPages,
                currentPage: data?.data?.page,
            }));
        }
        dispatch(common_state());
    }).catch(error => {
        const apiResponse = responseHandler(error.response);
        MyToast(apiResponse?.data?.message ?? '');
        dispatch(common_state());
    });
});

const leadsSlice = createSlice({
    name: 'leads',
    initialState: {
        isLoading: false,
        stats: {},
        
        // Assigned leads list
        leads: [],
        leadsTotalPages: 0,
        leadsCurrentPage: 1,
        
        // Successful leads list
        successfulLeads: [],
        successfulLeadsTotalPages: 0,
        successfulLeadsCurrentPage: 1,
        
        // Scheduled leads list
        scheduledLeads: [],
        scheduledLeadsTotalPages: 0,
        scheduledLeadsCurrentPage: 1,
        
        // Unsuccessful leads list
        unsuccessfulLeads: [],
        unsuccessfulLeadsTotalPages: 0,
        unsuccessfulLeadsCurrentPage: 1,
        
        // Closed leads list
        closedLeads: [],
        closedLeadsTotalPages: 0,
        closedLeadsCurrentPage: 1,

        // Outcome-specific lists
        interestedLeads: [],
        interestedLeadsTotalPages: 0,
        interestedLeadsCurrentPage: 1,
        
        followUpLeads: [],
        followUpLeadsTotalPages: 0,
        followUpLeadsCurrentPage: 1,
        
        informationSharingLeads: [],
        informationSharingLeadsTotalPages: 0,
        informationSharingLeadsCurrentPage: 1,
        
        siteVisitPlannedLeads: [],
        siteVisitPlannedLeadsTotalPages: 0,
        siteVisitPlannedLeadsCurrentPage: 1,
        
        siteVisitDoneLeads: [],
        siteVisitDoneLeadsTotalPages: 0,
        siteVisitDoneLeadsCurrentPage: 1,
        
        readyToMoveLeads: [],
        readyToMoveLeadsTotalPages: 0,
        readyToMoveLeadsCurrentPage: 1,

        // Last Comment
        comments: []
    },
    reducers: {
        common_state: (state, action) => {
            state.isLoading = action?.payload?.isLoading ?? false;
        },
        setLeadsStats: (state, action) => {
            state.stats = action.payload || {};
        },
        setLeads: (state, action) => {
            state.leads = action?.payload?.items || [];
            state.leadsTotalPages = action?.payload?.totalPages || 0;
            state.leadsCurrentPage = action?.payload?.currentPage || 1;
        },
        setSuccessfulLeads: (state, action) => {
            console.log('setSuccessfulLeads action.payload', action.payload);
            const data = action.payload || {};
            state.successfulLeads = data.items || [];
            state.successfulLeadsTotalPages = data.totalPages || 0;
            state.successfulLeadsCurrentPage = data.currentPage || 1;
        },
        setScheduledLeads: (state, action) => {
            console.log('setScheduledLeads action.payload', action.payload);
            const data = action.payload || {};
            state.scheduledLeads = data.items || [];
            state.scheduledLeadsTotalPages = data.totalPages || 0;
            state.scheduledLeadsCurrentPage = data.currentPage || 1;
        },
        setUnsuccessfulLeads: (state, action) => {
            console.log('setUnsuccessfulLeads action.payload', action.payload);
            const data = action.payload || {};
            state.unsuccessfulLeads = data.items || [];
            state.unsuccessfulLeadsTotalPages = data.totalPages || 0;
            state.unsuccessfulLeadsCurrentPage = data.currentPage || 1;
        },
        setClosedLeads: (state, action) => {
            console.log('setClosedLeads action.payload', action.payload);
            const data = action.payload || {};
            state.closedLeads = data.items || [];
            state.closedLeadsTotalPages = data.totalPages || 0;
            state.closedLeadsCurrentPage = data.currentPage || 1;
        },
        setInterestedLeads: (state, action) => {
            const data = action.payload || {};
            state.interestedLeads = data.items || [];
            state.interestedLeadsTotalPages = data.totalPages || 0;
            state.interestedLeadsCurrentPage = data.currentPage || 1;
        },
        setFollowUpLeads: (state, action) => {
            const data = action.payload || {};
            state.followUpLeads = data.items || [];
            state.followUpLeadsTotalPages = data.totalPages || 0;
            state.followUpLeadsCurrentPage = data.currentPage || 1;
        },
        setInformationSharingLeads: (state, action) => {
            const data = action.payload || {};
            state.informationSharingLeads = data.items || [];
            state.informationSharingLeadsTotalPages = data.totalPages || 0;
            state.informationSharingLeadsCurrentPage = data.currentPage || 1;
        },
        setSiteVisitPlannedLeads: (state, action) => {
            const data = action.payload || {};
            state.siteVisitPlannedLeads = data.items || [];
            state.siteVisitPlannedLeadsTotalPages = data.totalPages || 0;
            state.siteVisitPlannedLeadsCurrentPage = data.currentPage || 1;
        },
        setSiteVisitDoneLeads: (state, action) => {
            const data = action.payload || {};
            state.siteVisitDoneLeads = data.items || [];
            state.siteVisitDoneLeadsTotalPages = data.totalPages || 0;
            state.siteVisitDoneLeadsCurrentPage = data.currentPage || 1;
        },
        setReadyToMoveLeads: (state, action) => {
            const data = action.payload || {};
            state.readyToMoveLeads = data.items || [];
            state.readyToMoveLeadsTotalPages = data.totalPages || 0;
            state.readyToMoveLeadsCurrentPage = data.currentPage || 1;
        },
        set_last_lead_comment: (state, action) => {
            console.log('set_last_lead_comment action.payload', action.payload);
            state.comments = action?.payload?.comments || [];
            state.isLoading = action?.payload?.isLoading || false;
        }
    }
});

export const {
    setLeadsStats,
    setLeads,
    setSuccessfulLeads,
    setScheduledLeads,
    setUnsuccessfulLeads,
    setClosedLeads,
    setInterestedLeads,
    setFollowUpLeads,
    setInformationSharingLeads,
    setSiteVisitPlannedLeads,
    setSiteVisitDoneLeads,
    setReadyToMoveLeads,
    common_state,
    set_last_lead_comment
} = leadsSlice.actions;

export default leadsSlice.reducer;

