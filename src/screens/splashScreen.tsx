import React, {useEffect, useState} from 'react';
import {View, Text, ActivityIndicator, StyleSheet} from 'react-native';
import {getData, storeUsers} from '../utils/AsyncStorageMethods/index';
import {useNavigation} from '@react-navigation/native';
import {Users} from '../res/users';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Colors} from '../res/constants/Colors';

const splashScreen = (props: Props) => {
  const [users, setUsers] = useState([]);
  const navigation = useNavigation();

  const staticUsers = async () => {
    await storeUsers('users', Users);
  };

  useEffect(() => {
    const storage = async () => {
      let token = await AsyncStorage.getItem('userToken');
      console.log('token', token);
      if (token && token != null) {
        navigation.reset({
          index: 0,
          routes: [{name: 'Home'}],
        });
      }
      if (token === null) {
        navigation.reset({
          index: 0,
          routes: [{name: 'Login'}],
        });
      }
    };
    staticUsers();
    storage();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
  },
});

export default splashScreen;
