import { createSolAddress, importSolWallet, verifySolAddress, signSolTransaction, createNonceAccount, createStakingAccount } from "../wallet";
import * as bip39 from "bip39";

describe("sol wallet test", () => {
    test("create sol address", () => {
        const mnemonic = "";
        const seed = bip39.mnemonicToSeedSync(mnemonic, "");
        const addressInfo = createSolAddress(seed.toString("hex"), "0");
        console.log(addressInfo);
    })

    test("import sol wallet", () => {
        const secretKey = "";
        const addressInfo = importSolWallet(secretKey);
        console.log(addressInfo);
    })

    test("verify sol address", () => {
        const address = "8C6xzZPT3UKxgf7dUBvnbbLwF5u64hM3gqDKDz4KXTV8";
        const isAddress = verifySolAddress(address);
        console.log(isAddress);
    })

    test("sign sol-transaction", async () => {
        const tx_msg = await signSolTransaction({
            secretKey: "",
            nonce: "",
            from: "",
            to: "",
            amount: "0.0004",
            decimal: 9,
            hasCreatedTokenAddress: true,
            mintAddress: "0x00"
        })
        console.log("tx_msg===",tx_msg);
    })

    test('Sign sol-token-Transaction', async () => {
        const tx_msg = await signSolTransaction({
            secretKey: "",
            authorSecretKey: "",
            nonceAccountSecretKey: "",
            from: "",
            to: "",
            amount: "0.001",
            decimal: 6,
            hasCreatedTokenAddr: false,
            mintAddress: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
            txType: "TRANSFER_TOKEN"
        })
        console.log("tx_msg===", tx_msg)
    });

    test('create nonceAccount', async () => {
        const tx_msg = await createNonceAccount({
            authorSecretKey: "",
            nonceSecretKey: "",
            recentBlockhash: "DGDqGa3vG2SCLecfwgdr9dveNmWTUyEk3mdRaAfALQZm",
            minBalanceForRentExemption: 1238880,
        })
        console.log("tx_msg===", tx_msg)
    });

    test('create stakeAccount', async () => {
        const tx_msg = await createStakingAccount({
            authorSecretKey: "55a70321542da0b6123f37180e61993d5769f0a5d727f9c817151c1270c290963a7b3874ba467be6b81ea361e3d7453af8b81c88aedd24b5031fdda0bc71ad32",
            stakeSecretKey: "ae7aebb8767bb0117f2034c6f13a971a8327676092b30d87cd069620deaa133a0eb55ff73c71d436f86e2388ff8ebc55e77a1a5ffa6e4a5c56cdb3517f25c0e0",
            lamportsForStakeAccount: 19947680,
            recentBlockhash: "EusW5Ltz8HsaG4nqaWA7aMo6cq5hJpf7z9eGcTeYifQS",
            voteAccountAddress: "7PmWxxiTneGteGxEYvzj5pGDVMQ4nuN9DfUypEXmaA8o"
        })
        console.log("txSignHex==", tx_msg);
    });
})