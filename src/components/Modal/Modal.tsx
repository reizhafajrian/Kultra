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
import {ModalContext} from '../../pages/HomeScreen';

interface ModalProps {
  visible: boolean;
  children: React.ReactNode;
  onClose: () => void;
}

export const ModalComponent = ({visible, children, onClose}: ModalProps) => {
  const context = useContext(ModalContext);

  const closeModal = () => {
    context.modal(false);
  };
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
          <Text style={{fontSize: 24}}>
            Begini Lho Sejarah Lahirnya Sate Hingga Jadi Makanan Nasional
            Indonesia
          </Text>
          <View height={16} />
          <Image
            source={IMGEXAMPLE}
            style={{width: '100%', height: 200, resizeMode: 'cover'}}
          />
          <View height={16} />
          <Text style={{fontSize: 16}}>
            Sate beserta bumbu kacangnya kini tak lagi hanya dimiliki Indonesia.
            Meskipun Indonesia tercatat sebagai negara yang memiliki hak paten
            atas sate, beberapa negara tetangga juga mengandalkan sate sebagai
            kuliner penarik wisatawan dari seluruh dunia. Terciptanya sate
            banyak dipengaruhi oleh kuliner Indonesia, Malaysia dan Thailand.
            Tetapi sate aslinya berasal dari pulau Jawa yang awalnya hanya
            disajikan dengan bumbu kacang. Sate juga lumrah ditemukan di
            Singapura, Brunei Darussalam, Malaysia, Timor Leste, Filipina dan
            bahkan Belanda. Hanya saja resep aslinya sudah dimodifikasi sesuai
            dengan selera lokal.
          </Text>
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
