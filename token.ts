//@ts-ignore
import * as TronWeb from "tronweb";

export default class TRONTokenClient {
    // @ts-ignore
    async start(): Promise<any> {
        const testNetProvider = 'https://api.shasta.trongrid.io';
        const netProvider = testNetProvider;
        const fullNode = netProvider;
        const solidityNode = netProvider;
        const eventServer = netProvider;
        const privateKey = 'PK_TEST_WALLET';
        const tronWeb = new TronWeb(
            fullNode,
            solidityNode,
            eventServer,
            privateKey
        );
        const defaultTestAddress = tronWeb.address.fromPrivateKey(privateKey);
        await this.createTestTRC10Token(tronWeb, defaultTestAddress, privateKey);
        // Verify at: https://shasta.tronscan.org/#/
    }
    async signAndSubmitTx(tronWeb:any, rawTxObject:any, privateKey:any) {
        console.log(rawTxObject);
        const sign = await tronWeb.trx.sign(rawTxObject, privateKey);
        console.log({sign});
        const tx = await tronWeb.trx.sendRawTransaction(sign);
        // console.log(tx);
        return tx;
    }
    async createTestTRC10Token(tronWeb:any, issuerAddress:any, privateKey:any) {
        try {
            let options = {
                name: 'Name',
                abbreviation: 'TTT',
                description: 'Description',
                url: 'testtoken.com',
                totalSupply: 1000000000,
                trxRatio: 1,
                tokenRatio: 1,
                saleStart: Date.now() + 10000,
                saleEnd: Date.now() + 31536000000,
                freeBandwidth: 0,
                freeBandwidthLimit: 0,
                frozenAmount: 0,
                frozenDuration: 0
            };
            const issuerHex = tronWeb.address.toHex(issuerAddress);
            const rawTxObj = await tronWeb.transactionBuilder.createToken(options, issuerHex);
            console.log({rawTxObj});
            const res = await this.signAndSubmitTx(tronWeb, rawTxObj, privateKey);
            console.log({res});
        } catch (e) {
            console.error(e);
        }
    }
}

(() => {
    const token = new TRONTokenClient();
    token.start().then(r => console.log("ll ", r));
})();