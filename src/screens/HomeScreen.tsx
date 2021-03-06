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
  Keyboard,
} from 'react-native';
import {Colors} from '../res/constants/Colors';

import {useNavigation} from '@react-navigation/native';
import {Button} from 'react-native-elements';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontIsto from 'react-native-vector-icons/Fontisto';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Props {
  userToken: string;
}

const HomeScreen = (props: Props) => {
  const navigation = useNavigation();
  const [keyboardStatus, setKeyboardStatus] = useState(undefined);
  console.log('keyboard status', keyboardStatus);
  const [showUpdate, setShowUpdate] = useState(false);
  const [toUpdate, setToUpdate] = useState();

  const getDate = new Date();
  const date = getDate.toLocaleDateString('en-US');

  const [description, setDescription] = useState('');
  const [userData, setUserData] = useState([]);
  const [user, setUser] = useState();
  // console.log('user Data State', userData);
  // console.log('logged in user', user);

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardStatus('on');
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardStatus('off');
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const keyBoardCaseStyle = {
    bottom: keyboardStatus === 'on' && Platform.OS === 'ios' ? 90 : 0,
  };

  useEffect(() => {
    const storage = async () => {
      let currentUser = await AsyncStorage.getItem('loggedInUser');
      setUser(JSON.parse(currentUser));
    };
    storage();
  }, []);

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

        setUserData(data);
        // console.log('inside _retrieve func', data);
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
    _storeData(updateTasks);
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
    _storeData(newMarkers);
    console.log(newMarkers);
  };

  const updateTask = () => {
    let newMarkers = userData.map((el) =>
      el.taskId === toUpdate.taskId ? {...el, body: description} : el,
    );
    setUserData(newMarkers);
    _storeData(newMarkers);
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
        userId: user.userId,
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

  const userTasks = userData.filter((task) => task.userId === user.userId);
  console.log('userTasks', userTasks);
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      style={styles.container}
    >
      <SafeAreaView style={styles.container}>
        <ScrollView style={{paddingHorizontal: 20}}>
          {userTasks?.map((e, index) => {
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

        <View style={[styles.textInputContainer, keyBoardCaseStyle]}>
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
    paddingVertical: 10,
  },
  textInput: {
    width: '80%',
    paddingVertical: Platform.OS === 'android' ? 5 : 10,
    backgroundColor: Colors.light,
    borderRadius: 20,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  textInputContainer: {
    paddingTop: 5,
    paddingHorizontal: 30,
    width: '100%',
    backgroundColor: Colors.white,
    borderRadius: 20,
    alignSelf: 'center',
    flexDirection: 'row',
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
