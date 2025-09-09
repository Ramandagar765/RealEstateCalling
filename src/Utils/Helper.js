import { Alert, Dimensions, Linking, Platform, ToastAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import notifee, {AndroidImportance} from '@notifee/react-native';
import RootNavigation from '../navigation/RootNavigation';
export const formatDate2 = (date) => date?.toISOString()?.split('T')[0]

export const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  };
  return date.toLocaleString('en-US', options);
}

export const copyToClipboard = async (text) => {
  
};
 

export const isIOS = Platform.OS === 'ios'
export const isAndroid = Platform.OS === 'android'
export const isNative = isIOS || isAndroid
export const devicePlatform = isIOS ? 'ios' : isAndroid ? 'android' : 'web'

export const getStorage = async key => {
  try {
    const data = await AsyncStorage.getItem(key);
    return JSON.parse(data);
  } catch (error) {
    console.log(error);
  }
};

export const getSelectedFilterCount = (item1, item2, item3, item4) => {
  let count = 0;
  if (hasValue(item1)) {
    count += 1;
  }
  if (hasValue(item2)) {
    count += 1;
  }
  if (hasValue(item3)) {
    count += 1;
  }
  if (hasValue(item4)) {
    count += 1;
  }
  return count;
};

export const multipleMassage = data => {
  try {
    if (hasValue(data) && typeof data === 'object') {
      Object.keys(data).forEach(key => {
        if (Array.isArray(data[key])) {
          const errors = data[key].join('\n');
          MyToast(errors);
        }
      });
    }
  } catch (error) {
    console.error(error);
  }
};

// export const multipleMassage = (data) => {
//   try {
//     if (hasValue(data)) {
//       if (Array.isArray(data) && data.length > 0) {
//         let error = data.join("\n\n");
//         MyToast(error)
//       }
//     }
//   } catch (error) {
//     console.log(error);
//   }
// }

export function extractIntegerPart(inputString) {
  var floatNumber = parseFloat(inputString);
  return Math.round(floatNumber);
}

export const setStorage = async (key, item) => {
  try {
    var jsonOfItem = await AsyncStorage.setItem(key, JSON.stringify(item));
    return jsonOfItem;
  } catch (error) {
    console.log(error);
  }
};

export const clearStorage = async () => {
  await AsyncStorage.clear();
};

export const clearStorageByKey = async key => {
  await AsyncStorage.removeItem(key);
};

export const hasValue = data => {
  return data !== undefined && data !== null && data !== '' && data !== 'undefined';
};

export const hasSpace = data => {
  return data !== undefined && data !== null && data !== '' && data !== 'undefined' && data.trim() !== '';
};

export const openURL = data => {
  try {
    if (hasValue(data)) {
      Linking.openURL(data);
    }
  } catch (error) {
    console.log(error);
  }
};

const email = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
export const IsEmailValid = function (res) {
  return email.test(res);
};

const phone = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
export const IsNumberValid = res => {
  return phone.test(res);
};

export const isUserNameValid = data => {
  try {
    /*
   Usernames can only have:
   - Uppercase Letters (A-Z)
   - Lowercase Letters (a-z)
   - Numbers (0-9)
   - Dots (.)
   - Underscores (_)
 */
    const res = /^[A-Za-z]+$/.exec(data);
    const valid = !!res;
    return valid;
  } catch (error) {
    console.log(error);
  }
};

export const reverseWordsInString = inputString => {
  const words = inputString.split(' ');
  const reversedWords = words.reverse();
  const reversedString = reversedWords.join(' ');

  return reversedString;
};

export const isUserNameValid2 = data => {
  try {
    /*
   Usernames can only have:
   - Lowercase Letters (a-z)
   - Numbers (0-9)
   - Dots (.)
   - Underscores (_)
 */
    const res = /^[a-z0-9_\.]+$/.exec(data);
    const valid = !!res;
    return valid;
  } catch (error) {
    console.log(error);
  }
};

export const MyToast = function (msg) {
  try {
    if (hasValue(msg)) {
      Platform.select({
        ios: () => {
          Alert.alert('' + msg);
        },
        android: () => {
          ToastAndroid.show('' + msg, ToastAndroid.SHORT);
        },
      })();
    }
  } catch (error) {
    console.log(error);
  }
};

