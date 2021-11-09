import React, { useEffect, useState } from 'react';
import {NavLink} from 'react-router-dom';
import { useMutation, useLazyQuery } from '@apollo/client';
import './ForgotPasswordRequest.styles.scss';
import { useTranslation } from 'react-i18next';
import { GET_ACCOUNT_BY_EMAIL, FORGOT_PASSWORD } from '../../graphql/graphql';
import {
    isNullOrEmpty, validEmail
  } from '../../utils/validations';

function ForgotPassword() {
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState([]);
    const [checkExistingUsers, setCheck] = useState(false);
    const [getUsers, { data: existingUsersData, error: existingUsersError }] = useLazyQuery(GET_ACCOUNT_BY_EMAIL);
    const [forgotPassword] = useMutation(
        FORGOT_PASSWORD,
        {
          onCompleted: (forgotPasswordData) => {
          },
        },
    );

    useEffect(() => {
        if(existingUsersError){
            setEmailError(existingUsersError);
        }
        else if(checkExistingUsers&& existingUsersData){
            if(existingUsersData.getAccountByEmail == null){
                setEmailError('This user is not registered in our system.');
            }
            else {
                sendForgotPasswordRequest();
            }
        }

    }, [checkExistingUsers,existingUsersData, existingUsersError, forgotPassword])

    async function sendEmailHandler() {  
        if (isNullOrEmpty(email) || !validEmail(email)) {
            setEmailError('Please enter a valid email address');
        }
        else {
            setCheck(true);
            getUsers({ variables: { email_address: email }});
        }
    }

      const eraseFieldError = (element) => {
          if(emailError)
          setEmailError([]);
      }

    const sendForgotPasswordRequest = () => {
        try {
            forgotPassword({
                variables: {
                emailAddress: email,
                },
            });
        }catch(error){
            setEmailError(error);
        }  
    }
    
    return(
        <div className="mainHandler">
            <div className="mainHeader">
                <p>
                    {t('forgotPassword.header.resetPassword')}
                </p>
                <hr className="introTextSeparator" />
                </div>
                <div className="mainBody">
                    <div className="innerWrapper">
                        <p>
                            {t('forgotPassword.body.heading1')}
                         </p>
                         <p>   
                            {t('forgotPassword.body.heading2')}
                        </p>
    
                        <div className="inputWrapper">
                            <input
                                className="localLogin localNameLogin"
                                type="text"
                                placeholder={t('forgotPassword.body.input.email')}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onFocus={(e) => eraseFieldError(e.target.name)}
                            />
                            {emailError?
                            <p className="inline-error">{emailError}</p> : ''}
                            <button
                                className="signInButton"
                                type="button"
                                value="Sign In"
                                onClick={sendEmailHandler}
                            >
                            {t('forgotPassword.body.button.sendemail')}
                            </button>
                            <NavLink className="navlink" to="/login/">{t('forgotPassword.body.link.signIn')}</NavLink>
                        </div>
                    </div>
                </div>    
        </div>
    )
}
export default ForgotPassword;