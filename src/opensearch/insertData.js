const core = require('@actions/core');
const github = require('@actions/github');

const { client } = require('./client');

const index_name = 'books';
const document = {
    title: 'The Outsider',
    author: 'Stephen King',
    year: '2018',
    genre: 'Crime fiction',
};

const id = '2';

async function main(){

    try {
        // `who-to-greet` input defined in action metadata file
        const nameToGreet = core.getInput('who-to-greet');
        console.log(`Hello ${nameToGreet}!`);
        const time = (new Date()).toTimeString();
        core.setOutput("time", time);
        // Get the JSON webhook payload for the event that triggered the workflow
        const payload = JSON.stringify(github.context.payload, undefined, 2)
        console.log(`The event payload: ${payload}`);


        //
        // const pagePath = core.getInput('pagePath');
        //
        // const response = await client.index({
        //     id: id,
        //     index: index_name,
        //     body: document,
        //     refresh: true,
        // });
        // console.log(response);
        //
        //
        // core.info((new Date()).toTimeString());
        // core.setOutput('id', id);
    } catch (error) {
        core.setFailed(error.message);
    }
}

main();
