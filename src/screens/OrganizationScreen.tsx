import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Button,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {TreeDataTypes, TreeSelect} from 'react-native-tree-selection';
import Modal from 'react-native-modal';
import {Picker} from '@react-native-picker/picker';
import Toast from 'react-native-toast-message';
import _ from 'lodash';

interface OrganizationScreenProps {
  navigation: any;
}

interface NewNodeData {
  id: string;
  name: string;
  features: TreeDataTypes[];
  svgImage?: string;
}

const initialNodes: TreeDataTypes[] = [
  {
    id: '1',
    name: 'Node 1',
    svgImage: '',
    features: [
      {name: 'feature 1', value: 'value 1'},
      {name: 'feature 2', value: 'value 2'},
    ],
    children: [
      {
        id: 11,
        name: 'Child Node 1',
        svgImage: '',
        features: [],
      },
    ],
  },
  {
    id: '2',
    name: 'Node 2',
    svgImage: '',
    features: [{name: 'feature 3', value: 'value 3'}],
    children: [],
  },
  // ... add more initial nodes
];
const flattenNodes = (nodes: TreeDataTypes[]): TreeDataTypes[] => {
  let flattenedNodes: TreeDataTypes[] = [];

  nodes.forEach(node => {
    flattenedNodes.push(node);

    if (node.children && node.children.length > 0) {
      flattenedNodes = flattenedNodes.concat(flattenNodes(node.children));
    }
  });

  return flattenedNodes;
};

