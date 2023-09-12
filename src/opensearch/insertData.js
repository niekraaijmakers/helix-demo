const core = require('@actions/core');
const github = require('@actions/github');

const { client } = require('./client');


async function main(){

    try {
        const pagePath = github.context.payload.client_payload.path;

        const response = await client.index({
            index: 'article',
            body: {
                pagePath
            },
            refresh: true,
        });

        console.log(response);
        core.info((new Date()).toTimeString());
    } catch (error) {
        core.setFailed(error.message);
    }
}

main();
