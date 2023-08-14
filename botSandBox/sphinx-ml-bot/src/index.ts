import express, { Request, Response } from "express";

const app = express();

app.post("/test", (req: Request, res: Response) => {
  return res.status(200).json({ msg: "Test is working" });
});

const port = 3500;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
