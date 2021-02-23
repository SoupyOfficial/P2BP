import React, { useState } from 'react';
import { View, ScrollView, Pressable, Image, TouchableWithoutFeedback, Modal, KeyboardAvoidingView, Linking } from 'react-native';
import { ViewableArea, ContentContainer } from '../../../components/content.component';
import { Header } from '../../../components/headers.component';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, Button, Input, Icon, Popover, Divider, List, ListItem, Card } from '@ui-kitten/components';
import { MapAreaWrapper, ShowArea } from '../../../components/Maps/mapPoints.component.js';
import { Timer } from '../../../components/timer.component.js';
import CountDown from 'react-native-countdown-component';
import { DataEntryModal } from '../../../components/Activities/Stationary/dataEntryModal.component.js';

export function SurveyActivity(props) {

  let surveyLink = 'http://ucf.qualtrics.com/jfe/form/SV_9vozKCHxjfyAHJ3';

  const [location] = useState(props.timeSlot.location)
  const [area] = useState(props.timeSlot.area.points)
  const [start, setStart] = useState(false)

  const endActivity = () => {
    setStart(false)
    props.navigation.navigate("ActivitySignUpPage");
  }

  const updateTime = (value) => {
    let temp = props.timeSlot;
    temp.timeLeft = value;
    props.setTimeSlot(temp);
  }

  const StartStopButton = () => {
    if (start) {
      return(
        <Button
          status={'danger'}
          style={{height: 50, marginTop: 5, marginLeft: 5, width: 90}}
          onPress={() => endActivity()}
        >
          End
        </Button>
      )
    }
    else {
      return(
        <Button
          style={{backgroundColor: '#006FD6'}}
          style={{height: 50, marginTop: 5, marginLeft: 5, width: 90}}
          onPress={() => setStart(true)}
        >
          Start
        </Button>
      )
    }
  }

  const TimeBar = () => {
    return(
      <View>
        <View style={{height: 60, flexDirection: 'row'}}>

          <StartStopButton/>

          <View style={{marginLeft: 175, marginTop: 5}}>
              <CountDown
                  running={start}
                  until={props.timeSlot.timeLeft}
                  onChange={(value) => updateTime(value)}
                  size={20}
                  digitStyle={{backgroundColor: 'white'}}
                  digitTxtStyle={{color: 'black'}}
                  timeToShow={['M', 'S']}
                  timeLabels={{m: '', s: ''}}
                  showSeparator
              />
          </View>
        </View>
      </View>
    )
  }

  return(
    <ViewableArea>
      <Header text={'Survey Activity'}/>
      <ContentContainer>
      <TimeBar/>
      <View style={{flex:1, flexDirection:'column'}}>
          <View style={{height:'40%'}}>
            <MapAreaWrapper area={area} mapHeight={'100%'}>
              <ShowArea area={area} />
            </MapAreaWrapper>
          </View>

          <View style={{flexDirection:'row', margin:10, marginRight:10}}>
            <Text>
              Survey Link:
            </Text>
            <Text> </Text>
            <Text
              style={{color: 'blue', width:'90%'}}
              onPress={() => Linking.openURL(surveyLink)}
            >
              {surveyLink}
            </Text>
          </View>

          <View style={{flex:1, alignItems:'center'}}>
            <Image
              style={{height:'100%', width:'100%'}}
              source={require('./surveyQRCode.png')}
            />
          </View>
        </View>
      </ContentContainer>
    </ViewableArea>
  )
};
