import React, { useState } from 'react';
import { ActivityIndicator, Keyboard, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Canvas, Fill, BackdropFilter, Blur } from '@shopify/react-native-skia';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import Toast from 'react-native-toast-message';
import { auth } from '../config/firebase';
import { normalize } from '../utils';
import Logo from './Logo';
import { LinearGradient } from 'expo-linear-gradient';

const Auth = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [action, setAction] = useState(0);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleAuth = async () => {
    if (loading) return;
    try {
      setLoading(true);
      await (!action ? signInWithEmailAndPassword : createUserWithEmailAndPassword)(auth, email, password);
      Toast.show({
        type: 'success',
        text1: 'Welcome back!',
        text2: 'Your sign in was successful. Enjoy your session.',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: (error as Error)?.message || 'An error occurred while processing your request :(',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Canvas style={styles.cover}>
        <Fill color="rgba(255, 255, 255, .6)" />
        <BackdropFilter filter={<Blur blur={10} />}>
          <Fill color="rgba(200, 200, 200, 0.35)" />
        </BackdropFilter>
      </Canvas>

      <LinearGradient colors={['rgba(255, 255, 255, 1)', 'rgba(255, 255, 255, .1)', 'transparent']} style={styles.cover} />

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.cover}>
          <SafeAreaView style={[styles.container]}>
            <Logo style="dark" />

            <View style={styles.form}>
              <SegmentedControl
                style={{ marginBottom: normalize(5) }}
                tintColor="#000"
                values={['Sign In', 'Sign Up']}
                selectedIndex={action}
                onChange={(event) => {
                  setAction(event.nativeEvent.selectedSegmentIndex);
                }}
              />
              <TextInput style={styles.input} placeholder="Email" keyboardType="email-address" value={email} placeholderTextColor="#8391A1" onChangeText={setEmail} />
              <TextInput style={styles.input} placeholder="Password" secureTextEntry={true} value={password} placeholderTextColor="#8391A1" onChangeText={setPassword} />
              <TouchableOpacity style={styles.button} activeOpacity={0.8} onPress={handleAuth} disabled={loading}>
                {!loading ? <Text style={styles.buttonText}>Sign {!action ? 'In' : 'Up'}</Text> : <ActivityIndicator animating color="#FFF" />}
              </TouchableOpacity>
            </View>

            <Toast />
          </SafeAreaView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </>
  );
};

export default Auth;

const styles = StyleSheet.create({
  cover: {
    flex: 1,
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  container: {
    flex: 1,
    padding: normalize(15),
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  form: {
    width: '100%',
    backgroundColor: '#FFF',
    padding: normalize(18),
    borderRadius: normalize(10),
    shadowColor: 'rgba(0,0,0,.4)',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
  },
  input: {
    width: '100%',
    paddingHorizontal: normalize(18),
    paddingVertical: normalize(12),
    marginVertical: normalize(8),
    backgroundColor: '#EEEEEE',
    borderRadius: normalize(8),
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
    width: '100%',
    backgroundColor: '#000',
    borderRadius: normalize(8),
    marginTop: normalize(5),
    paddingHorizontal: normalize(18),
    paddingVertical: normalize(12),
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});
