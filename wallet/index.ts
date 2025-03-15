import { HDKey } from "micro-ed25519-hdkey";
import { Keypair, Transaction, PublicKey, SystemProgram, StakeProgram } from "@solana/web3.js";
import * as SPLToken from '@solana/spl-token';

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

export function importSolWallet(secretKey: string) {
    const keypair = Keypair.fromSecretKey(Buffer.from(secretKey, 'hex'));
    const result = { 
        secretKey: Buffer.from(keypair.secretKey).toString('hex'),
        address: keypair.publicKey.toBase58()
    };
    return JSON.stringify(result, null, 2);
}

export function verifySolAddress(address: string) {
    return /^[1-9A-HJ-NP-Za-km-z]{44}$/.test(address);
}

export async function signSolTransaction(params: any) {
    const { secretKey, nonce, from, to, amount, decimal, mintAddress, hasCreatedTokenAddress, authorSecretKey, nonceSecretKey } = params;
    const fromAccount = Keypair.fromSecretKey(Buffer.from(secretKey, 'hex'));
    const authorAccount = Keypair.fromSecretKey(Buffer.from(authorSecretKey, 'hex'));
    const nonceAccount = Keypair.fromSecretKey(Buffer.from(nonceSecretKey, 'hex'));
    // Solana 的 SDK底层使用二进制公钥（Uint8Array）进行交易签名、地址派生等操作。 
    // Solana 的地址使用的是公钥的 Base58 编码，地址解码为 Uint8Array，其实就是公钥
    const fromPubkey = new PublicKey(from);
    const toPubKey = new PublicKey(to);
    const value = parseFloat(amount) * Math.pow(10, decimal);
    
    let tx = new Transaction();

    // SPL Token转账
    if (mintAddress != "0x00") {
        const mint = new PublicKey(mintAddress);
        // 获取关联代币账户 ATA 地址
        const fromAssociatedTokenAccountAddress = await SPLToken.Token.getAssociatedTokenAddress(
            SPLToken.ASSOCIATED_TOKEN_PROGRAM_ID, // 关联账户程序
            SPLToken.TOKEN_PROGRAM_ID, // 代币标准程序
            mint, // 代币合约地址
            fromPubkey // 用户钱包地址
        )
        const toAssociatedTokenAccountAddress = await SPLToken.Token.getAssociatedTokenAddress(
            SPLToken.ASSOCIATED_TOKEN_PROGRAM_ID,
            SPLToken.TOKEN_PROGRAM_ID,
            mint,
            toPubKey
        )
        // 接收方代币账户存在
        if (hasCreatedTokenAddress) {
            tx.add(
                // 更新 nonceAccount 的 nonce
                SystemProgram.nonceAdvance({
                    noncePubkey: nonceAccount.publicKey,
                    authorizedPubkey: authorAccount.publicKey,
                }),
                // 创建代币转账指令
                SPLToken.Token.createTransferInstruction(
                    SPLToken.TOKEN_PROGRAM_ID,
                    fromAssociatedTokenAccountAddress, // 发送方代币账户地址
                    toAssociatedTokenAccountAddress, // 接收方代币账户地址
                    fromPubkey, // 发送方用户钱包地址
                    [fromAccount], // 签名用户账户列表（需私钥签名）
                    value // 转账金额
                )
            )
        } else {
            // 接收方代币账户不存在
            tx.add(
                // 更新 nonceAccount 的 nonce
                SystemProgram.nonceAdvance({
                    noncePubkey: nonceAccount.publicKey,
                    authorizedPubkey: authorAccount.publicKey,
                }),
                // 创建接收方代币账户
                SPLToken.Token.createAssociatedTokenAccountInstruction(
                    SPLToken.ASSOCIATED_TOKEN_PROGRAM_ID,
                    SPLToken.TOKEN_PROGRAM_ID,
                    mint, // 合约地址
                    toAssociatedTokenAccountAddress, // 代币账户地址
                    toPubKey, // 用户钱包地址
                    fromPubkey // 支付租金的钱包地址
                ),
                // 创建代币转账指令
                SPLToken.Token.createTransferInstruction(
                    SPLToken.TOKEN_PROGRAM_ID,
                    fromAssociatedTokenAccountAddress, // 发送方代币账户
                    toAssociatedTokenAccountAddress, // 接收方代币账户
                    fromPubkey, // 发送方钱包地址
                    [fromAccount], // 签名主账户列表（需私钥签名）
                    value // 转账金额
                )
            )
        }
    } else {
        // Native Token转账
        tx.add(
            SystemProgram.nonceAdvance({
                noncePubkey: nonceAccount.publicKey,
                authorizedPubkey: authorAccount.publicKey,
            }),
            SystemProgram.transfer({
                fromPubkey: fromAccount.publicKey,
                toPubkey: toPubKey,
                lamports: value,
            })
        )
    }
    // 签名
    // tx.recentBlockhash = nonce; // 手动设置 nonce
    tx.sign(fromAccount);
    const serializedTransferTx = tx.serialize().toString("base64");
    return serializedTransferTx;
}

export function createNonceAccount(params: any) {
    const { authorSecretKey, nonceSecretKey, recentBlockhash, minBalanceForRentExemption } = params;
    const authorAccount = Keypair.fromSecretKey(Buffer.from(authorSecretKey, 'hex'));
    const nonceAccount = Keypair.fromSecretKey(Buffer.from(nonceSecretKey, 'hex'));
    
    const tx = new Transaction();
    tx.add(
        // 创建账户
        SystemProgram.createAccount({
            fromPubkey: authorAccount.publicKey, // 支付租金的授权账户地址
            newAccountPubkey: nonceAccount.publicKey, // 新创建的账户地址
            lamports: minBalanceForRentExemption, // 租金金额
            space: StakeProgram.space, // 账户空间大小（质押账户固定空间）
            programId: StakeProgram.programId // 账户所属程序（质押程序）
        }),
        // 初始化 Nonce账户
        SystemProgram.nonceInitialize({
            noncePubkey: nonceAccount.publicKey, // Nonce 账户地址（将新账户初始化为 Nonce 账户）
            authorizedPubkey: authorAccount.publicKey, // 授权账户地址（只有该地址可更新 Nonce）
        })
    )
    // 签名
    tx.recentBlockhash = recentBlockhash;
    tx.sign(authorAccount, nonceAccount); // 必须由创建者和新账户签名
    const serializedTx = tx.serialize().toString("base64");
    return serializedTx;
}