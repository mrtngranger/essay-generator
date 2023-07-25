const axios = require('axios');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR="#######REPLACE_WITH_YOUR_DOWNLOADS_FOLDER########"

export default async function(req, res) {
    const object = JSON.parse(req.body);
    console.log(object.imageUrl)
    const image_url = object.imageUrl || '';

    if (image_url.trim().length ===0) {
        res.status(500).json({
            error: {
                message: "Image url is not valid. Are you sure it has been generated?"
            }
        });
        return;
    }

    const output_dir = `${OUTPUT_DIR}`;
    try {
            
        if (!fs.existsSync(output_dir)) {
          fs.mkdirSync(output_dir);
        }
        const downloadedImagePath = await downloadImage(image_url, output_dir);
        console.log(`Successfully downloaded image: ${downloadedImagePath}`)
    }catch(error) {
        console.log(`Caught an error downloading the image ${error}`)
    }
}

async function downloadImage(url, outputDir) {
    const n_name = generateRandomString(10);
    const filename = `download_${n_name}.png`;
    const outputPath = path.join(outputDir, filename);
  
    try {
      const response = await axios({
        method: 'GET',
        url: url,
        responseType: 'stream',
      });
  
      response.data.pipe(fs.createWriteStream(outputPath));
      res.status(200).json({download: `${outputPath}`})
      return new Promise((resolve, reject) => {
        response.data.on('end', () => {
          resolve(outputPath);
        });
  
        response.data.on('error', (err) => {
          reject(err);
        });
      });
      
    } catch (err) {
      console.error(`Failed to download image: ${url}`, err);
      throw err;
    }
  }
  
  const generateRandomString = (length) => {
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };