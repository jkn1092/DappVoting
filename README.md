# Dapp Voting Alyra

Daap de vote basé sur un smart contract de vote et proposals.

## Contributeurs

- Jérémy Narrinasamy
- Hela Cherif

## Sources
- Vidéo : https://www.loom.com/share/3a9f121d00f64884891638df986e606d
- Dapp déployé : https://dapp-voting-alyra-tau.vercel.app/
- Youtube : https://youtu.be/4ZOQvXPz05M

## Installation

First ensure you are in an empty directory.

Run the `unbox` command using 1 of 2 ways.

```sh
# Install Truffle globally and run `truffle unbox`
$ npm install -g truffle
$ truffle unbox react
```

```sh
# Alternatively, run `truffle unbox` via npx
$ npx truffle unbox react
```

```sh
# Start ganache
$ ganache
```

```sh
# Migrate contract to ganache
$ truffle migrate --reset
```

Start the react dev server.

```sh
$ cd client
$ npx next dev
```

From there, follow the instructions on the hosted React app. It will walk you through using Truffle and Ganache to deploy the `Voting` contract, making calls to it, and sending transactions to change the contract's state.

## FAQ

- __How do I use this with Ganache (or any other network)?__

  The Truffle project is set to deploy to Ganache by default. If you'd like to change this, it's as easy as modifying the Truffle config file! Check out [our documentation on adding network configurations](https://trufflesuite.com/docs/truffle/reference/configuration/#networks). From there, you can run `truffle migrate` pointed to another network, restart the React dev server, and see the change take place.

- __Where can I find more resources?__

  This Box is a sweet combo of [Truffle](https://trufflesuite.com) and [Webpack](https://webpack.js.org). Either one would be a great place to start!
