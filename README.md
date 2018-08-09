# Media Processing Services - Ported to AWS

Media processing services provide media upload, processing and distribution services.
At this moment, only support image upload.

## Deployment
To deploy media processing services, 2 AWS Services are required
* AWS Lambda Function (Runtime: Node.js 8.10)
* AWS S3 Bucket

The following enviroment variables must be within the Lambda Function Settings
* `BUCKET` - The S3 Bucket Name
* `ACCESS_KEY` - IAM User Access ID Key (User created with AmazonS3FullAccess Policy)
* `SECRET` - IAM User Secret Key
* `REGION` - Region of S3 bucket. 'us-east-2' in this case

## Usage

Base URL: `https://85djasd501.execute-api.us-east-1.amazonaws.com/qa` (defunct., replace with your endpoint for requests)

### Upload Image - upload.js

**POST** `/upload`

* Content-Type: `application/json`
* Payload
    * base64 - Base64 string for the image you wish to upload, cannot contain `data:xxx`
    * type - Image type, must match the image type you wish to upload
* Response
    * status - ok
    * url - The uploaded image url

*Sample Request*
```javascript
// Payload
{
	"base64": "iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAEiSURBVDhPxZIhT0NBEITnoBKBrEQgEUhISEiqKiFUYJDI/gBEc8VVY5AYHKKGBIEAVBFN+A8EUVFZUdGk/XbvGtqmpS8ImGTu5vbd7N3tPv0Pog5gzeSGB4oiqgSbCnphNbRQsKEQorbY/YCqaqwrXatl4WIJosrsfELtw3vucOFxsP4J6eRnlJnfOf3S4xk/J0hmO3kPfmE+5er+9ilSAqtoU203TGEFC7pDHcFBNvf82wxSgqAzxhPmDsbdHLtl9FZhbmDuul5AKmLUNuoDtQMH8BGeQ0OXBIckGOX1HL67ELlq6m8pBRyjbF56umEzz9KbPnXM9qBKjhhuMFsdVmKxC/ZzvCbpVW9kvRLzCeydY/9J+sx11laPXyB63/8C0gQlpj3Fc3O2WAAAAABJRU5ErkJggg==",
	"type": "png"
}

// Result
{"status":"ok","url":"https://s3.us-east-2.amazonaws.com/yourmediabucket/431006d6-4735-4bbf-8dfa-3b68b67963b9.png"}
```
