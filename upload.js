// Use strict mode
"use strict";
// Add the AWS SDK
const AWS = require('aws-sdk');
// Require uuidv4 for name creation
const uuidv4 = require('uuid/v4');
// Set up config variables through env variables for AWS Lambda
const configVars = new AWS.Config({
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET,
    region: process.env.REGION
});
// Update the AWS config with the configVars declared above
AWS.config.update(configVars);
// Create new instance for S3 Interact'ion
const s3 = new AWS.S3();
// Declare Acceptable File/Image Types to accept
const acceptableTypes = [
    'image/tiff',
    'image/gif',
    'image/jpeg',
    'image/png'
];
// Set the Maximum Filesize to 5 MB
const maxLength = 5000000;
// Main handler -> upload.handler for the Lambda Function
exports.handler = (event, context, callback) => {
    if (!event || !event.base64 || !event.type) {
        callback(null, {
            statusCode: '400',
            headers: {'Access-Control-Allow-Origin': '*'},
            body: JSON.stringify({"message": "base64 and type are required parameter"})
        });
    } else {
        const buffer = new Buffer(event.base64, 'base64');
        // Ensure Image is correct filetype and less than
        if (buffer.length < maxLength  && acceptableTypes.includes('image/' + event.type) ) {
            // Set name to uuidv4 generated string and the fileType
            const name = uuidv4() + "." + event.type;
            const bucketName = process.env.BUCKET;
            const params = {
                Body: buffer,
                Key: name,
                Bucket: bucketName,
                ContentEncoding: 'base64',
                ContentType: 'image/' + event.type
            };
            // Upload File to S3 Container
            s3.putObject(params, (err, data) => {
                // If Upload error, callback with statuscode and the respective error message
                if (err) callback(new Error([err.statusCode], [err.message]));
                const fileUrl = 'https://s3.us-east-2.amazonaws.com/' + bucketName + '/' + name;
                // Otherwise callback with Statuscode 200
                callback(null, {
                    status: 'ok',
                    url: fileUrl
                });
            });
        } else {
            callback(null, {
                statusCode: '402',
                headers: {'Access-Control-Allow-Origin': '*'},
                body: JSON.stringify({"error": "Invalid file type or file too big (greater than 5 MB)."})
            });
        }
    }
};