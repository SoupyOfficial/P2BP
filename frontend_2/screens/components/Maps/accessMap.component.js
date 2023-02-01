import React from 'react';
import MapView from 'react-native-maps'
import { View } from 'react-native';
import { PressMapAreaWrapper } from './mapPoints.component';

import { styles } from './sharedMap.styles';

export function AccessMap(props) {

    const plat = Platform.OS;

    const colors = ['rgba(255, 0, 255, 1)', 'rgba(0, 255, 193, 1)', 'rgba(255, 166, 77, 1)'];
    const fills = ['rgba(0, 255, 193, 0.5)', 'rgba(255, 166, 77, 0.5)']

    // Custom colored data pin
    const DataPin = (props) =>{
        return(
            <View style={[styles.dataPin, {backgroundColor: props.color}]} />
        )
    }

// BEGIN BOUNDARY CLONE

        const CreatePoly = () => {
            // if the type of boundary is a construction boundary (polyline)
            if(props.type === 0){
                if(props.markers === null || props.markers.length == 0) {
                    return null
                }

                else if (props.markers.length == 1) {
                    return (props.markers.map((coord, index) => (
                        <MapView.Marker
                            key={index}
                            coordinate={props.markers[0]}
                        >
                            <DataPin color={colors[0]}/>
                        </MapView.Marker>
                    )))
                }

                else if (props.markers.length > 1) {

                    return (
                        <MapView.Polyline
                            coordinates={props.markers}
                            strokeWidth={3}
                            strokeColor={colors[0]}
                        />
                    )
                }
            }
            // otherwise, it is a material or shelter boundary (polygon)
            else{
                let fill;
                let color;
                if(props.type === 1){
                    color = colors[1];
                    fill = fills[0];
                }
                else{
                    color = colors[2];
                    fill = fills[1];
                }

                if(props.markers === null || props.markers.length == 0) {
                    return (null);
                }

                else if (props.markers.length == 1) {
                    return (props.markers.map((coord, index) => (
                        <MapView.Marker
                            key={index}
                            coordinate = {props.markers[0]}
                        >
                            <DataPin color={color}/>
                        </MapView.Marker>
                    )))
                }

                else if (props.markers.length === 2) {

                    return (
                        <MapView.Polyline
                            coordinates={props.markers}
                            strokeWidth={2}
                            strokeColor={color}
                        />
                    )
                }

                else if (props.markers.length > 2){
                    // android device
                    if(plat === 'android'){
                        return(
                            <MapView.Polygon 
                            coordinates={props.markers}
                            strokeWidth={2}
                            strokeColor={color}
                            fillColor={fill}
                        />
                        )
                    }
                    // ios device
                    else{
                        return(
                            <MapView.Polygon 
                                coordinates={props.markers}
                                strokeWidth={2}
                            />
                        )
                    }
                }
            }
        }

        // Shows plotted points of the boundary being drawn
        const ShowPoints = () => {
            if(props.markers === null) {
                return (null);
            }
            else {
                let color = colors[0];
                if(props.type === 1) color = colors[1]
                else if(props.type === 2) color = colors[2]

                return (
                    props.markers.map((coord, index) => (
                    <MapView.Marker
                        key={index}
                        coordinate = {{
                            latitude: coord.latitude,
                            longitude: coord.longitude
                        }}
                    >
                        <DataPin color={color}/>
                    </MapView.Marker>
                )))
            }
        }    

        const ConstructBounds = () =>{
            if(props.lineBool){
                return(    
                    props.linePaths.map((obj, index) => (
                        <MapView.Polyline
                            coordinates={obj}
                            strokeWidth={3}
                            strokeColor={colors[0]}
                            key={index}
                            tappable={props.lineTools ? false : true}
                            onPress={() => props.deleteMarker(0, index, obj)}
                        />
                    ))
                )
            }
            else return null
        }

        const MaterialBounds = () =>{
            if(props.matBool){
                // android device
                if(plat === 'android'){
                    return(
                        props.matPaths.map((obj, index) => (
                            <MapView.Polygon
                                coordinates={obj}
                                strokeWidth={2}
                                strokeColor={colors[1]}
                                fillColor={fills[0]}
                                key={index}
                                tappable={props.lineTools ? false : true}
                                onPress={() => props.deleteMarker(1, index, obj)}
                            />
                        ))
                    )
                }
                // ios device
                else{
                    // used to convert polygon arrays into enclosed line arrays (for consistent color)
                    let paths = props.matPaths;
                    let linePaths = [];
                    let len = props.matPaths.length;
                    // adds the 1st point to the end of each path object
                    for(let i = 0; i < len; i++) linePaths[i] = paths[i].concat(paths[i][0]);

                    return(
                        linePaths.map((obj, index) => (
                            <MapView.Polyline
                                coordinates={obj}
                                strokeWidth={2}
                                strokeColor={colors[1]}
                                key={index}
                                tappable={props.lineTools ? false : true}
                                onPress={() => props.deleteMarker(1, index, obj)}
                            />
                        ))
                    )
                }
            }
            else return null
        }

        const ShelterBounds = () =>{
            if(props.sheBool){
                // android device
                if(plat === 'android'){
                    return(
                        props.shePaths.map((obj, index) => (
                            <MapView.Polygon
                                coordinates={obj}
                                strokeWidth={2}
                                strokeColor={colors[2]}
                                fillColor={fills[1]}
                                key={index}
                                tappable={props.lineTools ? false : true}
                                onPress={() => props.deleteMarker(2, index, obj)}
                            />
                        ))
                    )
                }
                // ios device
                else{
                    // used to convert polygon arrays into enclosed line arrays
                    let paths = props.shePaths;
                    let linePaths = [];
                    let len = props.shePaths.length;
                    // adds the 1st point to the end of each path object
                    for(let i = 0; i < len; i++) linePaths[i] = paths[i].concat(paths[i][0]);

                    return(
                        linePaths.map((obj, index) => (
                            <MapView.Polyline
                                coordinates={obj}
                                strokeWidth={2}
                                strokeColor={colors[2]}
                                key={index}
                                tappable={props.lineTools ? false : true}
                                onPress={() => props.deleteMarker(2, index, obj)}
                            />
                        ))
                    )
                }
            }
            else return null
        }

        const AllBounds = () => {
            if (props.viewAll) {
                //console.log("Drawing boundaries")
                return (
                    <View>
                        <ConstructBounds />
                        <MaterialBounds />
                        <ShelterBounds />
                    </View>
                )
            }
            else return null
        }

// END BOUNDARY CLONE

    // offsets the data circle to have its center appear at the exact location of the marker
    let offsetPoint = {
        x: 0.5,
        y: 0.69
    }
    
    // renders current data point being placed
    const AddPoint = () =>{        
        if(props.marker == undefined || props.marker.length === 0) {
            return (null);
        }

        else{
            return(
                <MapView.Marker coordinate={props.marker} anchor={offsetPoint}>
                    <DataPin color={'#FD0000'} colorFill={'rgba(253, 0, 0, .5)'} />
                </MapView.Marker>
            )
        }
    }

    // renders submitted data points
    const PlotPoints = () =>{
        if(props.dataPoints === null || props.dataPoints.length == 0) {
            return (null);
        }

        else{
            //console.log(props.dataPoints)
            let obj = [];
            for(let i = 0; i < props.dataPoints.length; i++){
                let color;
                let colorFill;
                // only change color if its for the Vegetation type
                if(props.dataPoints[i].access_description === "Cars"){
                    color = "#FFE371"
                    colorFill = 'rgba(255, 227, 113, .5)'
                }
                else if(props.dataPoints[i].access_description === "Bikes"){
                    color = "#FF9933"
                    colorFill = 'rgba(255, 153, 51, .5)'
                }
                else{
                    color = '#FF00FF'
                    colorFill = 'rgba(255, 0, 255, .5)'
                }
                obj[i] = (
                    <View key={i.toString()}>
                        <MapView.Marker
                            coordinate={props.dataPoints[i].location}
                            anchor={offsetPoint}
                            // sloves problem of not being able to delete points for android
                            onPress={(e) => checkPoint(e.nativeEvent.coordinate)}
                        >
                            <DataPin
                                color={color}
                                colorFill={colorFill}
                            />
                        </MapView.Marker>
                    </View>
                )
            }
            return(
                <View>
                    {obj}
                </View>
            )
        }
    }
    
    // checks if a data point already exists at that location
    const checkPoint = (marker) =>{
        let index = -1;
        // loops through all the data points checking to see if its lat and long values are the same
        for(let i = 0; i < props.dataPoints.length; i++){
            if(props.dataPoints[i].location.latitude === marker.latitude && props.dataPoints[i].location.longitude === marker.longitude){
                // if so set the index to its index in the data array
                index = i
            }
        }
        // if the index is still -1, there is no point at that location so begin to add a marker
        if(index === -1) props.addMarker(marker)
        // otherwise, a point exists at that location so begin to delete the marker
        else props.deleteMarker(index)
    }

    return(
        <View>
            {/* main mapview container */}
            <PressMapAreaWrapper
                area={props.area}
                mapHeight={'95%'}
                //onPress={checkPoint}
                onPress={props.addMarker}
                recenter={props.recenter}
            >
                {/* shows the project area on the map */}
                <MapView.Polygon
                    coordinates={props.area}
                    strokeWidth={3}
                    strokeColor={'rgba(255,0,0,0.5)'}
                    fillColor={'rgba(0,0,0,0.2)'}
                />

                {/* draws polyline/polygon that the user is making */}
                <CreatePoly />

                <ShowPoints />
                
                {/* renders submitted drawn boundaries during test collection */}
                <AllBounds />

                {/* <AddPoint /> */}

                {/* <PlotPoints /> */}

            </PressMapAreaWrapper>
        </View>
    )
}