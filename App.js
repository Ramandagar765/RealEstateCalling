import { navigationRef } from '#/navigation/RootNavigation';
import { persistor, store } from '#/redux/store';
import DrawerNavigator from '#/navigation/DrawerNavigator';
import Splash from '#/screens/Dashboard/Splash';
import Login from '#/screens/User/Login';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import Profile from '#/screens/User/Profile';
const Stack = createStackNavigator();

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer ref={navigationRef}>
          <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName='Login'>
            <Stack.Screen name="Splash" component={Splash} />
            <Stack.Screen name='Login' component={Login} />
            <Stack.Screen name="DashBoard" component={DrawerNavigator} />
            <Stack.Screen name="Profile" component={Profile} />
          </Stack.Navigator>
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
};

export default App;