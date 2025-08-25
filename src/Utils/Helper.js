import { Alert, Dimensions, Linking, Platform, ToastAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import messaging from '@react-native-firebase/messaging';
// import notifee, {AndroidImportance} from '@notifee/react-native';
import RootNavigation from '../navigation/RootNavigation';
import { store } from '#/redux/store';


// import ReactNativeBlobUtil from 'react-native-blob-util';

import { Clipboard } from 'react-native';
// import RNClipboard from '@react-native-clipboard/clipboard'
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

// ... existing imports and functions ...

/**
 * Saves base64 encoded data as a file and opens it.
 * @param {string} base64Data - The base64 encoded file data.
 * @param {string} fileName - The name to give the file (including extension).
 * @param {string} mimeType - The MIME type of the file (e.g., 'application/pdf' for PDFs).
 * @returns {Promise<string>} A promise that resolves with the path to the saved file.
 */
export const saveAndOpenFile = async (base64Data, fileName, mimeType) => {

  // try {
  //   const { fs } = ReactNativeBlobUtil;
  //   let downloadDir = fs?.dirs?.DownloadDir;
  //   if (Platform.OS === 'ios') { downloadDir = fs?.dirs?.DocumentDir }
  //   const filePath = `${downloadDir}/${fileName}`;
  //   await fs.writeFile(filePath, base64Data, 'base64');
  //   console.log('File saved to:', filePath);
  //   if (Platform.OS === 'ios') {
  //     await RNFetchBlob.ios.previewDocument(filePath);
  //   } else {
  //     await RNFetchBlob.android.actionViewIntent(filePath, mimeType);
  //   }

  //   return filePath;
  // } catch (error) {
  //   console.error('Error saving or opening file:', error);
  //   throw error;
  // }
};

// ... rest of the existing code ...



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
        RootNavigation.reset('PlanDetails');
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
  const date = new Date(dateString);
  const day = date.getDate(); // Get the day of the month
  const month = date.toLocaleString('default', { month: 'short' }); // Get the abbreviated month name
  const year = date.getFullYear(); // Get the full year

  // Return the formatted date in the desired format
  return `${day} ${month} ${year}`;
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

export const upcoming_features = [
  'AI ACCOUNTING',
  'PROJECT MANAGEMENT WITH AI',
  'TEAM MANAGEMENT',
  'PROPOSAL WRITING WITH AI',
  'PAYMENT PROCESSING',
  'AI BUSINESS INSIGHTS',
  'TIME TRACKING',
]



export const getcurrency = (currency, currencies) => {
  const currency_data = currencies?.find((item) => {
    return item.id == currency
  });
  return currency_data?.icon
}
export const getCountryCodeFromIP = async () => {
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    console.log(data);
    return data.country_code;
  } catch (error) {
    console.error('Error fetching location:', error);
    return 'IN';
  }
};

export const mapCountryCodeToCurrency = (countryCode) => {
  const currencyMap = {
    US: 'USD',
    IN: 'INR',
    EU: 'EUR',
    AE: 'AED',
    GB: 'GBP',
    CA: 'CAD',
    KE: 'KES',
    CH: 'CHF',
    AU: 'AUD',
    JP: 'JPY'
  };
  return currencyMap[countryCode] || 'INR';
};

export const extractNumberFromSerial = (serialString) => {
  if (!serialString) return 0;
  if (!isNaN(serialString)) {
    return parseInt(serialString);
  }

  const patterns = [
    /-(\d+)-/,           // matches -123-
    /-(\d+)(?!.*-)/,     // matches -123 at the end
    /^(\d+)-/,           // matches 123- at start
    /(\d+)/              // matches any number
  ];

  for (const pattern of patterns) {
    const matches = serialString.match(pattern);
    if (matches) {
      return parseInt(matches[1]);
    }
  }

  return serialString;
};



export const openDoucment = async (actualFilePath) => {
  // await new Promise(resolve => setTimeout(resolve, 500));
  // try {
  //   await ReactNativeBlobUtil.ios.previewDocument(actualFilePath);
  //   console.log('PDF preview opened successfully');
  // } catch (previewError) {
  //   console.log('previewDocument failed:', previewError);
  //   try {
  //     await ReactNativeBlobUtil.ios.openDocument(actualFilePath);
  //     console.log('PDF opened with openDocument');
  //   } catch (openError) {
  //     console.log('openDocument failed:', openError);
  //     const fileExists = await ReactNativeBlobUtil.fs.exists(actualFilePath);
  //     console.log('File exists:', fileExists);

  //     if (fileExists) {
  //       Alert.alert(
  //         'PDF Downloaded',
  //         `Invoice has been saved successfully.\n\nLocation: Documents/${fileName}`,
  //         [
  //           { text: 'OK', style: 'default' },
  //           {
  //             text: 'Open Files App',
  //             onPress: () => {
  //               // This will open iOS Files app
  //               Linking.openURL('shareddocuments://')
  //                 .catch(() => {
  //                   // Fallback - try to open with file URL
  //                   Linking.openURL(`file://${actualFilePath}`)
  //                     .catch(err => console.log('Could not open file:', err));
  //                 });
  //             }
  //           }
  //         ]
  //       );
  //     } else {
  //       throw new Error('File was not saved properly');
  //     }
  //   }
  // }
}

