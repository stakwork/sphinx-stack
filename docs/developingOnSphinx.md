# Developing/Contributing on Sphinx-Stack!

Hey there congragulations if you'd made it to this point you probably have already gotten `sphinx-stack` up and running are ready to develop either on its parts or around it (ie bots). If you havent reached this point yet we would recommend that you checkout the [setup tutorial](https://github.com/stakwork/sphinx-stack#readme).

# Components to stack

Now as may know there are multiple parts to the `sphinx-stack` some being but not limited to `sphinx-relay` `sphinx-tribes` `sphinx-meme` and more parts.

As of now these are the components to the stack that are in the default `docker-compose.yml`

```
sphinx-relay [node typescript]
	alice.sphinx
	bob.sphinx
	carol.sphinx

db (tribes db) [posgres]
	db.sphinx

sphinx-tribes (GO lang and ReactJs Frontend)
	tribes.sphinx

sphinx-auth [Go lang]
	auth.sphinx

sphinx-mqtt [Go Lang]
	mqtt.sphinx

sphinx-meme [Go Lang]
	meme.sphinx

lnzap/lnd (lighting node) [not sphinx maintained]
	alice-lnd.sphinx
	bob-lnd.sphinx
	carol-lnd.sphinx

lncm/bitcoind (bitcoin node) [not sphinx maintained]
	bitcoind.sphinx
```

But as you're developing on the sphinx infrastructure there maybe a few things you want to know or some knowlege base that you would like to have

1. How to modify image in the stack
2. How to troubleshoot stack if not working

## How to modify an Image in the stack

This is when we want to modify one of the containers that are running in the stack and I can run through the steps in an example
Example
Say we wanted to updtate `sphinx-relay` such that it clears your db's old message after a certain age. Then we must make a change in `sphinx-relay` so...

1. Make sure `sphinx-stack` is up and running, and test that the change is not working yet
2. Go into `sphinx-relay` and update the code
3. To update the image first do what every you need to build the code/make generated files locally for `sphinx-relay` this is `npm run build`
4. Now build the new image `docker build -t sphinxlightning/sphinx-relay .` (dont forget the dot at the end)
5. go back to `sphinx-stack` and run `docker-compose up -d` and it should restart the stack with the new changes you've made
6. **optional** if you come accross issues trying to run the stack it might be worth checking out the troubleshooting section

And there you go you have offically modified an image in the stack, the proccess should be similar for every image you would want to update.

## Troubleshooting the stack

Now some times there will be issues with your stack and below are some common issues and how to resolve them

1). An error that looks something like this

<img src="https://user-images.githubusercontent.com/15950706/158900226-e5220c2f-83a5-46d2-a56a-d8b63c59d691.jpg" alt="dockerDameonError" width="500" />

This just means the `docker deamon` isnt running you just need to start that up and this error should go away

2). Simply is not working with tests or client
This may be because the `./realy/NODES.json` file and the application trying to connect to the stack are not using the same info. A simple solution is doing the following in `sphinx-stack`

> `docker-compose down`
> `./clearAll.sh`
> `docker-compose up -d`

Then after the `./relay/NODES.json` file is generated then use that file wherever outside the stack

3). When the `./relay/NODES.json` file is not generating
This is usually because the `sphinx-stack_relaysetup_1` container never exits, at this point you should be checking the logs of that container and also `alice,bob,carol.sphinx` containers aswell
you can do this by doing
`docker logs sphinx-stack_relaysetup_1` and `docker logs alice.sphinx`
from there you need to debug what the issue is
