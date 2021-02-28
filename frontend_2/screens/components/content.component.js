import React from 'react';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { SafeAreaView, View, TouchableOpacity, Modal } from 'react-native';
import { useTheme, Card } from '@ui-kitten/components';
import { ThemeContext } from '../../theme-context';
import { styles } from './content.styles';

const blueColor = '#006FD6';

export const ViewableArea = ({ children }) => {

  const statusBarHeight = getStatusBarHeight();
  const theme = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: blueColor}}>
      <SafeAreaView style={{flex: 1, marginTop:statusBarHeight}}>
        {children}
      </SafeAreaView>
      <SafeAreaView style={{backgroundColor:theme['background-basic-color-1']}}/>
    </View>
 );
};

export const BlueViewableArea = ({ children }) => {

  const statusBarHeight = getStatusBarHeight();

  return (
    <View style={{flex: 1, backgroundColor:blueColor}}>
      <SafeAreaView style={{flex: 1, backgroundColor:blueColor, marginTop:statusBarHeight}}>
        {children}
      </SafeAreaView>
    </View>
 );
};

export const ContentContainer = ({ children }) => {

  const theme = useTheme();

  return (
    <View style={{flex: 1,justifyContent:'flex-start',flexDirection:'column',backgroundColor:theme['background-basic-color-1']}}>
      {children}
    </View>
 );
};

export const ModalContainer = ({ children, ...props }) => {

  const statusBarHeight = getStatusBarHeight();
  const theme = useTheme();

  return (
    <Modal
      animationType='slide'
      visible={props.visible}
    >
      <View style={{flex: 1, backgroundColor:theme['background-basic-color-1']}}>
        <SafeAreaView
          style={{
            flex: 1,
            flexDirection:'column',
            justifyContent:'space-between',
            backgroundColor:theme['background-basic-color-1'],
            marginTop:statusBarHeight,margin:20
          }}
        >
          {children}
        </SafeAreaView>
      </View>
    </Modal>
 );
};

export const PopUpContainer = ({ children, ...props }) => {

  const statusBarHeight = getStatusBarHeight();
  const theme = useTheme();

  return (
    <Modal
      style={{width:'80%'}}
      animationType="fade"
      transparent={true}
      visible={props.visible}
      backdropStyle={styles.backdrop}
      onRequestClose={props.closePopUp}
    >
      <TouchableOpacity
          style={styles.modalBackgroundStyle}
          activeOpacity={1}
          onPressOut={props.closePopUp}
        >
        <Card disabled={true} style={{width:'80%', margin:5}}>
          {children}
        </Card>
      </TouchableOpacity>

    </Modal>
 );
};