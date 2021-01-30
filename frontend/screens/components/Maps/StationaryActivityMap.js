import React, { Component } from 'react';
import MapView, { PROVIDER_GOOGLE, Marker, Image, Polygon, Callout } from 'react-native-maps'
import { View } from 'react-native';
import { Text, Button, Input, Icon, Divider, List, ListItem} from '@ui-kitten/components';

class StationaryActivityMap extends Component {

    constructor(props){
        super(props);

        this.state = {
            location: props.location,
            markers: props.markers,
        }

        console.log("Position: " + JSON.stringify(this.props.position))
    }

    render() {

        const DataPin = (props) => (

            <Icon {...props} fill="blue" style={{width: 20, height: 20}} name={"radio-button-off"}/>
        )

        const ShowPolygon = () => {
            if(this.props.markers === null) {
                return (null);
            }
            else {
                return (
                    this.props.markers.map((coord, index) => (
                    <MapView.Marker
                        key={index}
                        coordinate = {{
                            latitude: coord.latitude,
                            longitude: coord.longitude
                        }}
                    >
                        <DataPin/>
                    </MapView.Marker>
                    )))
                }
            }

        return(

            <View>
                <MapView
                    provider={PROVIDER_GOOGLE}
                    style={{height:'100%'}}
                    initialCamera ={{
                        center:{
                            latitude: this.state.location.latitude,
                            longitude: this.state.location.longitude
                        },
                        pitch: 10,
                        heading: -1,
                        altitude: -1,
                        zoom: 17
                    }}

                    onPress={event => this.props.addMarker(event.nativeEvent.coordinate)}
                >
                    <MapView.Marker
                        coordinate = {{
                            latitude: this.props.position[0].latitude,
                            longitude: this.props.position[0].longitude
                        }}
                    >
                    </MapView.Marker>

                    <MapView.Polygon
                     coordinates={this.props.area}
                     strokeWidth={3}
                     strokeColor={'rgba(255,0,0,0.5)'}
                     fillColor={'rgba(0,0,0,0.5)'}
                    />

                    <ShowPolygon/>

                </MapView>
            </View>
        );
    }
}

export default StationaryActivityMap;
