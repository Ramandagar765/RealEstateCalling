import * as React from 'react';
import {StackActions} from '@react-navigation/native';

export const navigationRef = React.createRef();

export function navigate(name, params) {
  navigationRef.current?.navigate(name, params);
}

export function replace(name, params) {
  navigationRef.current.dispatch(StackActions.replace(name, params));
}

export function goBack() {
  navigationRef.current?.goBack();
}

export function reset(routeName, params) {
  navigationRef.current?.reset({
    index: 0,
    routes: [{name: routeName, params}],
  });
}

export function pop(count = 1) {
  navigationRef.current?.dispatch(StackActions.pop(count));
}

export default {navigate, replace, goBack, reset, pop};
