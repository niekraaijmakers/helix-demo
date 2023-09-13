const core = require('@actions/core');
const github = require('@actions/github');

const { client } = require('./client');
const { constructOpenSearchPayload } = require('./constructOpenSearchPayload');

async function main(){

    try {
        const pagePath = github.context.payload.client_payload.path;
        const openSearchPayload = await constructOpenSearchPayload(pagePath);

        if(openSearchPayload){
            const response = await client.index(openSearchPayload);
            console.log(response);
        }

        core.info((new Date()).toTimeString());
    } catch (error) {
        core.setFailed(error.message);
    }
}

main();
