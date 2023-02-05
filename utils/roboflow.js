import 'dotenv/config'
import fetch from "node-fetch";
import fs from "fs";
import FormData from "form-data";

if (typeof process.env.ROBOFLOW_API_KEY === 'undefined')
    throw new Error('ROBOFLOW_API_KEY is undefined');

const datasetName = 'lovense-levels'


export function upload (filename) {
    const formData = new FormData();
    formData.append("name", filename);
    formData.append("file", fs.createReadStream(filename));
    formData.append("split", "train");

    fetch({
        method: "POST",
        url: `https://api.roboflow.com/dataset/${datasetName}/upload`,
        params: {
            api_key: process.env.ROBOFLOW_API_KEY
        },
        data: formData,
        headers: formData.getHeaders()
    })
        .then(function (response) {
        console.log(response.data);
    })
        .catch(function (error) {
        console.log(error.message);
    });
}