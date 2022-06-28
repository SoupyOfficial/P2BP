import * as React from 'react';
import Button from '@mui/material/Button';
import DisplayCards from '../components/DisplayCards';
import { Link, useParams } from 'react-router-dom';

import './routes.css';

const teamsURL = '/teams';

function TeamHome() {
    // Load Viewable Projects by Team selected on previous page
    // Team id is passed in URL useParams can pull it
    let { teamId } = useParams();
    // project array structure hardcoded on template
    const projects = [
        {
            name: 'Lake Eola',
            id: 'p23e32duew'
        },
        {
            name: 'Lake Underhill Park',
            id: 'p4343rfi43f'
        },
        {
            name: 'University of Central Florida',
            id: 'p984f92hdeq'
        }
    ]

    return(
        <div id='teamHome'>
            <div id='newProjectButtonBox'>
                <Button 
                    id='newProjectButton' 
                    variant='contained' 
                    component={ Link } 
                    to='new'
                >
                    New Project
                </Button>
            </div>
            {/* type = 1 implies the project style cards */}
            <DisplayCards type={ 1 } projects={ projects }/>
        </div>
    );
}
export default TeamHome;