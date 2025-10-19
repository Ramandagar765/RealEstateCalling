import user from '#/screens/User/store';
import dashboard from '#/screens/Dashboard/store';
import leads from '#/screens/Leads/store';
import app from './appSlice';

const rootReducer = {
  user,
  dashboard,
  leads,
  app
};

export default rootReducer;
