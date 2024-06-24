# Nillion Secure Weather Temperater Guess using Nada Program

## Introduce
Guess The Weather is an engaging and interactive app developed for the Nillion Tinybin bounty challenge. This app allows users to forecast the temperature for the following day in Da Nang and then compare their predictions with the actual temperature retrieved from a weather API. Additionally, the app demonstrates secure data comparison using Nillion's Nada programs.

## Key features
### Secure Bin:
Utilizing the Nada program, the app ensures that all temperature predictions are securely encrypted and protected from unauthorized access. This maintains the confidentiality of each user's forecast for Da Nang's weather the next day.

### Advanced Technology:
Utilizing Nillion's innovative technology, the app securely computes and compares users' temperature predictions while ensuring the privacy of each participant is maintained.

### Transparent Results:
You can forecast the temperature in Da Nang for the following day and compare your prediction with data from Open-Meteo.


## Requirements

Before you begin, you need to install the following tools:

- `nilup`, an installer and version manager for the [Nillion SDK tools](https://docs.nillion.com/nillion-sdk-and-tools). Install nilup:

  _For the security-conscious, please download the `install.sh` script, so that you can inspect how
  it works, before piping it to `bash`._

  ```
  curl https://nilup.nilogy.xyz/install.sh | bash
  ```

  - Confirm `nilup` installation
    ```
    nilup -V
    ```

- [Nillion SDK tools](https://docs.nillion.com/nillion-sdk-and-tools) Use `nilup` to install these:
  ```bash
  nilup install latest
  nilup use latest
  nilup init
  ```
  - Confirm global Nillion tool installation
    ```
    nillion -V
    ```
- [Node (>= v18.17)](https://nodejs.org/en/download/)

  - Check version with
    ```
    node -v
    ```

- [python3](https://www.python.org/downloads/) version 3.11 or higher with a working [pip](https://pip.pypa.io/en/stable/getting-started/) installed

  - Confirm that you have python3 (version >=3.11) and pip installed:
    ```
    python3 --version
    python3 -m pip --version
    ```

- Yarn ([v1](https://classic.yarnpkg.com/en/docs/install/) or [v2+](https://yarnpkg.com/getting-started/install))
  - Check version with
    ```
    yarn -v
    ```
- [Git](https://git-scm.com/downloads)

To use this app, you need to have the MetaMask Flask browser extension installed and to store your Nillion user key in MetaMask Snaps

1. Install the [MetaMask Flask browser extension](https://docs.metamask.io/snaps/get-started/install-flask/) that will let you work with experimental snaps.
2. Create a new test wallet in MetaMask Flask
3. Temporarily disable any other wallet browser extensions (Classic MetaMask, Rainbow Wallet, etc.) while using MetaMask Flask
4. [Visit the Nillion Key Management UI](https://nillion-snap-site.vercel.app/) to generate a user key and store it in MetaMask Snaps - this saves your user key within MetaMask so it can be used by other Nillion web apps
5. This quickstart will ask you to "Connect to Snap" to use your Nillion user key

## Quickstart

To get started, follow the steps below:

### 1. Clone this repo & install dependencies

```
git clone https://github.com/thu142857/tinybin-nillion-blind-app.git
cd tinybin-nillion-blind-app
yarn install
```

### 2. Run the Nillion devnet in the first terminal:

This bootstraps Nillion devnet, a local network of nodes and adds cluster info to your NextJS app .env file and blockchain info to your Hardhat .env file

```
yarn nillion-devnet
```

### 3. Run a local ethereum network in the second terminal:

```
yarn chain
```

This command starts a local Ethereum network using Hardhat. The network runs on your local machine and can be used for testing and development. You can customize the network configuration in `hardhat.config.ts`.

### 4. Open a third terminal and deploy the test ethereum contract:

```
yarn deploy
```

This command deploys a test smart contract to the local network. The contract is located in `packages/hardhat/contracts` and can be modified to suit your needs. The `yarn deploy` command uses the deploy script located in `packages/hardhat/deploy` to deploy the contract to the network. You can also customize the deploy script.

### 6. Open one more terminal to start your NextJS web app:

```
cd packages/nextjs
```

Install nextjs app
```
pnpm install
```

Run app
```
pnpm dev
```

Visit your app on: `http://localhost:3000`.
