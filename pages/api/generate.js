import { OpenAIApi, Configuration } from "openai";

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const openai = new OpenAIApi(configuration);

  export default async function (req, res) {
    if (!configuration.apiKey) {
      res.status(500).json({
        error: {
          message: "OpenAI API key not configured, please follow instructions in README.md",
        }
      });
      return;
    }

    //get the image prompt
    const imagePrompt = req.body.imageprompt  || '';
    if (imagePrompt.trim().length === 0) {
        res.status(400).json({
            error: {
                message: "Please enter a valid image prompt"
            }
        });
        return;
    }

    try {
        
        //create image with open api
        const response = await openai.createImage({
            prompt: `${imagePrompt}`,
            n: 1,
            size: "1024x1024",
          });
          const image_url = response.data.data[0].url;

          console.log(image_url)
        
          //send the image back

          res.status(200).json({imageResult: image_url})

    } catch (error) {
        if (error.response) {
            console.error(error.response.status, error.response.data);
            res.status(error.response.status).json(error.response.data);
        } else {
        console.error(`Error with OpenAI API request: ${error.message}`);
        res.status(500).json({
            error: {
            message: 'An error occurred during your request.',
            }
        });
    }

}
  }