import 'react-native-gesture-handler';
import React, {useState, useEffect} from 'react';
// Libs related to walletconnect
import '@walletconnect/react-native-compat';
import {WagmiConfig} from 'wagmi';
import {mainnet, polygon, arbitrum} from 'viem/chains';
import {
  createWeb3Modal,
  defaultWagmiConfig,
  Web3Modal,
} from '@web3modal/wagmi-react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import SplashScreen from './src/components/SplashScreen';
import MetaMaskScreen from './src/screens/MetaMaskScreen';
import NodeDetailsScreen from './src/screens/NodeDetailsScreen';
import OrganizationScreen from './src/screens/OrganizationScreen';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {StyleSheet} from 'react-native';
import Toast from 'react-native-toast-message';

const projectId = process.env.PROJECT_ID as string;

const metadata = {
  name: 'Web3Modal RN',
  description: 'AssetShare WalletConnect',
  url: 'https://web3modal.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886'],
  redirect: {
    native: 'YOUR_APP_SCHEME://',
    universal: 'YOUR_APP_UNIVERSAL_LINK.com',
  },
};

const chains = [mainnet, polygon, arbitrum];

const wagmiConfig = defaultWagmiConfig({chains, projectId, metadata});

createWeb3Modal({
  projectId,
  chains,
  wagmiConfig,
});

const App = () => {
  const [isSplashVisible, setSplashVisible] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => {
      setSplashVisible(false);
    }, 2000);
  }, []);

  return (
    <GestureHandlerRootView style={styles.flex1}>
      <WagmiConfig config={wagmiConfig}>
        <NavigationContainer>
          {isSplashVisible ? (
            <SplashScreen onAnimationFinish={() => {}} />
          ) : (
            <Stack.Navigator initialRouteName="MetaMask">
              <Stack.Screen name="MetaMask" component={MetaMaskScreen} />
              <Stack.Screen
                name="OrganizationView"
                component={OrganizationScreen}
              />
              <Stack.Screen name="NodeDetails" component={NodeDetailsScreen} />
            </Stack.Navigator>
          )}
        </NavigationContainer>
        <Web3Modal />
        <Toast />
      </WagmiConfig>
    </GestureHandlerRootView>
  );
};

const Stack = createStackNavigator();

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
});

export default App;
