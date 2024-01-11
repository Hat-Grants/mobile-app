// NodeDetailsScreen.tsx

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

// Define the type for your tree data
interface TreeDataTypes {
  id: string;
  name: string;
  svgImage: string;
  features: { name: string; value: string }[];
  children: TreeDataTypes[];
}

// Define the navigation parameters
type RootStackParamList = {
  NodeDetails: { nodes: string };
};

type NodeDetailsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'NodeDetails'>;
type NodeDetailsScreenRouteProp = RouteProp<RootStackParamList, 'NodeDetails'>;

interface NodeDetailsScreenProps {
  navigation: NodeDetailsScreenNavigationProp;
  route: NodeDetailsScreenRouteProp;
}

const NodeDetailsScreen: React.FC<NodeDetailsScreenProps> = ({ route }) => {
    const { nodes } = route.params;
    const deserializedNodes = JSON.parse(nodes);

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {deserializedNodes.map((node: TreeDataTypes) => (
        <View key={node.id} style={styles.card}>
          <Svg height={100} width={100}>
            {/* Add your SVG components here */}
            <Circle cx={50} cy={50} r={40} fill="blue" />
          </Svg>
          <Text style={styles.nodeName}>{node.name}</Text>
          <View style={styles.featuresContainer}>
            {node.features && node.features.map((feature, index) => (
              <Text key={index} style={styles.featureText}>
                {`${feature.name}: ${feature.value}`}
              </Text>
            ))}
          </View>
          <Text style={styles.childrenHeader}>Children:</Text>
          <View style={styles.childrenContainer}>
            {node.children && node.children.map((child) => (
              <Text key={child.id} style={styles.childName}>
                {child.name}
              </Text>
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  nodeName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
  },
  featuresContainer: {
    marginTop: 16,
  },
  featureText: {
    fontSize: 16,
  },
  childrenHeader: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: 'bold',
  },
  childrenContainer: {
    marginTop: 8,
  },
  childName: {
    fontSize: 16,
  },
});

export default NodeDetailsScreen;