const OrganizationScreen: React.FC<OrganizationScreenProps> = ({
  navigation,
}) => {
  const [nodes, setNodes] = useState<TreeDataTypes[]>(initialNodes);
  const [selectedNodes, setSelectedNodes] = useState<TreeDataTypes[]>();
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedParentNode, setSelectedParentNode] = useState<TreeDataTypes>();
  const [newNodeData, setNewNodeData] = useState<NewNodeData>({
    id: '',
    name: '',
    features: [],
  });

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const flattenedNodes = flattenNodes(nodes);

  const handleNodeDetailsPress = () => {
    if (selectedNodes && selectedNodes.length == 0) {
      Toast.show({
        type: 'error',
        text1: 'Node Selection',
        text2: 'Please select at least one node',
      });
      return;
    }

    try {
      // Deep copy the nodes array before serializing
      const deepCopiedNodes = _.cloneDeep(selectedNodes);

      // Serialize nodes array before passing it as a parameter
      const serializedNodes = JSON.stringify(deepCopiedNodes);
      console.log(serializedNodes);
      // Navigate to NodeDetailsScreen and pass the serialized nodes as a parameter
      navigation.navigate('NodeDetails', {nodes: serializedNodes});
    } catch (error) {
      console.error('Error while serializing nodes:', error);
    }
  };

  const addNode = () => {
    const newNode: TreeDataTypes = {
      id: newNodeData.id,
      name: newNodeData.name,
      features: [...newNodeData.features],
      children: [],
    };

    const findParentAndAddNode = (nodes: TreeDataTypes[]): TreeDataTypes[] => {
      return nodes.map(node => {
        if (
          selectedParentNode !== undefined &&
          node.id === selectedParentNode.id
        ) {
          // If the current node is the selected parent, add the new node
          return {
            ...node,
            children: [...node.children, newNode],
          };
        } else if (node.children && node.children.length > 0) {
          // If the current node has children, recursively search for the parent
          return {
            ...node,
            children: findParentAndAddNode(node.children),
          };
        }
        return node;
      });
    };
    if (selectedParentNode === undefined) {
      setNodes(prevNodes => [...prevNodes, newNode]);
    } else {
      setNodes(prevNodes => findParentAndAddNode(prevNodes));
    }

    // Reset the newNodeData and close the modal
    setNewNodeData({id: '', name: '', features: []});
    setSelectedParentNode(undefined);
    setModalVisible(false);
  };

  const addFeature = () => {
    setNewNodeData(prevData => ({
      ...prevData,
      features: [
        ...prevData.features,
        {name: `Feature ${prevData.features.length + 1}`, value: ''},
      ],
    }));
  };

  const removeFeature = (index: number) => {
    setNewNodeData(prevData => {
      const updatedFeatures = [...prevData.features];
      updatedFeatures.splice(index, 1);
      return {...prevData, features: updatedFeatures};
    });
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.treeContainer}>
        <TreeSelect
          data={nodes}
          childKey="children"
          titleKey="name"
          renderArrowOpen={
            <Text style={{fontWeight: 'bold', color: 'white'}}> &gt; </Text>
          }
          renderArrowClosed={
            <Text style={{fontWeight: 'bold', color: 'white'}}> </Text>
          }
          onParentPress={(item: TreeDataTypes) => {
            console.log('onPressParent', item);
          }}
          onChildPress={(item: TreeDataTypes) => {
            console.log('onPressChild', item);
          }}
          onCheckBoxPress={(items: TreeDataTypes[]) => {
            setSelectedNodes(items);
          }}
        />
      </SafeAreaView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={toggleModal} style={styles.addButton}>
          <Text style={{color: 'white', fontWeight: 'bold'}}>Add Node</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleNodeDetailsPress}
          style={styles.addButton}>
          <Text style={{color: 'white', fontWeight: 'bold'}}>
            Show selected nodes
          </Text>
        </TouchableOpacity>
      </View>

      <Modal isVisible={isModalVisible} onBackdropPress={toggleModal}>
        <ScrollView style={{flex: 1}}>
          <View style={[styles.modalContainer]}>
            <TextInput
              placeholder="ID - blockchain address"
              onChangeText={text => setNewNodeData({...newNodeData, id: text})}
              style={styles.input}
            />
            <TextInput
              placeholder="Name"
              onChangeText={text =>
                setNewNodeData({...newNodeData, name: text})
              }
              style={styles.input}
            />

            <Text style={{marginTop: 10}}>Features:</Text>
            {newNodeData.features.map((feature, index) => (
              <View key={index} style={styles.featureContainer}>
                <TextInput
                  placeholder="Feature Name"
                  value={feature.name as string}
                  onChangeText={text => {
                    const updatedFeatures = [...newNodeData.features];
                    updatedFeatures[index].name = text;
                    setNewNodeData({...newNodeData, features: updatedFeatures});
                  }}
                  style={[styles.input, styles.featureInput]}
                />
                <TextInput
                  placeholder="Feature Value"
                  value={feature.value as string}
                  onChangeText={text => {
                    const updatedFeatures = [...newNodeData.features];
                    updatedFeatures[index].value = text;
                    setNewNodeData({...newNodeData, features: updatedFeatures});
                  }}
                  style={[styles.input, styles.featureInput]}
                  onSubmitEditing={() => addFeature()} // Trigger addFeature on 'Enter' press
                />
                <Button title="Remove" onPress={() => removeFeature(index)} />
              </View>
            ))}
            <Button title="Add Feature" onPress={addFeature} />

            <Text style={{marginTop: 10}}>Parent:</Text>
            <Picker
              selectedValue={selectedParentNode}
              onValueChange={(itemValue, itemIndex) => {
                if (itemValue !== undefined) {
                  console.log(itemValue.id);
                }
                setSelectedParentNode(itemValue);
              }}>
              <Picker.Item key={'undefined'} label="None" value={undefined} />
              {flattenedNodes.map((node: TreeDataTypes, index) => {
                return (
                  <Picker.Item
                    key={index}
                    label={node.name as string}
                    value={node}
                  />
                );
              })}
            </Picker>

            <Button title="Submit" onPress={addNode} />
          </View>
        </ScrollView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  treeContainer: {
    flex: 1,
  },
  dropDownStyle: {
    marginBottom: 10,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    flexDirection: 'row', // Use flex layout for buttons
  },
  addButton: {
    padding: 10,
    backgroundColor: '#f5b800',
    borderRadius: 5,
    marginLeft: 10, // Add margin between buttons
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  featureContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  featureInput: {
    flex: 1,
    marginRight: 10,
  },
});

export default OrganizationScreen;
