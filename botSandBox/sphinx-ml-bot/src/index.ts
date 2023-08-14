import express, { Request, Response } from "express";
import axios from "axios";

const app = express();

function sendWebhook(url: string, project_id: string, msg: string) {
  try {
    axios.post(url, { project_id, body: { response: msg } });
  } catch (error) {
    console.log(`Error sending webhook: ${error}`);
  }
}

function generateProjectId() {
  const project_id = Math.random().toString(36).substring(2, 10);
  return project_id;
}

app.post("/test", (req: Request, res: Response) => {
  return res.status(200).json({ msg: "Test is working" });
});

app.post("/text", (req: Request, res: Response) => {
  const project_id = generateProjectId();
  setTimeout(() => {
    sendWebhook(
      req.body.webhook,
      project_id,
      "This is a response from test ml-bot server built in sphinx-stack"
    );
  }, 30000);
  return res.status(200).json({ project_id });
});

app.post("/image", (req: Request, res: Response) => {
  const project_id = generateProjectId();
  setTimeout(() => {
    sendWebhook(
      req.body.webhook,
      project_id,
      "https://res.cloudinary.com/teebams/image/upload/v1648478325/elite/wiot5aymifdzqwplyu1a.png"
    );
  }, 30000);
  return res.status(200).json({ project_id });
});

const port = 3500;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
