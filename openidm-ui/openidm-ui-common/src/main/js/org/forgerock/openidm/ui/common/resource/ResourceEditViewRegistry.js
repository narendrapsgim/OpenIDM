/**
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS HEADER.
 *
 * Copyright (c) 2015 ForgeRock AS. All rights reserved.
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

define("org/forgerock/openidm/ui/common/resource/ResourceEditViewRegistry", [
    "underscore",
    "org/forgerock/commons/ui/common/main/AbstractConfigurationAware",
    "org/forgerock/commons/ui/common/util/ModuleLoader"
], function(_, AbstractConfigurationAware, ModuleLoader) {
    var obj = new AbstractConfigurationAware();

    obj.updateConfigurationCallback = function (conf) {
        this.configuration = conf;

        _.each(conf,function(val,key){
            ModuleLoader.setAlias(key, val);
        });
    };

    obj.getEditViewModule = function (resource) {
        if(_.isUndefined(this.configuration["resource-" + resource])) {
            return ModuleLoader.load("org/forgerock/openidm/ui/common/resource/GenericEditResourceView");
        } else {
            return ModuleLoader.load(this.configuration["resource-" + resource]);
        }
    };

    return obj;
});
