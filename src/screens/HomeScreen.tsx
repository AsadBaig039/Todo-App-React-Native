import React, {useState, useEffect, useLayoutEffect} from 'react';
import {
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {Colors} from '../res/constants/Colors';
import {
  getData,
  storeData,
  clearByKey,
} from '../utils/AsyncStorageMethods/index';
import {useNavigation} from '@react-navigation/native';
import {Button} from 'react-native-elements';
import {doPost, doPostWithToken} from '../utils/AxiosMethods';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontIsto from 'react-native-vector-icons/Fontisto';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import AsyncStorage from '@react-native-async-storage/async-storage';

// import {useRoute} from '@react-navigation/native';
// var axios = require('axios').default;

interface Props {
  userToken: string;
}

const HomeScreen = (props: Props) => {
  const navigation = useNavigation();
  const [showUpdate, setShowUpdate] = useState(false);
  const [toUpdate, setToUpdate] = useState();

  const getDate = new Date();
  const date = getDate.toLocaleDateString('en-US');

  const [description, setDescription] = useState('');
  const [userData, setUserData] = useState([]);
  console.log('user Data State', userData);

  const _storeData = async (data) => {
    try {
      await AsyncStorage.setItem('userData', JSON.stringify(data));
    } catch (error) {
      console.log(error);
    }
    _retrieveData();
  };

  const _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('userData');
      if (value !== null) {
        const data = JSON.parse(value);
        //setUserData(data);
        console.log('inside _retrieve func', data);
      }
    } catch (error) {
      // Error retrieving data
    }
  };

  useEffect(() => {
    _retrieveData();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Home',
      headerTitleAlign: 'center',
      headerStyle: {backgroundColor: '#fff'},
      headerTitleStyle: {color: Colors.primary, marginLeft: 100, fontSize: 14},
      headerTintColor: 'black',
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate('Profile')}
          activeOpacity={0.5}
        >
          <SimpleLineIcons name="user" size={24} color="black" />
        </TouchableOpacity>
      ),
      // headerRight: () => (
      //   <TouchableOpacity activeOpacity={0.5} onPress={() => logout()}>
      //     <Text style={styles.logoutText}>Logout</Text>
      //     {/* <SimpleLineIcons name="pencil" size={24} color="black" /> */}
      //   </TouchableOpacity>
      // ),
    });
  }, [navigation]);

  const deleteItem = (id: string) => {
    const updateTasks = userData.filter((task) => task.taskId !== id);
    console.log(updateTasks);
    setUserData(updateTasks);
    _storeData('userData', updateTasks);
  };

  const editItem = (task: string) => {
    console.log('Task', task);
    setShowUpdate(true);
    setDescription(task.body);
    setToUpdate(task);
  };

  const markCompleted = (item: object) => {
    let newMarkers = userData.map((el) =>
      el.taskId === item.taskId ? {...el, completed: true} : el,
    );
    setUserData(newMarkers);
    console.log(newMarkers);
  };

  const updateTask = () => {
    let newMarkers = userData.map((el) =>
      el.taskId === toUpdate.taskId ? {...el, body: description} : el,
    );
    setUserData(newMarkers);
    setDescription('');
    setShowUpdate(false);
  };

  const AddTask = async () => {
    setDescription('');
    fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      body: JSON.stringify({
        title: 'Todo',
        body: description,
        userId: '123321',
        createdDate: date,
        completed: false,
        taskId: Math.floor(Math.random() * 10),
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((response) => response.json())
      .then((json) => {
        // console.log(json);
        const updateData = [...userData, json];
        setUserData(updateData);
        _storeData(updateData);
      });
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      style={styles.container}
    >
      <SafeAreaView style={styles.container}>
        <ScrollView>
          {userData?.map((e, index) => {
            return (
              <View style={styles.listItemCard} key={index}>
                <View style={styles.body}>
                  <Text style={styles.descriptionText}>{e.body}</Text>

                  <View style={styles.extraInfo}>
                    <FontIsto name="date" size={20} color={Colors.white} />
                    <Text style={styles.dateText}>{e.createdDate}</Text>
                  </View>
                  <View style={styles.taskComplete}>
                    {e.completed && (
                      <View style={styles.completedTag}>
                        <Text style={styles.completedText}>Completed</Text>
                      </View>
                    )}

                    {/* <FontAwesome5 name="tasks" size={20} color={Colors.white} />
                {e.completed ? (
                  <MaterialIcons
                    name="done-outline"
                    size={20}
                    color={Colors.white}
                  />
                ) : (
                  <Entypo name="cross" size={20} color={Colors.white} />
                )} */}
                  </View>
                </View>
                <View style={styles.edit}>
                  <TouchableOpacity onPress={() => markCompleted(e)}>
                    <MaterialIcons name="done" color={Colors.white} size={20} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => editItem(e)}>
                    <FontAwesome5 name="edit" color={Colors.white} size={20} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => deleteItem(e.taskId)}>
                    <MaterialCommunityIcon
                      name="delete"
                      color={Colors.white}
                      size={20}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </ScrollView>

        <View style={styles.textInputContainer}>
          <TextInput
            placeholder="Write task here"
            onChangeText={(text) => setDescription(text)}
            style={styles.textInput}
            value={description}
          />
          {showUpdate ? (
            <Button
              containerStyle={styles.addTaskButton}
              title=" Update"
              titleStyle={styles.addTaskTitle}
              onPress={() => updateTask()}
            />
          ) : (
            <Button
              containerStyle={styles.addTaskButton}
              title="Add Task"
              titleStyle={styles.addTaskTitle}
              onPress={() => AddTask()}
            />
          )}
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
  },
  textInput: {
    width: '80%',
    paddingVertical: 10,
    backgroundColor: Colors.light,
    borderRadius: 20,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  textInputContainer: {
    paddingTop: 20,
    width: '100%',
    backgroundColor: Colors.white,
    borderRadius: 20,
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 30 : 30,
    alignSelf: 'center',
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  addTaskButton: {
    width: 80,
    borderRadius: 20,
    alignSelf: 'center',
    marginLeft: 10,
  },
  addTaskTitle: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  logoutText: {
    color: 'red',
  },
  listItemCard: {
    width: '100%',
    backgroundColor: '#006D77',
    alignSelf: 'center',
    marginVertical: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    flexDirection: 'row',
  },
  descriptionText: {
    color: Colors.white,
    fontSize: 15,
  },
  body: {
    width: '70%',
    paddingHorizontal: 10,
  },
  edit: {
    width: '30%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  extraInfo: {
    flexDirection: 'row',
    marginTop: 10,
  },
  dateText: {
    color: Colors.white,
    fontSize: 12,
    alignSelf: 'center',
    marginLeft: 5,
  },
  taskComplete: {
    flexDirection: 'row',
    marginTop: 5,
  },
  completedTag: {
    width: 80,
    borderRadius: 10,
    paddingHorizontal: 5,
    backgroundColor: 'green',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },

  completedText: {
    fontSize: 10,
    color: Colors.white,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
