/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import * as React from 'react';
import { ColorSchemeName } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onAuthStateChanged } from 'firebase/auth';

import Home from '../screens/Home';
import Favorite from '../screens/Favorite';
import Detail from '../screens/Detail';
import { RootStackParamList } from '../types';
import LinkingConfiguration from './LinkingConfiguration';
import Auth from '../components/Auth';
import { auth } from '../config/firebase';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { signIn, signOut } from '../store/reducers/auth';

export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => dispatch(user ? signIn(user) : signOut()));
    return unsubscribe;
  }, []);

  return (
    <NavigationContainer linking={LinkingConfiguration} theme={DefaultTheme}>
      <RootNavigator />

      {!user && <Auth />}
    </NavigationContainer>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen name="Favorite" component={Favorite} options={{ headerShown: false }} />
        <Stack.Screen name="Detail" component={Detail} options={{ headerShown: false }} />
      </Stack.Group>
    </Stack.Navigator>
  );
}
