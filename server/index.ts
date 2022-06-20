import express from "express";
import cors from "cors";
import type { Request, Response } from "express";
import bodyParser from "body-parser";
import fsPromise from "fs/promises";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import "dotenv/config";

const port = process.env.PORT ?? 8000;
const app = express();

app.use(cors());
app.use(bodyParser.raw({ type: "application/octet-stream" }));

app.get("/", (_, res: Response) => {
  res.send("Server is running...");
});

app.post("/upload", async (req: Request, res: Response) => {
  // since all params are required, we have to check if client send all the required
  // params. Else, we have to send 400 and tell the client what params are missing
  // ...
  // this is why it's so important to use some kind of serialization such protobuf
  // so the client exactly knew what params are required without double checking
  // on some documentation
  const requiredParams = ["name", "currentChunkIdx", "totalChunks"] as const;

  // check if any params missing
  const isParamMissing = requiredParams.filter(
    (p) => !Object.keys(req.query).some((q) => q.includes(p))
  );

  if (isParamMissing.length > 0)
    res.json({
      status: 400,
      data: null,
      error: `missing required params. the params of ${isParamMissing.join(
        ", "
      )} didn't get provided.`,
    });

  const { name, currentChunkIdx, totalChunks } = req.query as Record<
    typeof requiredParams[number],
    string
  >;
  const isFirstChunk = parseInt(currentChunkIdx) === 0;
  const isLastChunk = parseInt(currentChunkIdx) === parseInt(totalChunks) - 1;
  const ext = name.split(".").pop();
  const data = req.body.toString().split(",")[1]; // split and remove the octet prefix format
  const buffer = Buffer.from(data);
  const tmpFileName = uuidv4();

  // check if the folder never been created
  const isFolderExists = fs.existsSync("./uploads");

  if (!isFolderExists) await fsPromise.mkdir("./uploads", { recursive: true });

  // first we need to check if this is the first chunk and the file is exists
  // because we have to unlink the written file that probably
  // was created from the process before
  const isFileExists = fs.existsSync(`./uploads/${tmpFileName}`);

  if (isFirstChunk && isFileExists) {
    await fsPromise.unlink(`./uploads/${tmpFileName}`);
  }

  await fsPromise.appendFile(`./uploads/${tmpFileName}`, buffer);

  // if this is the last chunk, we have to rename the temporary file name
  // to some random name. I will use uuidv4 here
  if (isLastChunk) {
    const fileName = `${uuidv4()}.${ext}`;
    await fsPromise.rename(`./uploads/${tmpFileName}`, `./uploads/${fileName}`);

    res.json({
      status: 200,
      data: {
        fileName,
        message: `the finel chunk successfully uploaded and named ${fileName}`,
      },
      error: null,
    });
  }

  res.json({
    status: 200,
    data: `chunk of ${currentChunkIdx} from ${totalChunks} successfully uploaded`,
    error: null,
  });
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
