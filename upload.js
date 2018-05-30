// Use strict mode
"use strict";
// Add the AWS SDK
const AWS = require('aws-sdk');
// Require fileType for validation of files
const fileType = require('file-type');
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
    if (!event.body || !event.body.base64) {
        callback(null, {
            statusCode: '400',
            headers: {'Access-Control-Allow-Origin': '*'},
            body: JSON.stringify({"message": "base64 is a required parameter"})
        });
    } else {
        // Get Upload data
        const body = JSON.parse(event.body);
        const buffer = new Buffer(body['image'], 'base64');
        // Get fileType Information
        const fileTypeInfo = fileType(buffer);
        // Ensure Image is correct filetype and less than
        if (buffer.length < maxLength  && acceptableTypes.includes(fileTypeInfo.mime)) {
            // Set name to uuidv4 generated string and the fileType
            const name = `${uuidv4()}.${fileTypeInfo.ext}`;
            const params = {
                Body: buffer,
                Key: name,
                Bucket: process.env.BUCKET,
                ContentEncoding: 'base64',
                ContentType: fileTypeInfo.mime
            };
            // Upload File to S3 Container
            s3.putObject(params, (err, data) => {
                // If Upload error, callback with statuscode and the respective error message
                if (err) callback(new Error([err.statusCode], [err.message]));
                // Otherwise callback with Statuscode 200
                callback(null, {
                    statusCode: '200',
                    headers: {'Access-Control-Allow-Origin': '*'},
                    body: JSON.stringify({'status': 'ok', 'url': data, })
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