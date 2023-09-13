const { parse } = require('node-html-parser');
const BASE_URL = 'https://main--helix-demo--niekraaijmakers.hlx.live';

const INDEXES = [
    'article',
    'video'
]
function mapToIndex(path){

    for(let i=0;i<INDEXES.length;i++){
        if(path.startsWith('/' + INDEXES[i])){
            return INDEXES[i];
        }
    }
    return false;
}

module.exports.constructOpenSearchPayload = async (helixPagePath) => {

    const path = helixPagePath.substring(0, helixPagePath.indexOf('.'));

    const index = mapToIndex(path);

    if(!index){
        return Promise.resolve(false);
    }

    const url = BASE_URL + path;

    const response = await fetch(url);
    const text = await response.text();

    const root = parse(text);

    const image = root.querySelector('meta[property="og:image"]')?.getAttribute('content');
    const description = root.querySelector('meta[property="og:description"]')?.getAttribute('content');
    const title= root.querySelector('meta[property="og:title"]')?.getAttribute('content');
    const content = root.querySelector('body').innerText;

    return {
        index,
        body: {
            title,
            image,
            description,
            path,
            content,
        },
        refresh: true,
    }
}

