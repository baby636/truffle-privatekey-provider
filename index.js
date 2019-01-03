const ProviderEngine = require("web3-provider-engine");
const FiltersSubprovider = require('web3-provider-engine/subproviders/filters.js');
const WalletSubprovider = require('web3-provider-engine/subproviders/wallet.js');
const ProviderSubprovider = require("web3-provider-engine/subproviders/provider.js");
const NonceSubprovider = require('web3-provider-engine/subproviders/nonce-tracker.js');
const EthereumjsWallet = require('ethereumjs-wallet');
const Web3 = require("web3");

function PrivateKeyProvider(privateKey, provider_url) {
    if (!privateKey) {
        throw new Error(`Private Key missing, non-empty string expected, got "${privateKey}"`);
    }

    if (!provider_url) {
        throw new Error(`Provider URL missing, non-empty string expected, got "${provider_url}"`);
    }

    this.wallet = EthereumjsWallet.fromPrivateKey(new Buffer(privateKey, "hex"));
    this.address = "0x" + this.wallet.getAddress().toString("hex");

    this.engine = new ProviderEngine();
    
    this.engine.addProvider(new WalletSubprovider(this.wallet, {}));
    this.engine.addProvider(new FiltersSubprovider());
    this.engine.addProvider(new NonceSubprovider());
    this.engine.addProvider(new ProviderSubprovider(new Web3.providers.HttpProvider(provider_url)));
    this.engine.start(); // Required by the provider engine.
};

PrivateKeyProvider.prototype.send = function() {
  this.engine.send.apply(this.engine, arguments);
};

module.exports = PrivateKeyProvider;