export const configOptions = async (fileName) => {
  // const { fs } = ReactNativeBlobUtil;
  // let downloadConfig;
  // let filePath;
  // if (Platform.OS === 'ios') {
  //   filePath = `${fs.dirs.DocumentDir}/${fileName}`;
  //   downloadConfig = {
  //     fileCache: true,
  //     path: filePath,
  //   };
  //   return downloadConfig
  // } else {
  //   filePath = `/storage/emulated/0/Download/${fileName}`;
  //   downloadConfig = {
  //     fileCache: true,
  //     addAndroidDownloads: {
  //       useDownloadManager: true,
  //       notification: true,
  //       path: filePath,
  //       description: 'Downloading Invoice PDF',
  //       mime: 'application/pdf',
  //     },
  //   };
  //   return downloadConfig    
  // }
}


export const ErrorMessage = 'Oops Something went wrong, Please try again'

/**
 * Formats date according to the selected date format from settings
 * @param {Date|string} date - The date to format (can be Date object or string)
 * @param {string} dateFormat - The date format from settings (e.g., 'Y-m-d', 'd-m-Y', etc.)
 * @returns {string} Formatted date string
 */
export const formatDateBySettings = (date, dateFormat) => {
  if (!date) return '';
  
  // Convert to Date object if it's a string
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Check if date is valid
  if (isNaN(dateObj.getTime())) return '';
  
  // Get date components
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  
  // Format according to dateFormat setting
  switch (dateFormat) {
    case 'Y-m-d':
      return `${year}-${month}-${day}`;
    case 'Y.m.d':
      return `${year}.${month}.${day}`;
    case 'Y/m/d':
      return `${year}/${month}/${day}`;
    case 'd-m-Y':
      return `${day}-${month}-${year}`;
    case 'd.m.Y':
      return `${day}.${month}.${year}`;
    case 'd/m/Y':
      return `${day}/${month}/${year}`;
    case 'm-d-Y':
      return `${month}-${day}-${year}`;
    case 'm.d.Y':
      return `${month}.${day}.${year}`;
    case 'm/d/Y':
      return `${month}/${day}/${year}`;
    default:
      // Default to Y-m-d format if no valid format is provided
      return `${year}-${month}-${day}`;
  }
};

/**
 * Converts a date string from any format back to ISO format (YYYY-MM-DD) for backend
 * @param {string} dateString - The formatted date string
 * @param {string} dateFormat - The date format that was used to create the string
 * @returns {string} Date in ISO format (YYYY-MM-DD)
 */
export const convertFormattedDateToISO = (dateString, dateFormat) => {
  if (!dateString || !dateFormat) return '';
  
  let year, month, day;
  
  // Split the date string based on the separator used in the format
  let separator = '-';
  if (dateFormat.includes('.')) separator = '.';
  else if (dateFormat.includes('/')) separator = '/';
  
  const parts = dateString.split(separator);
  
  if (parts.length !== 3) return '';
  
  // Parse according to the format
  switch (dateFormat) {
    case 'Y-m-d':
    case 'Y.m.d':
    case 'Y/m/d':
      [year, month, day] = parts;
      break;
    case 'd-m-Y':
    case 'd.m.Y':
    case 'd/m/Y':
      [day, month, year] = parts;
      break;
    case 'm-d-Y':
    case 'm.d.Y':
    case 'm/d/Y':
      [month, day, year] = parts;
      break;
    default:
      return '';
  }
  
  // Ensure proper padding
  month = String(month).padStart(2, '0');
  day = String(day).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};


export const date_format = () => {
  return store?.getState()?.settings?.settings_data?.defaultSetting?.settings?.date_format;
}


export const quickActions = [
  {
    id: 5,
    label: 'Create invoice for new user Abc abc@example.com, items image 2000, art 3000',
    query: 'Create invoice for new user Abc abc@example.com, items image 2000, art 3000'
},
  {
      id: 1,
      label: 'overdue invoices',
      query: 'overdue invoices'
  },
  {
      id: 2,
      label: 'paid invoices',
      query: 'paid invoices'
  },
  {
      id: 3,
      label: 'unpaid invoices',
      query: 'unpaid invoices'
  },
  {
      id: 4,
      label: 'What is my last 12 months revenue',
      query: 'What is my last 12 months revenue'
  },
 
];