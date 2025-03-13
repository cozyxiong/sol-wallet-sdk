import { createSolAddress, importSolWallet } from "../wallet";
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
})