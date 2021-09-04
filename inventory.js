#!/usr/bin/env node

require('dotenv').config();
const argv = require('minimist')(process.argv.slice(2));
const fetch = require('node-fetch');
const R = require('ramda');
const RA = require('ramda-adjunct');

const vultrApiKey = process.env.VULTR_API_ACCOUNT;
const vultrApiEndpoint = 'https://api.vultr.com';
const vultrApiFunction = '/v1/server/list';
if (typeof vultrApiKey === 'undefined') throw new Error('VULTR_API_ACCOUNT must be defined in env, but it was undefined');

const { list, host } = argv;

const url = `${vultrApiEndpoint}${vultrApiFunction}?api_key=${vultrApiKey}`;


async function getMachines (tag) {
    const result = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const machines = await result.json();

    const machineHasTag = R.compose(
        R.includes(tag),
        R.prop('tag')
    )
    const matchingMachines = R.compose(
        R.filter(machineHasTag)
    )(machines)


    const getMachineIp = R.prop('main_ip')
    const getMachineLabel = R.prop('label')

    const getMachineData = (machine) => {
        return {
            ansible_host: getMachineIp(machine),
            ansible_user: 'root'
        }
    }

    const hostData = R.map(getMachineData, matchingMachines);
    const machinesNames = R.compose(
        R.keys
    )(matchingMachines);


    const inventory = {
        '_meta': {
            'hostvars': hostData
        },
        'immls': machinesNames,
        'all': {
            'children': [
                'immls'
            ]
        }
    }

    // https://docs.ansible.com/ansible/latest/dev_guide/developing_inventory.html#developing-inventory-scripts
    console.log(JSON.stringify(inventory, 0, 2))


    return inventory;

}


getMachines('immls');
