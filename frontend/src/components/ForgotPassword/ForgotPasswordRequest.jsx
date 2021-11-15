import React, { useEffect, useState } from 'react';
import {NavLink} from 'react-router-dom';
import { useMutation, useLazyQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { GET_ACCOUNT_BY_EMAIL, FORGOT_PASSWORD } from '../../graphql/graphql';
import {
    isNullOrEmpty, validEmail
  } from '../../utils/validations';

  import './ForgotPasswordRequest.scss';

function ForgotPassword() {
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState([]);
    const [emailSuccess, setEmailSuccess] = useState(false);
    const [checkExistingUsers, setCheck] = useState(false);
    const [getUsers, { data: existingUsersData, error: existingUsersError }] = useLazyQuery(GET_ACCOUNT_BY_EMAIL);
    const [forgotPassword, {data: forgotPasswordData, error: forgotPasswordError }] = useMutation(FORGOT_PASSWORD);

    useEffect(() => {
        if(forgotPasswordError){
            setEmailError(forgotPasswordError);
        }
        else if(forgotPasswordData){
           if(forgotPasswordData.forgotPassword.includes('/reset-password'))
           setEmailSuccess(true);
        }

    }, [forgotPasswordData,forgotPasswordError])

    useEffect(() => {
        if(existingUsersError){
            setEmailError(existingUsersError);
        }
        else if(checkExistingUsers&& existingUsersData){
            if(existingUsersData.getAccountByEmail == null){
                setEmailError('This user is not registered in our system.');
            }
            else {
                forgotPassword({
                    variables: {
                    emailAddress: email,
                    },
                });
            }
        }

    }, [checkExistingUsers,existingUsersData, existingUsersError, forgotPassword, email])

    async function sendEmailHandler() {  
        if (isNullOrEmpty(email) || !validEmail(email)) {
            setEmailError('Please enter a valid email address');
        }
        else {
            setCheck(true);
            getUsers({ variables: { email_address: email }});
        }
    }

      const eraseFieldError = () => {
        setEmailError([]);
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
                    {emailSuccess ?
                        <div className="innerWrapper">
                            <p>Password reset email sent.</p>
                            <span>Please check your inbox.</span>
                            <div className="inputWrapper">
                                <NavLink className="navlink" to="/login/">{t('forgotPassword.body.link.signIn')}</NavLink>
                            </div>   
                        </div>
                    :    
                        <div className="innerWrapper">
                            <p>
                                {t('forgotPassword.body.heading1')}
                            </p>
                            <span>   
                                {t('forgotPassword.body.heading2')}
                            </span>
                            <div className="inputWrapper">
                                <input
                                    className={emailError ? 'input-error' : 'input-valid'}
                                    type="text"
                                    placeholder={t('forgotPassword.body.input.email')}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    onFocus={eraseFieldError}
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
                    }

                </div>    
        </div>
    )
}
export default ForgotPassword;