import 'dotenv/config'
import fetch from "node-fetch";
import path from "node:path"
import {FormData} from 'formdata-node'
import {fileFromPath} from "formdata-node/file-from-path"


if (typeof process.env.ROBOFLOW_API_KEY === 'undefined')
    throw new Error('ROBOFLOW_API_KEY is undefined');

const datasetName = 'lovense-levels'


export async function upload (filename) {
    const formData = new FormData();
    formData.set("name", filename);
    formData.set("api_key", process.env.ROBOFLOW_API_KEY)
    formData.set("file", await fileFromPath(filename));
    formData.set("split", "train");
    const url = `https://api.roboflow.com/dataset/${datasetName}/upload`
    const res = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${process.env.ROBOFLOW_API_KEY}`
        },
        method: "POST",
        body: formData
    })
    const json = await res.json()
    console.log(json)
    return json
}