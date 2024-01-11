// AnimatedSplashScreen.tsx

import React, { useEffect, useRef } from 'react';
import { View, Image, Animated, StyleSheet } from 'react-native';

interface AnimatedSplashScreenProps {
  onAnimationFinish: () => void;
}

const SplashScreen: React.FC<AnimatedSplashScreenProps> = ({ onAnimationFinish }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start(() => {
      // Animation is finished
      onAnimationFinish();
    });
  }, [fadeAnim, onAnimationFinish]);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('../assets/images/splashImage.png')}
        style={[styles.image, { opacity: fadeAnim }]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
  },
  image: {
    width: 400,
    height: 400,
  },
});

export default SplashScreen;
