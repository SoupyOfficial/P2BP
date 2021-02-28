import React, { useState } from 'react';
import { ScrollView, View, TouchableWithoutFeedback, Modal } from 'react-native';
import { Icon, Text, Button, Input, Spinner } from '@ui-kitten/components';
import { BlueViewableArea } from '../components/content.component';

import { styles } from './signup.styles';

export const SignUpScreen = ( props ) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');

    const [emailTouched, setEmailTouched] = useState(false);
    const [passwordTouched, setPasswordTouched] = useState(false);

    const [secureTextEntry, setSecureTextEntry] = useState(true);   // Display dots instead of text in password field
    const [loading, setLoading] = useState(false);

    const toggleSecureEntry = () => {
        setSecureTextEntry(!secureTextEntry);
    };

    const navigateBack = () => {
        props.navigation.goBack();
    };

    const handleSignup = async () => {
        setLoading(true);

        // Assemble the request body
        const userBody = {
            email: email,
            password: password
        };
        if (firstname !== '') userBody.firstname = firstname;
        if (lastname !== '') userBody.lastname = lastname;

        try {
            // Make an HTTP request to create a new user
            const response = await fetch('https://measuringplacesd.herokuapp.com/api/users', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userBody)
            });
            const res = await response.json();

            console.log('OK: ' + response.ok, 'Signup response: ' + JSON.stringify(res));

            if (response.ok) {
                // Redirect to the login page
                props.navigation.navigate('Login');
            }
        } catch (error) {
            console.log(error);
        }

        setLoading(false);
    };

    const checkEmail = () => {
        if (!/.+\@.+\..+/g.test(email)) return false;
        if (/\s/g.test(email)) return false;
        return true;
    }

    const checkPassword = () => {
        let rules = [];
        if (password.length < 8) rules.push('Must be at least 8 characters long');
        if (/\s/g.test(password)) rules.push('Must not have any spaces');
        if (!/\d/g.test(password)) rules.push('Must have at least one digit');
        if (!/[!@#$%^&*]/g.test(password)) rules.push('Must have one of the following: ! @ # $ % ^ & *');
        if (!/[A-Z]/g.test(password)) rules.push('Must have at least one uppercase letter');

        return rules;
    }

    const SignUpButton = ({ enabled }) => (
        <Button style={[styles.signUpButton, !enabled && {backgroundColor: '#E6D88A'}]} onPress={handleSignup} disabled={!enabled}>
            <Text style={[styles.signUpText, !enabled && {color: '#808080'}]}>
                Sign Up
            </Text>
        </Button>
    );

    const BackButton = () => (
        <Button appearance={'ghost'} onPress={navigateBack} style={{marginTop:15}}>
            <Text status={'control'} category='h5'>
               &larr; Back
            </Text>
        </Button>
    );

    const eyeIcon = (props) => (
        <TouchableWithoutFeedback onPress={toggleSecureEntry}>
            <Icon {...props} name={secureTextEntry ? 'eye-off' : 'eye'}/>
        </TouchableWithoutFeedback>
    );

    const isValidEmail = checkEmail();
    const passwordProblems = checkPassword();

    return (
        <BlueViewableArea>
            <ScrollView contentContainerStyle={styles.container}>
                <Modal
                    animationType='fade'
                    transparent={true}
                    visible={loading}
                >
                    <View style={styles.modalBackgroundStyle}>
                        <Spinner />
                    </View>
                </Modal>
                <Text category='h1' status='control'>Sign Up</Text>
                <View>
                    <Text category='label' style={styles.inputText}> Email Address: </Text>
                    <Input
                        value={email}
                        placeholder='Email address...'
                        style={styles.inputBox}
                        autoCapitalize='none'
                        keyboardType="email-address"
                        onFocus={() => setEmailTouched(true)}
                        onChangeText={nextValue => setEmail(nextValue)}
                        caption={
                            emailTouched && !isValidEmail &&
                            <Text style={{color: '#FF3D71'}}>
                                Email address is not valid
                            </Text>
                        }
                    />
                </View>
                <View>
                    <Text category='label' style={styles.inputText}> Password:</Text>
                    <Input
                        value={password}
                        placeholder='Password...'
                        style={styles.inputBox}
                        autoCapitalize='none'
                        accessoryRight={eyeIcon}
                        secureTextEntry={secureTextEntry}
                        onFocus={() => setPasswordTouched(true)}
                        onChangeText={nextValue => setPassword(nextValue)}
                        caption={
                            passwordTouched && passwordProblems.length > 0 &&
                            <Text style={{color: '#FF3D71'}}>
                                {passwordProblems.join('\n')}
                            </Text>
                        }
                    />
                </View>
                <View>
                    <Text category='label' style={styles.inputText}> First Name: </Text>
                    <Input
                        value={firstname}
                        placeholder='First name...'
                        style={styles.inputBox}
                        autoCapitalize='none'
                        onChangeText={(nextValue) => setFirstname(nextValue)}
                    />
                </View>
                <View>
                    <Text category='label' style={styles.inputText}> Last Name: </Text>
                    <Input
                        value={lastname}
                        placeholder='Last name...'
                        style={styles.inputBox}
                        autoCapitalize='none'
                        onChangeText={(nextValue) => setLastname(nextValue)}
                    />
                </View>
                <SignUpButton enabled={isValidEmail && passwordProblems.length === 0}/>
                <BackButton />
            </ScrollView>
        </BlueViewableArea>
    );
};