export const MyAlert = function (msg, title) {
  try {
    if (hasValue(msg)) {
      Alert.alert(
        hasValue(title) ? title : '',
        msg,
        [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
        { cancelable: true },
      );
    }
  } catch (error) {
    console.log(error);
  }
};

// export const timeCalculator = (live_start_time, live_end_time) => {
//   if (moment(live_start_time).format('hh:mm:ss') == moment(live_end_time).format('hh:mm:ss')) {
//     return "00";
//   }
//   let d = moment.duration(moment(live_end_time, 'YYYY-MM-DD HH:mm:ss').diff(moment(live_start_time, 'YYYY-MM-DD HH:mm:ss'))).asSeconds();
//   d = Number(d);
//   var h = Math.floor(d / 3600);
//   var m = Math.floor(d % 3600 / 60);
//   var s = Math.floor(d % 3600 % 60);
//   var hDisplay = h > 0 ? h + ":" : "00:";
//   var mDisplay = m > 0 ? m + ":" : "00:";
//   var sDisplay = s > 0 ? s : "00";
//   return hDisplay + mDisplay + sDisplay;
// }

// export const timeInSeconds = (live_start_time, live_end_time) => {
//   let seconds = moment.duration(moment(live_end_time, 'YYYY-MM-DD HH:mm:ss').diff(moment(live_start_time, 'YYYY-MM-DD HH:mm:ss'))).asSeconds();
//   return seconds;
// }

export const responseHandler = response => {
  try {
    console.log('response raman', response?.config?.url ?? '' + ' :- ', response);
    if (!hasValue(response)) {
      MyToast('Oops Something went wrong, Please try again');
    } else if (
      response &&
      response.status &&
      (response.status < 200 ||
        response.status >= 300 ||
        response.status >= 400)
    ) {
      if (response.status == 400) {
        // verified account
        if (response?.data?.error ?? '') {
          MyToast(response.data.error);
        } else {
          MyToast(response.data.message);
          multipleMassage(response?.data?.data);
        }
        return 'failure';
      } else if (response.status == 401) {
        // Invalid Api Key
        MyToast(response.data.message);
        if (response?.data?.account_type === 0) {
          RootNavigation.navigate('AccountType');
        }
        // store.dispatch(logout_state());
        return 'failure';
      } else if (response.status == 403) {
        MyToast(response.data.message);
        // RootNavigation.reset('PlanDetails');
        // store.dispatch(logout_state());
        return 'failure';
      } else if (response.status == 402) {
        MyToast(response.data.message);
        return 'failure';
      } else if (response.status == 404) {
        multipleMassage(response.data.data ?? '');
        return 'failure';
      } else if (response.status == 422) {
        multipleMassage(response?.data ?? '');
        return 'failure';
      }

      else if (response.status == 417) {
        let error = '';
        if (response.data && response.data.error) {
          if (
            Array.isArray(response.data.error) &&
            response.data.error.length > 0
          ) {
            error = response.data.error.join('\n\n');
          } else {
            error = response.data.error;
          }
        } else if (response.data && response.data.validation) {
          if (
            Array.isArray(response.data.validation) &&
            response.data.validation.length > 0
          ) {
            error = response.data.validation.join('\n\n');
          } else {
            error = response.data.message;
          }
        } else {
          error = response.data.message;
        }
        if (error) {
          MyToast(error);
          return 'failure';
        }
      } else if (response.status == 403) {
        // Invalid Api Key
        MyToast(response.response.error);
        return 'failure';
      }
      MyToast(response.data.message);
      return response;
    } else {
      let error = '';
      if (response.data && response.data.validation) {
        if (
          Array.isArray(response.data.validation) &&
          response.data.validation.length > 0
        ) {
          error = response.data.validation.join('\n\n');
        }
      }
      if (error) {
        MyToast(error);
      }
      return response;
    }
  } catch (error) {
    console.log('responseHandler error:- ', error);
  }
};

const today = new Date();
const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
let days = [];
export const getDays = () => {
  for (let i = 0; i < 5; i++) {
    const nextDay = new Date(today);
    nextDay.setDate(today.getDate() + i);
    let dayName = dayNames[nextDay.getDay()];
    let date = nextDay.getDate();
    days.push(dayName + ' ' + date);
  }
  return days;
};

// export const dateTime = (data, prev_format, show_format) => {
//   let res = moment(data ? data : new Date(), prev_format).format(show_format ? show_format : 'YYYY-MM-DD HH:mm:ss')
//   if (!hasValue(res)) { res = "" }
//   if (res == 'Invalid date') { res = "" }
//   return res;
// }

export const toFixed = (data, flag) => {
  const num = hasValue(data) ? Number(data) : 0;
  let n = num.toFixed(hasValue(flag) ? flag : 2);
  if (n == 'NaN') {
    n = 0;
  }
  return n == 0.0 ? '0' : n;
};

export const hasWhiteSpace = data => {
  return /\s/g.test(data);
};

export const trimString = data => {
  let result = data.trim();
  return result;
};


export function capitalizeFirstLetter(str) {
  if (typeof str !== 'string' || str.length === 0) {
    return str;
  }
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export const filterItems = (items, searchText) => {
  return items.filter(item =>
    item.name.toLowerCase().includes(searchText.toLowerCase()),
  );
};
export const isValidPassword = (password) => {
  // Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
}


/**
 * Calculates the time elapsed since the given date and returns a formatted string.
 * @param {string} dateString - ISO 8601 formatted date string (e.g., "2023-04-15T10:30:00Z")
 * @returns {string} Formatted time elapsed (e.g., "2d ago", "3w ago", "2mo ago")
 */
export function getTime(dateString) {
  const now = new Date();
  const past = new Date(dateString);
  const diffMs = now - past;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHr / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffSec < 60) return 'just now';
  if (diffMin < 60) return `${diffMin} minutes ago`;
  if (diffHr < 24) return `${diffHr} hours ago`;
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffWeeks < 4) return `${diffWeeks} weeks ago`;
  if (diffMonths < 12) return `${diffMonths} months ago`;
  return `${diffYears} years ago`;
}
export const formatDatepayment = (dateString) => {
  const date = new Date(dateString);

  const options = { month: 'short', day: 'numeric', year: 'numeric' };

  const formattedDate = date.toLocaleString('en-US', options);

  return formattedDate;
};

