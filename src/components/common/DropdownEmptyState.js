import { View, Text, Pressable } from 'react-native';
import { L, C, F } from '#/commonStyles/style-layout';
import { hasValue } from '#/Utils';

const DropdownEmptyState = ({
  buttonText,
  message,
  onPress,
  buttonStyle,
  messageStyle,
  containerStyle
}) => {
  return (
    <View style={[containerStyle]}>
      {onPress && <Pressable 
        style={[C.bgGreen, L.aiC, L.p3, L.bR5, L.mH5, buttonStyle]} 
        onPress={onPress}
      >
        <Text 
          style={[F.fsOne5, C.fcWhite, F.fsOne3, L.bR5, L.pH2, L.pV2, F.ffS, L.pH5]}
          numberOfLines={1}
        >
          {buttonText}
        </Text>
      </Pressable>}
      {hasValue(message) && <Text style={[F.fsOne8, C.fcGray, F.ffM, F.fsOne4, L.m10, messageStyle]}>
        {message}
      </Text>}
    </View>
  );
};

export default DropdownEmptyState;
