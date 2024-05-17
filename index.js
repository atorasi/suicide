const { Wallet } = require('ethers');
const http = require('redaxios');
const fs = require('fs').promises;

const message = 'This is a sybil address';


async function main() {
    const privateKeyList = await fs.readFile('keys.txt', 'utf-8');
    const privateKeys = privateKeyList.split('\n').map(key => key.trim()).filter(key => key !== '');

    for (const privateKey of privateKeys) {
        try {
            const wallet = new Wallet(privateKey);
            const signature = await wallet.signMessage(message);

            const {data} = await http.post('https://sybil.layerzero.network/api/report', {
                chainType: 'evm',
                signature,
                message,
                address: wallet.address,
            })

            console.log("ВЫ ЗАЕБАШИЛИ СВОЙ ЖЕ АККАУНТ: ", wallet.address);
        } catch (error) {
            console.error(error);
        }
    }
}

main()
