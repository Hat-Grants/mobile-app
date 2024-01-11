import React, {useEffect, useState} from 'react';
import {W3mButton} from '@web3modal/wagmi-react-native';
import {View, StyleSheet, TouchableOpacity, Text, Image} from 'react-native';
import {useAccount, useNetwork} from 'wagmi';
import Toast from 'react-native-toast-message';

const metaMaskLogo = require('../assets/images/metamask.png'); // Replace with the correct path

interface MetaMaskScreenProps {
  navigation: any;
}

const MetaMaskScreen: React.FC<MetaMaskScreenProps> = ({navigation}) => {
  // hook to check account status
  const {address, isConnecting, isDisconnected} = useAccount();
  const {chain, chains} = useNetwork();

  useEffect(() => {}, []);

  const openOrganizationView = () => {
    if (chain === undefined) {
      Toast.show({
        type: 'error',
        text1: 'Sorry',
        text2: 'The system cannot detect the connected chain',
      });
      return;
    }

    const availableChains: string[] = [];
    chains.forEach(availableChain => {
      availableChains.push(availableChain.name);
    });

    if (availableChains.indexOf(chain.name) == -1) {
      if (chain === undefined) {
        Toast.show({
          type: 'error',
          text1: 'Sorry',
          text2: 'The connected chain is not among the available chains',
        });
        return;
      }
    }

    navigation.navigate('OrganizationView');
  };

  return (
    <View style={styles.container}>
      <Image source={metaMaskLogo} style={styles.logo} />

      {!address && <W3mButton />}
      {isConnecting && <Text>Please waiting, connection is in progress</Text>}
      {!isDisconnected && (
        <Text>
          The connected address is <Text style={styles.boldText}>{address}</Text> and your chain is <Text style={styles.boldText}>{chain?.name}{' '}</Text>
          consider it should be among {chains.map(chain => ' '+chain.name)}
        </Text>
      )}
      {address && (
        <TouchableOpacity onPress={openOrganizationView} style={styles.button}>
          <Text style={styles.buttonText}>Open Organization View</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  connectButton: {
    backgroundColor: 'blue',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 20,
  },
  button: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 5,
    marginTop: 10
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  boldText: {
    fontWeight: 'bold',
    color: 'black',
  }
});

export default MetaMaskScreen;
