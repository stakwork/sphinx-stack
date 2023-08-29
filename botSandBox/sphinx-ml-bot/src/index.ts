import express, { Request, Response } from "express";
import axios from "axios";

const app = express();

app.use(express.json());

function sendWebhook(url: string, process_id: string, msg: string) {
  try {
    axios.post(url, { body: { process_id, response: msg } });
  } catch (error) {
    console.log(`Error sending webhook: ${error}`);
  }
}

function generateProcessId() {
  const process_id = Math.random().toString(36).substring(2, 10);
  return process_id;
}

app.post("/test", (req: Request, res: Response) => {
  return res.status(200).json({ msg: "Test is working" });
});

app.post("/text", (req: Request, res: Response) => {
  const process_id = generateProcessId();
  setTimeout(() => {
    sendWebhook(
      req.body.webhook,
      process_id,
      "This is a response from test ml-bot server built in sphinx-stack"
    );
  }, 5000);
  return res.status(200).json({ body: { process_id } });
});

app.post("/image", (req: Request, res: Response) => {
  const process_id = generateProcessId();
  setTimeout(() => {
    sendWebhook(
      req.body.webhook,
      process_id,
      "https://res.cloudinary.com/teebams/image/upload/v1648478325/elite/wiot5aymifdzqwplyu1a.png"
    );
  }, 7000);
  return res.status(200).json({ body: { process_id } });
});

const port = 3500;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
