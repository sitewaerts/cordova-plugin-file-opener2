/*
The MIT License (MIT)

Copyright (c) 2020 pwlin - pwlin05@gmail.com

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
// https://www.electronjs.org/docs/api/shell
const {shell} = require('electron');


const fileOpenerPlugin = {
    /**
     *
     * @param {string} fileName
     * @param {CallbackContext} callbackContext
     */
    open: function ([fileName], callbackContext)
    {
        const path = _file_plugin_util.urlToFilePath(fileName);
        if (path)
        {
            shell.openPath(path)
                .then((error) =>
                {
                    if (error && error.length > 0)
                    {
                        const message = 'Failed opening file ' + path + " (" + fileName + ")";
                        callbackContext.error({status: 0, message, cause: error});
                    }
                    else
                        callbackContext.success(true);
                }, (error) =>
                {
                    const message = 'Failed opening file ' + path + " (" + fileName + ")";
                    callbackContext.error({status: 0, message, cause: error});
                });
        }
        else
        {
            shell.openExternal(fileName)
                .then(() =>
                {
                    callbackContext.success(true);
                }, (error) =>
                {
                    const message = 'Failed opening ' + fileName;
                    callbackContext.error({status: 0, message, cause: error});
                });
        }

    }
};


/**
 * cordova electron plugin api
 * @param {string} action
 * @param {Array<any>} args
 * @param {CallbackContext} callbackContext
 * @returns {boolean} indicating if action is available in plugin
 */
const plugin = function (action, args, callbackContext)
{
    if (!fileOpenerPlugin[action])
        return false;
    try
    {
        fileOpenerPlugin[action](args, callbackContext)
    } catch (e)
    {
        console.error(action + ' failed', e);
        callbackContext.error({message: action + ' failed', cause: e});
    }
    return true;
}

let _file_plugin_util;

/**
 * @param {Record<string, string>} variables
 * @param {(serviceName:string)=>Promise<any>} serviceLoader
 * @returns {Promise<void>}
 */
plugin.init = async (variables, serviceLoader)=>{
    _file_plugin_util = _file_plugin_util || (await serviceLoader('File')).util
}

module.exports = plugin;
