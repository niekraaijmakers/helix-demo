const { client } = require('./client');

console.log('Creating index:');

const index_name = 'books';
const settings = {
    settings: {
        index: {
            number_of_shards: 4,
            number_of_replicas: 3,
        },
    },
};

async function main(){
    const response = await client.indices.create({
        index: index_name,
        body: settings,
    });

    console.log(response.body);
}

main();
