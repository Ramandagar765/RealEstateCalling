import { navigationRef } from '#/navigation/RootNavigation';
import DrawerNavigator from '#/navigation/DrawerNavigator';
import Splash from '#/screens/Dashboard/Splash';
import Login from '#/screens/User/Login';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { Provider } from 'react-redux';
import Profile from '#/screens/User/Profile';
const Stack = createStackNavigator();

const App = () => {
  return (
        <NavigationContainer ref={navigationRef}>
          <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName='Splash'>
            <Stack.Screen name="Splash" component={Splash} />
            <Stack.Screen name='Login' component={Login} />
            <Stack.Screen name="DashBoard" component={DrawerNavigator} />
            <Stack.Screen name="Profile" component={Profile} />
          </Stack.Navigator>
        </NavigationContainer>
  );
};

export default App;