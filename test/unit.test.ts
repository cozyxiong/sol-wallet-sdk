import { createSolAddress, importSolWallet, verifySolAddress, signSolTransaction, createNonceAccount, createStakingAccount, deactivateStake, withdrawFunds } from "../wallet";
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
            authorSecretKey: "",
            stakeSecretKey: "",
            lamportsForStakeAccount: 19947680,
            recentBlockhash: "EusW5Ltz8HsaG4nqaWA7aMo6cq5hJpf7z9eGcTeYifQS",
            voteAccountAddress: "7PmWxxiTneGteGxEYvzj5pGDVMQ4nuN9DfUypEXmaA8o"
        })
        console.log("txSignHex==", tx_msg);
    });

    test('deactivate stake', async () => {
        const tx_msg = await deactivateStake({
            authorSecretKey: "",
            stakeSecretKey: "",
            recentBlockhash: "C4L6FyFLeH1tryUtLcSNNi8WUyRVUfKyhrQGBxS8i7RA"
        })
        console.log("txSignHex==", tx_msg);

    });

    test('withdraw funds', async () => {
        const tx_msg = await withdrawFunds({
            authorSecretKey: "",
            stakeSecretKey: "",
            recentBlockhash: "5Sqn7oLnVRkkdFV2Dy1hiR1HnUJusuvBQ8NFP4yXJH8j",
            stakeBalance: 1010592,
        })
        console.log("txSignHex==", tx_msg);
    });
})