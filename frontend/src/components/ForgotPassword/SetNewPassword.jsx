import React, {useEffect, useState } from 'react';
import {NavLink} from 'react-router-dom';
import { useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import queryString from 'query-string';
import { useMutation, useLazyQuery } from '@apollo/client';
import parseJwt from '../../utils/parseJwt';
import {
    isNullOrEmpty, isPasswordValid,
  } from '../../utils/validations';
import { RESET_PASSWORD, GET_RESET_PASSWORD_TOKEN } from '../../graphql/graphql';

import './ForgotPasswordRequest.scss';

function SetNewPassword (){
    const { t } = useTranslation();
    const location = useLocation();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    // Error variables for inline field validations
    const [fieldErrors, setFieldErrors] = useState({
        password: null,
        confirmPassword: null
    });
    const [invalidError, setInvalidError] = useState('');
    const [id, setUserId] = useState(null);
    const [resetTokenQueryString, setResetTokenQueryString] = useState(null);
    const [resetSuccess, setResetSuccess] = useState(null);
    const PASSWORD_TEXT  = 'Invalid password format';
    const [getResetPasswordToken, { data: resetTokenData, error: resetTokenError }] = useLazyQuery(GET_RESET_PASSWORD_TOKEN);
    const [resetPassword, {data: resetPasswordData, error: resetPasswordError}] = useMutation(RESET_PASSWORD);

    const eraseFieldError = (element) => {
        const currentErrors = { ...fieldErrors };
        if (element in currentErrors) delete currentErrors[element];
        setFieldErrors(currentErrors);
    };

    // Confirm Password validation
    const validateConfirmPassword = () => {
        const currentErrors = { ...fieldErrors };
        if (password !== confirmPassword) {
        currentErrors.confirmPassword = 'Passwords do not match';
        } else {
        delete currentErrors.confirmPassword;
        }
        setFieldErrors(currentErrors);
    };

    // Password validation
    const verifyPasswordFormat = () => {
        const currentErrors = { ...fieldErrors };
        if (isNullOrEmpty(password) || !isPasswordValid(password)) {
        currentErrors.password = PASSWORD_TEXT;
        } else {
        delete currentErrors.password;
        }
        setFieldErrors(currentErrors);
        if (confirmPassword) {
        validateConfirmPassword();
        }
    };

    const changePasswordHandler = () => {
        resetPassword({
            variables: {
              id,
              password
            },
        });
    }

    useEffect(() => {
        resetPasswordData ? setResetSuccess(true): setResetSuccess(false)
        if(resetPasswordError){
            setResetSuccess(false);
            setInvalidError(`Password reset failed ${resetPasswordError}`);
        }
    },[resetPasswordData, resetPasswordError]);

    useEffect(() => {
        if(resetTokenError){
            setInvalidError(`Password Reset Link is invalid or expired ${resetTokenError}`);
        }
        if(resetTokenData){
            console.log("reset token received: ", resetTokenData);
            if( !resetTokenData.getResetPasswordToken || !resetTokenData.getResetPasswordToken.password_reset_token){
                setInvalidError(`Password Reset Link is invalid or expired`);
            }
            else{
                const tokenFromDB = resetTokenData.getResetPasswordToken.password_reset_token;
                if(resetTokenQueryString !== tokenFromDB)
                setInvalidError(`Password Reset Link is invalid or expired`);
            }
        }  
    }, [resetTokenData, resetTokenError, resetTokenQueryString]);

    // Will be fired on mounting. We should verify the token first.
    useEffect(() => {
        const {token} = queryString.parse(location.search);
        setResetTokenQueryString(token);
        const tokenObj = parseJwt(token);
        const userid = parseInt(tokenObj._id, 10);
        setUserId(userid);  
        const seconds = new Date() / 1000;   
        if(tokenObj != null && tokenObj.exp > seconds){
            // Get reset token from DB for token verification.
            getResetPasswordToken({ variables: { id: userid }});
        }
        else {
            setInvalidError('Password Reset Link is invalid or expired');
        }
    },[getResetPasswordToken, location.search]);

    return(
        <div className="mainHandler">
            <div className="mainHeader">
                <p>
                    {t('setNewPassword.header')}
                </p>
                <hr className="introTextSeparator" />
            </div>
            <div className="mainBody">
                {resetSuccess ?
                    <div className="innerWrapper">
                        <p>
                        Password reset successfully. 
                        </p>
                        <p>Please Login.</p>
                        <div className="inputWrapper">
                            <NavLink className="navlink" to="/login/">{t('forgotPassword.body.link.signIn')}</NavLink>
                        </div>
                    </div>
                    :              
                    <div>
                        {invalidError ?
                            <div className="innerWrapper">
                                <div className="inputWrapper">
                                    <p>{invalidError}</p>
                                    <NavLink className="navlink" to="/login/">{t('forgotPassword.body.link.signIn')}</NavLink>
                                </div>
                            </div>
                        :
                        <div className="innerWrapper">
                            <p>
                                {t('setNewPassword.body.heading1')}
                            </p> 
                            <div className="inputWrapper">
                                <input 
                                    className={fieldErrors && fieldErrors.password ? 'input-error' : 'input-valid'}
                                    type="password"
                                    id="password"
                                    name="password"
                                    placeholder={t('setNewPassword.body.input.newPassword')}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}    
                                    onBlur={verifyPasswordFormat} 
                                    onFocus={(e) => eraseFieldError(e.target.name)}   
                                />
                                {fieldErrors && fieldErrors.password
                                    ? <p className="inline-error">{fieldErrors.password}</p> : ''}
                                <input
                                    className={fieldErrors && fieldErrors.password ? 'input-error' : 'input-valid'}
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    placeholder={t('setNewPassword.body.input.confirmNewPassword')}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}  
                                    onBlur={validateConfirmPassword}  
                                    onFocus={(e) => eraseFieldError(e.target.name)}    
                                />
                                {fieldErrors && fieldErrors.confirmPassword
                                    ? <p className="inline-error">{fieldErrors.confirmPassword}</p> : ''}
                                <button
                                    className="signInButton"
                                    type="button"
                                    onClick={changePasswordHandler}
                                    disabled={Object.entries(fieldErrors || {}).length > 0}
                                    value="Sign In"
                                >
                                {t('setNewPassword.body.button.changePassword')}
                                </button>
                                <NavLink className="navlink" to="/login/">{t('forgotPassword.body.link.signIn')}</NavLink>
                            </div>
                        </div>
                    }
                    </div>
                }
            </div>    
        </div>
        )
    }

export default SetNewPassword;