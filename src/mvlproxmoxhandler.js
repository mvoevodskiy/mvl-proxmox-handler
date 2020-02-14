const MVLoaderBase = require('mvloader/src/mvloaderbase');
const ProxmoxConnector = require('./connector');

class MVLProxmoxHandler extends MVLoaderBase {
    constructor (...config) {
        let defaults = {
            node: 'promo-test',
            baseIDForClone: '200',
            username: '',
            password: '',
            hostname: '',
        };
        super(defaults, ...config);
    }

    async init() {
        super.init();

        const {username, password, hostname} = this.config;
        this.connector = new ProxmoxConnector(username, password, hostname);
    }

    async startVM(vmid) {
        return await this.connector.post(`/nodes/${this.config.node}/lxc/${vmid}/status/start`);
    }

    async stopVM(vmid) {
        return await this.connector.post(`/nodes/${this.config.node}/lxc/${vmid}/status/stop`);
    }

    async rebootVM(vmid) {
        return await this.connector.post(`/nodes/${this.config.node}/lxc/${vmid}/status/reboot`);
    }

    async deleteVM(vmid) {
        return await this.connector.delete(`/nodes/${this.config.node}/lxc/${vmid}`);
    }

    async getStatusVM(vmid) {
        let result = await this.connector.get(`/nodes/${this.config.node}/lxc/${vmid}/status/current`);
        return JSON.parse(result).data;
    }

    async cloneVM(newid) {
        let url = `/nodes/${this.config.node}/lxc/${this.config.baseIDForClone}/clone`;
        return await this.connector.post(url, {newid});
    }
}

module.exports = MVLProxmoxHandler;
