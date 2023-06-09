import React, { useState, useEffect } from 'react';
import { View, Image, Linking, TouchableOpacity } from 'react-native';
import { ViewableArea, ContentContainer } from '../../../components/content.component';
import { Header } from '../../../components/headers.component';
import { useTheme, Text, Button, Icon } from '@ui-kitten/components';
import { MapAreaWrapper, ShowArea } from '../../../components/Maps/mapPoints.component.js';
import { PopupMessage } from '../../../components/Activities/popupMessage.component';
import CountDown from 'react-native-countdown-fixed';

import { styles } from './surveyActivity.styles';

export function SurveyActivity(props) {

  const theme = useTheme();
  let surveyLink = 'http://ucf.qualtrics.com/jfe/form/SV_9vozKCHxjfyAHJ3';

  const [area] = useState(props.timeSlot.area)
  const [start, setStart] = useState(false)
  const [initalStart, setInitalStart] = useState(true);

  // timer stuff
  const initalTime = props.timeSlot.timeLeft
  // controls the rendered countdown timer
  const [timer, setTimer] = useState(initalTime);
  // controls timer interval instance
  const [id, setId] = useState();

  const [popupMsg, setPopupMsg] = useState(true);

  const endActivity = () => {
    setStart(false);
    clearInterval(id);
    props.navigation.navigate("ActivitySignUpPage");
  }

  // helps control the countdown timer
  useEffect(() =>{
    // only start the timer when we start the test
    if(start){
      setPopupMsg(false);
      startTime(timer);
      setInitalStart(false);
    }
    else if(start === false){
      clearInterval(id);
    }
  }, [start]);

  // begins/updates the timer
  function startTime(current){
    let count = current;
    setId(setInterval(() =>{            
      count--;
      // timer is what actually gets rendered so update every second
      setTimer(count);
      // console.log(count);
      // when the timer hits 0, end the test
      if(count === 0){
        setStart(false);
        clearInterval(id);
        endActivity();
      }
    // 1000 ms == 1 s
    }, 1000));
  }

  const StartStopButton = () => {
    if (initalStart) {
      return(
        <Button style={styles.startButton} onPress={() => setStart(true)} >
          <View>
            <Text style={styles.startStopText}>Start</Text>
          </View>
        </Button>
      )
    }
    else {
      return(
        <Button
          status={'danger'}
          style={styles.stopButton}
          onPress={() => endActivity()}
        >
          <View>
            <Text style={styles.startStopText}>End</Text>
          </View>
        </Button>
      )
    }
  }

  const PlayPauseButton = () =>{
    const Play = () => <Icon name='play-circle' fill={'#FFFFFF'} style={styles.playPauseIcon} />
    const Pause = () => <Icon name='pause-circle' fill={'#FFFFFF'} style={styles.playPauseIcon} />
  
    // timer is active
    if(start){
      return(
        <TouchableOpacity style={styles.playPauseButton} onPress={() => setStart(false)}>
          <Pause />
        </TouchableOpacity>
      )
    }
    // timer is paused
    else{
      return(
        <TouchableOpacity style={styles.playPauseButton} onPress={() => setStart(true)}>
          <Play />
        </TouchableOpacity>
      )
    }
  }

  const TimeBar = () => {
    return(
      <View>
        <View style={styles.container}>

          <StartStopButton/>

          <View>
            <Text status='danger' category='h4'>
              Code: {props.timeSlot.key}
            </Text>
          </View>

          <View style={styles.timerRow}>
            
            {initalStart ?
              null
            :
              <PlayPauseButton />
            }
            
            <CountDown
              running={start}
              until={timer}
              size={20}
              digitStyle={{backgroundColor:theme['background-basic-color-1']}}
              digitTxtStyle={{color:theme['text-basic-color']}}
              separatorStyle={{color:theme['text-basic-color']}}
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
      <Header text={'Community Survey'}/>
      <ContentContainer>
        <TimeBar/>

        <PopupMessage
          visible={popupMsg}
        />

        <View style={styles.mainView}>
            <View style={styles.mapWrapper}>
              <MapAreaWrapper area={area} mapHeight={'100%'}>
                <ShowArea area={area} />
              </MapAreaWrapper>
            </View>

            <View style={styles.surveyView}>
              <Text>
                Survey Link:
              </Text>
              <Text> </Text>
              <Text
                style={styles.surveyLink}
                onPress={() => Linking.openURL(surveyLink)}
              >
                {surveyLink}
              </Text>
            </View>

            <View style={styles.qrView}>
              <Image
                style={styles.qr}
                source={require('./surveyQRCode.png')}
              />
            </View>
        </View>
      </ContentContainer>
      {start ?
        null
      :
        <View style={styles.descriptionView}>
            {initalStart ?
                null
            :
                <Text category={'s1'}>Press the play button to resume the test</Text>
            }
        </View>
      }
    </ViewableArea>
  );
}