export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';

  // Add time and force UTC timezone
  const date = new Date(dateString + 'T00:00:00Z');

  const options = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC'
  };

  return date.toLocaleString('en-US', options);
};
export const formatTime = (dateString) => {
  // datestring is "34:12:05" like this
  const date = new Date(dateString);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const amOrPm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  return `${formattedHours}:${formattedMinutes} `;
};



export function formatDate3(dateString) {
  console.log('date string',dateString)
  const date = new Date(dateString);
  const day = date.getDate(); // Get the day of the month
  const month = date.toLocaleString('default', { month: 'short' }); // Get the abbreviated month name
  const year = date.getFullYear(); // Get the full year
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const amOrPm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  // Return the formatted date in the desired format
  return `${day} ${month} ${year} ${formattedHours}:${formattedMinutes} ${amOrPm}`;
}

const formattedDate = formatDate("2025-01-06 21:28:10");
console.log(formattedDate); // Outputs: "6 Jan 2025"


export const getStatusColor = (status, is_background = false) => {
  if (status === 0) return is_background ? '#FFF1D3' : '#D98405';
  if (status === 1) return is_background ? '#FDD4DA' : '#F62947';
  if (status === 2) return is_background ? '#CEF2E3' : '#0AC074';
  if (status === 3) return is_background ? '#E0E3FF' : '#6571FF';
  if (status === 4) return is_background ? '#FDD4DA' : '#F62947';
  if (status === 6) return is_background ? '#CEF2E3' : '#0AC074';
  if (status === 7) return is_background ? '#E0E3FF' : '#6571FF';
  if (status === 8) return is_background ? '#CEF2E3' : '#0AC074';
}

export const reportsFilters = [
  { value: 6, label: 'All' },
  { value: 1, label: 'Today' },
  { value: 2, label: 'Yesterday' },
  { value: 3, label: 'This Week' },
  { value: 4, label: 'This Month' },
  { value: 5, label: 'This Quarter' },
  { value: 6, label: 'This Year' },
];
export const optionFilters = [
  { value: 1, label: '0-30 Days' },
  { value: 2, label: '30-60 Days' },
  { value: 3, label: '60-90 Days' },
];
export const optionQuoteFilters = [
  { value: 0, label: 'Draft' },
  { value: 1, label: 'Converted' },
];

