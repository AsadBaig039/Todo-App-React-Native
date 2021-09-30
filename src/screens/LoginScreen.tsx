import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  TextInput,
  Text,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {Button, Input} from 'react-native-elements';
import {useNavigation} from '@react-navigation/native';
import {Formik} from 'formik';
import * as yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {Colors} from '../res/constants/Colors';
import {doPost} from '../utils/AxiosMethods/index';
import {storeData, getData} from '../utils/AsyncStorageMethods/index';
import {Users} from '../res/users';

const loginValidationSchema = yup.object().shape({
  email: yup
    .string()
    .email('Please enter valid email')
    .required('Email Address is Required'),
  password: yup
    .string()
    .min(8, ({min}) => `Password must be at least ${min} characters`)
    .required('Password is required'),
});

interface Props {
  email: string;
  password: string;
  credentials: Object;
}

interface User {
  name: string;
  email: string;
  password: string;
  age: string;
}

const LoginScreen = (props: Props) => {
  const navigation = useNavigation();

  const [users, setUsers] = useState([]);
  console.log(users);

  type loginResponse = {
    token: string;
    data: object;
  };

  type credentials = {
    email: string;
    password: string;
  };

  useEffect(() => {
    const getUsers = async () => {
      let users = await AsyncStorage.getItem('users');
      const staticUser = JSON.parse(users);
      setUsers(staticUser);
    };
    getUsers();
  }, [navigation]);

  // const getUsers = async () => {
  //   const staticUsers = await getData('users');
  //   if (staticUsers) {
  //     setUsers(staticUsers);
  //   }
  //   return;
  // };

  // useEffect(() => {
  //   getUsers();
  // }, []);

  const Login = async (values: credentials) => {
    const credentials = {
      email: values.email,
      password: values.password,
    };

    const filterUser = users.filter((e) => e.email === credentials.email);
    if (
      filterUser[0]?.email === credentials.email &&
      filterUser[0]?.password === credentials.password
    ) {
      storeData('userToken', filterUser[0].token);
      storeData('loggedInUser', filterUser[0]);
      navigation.reset({
        index: 0,
        routes: [{name: 'Home', params: {user: filterUser[0]}}],
      });
    }
    if (filterUser.length === 0) {
      alert('User not found');
    }
    // const response = await doPost('/user/login', credentials);
    // console.log(response);
    // const {token} = response;
    // if (token) {
    //   storeData('userToken', response.token);
    //   navigation.reset({
    //     index: 0,
    //     routes: [{name: 'Home'}],
    //   });
    // }
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <Formik
        initialValues={{email: '', password: ''}}
        onSubmit={(values) => Login(values)}
        validationSchema={loginValidationSchema}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <>
            <TextInput
              name="email"
              placeholder="Email Address"
              style={styles.textInput}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {errors.email && touched.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}

            <TextInput
              name="password"
              placeholder="Password"
              style={styles.textInput}
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
              secureTextEntry
            />
            {errors.password && touched.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}
            <TouchableOpacity onPress={handleSubmit} style={styles.buttonStyle}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('SignUp')}
              style={styles.buttonStyle}
            >
              <Text style={styles.buttonText}>Signup</Text>
            </TouchableOpacity>
          </>
        )}
      </Formik>
    </KeyboardAvoidingView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 100,
    paddingHorizontal: 40,
  },

  textInput: {
    width: '100%',
    paddingVertical: Platform.OS === 'android' ? 5 : 10,
    borderWidth: 1,
    borderColor: Colors.primary,
    backgroundColor: Colors.white,
    borderRadius: 10,
    paddingHorizontal: 20,
    marginVertical: 10,
  },

  buttonStyle: {
    width: 150,
    borderRadius: 20,
    marginTop: 20,
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    alignItems: 'center',
    alignSelf: 'center',
  },

  errorText: {
    fontSize: 10,
    color: 'red',
  },
  buttonText: {
    color: Colors.white,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
