// routes/api/s3.js
import { GetObjectCommand, ListObjectsV2Command, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
require('dotenv').config({ path: __dirname + "/../../../.env" });
import express from 'express';
import path from 'path';
import https from 'https';
import http from 'http';
const router = express.Router();
import fs from 'fs';
import multer from 'multer';
import { NodeJsClient } from "@smithy/types";

const region = process.env.AWS_REGION || ""; 
const accessKeyId = process.env.AWS_ACCESS_KEY_NODE || "";
const secretAccessKey = process.env.AWS_SECRET_KEY_NODE || "";

if (!region || !accessKeyId || !secretAccessKey) {
    throw new Error("AWS configuration environment variables are missing!");
}

const client = new S3Client({
    region: region,
    credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey
    }
}) as NodeJsClient<S3Client>;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Load ImagePath and Metadata models
// const ImagePath = require('../../models/ImagePath');
// const Metadata = require('../../models/Metadata');

import ImagePath from '../../models/ImagePath';
import Metadata from '../../models/Metadata';
import { hostname } from "os";

// @route   GET api/s3/test
// @desc    Tests s3 route
// @access  Public
router.get('/test', (req, res) => res.send('s3 route testing!'));

// @route   GET api/s3/imgPath
// @desc    Get all ImagePaths
// @access  Public
router.get('/imgPath', (req, res) => {
    ImagePath.find({})
      .select('-_id -__v')
      .then(ImagePath => res.json(ImagePath))
      .catch(err => res.status(404).json({ error: 'No ImagePathes found' }));
  });

// @route   GET api/s3/imgPath/:i
// @desc    Get ImagePath with name "i"
// @access  Public
router.get('/imgPath/:i', (req, res) => {
    ImagePath.find({ name: req.params.i})
      .select('-_id -__v')
      .then(ImagePath => res.json(ImagePath[0]))
      .catch(err => res.status(404).json({ error: 'No such ImagePath found' }));
  });

// @route   GET api/s3/metadata/:i
// @desc    Get Metadata with name "i"
// @access  Public
router.get('/metadata/:i', (req, res) => {
    Metadata.find({ name: req.params.i})
      .select('-_id -__v')
      .then(Metadata => res.json(Metadata[0]))
      .catch(err => res.status(404).json({ error: 'No such Metadata found' }));
  });
  
// @route   POST api/s3/imgPath
// @desc    Add/save ImagePath
// @access  Public
router.post('/imgPath', (req, res) => {
    ImagePath.create(req.body)
      .then(ImagePath => res.json({ msg: 'ImagePath added successfully', ImgPath: ImagePath }))
      .catch(err => res.status(400).json({ error: 'Unable to add this ImagePath' }));
  });

// @route   PUT api/metadata/:i
// @desc    Update Metadata with name "i"
// @access  Public
router.put('/metadata/:i', (req, res) => {
    Metadata.findOneAndUpdate({ name: req.params.i }, req.body, { new: true })
      .then(Metadata => {
        if (!Metadata) {
          return res.status(404).json({error: "Metadata not found"});
        }  
        res.json({ msg: 'Updated successfully', messageetadata: Metadata })
      })
      .catch(err =>
        res.status(400).json({ error: 'Unable to update the Database' })
      );
  });


// async function listObjects() {
//     // listObjects()
//     //     .then(test => res.json(test))
//     //     .catch(err => res.status(500).json({ error: 'Internal Server Error' }));
//     const command = new ListObjectsV2Command({
//         Bucket: process.env.AWS_S3_BUCKET_NAME,
//         MaxKeys: 5,
//         // Prefix: "videos/"
//     });
    
//     try {
//         let isTruncated = true;
    
//         console.log("Your bucket contains the following objects:\n");
//         let contents = [];
    
//         while (isTruncated) {
//         const { Contents, IsTruncated, NextContinuationToken } =
//             await client.send(command);
//         // const contentsList = Contents.map((c) => ` • ${c.Key}`).join("\n");
//         contents.push(Contents.map((c) => c.Key));
//         isTruncated = IsTruncated;
//         command.input.ContinuationToken = NextContinuationToken;
//         }
//         return contents
//     } catch (err) {
//         console.log(err);
//         return [];
//     }
// }

async function getNewName() {
    try {
        const i_count = await Metadata.find({ name: "img_count" }).select('-_id -__v');
        const new_name = "Internet_Image_" + i_count[0].data + ".jpg";
        return new_name;
    } catch (e) {
        throw new Error("Couldn't get new name");
    }
}

