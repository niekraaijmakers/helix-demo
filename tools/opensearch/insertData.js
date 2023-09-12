const { client } = require('./client');

console.log('Creating index:');

const index_name = 'books';
const document = {
    title: 'The Outsider',
    author: 'Stephen King',
    year: '2018',
    genre: 'Crime fiction',
};

const id = '1';

async function main(){
    console.log('Adding document:');


    const response = await client.index({
        id: id,
        index: index_name,
        body: document,
        refresh: true,
    });

    console.log(response.body);
}

main();
