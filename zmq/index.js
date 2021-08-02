const zmq = require("zeromq");

async function run() {
  const sock = new zmq.Subscriber();

  sock.connect("tcp://0.0.0.0:28332");
  sock.subscribe("hashblock");
  sock.subscribe("rawblock");

  console.log("Subscriber connected");

  for await (const [topic, msg] of sock) {
    console.log(
      "received a message related to: [",
      topic.toString(),
      "] containing message:",
      msg
    );
  }
}

run();
