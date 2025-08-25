import { View, Text, TouchableOpacity } from 'react-native';
import { L, C, F, WT } from '#/commonStyles/style-layout';

const EmptyDropdown = ({ message, buttonText, onPress }) => {
  return (
    <View style={[L.row, L.aiC, L.jcSB, WT('96%'), L.mT5]}>
      <Text style={[F.fsOne4, C.fcGray]}>{message}</Text>
      <TouchableOpacity 
        style={[L.p8, L.bR5, C.bgPink, WT('40%'), L.aiC, L.jcC]} 
        onPress={onPress}
      >
        <Text style={[F.fsOne4, C.fcWhite]}>{buttonText}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EmptyDropdown;
