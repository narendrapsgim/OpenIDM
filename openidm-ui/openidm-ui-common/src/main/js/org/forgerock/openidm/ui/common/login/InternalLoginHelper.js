/**
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS HEADER.
 *
 * Copyright (c) 2011-2013 ForgeRock AS. All rights reserved.
 *
 * The contents of this file are subject to the terms
 * of the Common Development and Distribution License
 * (the License). You may not use this file except in
 * compliance with the License.
 *
 * You can obtain a copy of the License at
 * http://forgerock.org/license/CDDLv1.0.html
 * See the License for the specific language governing
 * permission and limitations under the License.
 *
 * When distributing Covered Code, include this CDDL
 * Header Notice in each file and include the License file
 * at http://forgerock.org/license/CDDLv1.0.html
 * If applicable, add the following below the CDDL Header,
 * with the fields enclosed by brackets [] replaced by
 * your own identifying information:
 * "Portions Copyrighted [year] [name of copyright owner]"
 */

/*global define */

define("org/forgerock/openidm/ui/common/login/InternalLoginHelper", [
    "underscore",
    "AuthnDelegate",
    "org/forgerock/commons/ui/common/main/EventManager",
    "org/forgerock/commons/ui/common/main/AbstractConfigurationAware",
    "org/forgerock/commons/ui/common/main/ServiceInvoker",
    "org/forgerock/commons/ui/common/main/Configuration",
    "org/forgerock/commons/ui/common/util/CookieHelper",
    "org/forgerock/openidm/ui/common/util/AMLoginUtils"
], function (_, authnDelegate, eventManager, AbstractConfigurationAware, serviceInvoker, conf, cookieHelper, amLoginUtils) {
    var obj = new AbstractConfigurationAware();

    obj.login = function(params, successCallback, errorCallback) {
        cookieHelper.deleteCookie("session-jwt", "/", ""); // resets the session cookie to discard old session that may still exist
        return authnDelegate.login(params.userName, params.password, {
                "forbidden": {
                    status: "403"
                },
                "unauthorized": {
                    status: "401",
                    message: "authenticationFailed"
                }
            }).then(function(user) {
                conf.globalData.userComponent = user.component;

                if (successCallback) {
                    successCallback(user);
                }

                return user;
            }, errorCallback);
    };

    obj.logout = function (successCallback, errorCallback) {
        delete conf.loggedUser;
        cookieHelper.deleteCookie("session-jwt", "/", ""); // resets the session cookie to discard old session that may still exist

        if(conf.globalData.openamAuthEnabled){
            amLoginUtils.openamLogout(successCallback);
            return false;
        }

        successCallback();

    };

    obj.getLoggedUser = function(successCallback, errorCallback) {
        return authnDelegate.getProfile({
            "forbidden": {
                status: "403"
            },
            "unauthorized": {
                status: "401"
            }
        }).then(function(user) {
            conf.globalData.userComponent = user.component;

            if (successCallback) {
                successCallback(user);
            }

            return user;
        }, function(e) {
            if(e.responseJSON && e.responseJSON.detail && e.responseJSON.detail.failureReasons && e.responseJSON.detail.failureReasons.length){
                if(_.where(e.responseJSON.detail.failureReasons,{ isAlive: false }).length){
                    conf.globalData.authenticationUnavailable = true;
                }
            }
            errorCallback();
        });

    };
    return obj;
});