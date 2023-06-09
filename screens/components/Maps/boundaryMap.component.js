import React from 'react';
import MapView, { Marker, Polygon, Polyline } from 'react-native-maps'
import { View, Platform } from 'react-native';
import { PressMapAreaWrapper } from './mapPoints.component';

import { styles } from './sharedMap.styles';

export function BoundaryMap(props) {

    const plat = Platform.OS;

    const colors = ['rgba(255, 0, 255, 1)', 'rgba(0, 255, 193, 1)', 'rgba(255, 166, 77, 1)'];
    const fills = ['rgba(0, 255, 193, 0.5)', 'rgba(255, 166, 77, 0.5)']

    // Custom colored data pin
    const DataPin = (props) =>{
        return(
            <View style={[styles.dataPin, {backgroundColor: props.color}]} />
        )
    }

    const CreatePoly = () => {
        // if the type of boundary is a construction boundary (polyline)
        if(props.type === 0){
            if(props.markers === null || props.markers.length == 0) {
                return null
            }

            else if (props.markers.length == 1) {
                return (props.markers.map((coord, index) => (
                    <Marker
                        key={index}
                        coordinate={props.markers[0]}
                    >
                        <DataPin color={colors[0]}/>
                    </Marker>
                )))
            }

            else if (props.markers.length > 1) {

                return (
                    <Polyline
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
                    <Marker
                        key={index}
                        coordinate = {props.markers[0]}
                    >
                        <DataPin color={color}/>
                    </Marker>
                )))
            }

            else if (props.markers.length === 2) {

                return (
                    <Polyline
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
                        <Polygon 
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
                        <Polygon 
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
                <Marker
                    key={index}
                    coordinate = {{
                        latitude: coord.latitude,
                        longitude: coord.longitude
                    }}
                >
                    <DataPin color={color}/>
                </Marker>
             )))
         }
    }    
    
    const ConstructBounds = () =>{
        if(props.lineBool){
            return(    
                props.linePaths.map((obj, index) => (
                    <Polyline
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
                        <Polygon
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
                        <Polyline
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
                        <Polygon
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
                        <Polyline
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

    return(
        <View>
            {/* main mapview container */}
            <PressMapAreaWrapper
                area={props.area}
                mapHeight={'95%'}
                onPress={props.addMarker}
                recenter={props.recenter}
            >
                {/* shows the project area on the map */}
                <Polygon
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

            </PressMapAreaWrapper>
        </View>
    )
}