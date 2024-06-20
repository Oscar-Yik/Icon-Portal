// routes/api/s3.js
const { GetObjectCommand, ListObjectsV2Command, PutObjectCommand, S3Client } = require("@aws-sdk/client-s3");
require('dotenv').config({ path: __dirname + "/../../.env" });
const express = require('express');
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

// @route   GET api/s3/:i
// @desc    Get image i from s3
// @access  Public
router.get('/:i', (req, res) => {
    // given the name in MongoDB,
    // get image from s3
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

    getCommand()
        .then(stream => {
            // the .jpg is already renamed 
            const filePath = 'assets/download/' + req.params.i;
            const writeStream = fs.createWriteStream(filePath);

            stream.pipe(writeStream)
                .on('error', err => {
                    res.status(500).json({ error: 'Internal Server Error', message: "Couldn't save file to project directory" });
                })
                .on('finish', () => {
                    res.json({ message: "File saved successfully" });
                });
        })
        .catch(err => res.status(404).json({ error: 'Not Found', message: "Couldn't retrieve file from S3" }));
});


// @route   POST api/s3/:i
// @desc    upload image to s3 bucket
// @access  Public
router.post('/:i', (req, res) => {
    // given the name of the file,
    // upload file to s3
    // get and update metadata
    // make a new imgPath in mongoDB + make a name with metadata 

    async function putObject() {

        try {
            const fileContent = fs.readFileSync('assets/upload/' + req.params.i);
                
            const command = new PutObjectCommand({
              Bucket: process.env.AWS_S3_BUCKET_NAME,
              Key: "images/" + req.params.i,
              Body: Buffer.from(fileContent),
            });
            
            const response = await client.send(command);
            return response;
          } catch (error) {
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
                let newMetadata = { ...metadata[0] };
                newMetadata.data = img_number; 

                const updatedImg = await Metadata.findOneAndUpdate({ name: "img_count" }, newMetadata, { new: true });
                if (!updatedImg) {
                    throw new Error("Couldn't update img_count");
                }

                const imgName = "Sample_Background_" + img_number + ".jpg"; 
                const img = { name: imgName, img_path: "images/" + req.params.i }   

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