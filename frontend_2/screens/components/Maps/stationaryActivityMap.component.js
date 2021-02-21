import React, { useState } from 'react';
import MapView, { PROVIDER_GOOGLE, Marker, Image, Polygon, Callout } from 'react-native-maps'
import { View } from 'react-native';
import { Text, Button, Input, Icon, Divider, List, ListItem} from '@ui-kitten/components';
import { PressMapAreaWrapper, ShowArea } from './mapPoints.component';

export function StationaryActivityMap(props) {

    const colors = ["blue", "red", "yellow", "green"]

    const [location] = useState(props.location)

    const DataPin = (props) => {

        return(
            <View style={{backgroundColor: colors[props.index % 4], borderRadius: 150/2, borderWidth: 1, width: 15, height: 15}}/>
        )
    }

    const ShowPolygon = () => {
        if(props.markers === null) {
            return (null);
        }
        else {
            return (
                props.markers.map((coord, index) => (
                <MapView.Marker
                    key={index}
                    coordinate = {{
                        latitude: coord.latitude,
                        longitude: coord.longitude
                    }}
                >
                    <DataPin index={index}/>
                </MapView.Marker>
             )))
         }
    }

    const StandingPoints = () => {
        return (
            props.position.map((coord, index) =>
                <MapView.Marker
                key={index}
                coordinate = {{
                    latitude: coord.latitude,
                    longitude: coord.longitude
                }}
                />
            ))
    }

    return(

        <View>
            <PressMapAreaWrapper
                area={props.area}
                mapHeight={'100%'}
                onPress={props.addMarker}
            >
                <StandingPoints/>

                <MapView.Polygon
                    coordinates={props.area}
                    strokeWidth={3}
                    strokeColor={'rgba(255,0,0,0.5)'}
                    fillColor={'rgba(0,0,0,0.5)'}
                />

                <ShowPolygon/>

            </PressMapAreaWrapper>
        </View>
    )
};
