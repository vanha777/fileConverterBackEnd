const axios = require('axios')
const FormData = require('form-data')
const fs = require('fs')
require('dotenv').config();
const aws = require('aws-sdk');
const s3 = new aws.S3();
aws.config.update({ region: 'ap-southeast-2' });
const S3_BUCKET = process.env.S3_BUCKET;
const PSPDFKEY = process.env.PSPDFKEY;

const handleConvert = (req, res, files) => {

    //use formData to embeded the received files
    const formData = new FormData()
    let arrayOfFile= [];
    const arrayFiles = files.map((files) => {
        return arrayOfFile.push({file:files.originalname})
    })
    console.log(arrayOfFile);

    formData.append('instructions', JSON.stringify({
        parts:arrayOfFile

    }))

    files.map((files)=>formData.append(files.originalname, files.buffer, {
        filename: files.originalname,
        contentType: files.mimetype
    }))





        //use async function to manage flow of stacks
        ; (async () => {

            try {
                //use pspdf API to convert files
                const response = await axios.post('https://api.pspdfkit.com/build', formData, {
                    headers: formData.getHeaders({
                        'Authorization': PSPDFKEY
                    }),
                    responseType: "stream"
                })
                //end.

                //upload response files from  API to Amazon S3
                const s3Params = {
                    Bucket: S3_BUCKET,
                    Key: `result${Date.now()}.pdf`,
                    Body: response.data,
                    ACL: 'public-read',
                    ContentType: 'application/pdf'
                }
                s3.upload(s3Params, (err, data) => {
                    if (err) {
                        console.error('Failed to upload to S3:', err)
                    } else {
                        console.log('Uploaded to S3:', data.Location)
                        res.status(200).json(data.Location)
                    }
                })
                //end.


            } catch (e) {
                const errorString = await streamToString(e.response.data)
                console.log(errorString)
            }
        })()

    //define catching function to properly handle error.
    function streamToString(stream) {
        const chunks = []
        return new Promise((resolve, reject) => {
            stream.on("data", (chunk) => chunks.push(Buffer.from(chunk)))
            stream.on("error", (err) => reject(err))
            stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")))
        })
    }
}
module.exports = {
    handleConvert
}



