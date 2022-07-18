import React, { useState } from 'react';
import { Route , Redirect, useHistory} from 'react-router-dom';
import { isExpired, decodeToken } from "react-jwt";
import $ from 'jquery';


const ProtectedRoute = ({path:path, setToken:setToken, requiredAuth:requiredAuth, component: Component, ...rest },props) => {
    let decodedToken = decodeToken(sessionStorage.getItem("access_token"));
    let isExpiredToken = isExpired(sessionStorage.getItem("access_token"));
    let history = useHistory();
    
    return (
            <Route 
                {...rest}
                render={(props) => {

                    if(isExpiredToken){

                        console.log("In ProtectedRoute, Token is Expired!");


                        $.ajax({
                            url: `/api-iec/refresh`, //TODO: update request URL
                            type: "POST",
                            beforeSend: function (xhr) {   //Include the bearer token in header
                                xhr.setRequestHeader("Authorization", 'Bearer '+ sessionStorage.getItem("refresh_token"));
                            },
                            dataType: 'json',
                            contentType: 'application/json',
                            data: JSON.stringify({
                            }),
                            xhrFields: {
                                withCredentials: true
                            },
                            crossDomain: true,
                            success: (result) => {

                                sessionStorage.setItem("access_token",result.access_token);
                                window.location.reload();
                            },
                            error: (error) => {
                                sessionStorage.removeItem("access_token")
                                sessionStorage.removeItem("refresh_token")
                                //setToken(null)
                                history.push('/api-iec/logins')
                                return(
                                    <Redirect to={{
                                        pathname: "/api-iec/logins",
                                        state:{
                                            from: props.location
                                        }
                                    }}
                                    />
                                );
                            }
                        });
                    }else{
                        let prevAuth = 0;
                        if (typeof decodedToken !== 'undefined' && decodedToken !== null && isExpiredToken === false){
                            if (decodedToken.user_claims.is_super_user === true){
                                prevAuth = 5;
                            } else if (decodedToken.user_claims.is_admin === true) {
                              prevAuth = 4;
                            } else if (decodedToken.user_claims.is_manager === true) {
                              prevAuth = 3;
                            } else if (decodedToken.user_claims.is_audit === true) {
                              prevAuth = 2;
                            } else if (decodedToken.user_claims.is_integration_engineer === true) {
                              prevAuth = 1;
                            } 

                            console.log("In ProtectedRoute.js, prevAuth: ", prevAuth, " & requiredAuth: ", requiredAuth)
                            
                            if (prevAuth >= requiredAuth){
                                return(<Component {...rest} {...props} setToken={setToken}/>);
                            }else{
                                return(
                                    <Redirect to={{
                                        pathname: "/",
                                        state:{
                                            from: props.location
                                        }
                                    }}
                                    />
                                );       
                            }
                            
                        } else{
                            return(
                                <Redirect to={{
                                    pathname: "/logins",
                                    state:{
                                        from: props.location
                                    }
                                }}
                                />
                            );
                        }
                    }
                }} />
          )

    
}

export default ProtectedRoute;
