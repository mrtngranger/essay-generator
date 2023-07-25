import Head from "next/head";
import { useState } from "react";
import styles from './index.module.css';


export default function Home() {
    const [imagePrompt, setImagePrompt] = useState("");
    const [imageResult, setImageResult] = useState("");

    //Get the Prompt from a User

    
    async function onSubmit(event) {
        event.preventDefault();
        
        try {
            //Send the Prompt to OpenAI/GPT
            const response = await fetch("api/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({imageprompt: imagePrompt}),
            });

            const data = await response.json();
            if(response.status != 200) {
                throw data.error || new Error(`Request failed with status ${response.status}`);
            }

            //Update the view to show an Image
            setImageResult(data.imageResult);
            setImagePrompt("");
            
        } catch (error) {
            //Print an error if it doesn't work
            console.error(error);
            alert(error.message);
        }
    }


    
    async function downloadImage(event){
        try {
            //Download the image
            const response = await fetch("api/downloadImage", {
                method: "POST",
                headers: {
                    "Content-Type": "stream",
                },
                body: JSON.stringify({imageUrl: imageResult}),
            });
        } catch (error) {
            console.error(error)
            alert(error.message)
        }
    }

    return (
    <div>
        <Head>
            <title>COF Academy Image Generator</title>
            <link rel="icon" href="/cof_logo.png"/>
        </Head>

        <main className={styles.main}>
            <img src="/cof_logo.png"/>
            <h3 className={`${styles.cof_header}`}>
                Image Generator
            </h3>
            <form onSubmit={onSubmit}>
                <input 
                    type="text"
                    name="imageprompt"
                    placeholder="Please insert a prompt for an image"
                    value={imagePrompt}
                    onChange= {(e) => setImagePrompt(e.target.value)}
                />
                <input type="submit" value="Create Image"/>
            </form>
            {imageResult && <div className={styles.imageContainer}>
                <img src={imageResult} />
                <br />
                <button onClick={downloadImage} className={styles.downloadButton}>Download Image</button>
                </div>}
        </main>
    </div>
    )
}