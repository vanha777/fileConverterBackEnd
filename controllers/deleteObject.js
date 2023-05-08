
const { S3Client, DeleteObjectsCommand } = require("@aws-sdk/client-s3"); // CommonJS import
const client = new S3Client({
    region: 'ap-southeast-2',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const handleDeleteObjects = (req, res) => {
    //const filesToDelete = JSON.parse(req.body);

    ; (async () => {
        try {
            //use ListOjectsCommand Function in @aws-sdk.client-s3
            const input = {
                "Bucket": process.env.S3_BUCKET,
                "Delete": {
                    "Objects": req.body,
                    "Quiet": false
                }
            };
            const command = new DeleteObjectsCommand(input);
            const response = await client.send(command);
            if (response.Errors) {
                console.log('failed')
                res.status(500).json('Errors response from aws-sdk/s3');
                return;
            }
            res.status(200).json(response.Deleted);


        } catch (error) {
            console.log(error)
        }
    })()


}

module.exports = {
    handleDeleteObjects
}

