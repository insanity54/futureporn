// greets ChatGPT


import 'dotenv/config'
import Fastify from "fastify";
import os from "os";
import {
    exec as exec$0
} from "child_process";
import 'dotenv/config';

if (typeof process.env.FUTUREPORN_WORKDIR === 'undefined') throw new Error('FUTUREPORN_WORKDIR is undefined in env')

const PORT = process.env.PORT || 3000


const exec = {
    exec: exec$0
}.exec;
const fastify = Fastify();

fastify.get('/disk', (req, res) => {
    exec(`df -P ${process.env.FUTUREPORN_WORKDIR} | grep ${process.env.FUTUREPORN_WORKDIR} | awk '{print $5}'`, (error, stdout, stderr) => {
        if (error) {
            res.send({
                error: stderr
            });
        } else {
            const capacity = parseInt(stdout.trim().slice(0, -1));
            if (capacity < 70) {
                res.send({
                    status: 'OK',
                    capacity
                });
            } else {
                res.send({
                    status: 'Error',
                    capacity
                });
            }
        }
    });
});



fastify.get('/service', (req, res) => {
    exec("systemctl is-active capture", (error, stdout, stderr) => {
        if (error) {
            console.error(error)
            res.send({
                status: 'Error'
            });
        } else {
            if (stdout.trim() === "active") {
                res.send({
                    status: 'OK'
                });
            } else {
                res.send({
                    status: 'Error'
                });
            }
        }
    });
});
fastify.listen(PORT, (err) => {
    if (err)
        throw err;
    console.log(`Server started on port ${PORT}`);
});