// @route   GET api/s3/:i
// @desc    Get image i from s3
// @access  Public
router.get('/:i', (req, res) => {
    // given the name in MongoDB,
    // get image from s3
    const filePath = 'assets/download/' + req.params.i;
    const absolutefilePath = path.join(__dirname.slice(0,-15), filePath); 

    async function getCommand() {
        try {
            const imgPath = await ImagePath.find({ name: req.params.i}).select('-_id -__v');
            const command = new GetObjectCommand({
                Bucket: process.env.AWS_S3_BUCKET_NAME_IMAGES,
                Key: imgPath[0].img_path,
            });
            const response = await client.send(command);
            return response.Body;
        } catch (err) {
            console.log("Error downloading from s3");
            throw err;
        }
    };

    if (fs.existsSync(filePath)) {
        res.sendFile(absolutefilePath, (err) => {
            if (err) {
                console.log("Error sending file (already exists):", err);
                res.status(500).json({ error: 'Internal Server Error', message: "Couldn't send file (already exists)" });
            } else {
                // console.log("File sent successfully (already exists)");
            }
        });
    } else {
        getCommand()
            .then((stream) : Promise<string> => {
                // the .jpg is already renamed 
                const writeStream = fs.createWriteStream(filePath);
                
                return new Promise((resolve, reject) => {
                    if(stream) {
                        stream.pipe(writeStream)
                        .on('error', err => {
                            console.log("Can't find image");
                            reject(err);
                        })
                        .on('finish', () => {
                            console.log("Downloaded image to backend");
                            resolve(absolutefilePath);
                        });
                    } else {
                        reject(new Error("No stream returned from getCommand()"));
                    }
                })
            })
            .then((absolutefilePath) => {
                // console.log(`Final absolute filepath: ${absolutefilePath}`);
                res.setHeader('file_name', req.params.i);
                res.sendFile(absolutefilePath, (err) => {
                    if (err) {
                        console.log("Error sending file:", err);
                        res.status(500).json({ error: 'Internal Server Error', message: `Couldn't send file ${absolutefilePath}` });
                    } else {
                        console.log("File sent successfully");
                    }
                });
            })
            .catch(err => res.status(404).json({ error: 'Not Found', message: "Couldn't retrieve file from S3" }));
    }
});

async function makePostRequest(file_name: string, is_url: boolean) : Promise<string> {
    return new Promise((resolve, reject) => {
        console.log("trying to make post request to s3");
        const body = JSON.stringify({ "img_name": file_name, "is_url": is_url });

        const options = {
            hostname: (process.env.VITE_THEMES_IP) || ("icon-portal.click"), 
            port: (process.env.VITE_THEMES_IP) ? 8082 : 443,
            path: (process.env.VITE_THEMES_IP) ? "/api/s3" : "/grid-themes/api/s3",
            method: "POST", 
            headers: {
                'Content-Type': "application/json",
                'Content-Length': Buffer.byteLength(body)
            }
        };

        if (process.env.VITE_THEMES_IP) {
            console.log(`making request to: http://${options.hostname}:${options.port}${options.path}`);
            http.request(options, res => {
                let data = "";
                res.on("data", chunk => { data += chunk; })
                res.on("end", () => { resolve(data); })
            })
            .on("error", err => { 
                console.log("Error in making http post request to s3"); 
                reject(err); 
            })
            .end(body);
        } else {
            console.log(`making request to: https://${options.hostname}:${options.port}${options.path}`);
            https.request(options, res => {
                let data = "";
                res.on("data", chunk => { data += chunk; })
                res.on("end", () => { resolve(data); })
            })
            .on("error", err => { 
                console.log("Error in making https post request to s3"); 
                reject(err); 
            })
            .end(body);
        }
    });
}

// make new endpoint that takes in a file, filename and saves it, then calls the one underneath
// @route   POST api/s3/sendImage
// @desc    upload image to nodeJS application
// @access  Public
router.post('/sendImage', upload.single('file'), (req, res) => {
    if (req.file) {
        const fileBuffer = req.file.buffer;
        const originalName = req.file.originalname;
        
        // Define the path where you want to save the file
        const filePath = "assets/upload/" + originalName;

        if (fs.existsSync(filePath)) {
            res.status(400).json({ error: "Bad Request", message: "File already exists" });
        } else {
            // Save the file buffer to a file
            fs.writeFile(filePath, fileBuffer, (err) => {
                if (err) {
                    console.log('Error saving file');
                    return res.status(500).send('Error saving file');
                }
                // res.status(200).json({message: "File uploaded successfully" });
                makePostRequest(originalName, false)
                    .then(data => res.status(200).json({ message: `File ${originalName} uploaded successfully`, data: data }))
                    .catch(e => res.status(500).json({ error: "Internal Service Error", message: "Couldn't upload to s3" }));
            });
        }
    } else {
        res.status(400).json({ error: "Bad Request", message: "No file received from client"})
    }
})


