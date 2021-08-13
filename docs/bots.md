# building a Sphinx bot

### setup

Setup and run the `sphinx-stack` cluster.

### frontend

Run one of the Sphinx frontends. The easiest one to get up and running is [sphinx-desktop](https://github.com/stakwork/sphinx-win-linux-desktop). This repository is for the Windows/Linux desktop app, but it runs fine on Mac as well.

Once you have the Desktop App running, open the `NODES.json` file in `sphinx-stack/relay`. You will see an `exported_keys` string under "alice"... enter that string into the Desktop App, then enter the PIN (111111). Now you are connected to the local Docker cluster!

Create a Bot using the button in the upper right. Name is `example` and set the webhook to `http://localhost:3333`. You will then see a `token`

### build your bot

Clone the example repo: [sphinx-example-bot](https://github.com/stakwork/sphinx-example-bot). Create a file in the repo called `.env` : (replace **\*** with the token generated in the Desktop App)

```
SPHINX_TOKEN=*****
PORT=3333
```

- `npm install`
- `npm run build`
- `npm run start`

Check out the `index.js` file to see how to build new bot commands! You can integrate any node.js package or external service in your bot

### use the bot!

Back in the Desktop App, create a new tribe using the main menu. In tribes that you create, you can run MotherBot commands to serach, install, and uninstall bots.

- `/bot search example`: will return your newly created example bot
- `/bot install example`: will install the bot in your new tribe!
- `/example test`: will run the "test" command in your bot!
