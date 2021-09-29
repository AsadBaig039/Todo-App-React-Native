import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeData = async (key: string, value: string) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    console.log(`Error while storing ${key} in Async Storage`);
  }
};

export const storeUsers = async (key: string, value: Array<object>) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    console.log(`Error while storing ${key} in Async Storage`);
  }
};

export const getData = async (key: string) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    console.log(`Value from Key: ${key} is ${jsonValue}`);
    return jsonValue != null ? jsonValue : null;
  } catch (e) {
    console.log(`Error while reading ${key} from Async Storage`);
  }
};

export const clearAll = async () => {
  try {
    await AsyncStorage.clear();
  } catch (e) {
    // clear error
  }

  console.log('Done.');
};

export const clearByKey = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (exception) {
    return false;
  }
};

// //Storing AuthToken
// export const storeAuthToken = (token: string) => {
//   storeData('userToken', token);
// };

// //Retrieving AuthToken
// export const retrieveAuthToken = async tokenHandler => {
//   const token = await getData('userToken');

//   setTimeout(() => {
//     tokenHandler(token);
//   }, 500);
// };
