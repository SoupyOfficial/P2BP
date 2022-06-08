import * as React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import AppNavBar from './components/AppNavBar';
import Title from './routes/Title';
import Home from './routes/Home';
import NewProject from './routes/NewProject';
import NewUser from './routes/NewUser';
import SettingsPage from './routes/SettingsPage';
import EditProject from './routes/EditProject';
import ProjectPage from './routes/ProjectPage';

function UserRoutes() {
    // can be reached at (url)/home/(any component path below), ex: (url)/home/settings
    return (
        <div id='userRoutes'>
            <AppNavBar />
            <Routes>
                <Route index element={<Home />} />
                <Route path='project/:id/*' element={<ProjectPage />} />
                <Route path='new' element={<NewProject />} />
                <Route path='settings' element={<SettingsPage />} />
                <Route path='edit/:id' element={<EditProject />} />
            </Routes>
        </div>
    );
} 

function App(){
    //token/storage of choice
    //  const token = localStorage.getItem('token_data')
    // true == active user (logged in)
    const [state, setState] = React.useState(/*token !== null && token !== '' ? true : false*/);

    // Set user vars to access the user home page
    function handleOnLogin(active) {
        setState(active);
        return <Navigate to='/home' />
    }

    // clear all fields on logout
    function handleOnLogout(active) {
        setState(active);
        return <Navigate to='/' />
    }

    // (url)/(any path below)
    return(
        <Router>
            <Routes>
                {/* pass onLogin function to handle userState */}
                <Route index element={<Title onLogin={handleOnLogin}/>}/>
                    <Route path='home/*' element={<UserRoutes />}/>
                <Route path='new' element={<NewUser />} />
            </Routes>
        </Router>
    );
}

export default App;