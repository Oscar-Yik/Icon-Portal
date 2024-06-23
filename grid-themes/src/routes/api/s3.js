// routes/api/s3.js
const { GetObjectCommand, ListObjectsV2Command, PutObjectCommand, S3Client } = require("@aws-sdk/client-s3");
require('dotenv').config({ path: __dirname + "/../../.env" });
const express = require('express');
const path = require('path');
const https = require('https');
const router = express.Router();
const fs = require('fs');
const client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY
    }
});

// Load ImagePath and Metadata models
const ImagePath = require('../../models/ImagePath');
const Metadata = require('../../models/Metadata');

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


async function listObjects() {
    // listObjects()
    //     .then(test => res.json(test))
    //     .catch(err => res.status(500).json({ error: 'Internal Server Error' }));
    const command = new ListObjectsV2Command({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        MaxKeys: 5,
        // Prefix: "videos/"
    });
    
    try {
        let isTruncated = true;
    
        console.log("Your bucket contains the following objects:\n");
        let contents = [];
    
        while (isTruncated) {
        const { Contents, IsTruncated, NextContinuationToken } =
            await client.send(command);
        // const contentsList = Contents.map((c) => ` • ${c.Key}`).join("\n");
        contents.push(Contents.map((c) => c.Key));
        isTruncated = IsTruncated;
        command.input.ContinuationToken = NextContinuationToken;
        }
        return contents
    } catch (err) {
        console.log(err);
        return [];
    }
}

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
    const absolutefilePath = path.join(__dirname.slice(0,-11), filePath); 

    async function getCommand() {
        try {
            const imgPath = await ImagePath.find({ name: req.params.i}).select('-_id -__v');
            const command = new GetObjectCommand({
                Bucket: process.env.AWS_S3_BUCKET_NAME,
                Key: imgPath[0].img_path,
            });
            const response = await client.send(command);
            return response.Body;
        } catch (err) {
            throw err;
        }
    };

    if (fs.existsSync(filePath)) {
        res.sendFile(absolutefilePath, (err) => {
            if (err) {
                console.error("Error sending file (already exists):", err);
                res.status(500).json({ error: 'Internal Server Error', message: "Couldn't send file (already exists)" });
            } else {
                // console.log("File sent successfully (already exists)");
            }
        });
    } else {
        getCommand()
            .then(stream => {
                // the .jpg is already renamed 
                const writeStream = fs.createWriteStream(filePath);

                stream.pipe(writeStream)
                    .on('error', err => {
                        res.status(500).json({ error: 'Internal Server Error', message: "Couldn't save file to project directory" });
                    })
                    .on('finish', () => {
                        // res.json({ message: "File saved successfully" });
                        return absolutefilePath
                    });
            })
            .then((absolutefilePath) => {
                res.setHeader('file_name', req.params.i);
                res.sendFile(absolutefilePath, (err) => {
                    if (err) {
                        console.error("Error sending file:", err);
                        res.status(500).json({ error: 'Internal Server Error', message: `Couldn't send file ${absolutefilePath}` });
                    } else {
                        console.log("File sent successfully");
                    }
                });
            })
            .catch(err => res.status(404).json({ error: 'Not Found', message: "Couldn't retrieve file from S3" }));
    }
});


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

    function downloadImage(image_url, image_path) {
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
                console.error(`Error downloading image: ${err.message}`);
            });
        });
    }

    async function check_url(is_url) {
        try {
            if (is_url) {
                const new_name = await getNewName();
                await downloadImage(req.body.img_name, 'assets/upload/' + new_name);
                img_name = new_name;
                image_path = 'assets/upload/' + new_name;
                return 'assets/upload/' + new_name;
            } 
        } catch (e) {
            console.log(e);
            throw new Error("Couldn't download image");
        }
    }

    async function putObject() {

        try {
            await check_url(req.body.is_url);
            const fileContent = fs.readFileSync(image_path);
                
            const command = new PutObjectCommand({
              Bucket: process.env.AWS_S3_BUCKET_NAME,
              Key: "images/" + img_name,
              Body: Buffer.from(fileContent),
            });
            
            const response = await client.send(command);
            return response;
          } catch (error) {
            console.log(error);
            throw error;
          }
    };
    
    putObject() 
        .then(async response => {
            try {
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

                res.json(response);
            } catch (e) {
                res.status(500).json({ error: "Internal Service Error", message: e.message });
            }
        })
        .catch(err => res.status(500).json({ error: "Internal Service Error", message: "Couldn't return response" }));

});

module.exports = router;