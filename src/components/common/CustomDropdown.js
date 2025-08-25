import { C, F, HT, L, normalize, WT } from '#/commonStyles/style-layout';
import  { useRef, useState } from 'react';
import {View,Text,TouchableOpacity,StyleSheet,FlatList,Animated,} from 'react-native';

const CustomDropdown = ({ data, placeholder, value, onSelect, isModalVisible, setModalVisible}) => {
  const currencyItem = data?.filter((item) => item?.id === value); 
  const [selectedItem, setSelectedItem] = useState({
    id: value,
    name: currencyItem[0]?.name || placeholder,
  });
  const dropdownHeight = useRef(new Animated.Value(0)).current;

  const toggleModal = () => {
    if (isModalVisible) {
      Animated.timing(dropdownHeight, {
        toValue: 0,
        duration: 300,
        easing: (t) => t * (2 - t),
        useNativeDriver: false,
      }).start(() => setModalVisible(false));
    } else {
      setModalVisible(true);
      Animated.timing(dropdownHeight, {
        toValue: 150,
        duration: 300,
        easing: (t) => t * (2 - t), // Ease-out function
        useNativeDriver: false,
      }).start();
    }

  };

  const handleItemPress = (item) => {
    setSelectedItem(item);
    onSelect(item);
    toggleModal();
  };


  // console.log(selectedItem)

  return (
    <View>
      <TouchableOpacity style={[styles.dropdown,]} onPress={toggleModal}>
        <Text style={[F.fsOne3, F.ffM, C.fcBlack, WT(normalize(80))]}>
          {selectedItem ? selectedItem?.name : placeholder}
        </Text>
      </TouchableOpacity>

      <Animated.View style={[L.card,C.bgWhite,L.mT10,C.brGray,L.bR5, WT(normalize(95)), { height: dropdownHeight , position:'absolute', top:'80%'}, ]}>
        {
          isModalVisible &&
          <FlatList
          nestedScrollEnabled
            data={data}
            keyExtractor={(item) => item?.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleItemPress(item)}
                style={styles.item}
              >
                <Text style={[F.ffM, F.fsOne3, C.fcBlack]}>{item?.name}</Text>
              </TouchableOpacity>
            )}
          />
        }
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  dropdown: {
    borderWidth: 1,
    borderColor: '#adc6fa',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'white'
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 20,
  },
  item: {
    padding: 10,
  },
  itemText: {
    fontSize: 6,
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#2196F3',
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  maindropdown: {
    overflow: 'hidden', // Hide overflow for smooth animation
    backgroundColor: 'white',
    elevation:2,
    borderRadius: 5,
    marginTop: 10,
    // zIndex:999
  
  },
});

export default CustomDropdown;