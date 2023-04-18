const aws = require('aws-sdk');
const s3 = new aws.S3();
aws.config.update({accessKeyId: 'AKIA6COXGD6KHVUZ2BBB', secretAccessKey: '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'});
aws.config.update({region: 'ap-southeast-2'});
const S3_BUCKET = process.env.S3_BUCKET;
const handleGetKey = (fileName, fileType) => {
    const s3Params = {
        Bucket: 'imgconverter',
        Key: fileName,
        Expires: 60,
        ContentType: fileType,
        ACL: 'public-read'
    };

    s3.getSignedUrl('putObject', s3Params, (err, data) => {
        if (err) {
            console.log(err)
            return null;
        }
        const returnData = {
            signedRequest: data,
            url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
        };
        return returnData;
    })

}
module.exports = {
    handleGetKey
}
