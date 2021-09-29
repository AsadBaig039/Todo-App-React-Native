/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useLayoutEffect, useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Colors} from '../res/constants/Colors';
import {Avatar} from 'react-native-elements';
import {useNavigation} from '@react-navigation/native';
import {getData, clearByKey} from '../utils/AsyncStorageMethods/index';
import Icon from 'react-native-vector-icons/Ionicons';
import {useRoute} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Props {
  user: object;
}

const ProfileScreen = (props: Props) => {
  const navigation = useNavigation();
  const route = useRoute();

  const [user, setUser] = useState();
  console.log('user', user);

  const logout = async () => {
    await clearByKey('userToken');
    await clearByKey('loggedInUser');
    navigation.reset({
      index: 0,
      routes: [{name: 'Login'}],
    });
  };

  useEffect(() => {
    const storage = async () => {
      let getUser = await AsyncStorage.getItem('loggedInUser');
      setUser(JSON.parse(getUser));
    };
    storage();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Profile',
      headerTitleAlign: 'center',
      headerStyle: {backgroundColor: '#fff'},
      headerTitleStyle: {color: Colors.primary, marginLeft: 100, fontSize: 14},
      headerTintColor: 'black',
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={0.5}
        >
          <Icon name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity activeOpacity={0.5} onPress={() => logout()}>
          <Text style={styles.logoutTextHeader}>Logout</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);
  return (
    <View style={styles.container}>
      <Avatar
        containerStyle={styles.avatarContainer}
        size="xlarge"
        rounded
        source={{
          uri: 'https://res.cloudinary.com/dzcdsqxkb/image/upload/v1632898279/profile_ysn3ox.jpg',
        }}
      />
      <TouchableOpacity>
        <Text style={styles.editProfile}>Edit Profile</Text>
      </TouchableOpacity>
      {user && (
        <View>
          <View style={styles.rowContainer}>
            <Text>Name</Text>
            <Text>{user.name}</Text>
          </View>
          <View style={styles.rowContainer}>
            <Text>Email</Text>
            <Text>{user.email}</Text>
          </View>
          <View style={styles.rowContainer}>
            <Text>Age</Text>
            <Text>{user.age}</Text>
          </View>
        </View>
      )}

      {/* <TouchableOpacity style={styles.logoutButton}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingVertical: 20,
    paddingHorizontal: 30,
  },
  avatarContainer: {
    marginVertical: 20,
    alignSelf: 'center',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    marginVertical: 10,
    paddingVertical: 10,
    borderRadius: 10,
    paddingHorizontal: 20,
    borderColor: Colors.MediumGrey,
  },
  editProfile: {
    color: '#87CEEB',
    textAlign: 'center',
  },
  logoutButton: {
    width: '100%',
    paddingVertical: 10,
    backgroundColor: 'red',
    bottom: 0,
    position: 'absolute',
    alignSelf: 'center',
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 20,
  },
  logoutText: {
    color: Colors.white,
    fontWeight: 'bold',
  },
  logoutTextHeader: {
    color: 'red',
  },
});

export default ProfileScreen;
