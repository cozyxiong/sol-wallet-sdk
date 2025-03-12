import { HDKey } from "micro-ed25519-hdkey";
import { Keypair } from "@solana/web3.js";

export function createSolAddress(seedHex: string, addressIndex: string) {
    const rootNode = HDKey.fromMasterSeed(Buffer.from(seedHex, 'hex'));
    const childNode = rootNode.derive(`m/44'/501'/${addressIndex}'/0'`);
    // childNode.privateKey 私钥（Ed25519 的 32 字节随机数），用于生成 keypair
    const keypair = Keypair.fromSeed(childNode.privateKey);
    const result = { 
        // keypair.secretKey 私钥 + 公钥（64 字节的 Uint8Array）
        secretKey: Buffer.from(keypair.secretKey).toString('hex'),
        // keypair.publicKey 公钥（32 字节的 Uint8Array）
        // keypair.publicKey.toBase58() 地址（公钥的 base58 编码）
        address: keypair.publicKey.toBase58()
    };
    return JSON.stringify(result, null, 2); 
}