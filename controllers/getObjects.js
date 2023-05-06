
const { S3Client, ListObjectsCommand } = require("@aws-sdk/client-s3"); // CommonJS import
const client = new S3Client({
    region: 'ap-southeast-2',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});
const input = {
    "Bucket": process.env.S3_BUCKET,
};

const handleGetObjects = (req, res) => {
    ; (async () => {

        try {
            //use ListOjectsCommand Function in @aws-sdk.client-s3
            const command = new ListObjectsCommand(input);
            const response = await client.send(command);
            //end.

            //return list of Objects
            //console.log(response.Contents);
            const list = response.Contents;
            let listObjects = [];
            list.map((files) => {
                const previewUrl = `https://${process.env.S3_BUCKET}.s3.amazonaws.com/${files.Key}`
                return listObjects.push({
                    key: files.Key ,
                    lastModified: files.LastModified ,
                    size: files.Size ,
                    previewUrl: previewUrl,
                })

            })
            console.log(listObjects)
            res.json(listObjects)

            //end.


        } catch (error) {
            console.log(error)
        }
    })()
}

module.exports = {
    handleGetObjects
}


