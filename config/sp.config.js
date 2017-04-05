module.exports = function () {
    return {
        env: 'MacysPartners',  //MyMacys, MyBloomingdales
        driveLetter: 'S:',
        serverName: 'MT000XSSPP31.extranet.corp',   //'MT000XSSPP31.extranet.corp' = MacysPartners,  //mt000xsspp42=preprod
        paths : {
            js : {
                start: '\\Program Files\\Common Files\\microsoft shared\\Web Server Extensions\\15\\TEMPLATE\\LAYOUTS\\',
                end:'\\Scripts'
            },
            css: '\\Program Files\\Common Files\\microsoft shared\\Web Server Extensions\\16\\TEMPLATE\\LAYOUTS\\1033\\STYLES\\'
        }
    };
};
