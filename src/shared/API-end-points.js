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
    
    // Profile
    updateProfile: `${BASE_URL}api/user/profile`,
    lastcomment: `${BASE_URL}api/user/last-comments`,

    //Team Lead
    team_members: `${BASE_URL}api/team-lead/team-members`,
    team_dashboard: `${BASE_URL}api/team-lead/team-member-dashboard`,

    // get project
    projects: `${BASE_URL}api/user/active-projects`,
}