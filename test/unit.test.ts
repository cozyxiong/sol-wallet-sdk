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
        const secretKey = "aaad9398934126d3f4c6c530806a16da69122057d7ad67d3f31f9fd38db014ef6ad9f14590589c71f4fc7b393b8dee8d8d39c7da9da3be9cd658f461c57afcf7";
        const addressInfo = importSolWallet(secretKey);
        console.log(addressInfo);
    })
})