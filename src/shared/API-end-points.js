import { BASE_URL } from "./app-setting";

export const API = {
    BASE_URL: BASE_URL,
    TIMEOUT: 10000,
    
    // Auth endpoints
    login: `${BASE_URL}api/auth/login`,
    verifyToken: `${BASE_URL}api/auth/verify`,
    
    // User endpoints
    dashboard: `${BASE_URL}api/user/dashboard`,
    contacts: `${BASE_URL}api/user/contacts`,
    recordCall: `${BASE_URL}api/user/record-call`,
    
    // List endpoints
    successfulCalls: `${BASE_URL}api/user/successful-calls`,
    rescheduledCalls: `${BASE_URL}api/user/scheduled-calls`,
    unsuccessfulCalls: `${BASE_URL}api/user/unsuccessful-calls`,
    followUpCalls: `${BASE_URL}api/user/follow-up-calls`,
    closedDeals: `${BASE_URL}api/user/closed-deals`,
    
    // Outcome-specific endpoints for Contacts
    interestedCalls: `${BASE_URL}api/user/calls/outcome/interested`,
    notInterestedCalls: `${BASE_URL}api/user/calls/outcome/not-interested`,
    salesClosedCalls: `${BASE_URL}api/user/calls/outcome/sales-closed`,
    followUpOutcomeCalls: `${BASE_URL}api/user/calls/outcome/follow-up`,
    informationSharingCalls: `${BASE_URL}api/user/calls/outcome/information-sharing`,
    siteVisitPlannedCalls: `${BASE_URL}api/user/calls/outcome/site-visit-planned`,
    siteVisitDoneCalls: `${BASE_URL}api/user/calls/outcome/site-visit-done`,
    readyToMoveCalls: `${BASE_URL}api/user/calls/outcome/ready-to-move`,
    
    // Profile
    updateProfile: `${BASE_URL}api/user/profile`,
    lastcomment: `${BASE_URL}api/user/last-comments`,

    //Team Lead
    team_members: `${BASE_URL}api/team-lead/team-members`,
    team_dashboard: `${BASE_URL}api/team-lead/team-member-dashboard`,

    // get project
    projects: `${BASE_URL}api/user/active-projects`,

    // Lead endpoints
    leadsDashboard: `${BASE_URL}api/user/leads/dashboard`,
    leads: `${BASE_URL}api/user/leads`,
    recordLeadCall: `${BASE_URL}api/user/record-call`,
    scheduledLeads: `${BASE_URL}api/user/leads/scheduled`,
    unsuccessfulLeads: `${BASE_URL}api/user/leads/unsuccessful`,
    successfulLeads: `${BASE_URL}api/user/leads/successful`,
    closedLeads: `${BASE_URL}api/user/leads/closed`,
    lastLeadComments: `${BASE_URL}api/user/leads/last-comments`,
    
    // Outcome-specific endpoints for Leads
    interestedLeads: `${BASE_URL}api/user/leads/calls/outcome/interested`,
    notInterestedLeads: `${BASE_URL}api/user/leads/calls/outcome/not-interested`,
    salesClosedLeads: `${BASE_URL}api/user/leads/calls/outcome/sales-closed`,
    followUpOutcomeLeads: `${BASE_URL}api/user/leads/calls/outcome/follow-up`,
    informationSharingLeads: `${BASE_URL}api/user/leads/calls/outcome/information-sharing`,
    siteVisitPlannedLeads: `${BASE_URL}api/user/leads/calls/outcome/site-visit-planned`,
    siteVisitDoneLeads: `${BASE_URL}api/user/leads/calls/outcome/site-visit-done`,
    readyToMoveLeads: `${BASE_URL}api/user/leads/calls/outcome/ready-to-move`,
}