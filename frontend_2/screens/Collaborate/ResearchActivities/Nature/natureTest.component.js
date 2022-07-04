import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { ViewableArea, ContentContainer } from '../../../components/content.component';
import { Header } from '../../../components/headers.component';
import { useTheme, Button } from '@ui-kitten/components';
import { LineTools } from '../../../components/Activities/PeopleMoving/lineTools.component';
import { NatureMap } from '../../../components/Maps/natureMap.component.js';
import { ErrorModal } from '../../../components/Activities/Boundary/errorModal.component';
import { WeatherModal } from '../../../components/Activities/Nature/weatherModal.component';
import { WaterModal } from '../../../components/Activities/Nature/waterModal.component';
import { DataModal } from '../../../components/Activities/Nature/dataModal.component';
import { calcArea } from '../../../components/helperFunctions';
import CountDown from 'react-native-countdown-component';

import { styles } from './natureTest.styles';

export function NatureTest(props) {

    const theme = useTheme();

    const [area] = useState(props.timeSlot.area);

    // Begins the test
    const [start, setStart] = useState(false);
    const [initalStart, setInitalStart] = useState(true);

    // timer stuff
    const initalTime = props.timeSlot.timeLeft;
    // controls the rendered countdown timer
    const [timer, setTimer] = useState(initalTime);
    // controls timer interval instance
    const [id, setId] = useState();

    // Modal controls
    const [errorModal, setErrorModal] = useState(false);
    const errorMsg = "Need at least 3 points to confirm a body of water";
    const [weatherModal, setWeatherModal] = useState(false);
    const [waterModal, setWaterModal] = useState(false);
    const [dataModal, setDataModal] = useState(false);

    const [lineTools, setLineTools] = useState(false);
    
    // Current path being drawn and current marker being placed
    const [currentPath, setCurrentPath] = useState([]);
    const [currentPathSize, setCurrentPathSize] = useState(0);
    const [tempMarker, setTempMarker] = useState();

    // Used to store all the data info
    const [totalWaterPaths] = useState([]);
    const [dataPoints] = useState([]);
    const [weatherData] = useState([]);
    const [waterData] = useState([]);

    // End Button press or whenever the timer hits 0
    const endActivity = async () => {
        setStart(false)
        clearInterval(id);

        // close any of the modals that may be open when the test ends (timer hits 0 while in a modal)
        if(dataModal) setDataModal(false);
        if(waterModal) setWaterModal(false);
        if(errorModal) setErrorModal(false);
        
        // package the data; needs to be an array for multiple entries for a test
        let data =[{
            weather: weatherData[0],
            water: waterData,
            points: dataPoints,
            time: new Date()
        }]

        // Sends the collected data to DB
        try {
            const response = await fetch('https://p2bp.herokuapp.com/api/nature_maps/' + props.timeSlot._id + '/data', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + props.token
                },
                body: JSON.stringify({
                    entries: data
                })
            })

            let info = await response.json()
        
            console.log(info)
        
        } catch (error) {
            console.log("ERROR: ", error)
        }

        props.navigation.navigate("ActivitySignUpPage");
    }
    
    // Opens the data model and stores a temporary points
    const onPointCreate = async (marker) => {
        if (start && !lineTools) {
            setDataModal(true)
            setTempMarker(marker)
        }
    }

    // Closes the modal and saves the data point
    const closeData = async (inf) => {
        // save the data point to be rendered
        dataPoints.push(inf);
        setDataModal(false);
        setTempMarker();
    }
    
    // Closes the weather modal and saves the data
    const closeWeather = async (inf) =>{
        weatherData.push(inf)
        setWeatherModal(false)
    }

    const closeWater = async (inf) =>{
        let obj = {
            description: inf.description,
            area: calcArea(currentPath),
            location: currentPath
        }
        waterData.push(obj)
        setWaterModal(false);
        totalWaterPaths.push(currentPath);
        // whenever the data is saved, clear out the current paths stuff for next enteries
        let emptyPath = [];
        setCurrentPath(emptyPath);
        setCurrentPathSize(0);

        // reset test controls
        setLineTools(false);
    }

    // Start and Exit button
    const StartStopButton = () => {

        if (initalStart) {
            return(
                <Button style={styles.startButton} onPress={() => setStart(true)} >
                    Start
                </Button>
            )
        }
        else{
            return(
                <Button
                    status={'danger'}
                    style={styles.stopButton}
                    onPress={() => endActivity()}
                    >
                        End
                    </Button>
            )
        }
    }

    // helps control the countdown timer
    useEffect(() =>{
        // only start the timer when we start the test
        if(start){
            // pull up the weather modal when the test 1st starts
            if(initalStart) setWeatherModal(true);
            startTime(timer);
            setInitalStart(false);
        }
    }, [start]);

    // begins/updates the timer
    function startTime(current){
        let count = current;
        setId(setInterval(() =>{            
            count--;
            // timer is what actually gets rendered so update every second
            setTimer(count);
            //console.log(count);
            // when the timer reaches 0, call restart
            if(count === 0){
                // clear the interval to avoid resuming timer issues
                clearInterval(id);
                endActivity();
            }
        // 1000 ms == 1 s
        }, 1000));
    }

    // Count Down Timer and the Start/Exit button
    const TimeBar = () => {

        return(
            <View>
                <View style={styles.container}>

                    <StartStopButton/>

                    <View>
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

    // adds a marker to the current path
    const addShape = (marker) =>{
        // only add a marker if the test has started and the line toolbar is pulled up
        if(start && lineTools){
            // cannot use currentPath.push here, causes a read-only error somehow on the 3rd marker
            setCurrentPath(currentPath.concat(marker));
            setCurrentPathSize(currentPathSize+1);
        }
    }

    // checks the boundary and sets the buttons to collect data
    const confirm = () => {
        // polygon size check, needs at lest 3 points
        if(currentPathSize < 3){
            setErrorModal(true);
            return
        }
        // pull up the data modal
        setWaterModal(true);
    }
    
    // removes last plotted marker
    const removeLastPoint = () => {
        if (currentPathSize >= 1) {              
            let currPath = [...currentPath]
            currPath.splice(-1, 1)
            
            setCurrentPath(currPath)
            setCurrentPathSize(currentPathSize - 1)
        }
        // if we try deleting with no marker on drawn boundary, put away the line toolbar
        else setLineTools(false);
    }
    
    // cancels the current line being drawn (also closes line toolbar)
    const cancel = () => {
        // reset current path and path size, set line tools to false
        let emptyPath = []
        setCurrentPath(emptyPath)
        setCurrentPathSize(0)
        setLineTools(false)
        
    }

    const LineToolBar = () => {
        if (start && lineTools) {
            return (
                <LineTools confirm={confirm} cancel={cancel} removeLastPoint={removeLastPoint}/>
            )
        }
        else{
            return null;
        }
    }

    const WaterToolBar = () =>{
        // line toolbar is not rendered and the test has started
        if(start && !lineTools){
            return(
                <View style={styles.buttonView}>
                    <Button style={styles.button} onPress={() => setLineTools(true)}>Body of Water</Button>
                </View>
            )
        }
        // otherwise return nothing (linetool bar is up or test hasn't started)
        return null
    }

    // closes the error modal
    const dismiss = () =>{
        setErrorModal(false);
    }
    
    // closes the modals without submitting anything
    const goBack = () =>{
        if(waterModal) setWaterModal(false);
        else{
            setTempMarker();
            setDataModal(false);
        }
    }

    // Main render
    return(
        <ViewableArea>
            <Header text={'Nature Prevalence'}/>
            <ContentContainer>

                <TimeBar/>

                <ErrorModal
                    errorModal={errorModal}
                    errorMessage={errorMsg}
                    dismiss={dismiss}
                />

                <WeatherModal
                    visible={weatherModal}
                    closeData={closeWeather}
                />

                <WaterModal 
                    visible={waterModal}
                    closeData={closeWater}
                    back={goBack}
                />

                <DataModal
                    visible={dataModal}
                    closeData={closeData}
                    point={tempMarker}
                    back={goBack}
                />

                <NatureMap
                    area={area}
                    markers={currentPath}
                    marker={tempMarker}
                    dataPoints={dataPoints}
                    water={totalWaterPaths}
                    addMarker={onPointCreate}
                    addShape={addShape}
                    cond={lineTools}
                />

                <WaterToolBar />
                <LineToolBar />

            </ContentContainer>
        </ViewableArea>
    );
}