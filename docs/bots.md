# building a Sphinx bot

### setup

Setup and run the `sphinx-stack` cluster.

But instead of just `docker-compose up -d` we want to run our bots aswell
we can do this by running `docker-compose -f docker-compose.yml -f alts/bots.yml up -d`

### frontend

Run one of the Sphinx frontends. The easiest one to get up and running is [sphinx-desktop](https://github.com/stakwork/sphinx-win-linux-desktop). This repository is for the Windows/Linux desktop app, but it runs fine on Mac as well.

Once you have the Desktop App running, open the `NODES.json` file in `sphinx-stack/relay`. You will see an `exported_keys` string under "alice"... copy that string (make sure to include the trailing equals sign if it exists!). Enter the string into the Desktop App, then enter the PIN (111111). Now you are connected to the local Docker cluster!

![startup](https://github.com/stakwork/sphinx-stack/raw/master/docs/img/startup.png)

Now our example bot is already running when we created the spinx-stack.

The sphinx-example-bot is located under `./sphinx-stack/botSandBox/sphinx-example-bot`

### use the bot!

Back in the Desktop App, create a new tribe using the main menu. In tribes that you create, you can run MotherBot commands to serach, install, and uninstall bots.

- `/bot search example`: will return your newly created example bot
- `/bot install example`: will install the bot in your new tribe!
- `/example test`: will run the "test" command in your bot!

### make a change to the bot

Open the file under `./sphinx-stack/botSandBox/sphinx-example-bot/index.js` and edit the response under `case 'test'`
now try calling that command again.... CONGRATS!! You are offically a bot developer!
