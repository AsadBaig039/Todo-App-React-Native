import React from 'react';
import {
  Button,
  TextInput,
  View,
  StyleSheet,
  SafeAreaView,
  Text,
  TouchableOpacity,
} from 'react-native';
import {Formik} from 'formik';
import {Colors} from '../res/constants/Colors';
import * as yup from 'yup';

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

interface Props {}

const FormTest = (props: Props) => {
  return (
    <SafeAreaView style={styles.container}>
      <Formik
        initialValues={{email: '', password: ''}}
        onSubmit={(values) => console.log(values)}
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
          </>
        )}
      </Formik>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: 40,
  },

  textInput: {
    width: '100%',
    paddingVertical: 10,
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

export default FormTest;
