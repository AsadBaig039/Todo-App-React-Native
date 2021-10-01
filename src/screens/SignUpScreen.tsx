/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {Colors} from '../res/constants/Colors';
import {Formik} from 'formik';
import * as yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';

const loginValidationSchema = yup.object().shape({
  email: yup
    .string()
    .email('Please enter valid email')
    .required('Email Address is Required'),
  password: yup
    .string()
    .min(8, ({min}) => `Password must be at least ${min} characters`)
    .required('Password is required'),
  name: yup.string().required('Name is Required'),
  age: yup.string().required('Age is Required'),
});

type registerData = {
  name: string;
  email: string;
  password: string;
  age: string;
};

const SignUpScreen = (props: Props) => {
  const navigation = useNavigation();

  const [users, setUsers] = useState([]);
  useEffect(() => {
    const getUsers = async () => {
      let usersFromAsync = await AsyncStorage.getItem('users');
      const staticUser = JSON.parse(usersFromAsync);
      setUsers(staticUser);
    };
    getUsers();
  }, []);

  const _updateUsers = async (data) => {
    try {
      await AsyncStorage.setItem('users', JSON.stringify(data));
    } catch (error) {
      console.log(error);
    }
  };

  const getUsers = async () => {
    let usersFromAsync = await AsyncStorage.getItem('users');
    const staticUser = JSON.parse(usersFromAsync);
    return staticUser;
  };

  const register = async (values: registerData) => {
    console.log('register account');
    const user = {
      name: values.name,
      email: values.email,
      password: values.password,
      age: values.age,
      token: 'qwertasdfgzxcvb',
      userId: Math.floor(Math.random() * 100),
    };

    const updateUsers = [...users, user];
    console.log('update users', updateUsers);
    await setUsers(updateUsers);
    await _updateUsers(updateUsers);
    const getUserToCheck = await getUsers();
    navigation.navigate('Login');
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <Text style={styles.headingText}>Create New Account</Text>
      <Formik
        initialValues={{name: '', email: '', password: '', age: ''}}
        onSubmit={(values) => register(values)}
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
              name="name"
              placeholder="Full Name"
              style={styles.textInput}
              onChangeText={handleChange('name')}
              onBlur={handleBlur('name')}
              value={values.name}
              keyboardType="email-address"
            />
            {errors.name && touched.name && (
              <Text style={styles.errorText}>{errors.name}</Text>
            )}
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
              autoCapitalize="none"
            />
            {errors.password && touched.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}
            <TextInput
              name="age"
              placeholder="Age"
              style={styles.textInput}
              onChangeText={handleChange('age')}
              onBlur={handleBlur('age')}
              value={values.age}
              keyboardType="email-address"
            />
            {errors.age && touched.age && (
              <Text style={styles.errorText}>{errors.age}</Text>
            )}
            <TouchableOpacity onPress={handleSubmit} style={styles.buttonStyle}>
              <Text style={styles.buttonText}>SignUp</Text>
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
    paddingTop: 30,
    paddingHorizontal: 30,
  },
  headingText: {
    fontSize: 18,
    marginVertical: 20,
    fontWeight: 'bold',
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

  // inputContainer: {
  //   width: 300,
  // },
  // registerButton: {
  //   backgroundColor: Colors.primary,
  // },
  // registerButtonContainer: {
  //   width: 250,
  //   marginTop: 10,
  // },
});

export default SignUpScreen;

// chnaged code

/* <View style={styles.inputContainer}>
        <Input
          placeholder="Full Name"
          autoFocus
          value={name}
          onChangeText={(text) => setName(text)}
        />
        <Input
          placeholder="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <Input
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
        <Input
          placeholder="Age"
          value={age}
          keyboardType="numeric"
          maxLength={2}
          onChangeText={(text) => setAge(text)}
        />
      </View>
      <Button
        buttonStyle={styles.registerButton}
        raised
        title="Register"
        onPress={register}
        containerStyle={styles.registerButtonContainer}
      /> */