export const statusOptionFilters = [
  { value: 0, label: 'Draft' },
  { value: 1, label: 'Unpaid' },
  { value: 2, label: 'Paid' },
  { value: 3, label: 'Partially Paid' },
  { value: 4, label: 'Overdue' },
];
export const ClientstatusOptionFilters = [
  { value: 1, label: 'Unpaid' },
  { value: 2, label: 'Paid' },
  { value: 3, label: 'Partially Paid' },
  { value: 4, label: 'Overdue' },
];

export const statusOptionTransFilters = [
  { value: 0, label: 'All' },
  { value: 1, label: 'Stripe' },
  { value: 2, label: 'Cash' },
  { value: 3, label: 'Cheque' },
  { value: 4, label: 'Bank Transfer' },
  { value: 5, label: 'Online' },
];


export const getPaymentColor = (status, is_background = false) => {
  if (status === 4) return is_background ? '#FFF1D3' : '#D98405';
  if (status === 6) return is_background ? '#CEF2E3' : '#0AC074';
  if (status === 7) return is_background ? '#E0E3FF' : '#6571FF';
  if (status === 8) return is_background ? '#CCEBFE' : '#0099FB';
}

export const convertStateToFormData = (formData, type) => {
  const formDataToSend = new FormData();
  Object.keys(formData).forEach(key => {
    if (key !== type && formData[key] !== '') {
      formDataToSend.append(key, formData[key]);
    }
  });

  if (formData[type]?.uri) {
    formDataToSend.append(type, {
      uri: formData[type].uri,
      type: formData[type].type || 'image/jpeg',
      name: formData[type].name || 'profile.jpg'
    });
  }

  return formDataToSend;
};


export const convertStateToFormData2 = (formData, type) => {
  const formDataToSend = new FormData();
  Object.keys(formData).forEach(key => {
    if (key !== type && formData[key] !== '') {
      formDataToSend.append(key, formData[key]);
    }
  });

  if (formData[type]?.uri) {
    formDataToSend.append(type, {
      uri: formData[type].uri,
      type: formData[type].type || 'image/jpeg',
      name: formData[type].name || 'profile.jpg'
    });
  }

  return formDataToSend;
};


export const getPosition = (event, width = 0, height = 0) => {
  const { pageX, pageY } = event.nativeEvent;
  const position = {
    x: Math.max(20, Math.min(pageX - 100, Dimensions.get('window').width - width)),
    y: Math.max(20, Math.min(pageY - 20, Dimensions.get('window').height - height))
  };
  return position;
}

 
export const requestPermission = async () => {
  if (Platform.OS === 'android') {
    try {
      const response = await notifee.requestPermission()
      console.log('response', response)
      return response;
    } catch (error) {
      console.log('error', error)
    }
  } else if (Platform.OS == 'ios') {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log("enabled")
      return;
    } else {
      console.log("disabled")
      return;
    }
  }
}
 
 
export const foregroundHandler = async (remoteMessage) => {
  if (Platform.OS == 'ios') {
    const settings = await notifee.requestPermission()
    if (settings.authorizationStatus >= AuthorizationStatus.AUTHORIZED) {
      await notifee.displayNotification({
        title: remoteMessage?.notification?.title,
        body: remoteMessage?.notification?.body,
        ios: {
          critical: true,
          importance: AndroidImportance.HIGH,
        },
        data: remoteMessage.data
      });
    }
  }
  if (Platform.OS == 'android') {
    const channelId = await notifee.createChannel({
      id: remoteMessage?.sentTime?.toString(),
      name: 'Testing',
      sound: "default",
      importance: AndroidImportance.HIGH,
    });

    notifee.displayNotification({
      title: remoteMessage?.notification?.title,
      body: remoteMessage?.notification?.body,
      android: {
        channelId: channelId,
        sound: "default",
        importance: AndroidImportance.HIGH,
        largeIcon: 'ic_launher_round',
      },
      data: remoteMessage.data
    });
  }
}

 

export const successfulOutcomes = [
  { label: 'Interested', value: 'interested' },
  { label: 'Not Interested', value: 'not_interested' },
  { label: 'Deal Closed', value: 'deal_closed' },
];

export const unsuccessfulOutcomes = [
  { label: 'No Answer', value: 'no_answer' },
  { label: 'Failed to Connect', value: 'failed' },
];