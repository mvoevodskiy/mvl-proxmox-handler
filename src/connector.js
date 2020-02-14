const querystring = require("querystring");
const exec = require('child_process').exec;

class ProxmoxConnector {
    constructor(username, password, hostname) {
        this.url = `https://${hostname}:8006/api2/json`;
        this.auth = `username=${username}&password=${password}`;

        this.token = {
            CSRF: '',
            PVEAuth: '',
            timeStamp: 0
        };
    }

    async get(path, data) {
        if ((this.token.timeStamp + 7200) < new Date().getTime()) {
            await this.authorize();
        }

        let str = '';
        str += 'curl -k ';
        str += ('-b ' + 'PVEAuthCookie=' + this.token.PVEAuth);
        if (data) {
            const dataString = querystring.stringify(data);
            str += ('-d ' + '"' + dataString + '"' + ' ');
        }
        str += (' ' + this.url + path);
        return await this._execCurl(str);
    }

    async post(path, data = {}) {
        if ((this.token.timeStamp + 7200) < new Date().getTime()) {
            await this.authorize();
        }

        const dataString = querystring.stringify(data);
        let str = 'curl -XPOST -k ';
        str += ('-b ' + 'PVEAuthCookie=' + this.token.PVEAuth + ' ');
        str += ('-H ' + '"' + 'CSRFPreventionToken:' + this.token.CSRF + '"' + ' ');
        str += ('-d ' + '"' + dataString + '"' + ' ');
        str += (this.url + path);
        return await this._execCurl(str);
    }

    async delete(path) {
        if ((this.token.timeStamp + 7200) < new Date().getTime()) {
            await this.authorize();
        }

        let str = 'curl -X DELETE -k ';
        str += ('-b ' + 'PVEAuthCookie=' + this.token.PVEAuth + ' ');
        str += ('-H ' + '"' + 'CSRFPreventionToken:' + this.token.CSRF + '"' + ' ');
        str += (this.url + path);
        return await this._execCurl(str);
    }

    async authorize() {
        let response = await this.postAuth('/access/ticket', this.auth);
        let responseParsed = JSON.parse(response);
        this.token.CSRF = responseParsed.data.CSRFPreventionToken;
        this.token.PVEAuth = responseParsed.data.ticket;
        this.token.timeStamp = new Date().getTime()
    }

    async postAuth(path, data) {
        let str = 'curl -XPOST -k ';
        str += ('-d ' + '"' + data + '"' + ' ');
        str += (this.url + path);
        return await this._execCurl(str);
    }

    async _execCurl(str) {
        return new Promise(function (resolve) {
            exec(str, function (error, stdout, stderr) {
                if (error) {
                    console.warn(error);
                }
                resolve(stdout ? stdout : stderr);
            }.bind(this));
        }.bind(this));
    }
}

module.exports = ProxmoxConnector;
