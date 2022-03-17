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

1). How to modify image in the stack
2). How to add a new image to the stack
3). How to delete/use different images together (ie alternative docker-compose.yml files)

## How to modify an Image in the stack

This is when we want to modify one of the containers that are running in the stack and I can run through the steps in an example
Example
Say we wanted to updtate `sphinx-relay` such that it clears your db's old message after a certain age. Then we must make a change in `sphinx-relay` so...

1). Make sure `sphinx-stack` is up and running, and test that the change is not working yet
2). Go into `sphinx-relay` and update the code
3). To update the image first do what every you need to build the code/make generated files locally for `sphinx-relay` this is `npm run build`
4). Now build the new image `docker build -t sphinxlightning/sphinx-relay .` (dont forget the dot at the end)
5). go back to `sphinx-stack` and run `docker-compose up -d` and it should restart the stack with the new changes you've made

And there you go you have offically modified an image in the stack, the proccess should be similar for every image you would want to update.
