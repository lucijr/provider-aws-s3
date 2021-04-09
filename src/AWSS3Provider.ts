import path from 'path';
import fs from 'fs';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// #region Settings Default

// Set the AWS region:
let REGION = 'YOU_REGION'; // e.g., "us-east-1"

// Set Access ID:
const ID = 'YOU_ID';

// Set Secret Access Key:
const SECRET = 'YOU_SECRET';

// Credentials

let crendentials = { accessKeyId: ID, secretAccessKey: SECRET };

// Set the bucket parameters:
let bucketName = 'YOU_BUCKET';

//  #endregion

class AWSS3Providers {
  public async uploadFile(
    file: string,
    bucket?: string,
    region?: string,
    credentials?: { accessKeyId: string; secretAccessKey: string },
  ): Promise<string> {
    if (bucket) {
      bucketName = bucket;
    }

    if (region) {
      REGION = region;
    }

    if (credentials) {
      crendentials = credentials;
    }

    const s3 = new S3Client({
      region: REGION,
      credentials: crendentials,
    });
    const fileContent = fs.readFileSync(file);
    // Create name for uploaded object key
    const keyName = path.basename(file);
    const objectParams = {
      Bucket: bucketName,
      Key: keyName,
      Body: fileContent,
    };
    let objectUrl = '';

    try {
      const results = await s3.send(new PutObjectCommand(objectParams));

      objectUrl = `https://${bucketName}.s3.${REGION}.amazonaws.com/${keyName}`;

      console.log(`Successfully uploaded data to ${results}`); // optional log message.
    } catch (err) {
      console.log('Error', err);
    }

    return objectUrl;
  }
}

export default AWSS3Providers;
