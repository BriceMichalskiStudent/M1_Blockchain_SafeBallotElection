# SafeBallotElection

The SafeBallotElection project will make it possible to carry out online voting anonymously while ensuring the reliability and immutability of the counts.

SafeBallotElection is a truffle school project.

## Prerequisite

### Install Nodejs & Npm

```bash
# Debian Distribution :
$ sudo apt-get update
$ sudo apt install nodejs -y


# Redhat Distribution :
$ sudo yum install -y gcc-c++ make
$ curl -sL https://rpm.nodesource.com/setup_6.x | sudo -E bash
$ sudo yum install nodejs -y

```

### Install Truffle

```bash
$ npm install -g truffle
```

### Install Ganache

Refer to [Ganache Documentation](https://www.trufflesuite.com/docs/ganache/quickstart#1-install-ganache)

### Create Ganache Workspace

Refer to
[Ganache Documentation](https://www.trufflesuite.com/docs/ganache/quickstart#1-install-ganache)

### Uninstall Metamask extension on your browser

For the moment metamask is in conflict with us, please uninstall it.

## Installation for development

### Install project dependency

```bash
npm install
```

### Configure [truffle-config.js](truffle-config.js)

```js
module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // for more about customizing your Truffle configuration!
  networks: {
    development: {
      host: "127.0.0.1", // Change your Ganache adress if needed
      port: 7545, // Change your Ganache port if needed
      network_id: "*"
    },
    develop: {
      port: 8545
    }
  }
};
```

### Deploy smart contract

```bash
$ npm run truffle
```

### Run local development server

```bash
$ npm run dev
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