// @route   POST api/s3/sendImageURL
// @desc    upload image url to nodeJS application
// @access  Public
router.post('/sendImageURL', (req, res) => {
    // https://image-0.uhdpaper.com/wallpaper/kirby-game-art-4k-wallpaper-uhdpaper.com-462@0@h.jpg
    makePostRequest(req.body.url, true)
        .then(data => { 
            const dataJSON = JSON.parse(data);
            console.log(dataJSON.message);
            if (dataJSON.error) {
                res.status(200).json({ status: 0 }); 
            } else {
                res.status(200).json({ status: 1 }); 
            }
        })
        .catch(e => { res.status(200).json({ status: 0 }); });
})

// @route   POST api/s3
// @desc    upload image to s3 bucket
// @access  Public
router.post('/', (req, res) => {
    // given the name of the file,
    // upload file to s3
    // get and update metadata
    // make a new imgPath in mongoDB + make a name with metadata 
    let img_name = req.body.img_name;
    let image_path = 'assets/upload/' + img_name;

    console.log(`------Making s3 post request on: ${image_path}------`);

    function downloadImage(image_url: string, image_path: string) : Promise<string> {
        return new Promise((resolve, reject) => {
            const file = fs.createWriteStream(image_path);
    
            https.get(image_url, response => {
                response.pipe(file);
    
                file.on('finish', () => {
                    file.close(() => {
                        console.log(`Image downloaded as ${image_path}`);
                        resolve(image_path); // Resolve the promise with the image path
                    });
                });
            }).on('error', err => {
                fs.unlink(image_path, () => reject(err));
                console.log(`Error downloading image`);
            });
        });
    }

    async function check_url(is_url: string) : Promise<string> {
        try {
            if (is_url) {
                console.log("request is a url, getting new name for image...");
                const new_name = await getNewName();
                console.log("got name for image! downloading image using url....");
                await downloadImage(req.body.img_name, 'assets/upload/' + new_name);
                console.log("downloaded image!");
                img_name = new_name;
                image_path = 'assets/upload/' + new_name;
                return 'assets/upload/' + new_name;
            } else {
                console.log("request is not a url");
                return "request body contains image";
            }
        } catch (e) {
            // console.log(e);
            throw new Error("Couldn't download image");
        }
    }

    async function putObject() {
        try {
            console.log("------Checking if request is a url------")
            await check_url(req.body.is_url);
            console.log("------Finished checking if request was a url------");
            console.log("getting fileContent...")
            const fileContent = fs.readFileSync(image_path);
            console.log("got fileContent! making post request to s3 bucket...");
            const command = new PutObjectCommand({
              Bucket: process.env.AWS_S3_BUCKET_NAME_IMAGES,
              Key: "images/" + img_name,
              Body: Buffer.from(fileContent),
            });
            
            const response = await client.send(command);
            return response;
          } catch (error) {
            console.log("BAd things happneed");
            throw error;
          }
    };
    
    putObject() 
        .then(async response => {
            try {
                console.log("------Sent post request successfully! Adding path to MongoDB------");
                const metadata = await Metadata.find({ name: "img_count" }).select('-_id -__v');
                if (!metadata[0]) {
                    throw new Error("Couldn't get img_count");
                }

                const img_number = metadata[0].data + 1;
                // let newMetadata = { ...metadata[0] };
                // newMetadata.data = img_number; 
                // let newMetadata = { ...metadata[0], data: img_number };
                // console.log("new one:", newMetadata);

                const updatedImg = await Metadata.findOneAndUpdate(
                    { name: "img_count" }, 
                    { $set: { data: img_number } },
                    { new: true });
                if (!updatedImg) {
                    throw new Error("Couldn't update img_count");
                }
                console.log(updatedImg);
                const imgName = "Sample_Background_" + img_number + ".jpg"; 
                const img = { name: imgName, img_path: "images/" + img_name }   

                const createdImg = await ImagePath.create(img) 
                if (!createdImg) {
                    throw new Error("Couldn't upload image path to MongoDB");
                } 
                console.log("------finished adding path to MongoDB------");
                console.log("------finished making post request------")
                res.json(response);
            } catch (e) {
                if (e instanceof Error) {
                    res.status(500).json({ error: "Internal Service Error", message: e.message });
                } else {
                    res.status(500).json({ error: "Internal Service Error", message: "Error is not an error object" });
                }
            }
        })
        .catch(err => res.status(500).json({ error: "Internal Service Error", message: "Couldn't return response" }));

});

export default router;