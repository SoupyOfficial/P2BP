import React, { useState, useEffect } from 'react';
import { View, ScrollView, Pressable, Image, TouchableWithoutFeedback, KeyboardAvoidingView, Alert } from 'react-native';
import { Layout, TopNavigation, TopNavigationAction } from '@ui-kitten/components';
import { Text, Button, Input, Icon, Popover, Divider, List, ListItem, Card } from '@ui-kitten/components';
import { HeaderBack } from '../../../components/headers.component';
import { MapWrapper, ShowArea, ShowMarkers } from '../../../components/Maps/mapPoints.component';
import { ViewableArea, ContentContainer } from '../../../components/content.component';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from './activitySignUp.styles';

export function ActivitySignUpPage(props) {

  const activityList = ["Stationary Map", "People Count", "Survey"]

  const onBeginPress = async (index) => {

    if (props.activity.activity == activityList[0]) {

      let activityDetails = {
        location: props.activity.area[0],
        area: props.activity.area,
        position: getPointsLocations(props.activity.timeSlots[index]),
        time: (parseInt(props.activity.timeSlots[index].duration)* 60),
        timeLeft: (parseInt(props.activity.timeSlots[index].duration)* 60)
      }

      props.setTimeSlot(activityDetails);

      props.navigation.navigate("StationaryActivity")
    }
    else if (props.activity.activity == activityList[1]){

    }
    else if (props.activity.activity == activityList[2]){

      let activityDetails = {
        location: props.activity.area[0],
        area: props.activity.area,
        time: (parseInt(props.activity.timeSlots[index].duration)* 60),
        timeLeft: (parseInt(props.activity.timeSlots[index].duration)* 60)
      }
      props.setTimeSlot(activityDetails);
      props.navigation.navigate("SurveyActivity")
    }
  }

  const getPointsLocations = (timeSlot) => {
    let tempPoints = [];
    timeSlot.assignedPointIndicies.map(index => {
      tempPoints.push(props.activity.standingPoints[index.row]);
    });
    return tempPoints;
  }

  const getPointsString = (timeSlot) => {
    let tempPoints = [];
    timeSlot.assignedPointIndicies.map(index => {
      tempPoints.push("Point " + (index.row + 1));
    });
    return tempPoints.join(', ');
  }

  const timeSlotCard = ({item, index}) => (
    <Card disabled={true}>
      <View style={{flexDirection:'row', justifyContent:'space-between'}}>
        <View style={{flexDirection:'column'}}>
          <Text>Start Time {item.timeString}</Text>
          <Text>Time Limit: {item.duration} (min)</Text>
          <Text>Standing Points: {getPointsString(item)}</Text>
          <Text>Number of Researchers: {item.numResearchers}</Text>
        </View>
        <View style={{flexDirection:'column', justifyContent:'space-around'}}>
          <Button status='info' style={{margin:5}}>
            Sign Up
          </Button>
          <Button status='success' style={{margin:5}} onPress={() => onBeginPress(index)}>
            Begin
          </Button>
        </View>
      </View>
    </Card>
  );

  return (
    <ViewableArea>
      <HeaderBack {...props} text={props.activity.title}/>
      <ContentContainer>
        <View style={{height:'40%'}}>
          <MapWrapper location={props.activity.area[0]} mapHeight={'100%'}>
            <ShowArea area={props.activity.area} />
            <ShowMarkers markers={props.activity.standingPoints} />
          </MapWrapper>
        </View>
        <View style={{margin:15}}>
          <Text category='s1'>{props.activity.activity} Activity</Text>
          <Text category='s1'>Day: {props.activity.date.toLocaleDateString()}</Text>
        </View>
        <List
          style={{maxHeight:400}}
          data={props.activity.timeSlots}
          ItemSeparatorComponent={Divider}
          renderItem={timeSlotCard}
        />
      </ContentContainer>
    </ViewableArea>
  );
};
