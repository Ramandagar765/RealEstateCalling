import { AppRegistry, Platform, UIManager } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { LogBox } from 'react-native';
import { Component } from 'react';
import notifee, { EventType } from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import { MyAlert, getStorage, hasValue,  foregroundHandler, requestPermission, setStorage } from './src/Utils';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './src/redux/store';
import NetInfo from "@react-native-community/netinfo";


export default class AppContainer extends Component {
    constructor(props) {
        super(props);
        this.state = { isConnected: true };
        this.foregroundUnsubscribe = null;
        this.backgroundUnSubscribe = null;
        this.unsubscribe = null;
        this.lastHandledNotificationId = null;
        this.lastHandledTimestamp = 0;
    }

    componentDidMount() {
        this.setupApp();
    }

    async setupApp() {
        try {
            this.checkNetwork();
            requestPermission();


            this.foregroundUnsubscribe = notifee.onForegroundEvent(({ type, detail }) => {
                switch (type) {
                    case EventType.DISMISSED:
                        this.handleStorage(detail)
                        break;
                    case EventType.PRESS:
                        // console.log("onForegroundEvent remoteMessage=--=-==-=-=->", detail)
                        this.handleStorage(detail)
                        break;
                }
            });

            this.backgroundUnSubscribe = notifee.onBackgroundEvent(async ({ type, detail }) => {
                switch (type) {
                    case EventType.DISMISSED:
                        // this.handleStorage(detail)
                        console.log("onBackgroundEvent remoteMessage=--=-==-=-=->", detail)
                        break;
                    case EventType.PRESS:
                        console.log("onBackgroundEvent remoteMessage=--=-==-=-=-> PRESS", detail)
                        this.handleStorage(detail)
                        break;
                }
            });

            //foreground state
            this.unsubscribe = messaging().onMessage(async remoteMessage => {
                console.log("foreground remoteMessage-=-=-=-=-=->", remoteMessage)
                // this.handleStorage(detail)
                foregroundHandler(remoteMessage);
            });



            messaging().onNotificationOpenedApp(remoteMessage => {
                // console.log("background remoteMessage-=-=-=-=-=->", remoteMessage)
                this.handleStorage(remoteMessage)
            });

            // Check whether an initial notification is available
            messaging().getInitialNotification().then(remoteMessage => {
                // console.log("initial remoteMessage-=-=-=-=-=->", remoteMessage)
                this.handleStorage(remoteMessage)
            });

            //background state


            // Check whether an initial notification is available


        } catch (error) {
            console.log(error);
        }
    }

    componentWillUnmount() {
        this.unsubscribe();
        this.foregroundUnsubscribe();
    }


    checkNetwork() {
        try {
            return NetInfo.addEventListener(state => {
                if (state.isConnected === false) {
                    MyAlert('Please check your network connection', 'No Internet');
                }
                this.setState({ isConnected: state.isConnected });
            });
        } catch (error) {
            console.error('Error in checkNetwork:', error);
            MyAlert('An error occurred while checking network status', 'Error');
        }
    }



    async handleStorage(detail) {
        try {
            const existingData = await getStorage('notificationData');
            const dataArray = existingData ? JSON.parse(existingData) : [];
            console.log("detail", detail)

            const { body, title, data } = detail?.notification;
            console.log("body", body)
            console.log("title", title)
            if (hasValue(data)) {
                let { image } = data
                dataArray.push({ body, title, image });
            } else {
                dataArray.push({ body, title });
            }
            setStorage('notificationData', JSON.stringify(dataArray));
        } catch (error) {
            console.error('Error while handling storage:', error);
            return null;
        }
    }

    async handleNotification(remoteMessage, source) {
        foregroundHandler(remoteMessage);
        const currentTime = Date.now();
        const notificationId = remoteMessage.messageId || `${remoteMessage.notification.title}_${currentTime}`;

        if (this.lastHandledNotificationId === notificationId && currentTime - this.lastHandledTimestamp < 5000) {
            console.log(`Notification ${notificationId} already handled recently. Skipping.`);
            return;
        }

        this.lastHandledNotificationId = notificationId;
        this.lastHandledTimestamp = currentTime;

        try {
            const existingData = await getStorage('notificationData');
            const dataArray = existingData ? JSON.parse(existingData) : [];

            const { body, title, data } = remoteMessage.notification || {};
            if (body || title) {
                let newNotification = {
                    id: notificationId,
                    body,
                    title,
                    timestamp: currentTime,
                    source
                };
                if (data && data.image) {
                    newNotification.image = data.image;
                }

                // Add or update the notification
                const existingIndex = dataArray.findIndex(item => item.id === notificationId);
                if (existingIndex !== -1) {
                    dataArray[existingIndex] = newNotification;
                } else {
                    dataArray.push(newNotification);
                }
                await setStorage('notificationData', JSON.stringify(dataArray));
                console.log(`Notification stored successfully. Source: ${source}`);
            } else {
                console.log('No valid notification data to store');
            }
        } catch (error) {
            console.error('Error while handling notification:', error);
        }
    }

    render() {
        return (
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <App />
                </PersistGate>
            </Provider>
        );
    }
}


UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
AppRegistry.registerComponent(appName, () => AppContainer);
LogBox.ignoreAllLogs(true)

