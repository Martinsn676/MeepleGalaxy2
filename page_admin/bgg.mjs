import { adminMenu } from "./workFile.mjs";

export const apiBgg = {
    baseUrl: 'https://boardgamegeek.com/xmlapi2/',
    middleUrl: 'thing?id=',
    getApi: 'GET',
    async call(id) {
        try {
            const apiUrl = `${this.baseUrl}${this.middleUrl}${id}`;

            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const xmlString = await response.text();
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
            return xmlDoc
            
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    }
};

export function getAtt(name,product){
    const notFound = ""
    for (const attribute of product.attributes) {
        if (attribute.name === name && attribute.options) {
            if(attribute.options && attribute.options!=""){
                return attribute.options
            }else{
                return notFound
            }
            
        }
    }
    return notFound
}

export function bggAttributes (bggImport,wcImport){

let time = [
    bggImport.querySelector('minplaytime').getAttribute('value'),
    bggImport.querySelector('maxplaytime').getAttribute('value')
];
let players = [
    bggImport.querySelector('minplayers').getAttribute('value'),
    bggImport.querySelector('maxplayers').getAttribute('value')
];
if(time[0]==='0'){
    time = ""
}
if(players[0]==='0'){
    time = ""
}
const year = bggImport.querySelector('yearpublished').getAttribute('value') === '0' ? "" : bggImport.querySelector('yearpublished').getAttribute('value');
const age = bggImport.querySelector('minage').getAttribute('value') === '0' ? "" : bggImport.querySelector('minage').getAttribute('value');

const designerElements = bggImport.querySelectorAll('link[type="boardgamedesigner"]');
const designers = [];
designerElements.forEach(element => {
    const designer = element.getAttribute('value');
    designers.push(designer);
});
const artistElements = bggImport.querySelectorAll('link[type="boardgameartist"]');
const artists = [];
artistElements.forEach(element => {
    const artist = element.getAttribute('value');
    artists.push(artist);
});
const publisherElements = bggImport.querySelectorAll('link[type="boardgamepublisher"]');
const publishers = [];
publisherElements.forEach(element => {
    const publisher = element.getAttribute('value');
    publishers.push(publisher);
});

const categoryElements = bggImport.querySelectorAll('link[type="boardgamecategory"]');
const categories = [];
categoryElements.forEach(element => {
    const category = element.getAttribute('value');
    categories.push(category);
});
const mechanicElements = bggImport.querySelectorAll('link[type="boardgamemechanic"]');
const mechanics = [];
mechanicElements.forEach(element => {
    const mechanic = element.getAttribute('value');
    mechanics.push(mechanic);
});

    const attributes =[
    {
        id: 0,
        name: 'ean',
        slug: 'ean',
        position: 0,
        visible: true,
        variation: false,
        options: [adminMenu.eanInput.value],
    },
    {
        id: 0,
        name: 'bgg',
        slug: 'bgg',
        position: 0,
        visible: true,
        variation: false,
        options: [adminMenu.bggInput.value],
    },
    {
        id: 0,
        name: 'age',
        slug: 'age',
        position: 0,
        visible: true,
        variation: false,
        options: age,
    },
    {
        id: 0,
        name: 'year',
        slug: 'year',
        position: 0,
        visible: true,
        variation: false,
        options: year ,
    },
    {
        id: 0,
        name: 'players',
        slug: 'players',
        position: 0,
        visible: true,
        variation: false,
        options:players ,
    },
    {
        id: 0,
        name: 'time',
        slug: 'time',
        position: 0,
        visible: true,
        variation: false,
        options: time,
    },
    {
        id: 0,
        name: 'designers',
        slug: 'designers',
        position: 0,
        visible: true,
        variation: false,
        options:designers ,
    },
    {
        id: 0,
        name: 'artists',
        slug: 'artists',
        position: 0,
        visible: true,
        variation: false,
        options:artists ,
    },
    {
        id: 0,
        name: 'publishers',
        slug: 'publishers',
        position: 0,
        visible: true,
        variation: false,
        options: [adminMenu.publisherInput.value],
    },
    {
        id: 0,
        name: 'category',
        slug: 'category',
        position: 0,
        visible: true,
        variation: false,
        options:categories ,
    },
    {
        id: 0,
        name: 'mechanics',
        slug: 'mechanics',
        position: 0,
        visible: true,
        variation: false,
        options:mechanics ,
    },  
    {
        id: 0,
        name: 'parent',
        slug: 'parent',
        position: 0,
        visible: true,
        variation: false,
        options: getAtt('parent',wcImport),
    },
    {
        id: 0,
        name: 'child',
        slug: 'child',
        position: 0,
        visible: true,
        variation: false,
        options: getAtt('child',wcImport),
    },
    {
        id: 0,
        name: 'sleeves',
        slug: 'sleeves',
        position: 0,
        visible: true,
        variation: false,
        options: getAtt('sleeves',wcImport),
    },
    {
        id: 0,
        name: 'language',
        slug: 'language',
        position: 0,
        visible: true,
        variation: false,
        options: getAtt('language',wcImport),
    },
    {
        id: 0,
        name: 'allPublishers',
        slug: 'all-publishers',
        position: 0,
        visible: true,
        variation: false,
        options: publishers,
    },]
return attributes
}


