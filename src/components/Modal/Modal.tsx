import React, {useContext} from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  Image,
} from 'react-native';
import {Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Feather';
import {IMGEXAMPLE} from '../../assets';
import {ModalContext} from '../../pages/HomeScreen/HomeScreen';

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  image: string;
  desc: string;
}

export const ModalComponent = ({
  visible,
  onClose,
  title,
  desc,
  image,
}: ModalProps) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modal}>
          <TouchableOpacity onPress={onClose} style={styles.modalClose}>
            <Icon name="x" size={30} color="#000" />
          </TouchableOpacity>
          <View height={20} />
          <Text style={{fontSize: 24}}>{title}</Text>
          <View height={16} />
          <Image
            source={{uri: image}}
            style={{
              width: '100%',
              height: 200,
              resizeMode: 'cover',
              borderRadius: 20,
            }}
          />
          <View height={16} />
          <Text style={{fontSize: 16}}>{desc}</Text>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modal: {
    backgroundColor: '#fff',
    flex: 1,
    width: '100%',
    paddingHorizontal: 20,
  },
  modalClose: {
    alignSelf: 'flex-end',
  },
});
