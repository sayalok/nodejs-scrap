const axios = require("axios");
const cheerio = require("cheerio");
const pretty = require("pretty");

exports.addItems  = (req, res, next) => {   
    const url = "https://www.otomoto.pl/ciezarowe/uzytkowe/mercedes-benz/od-2014/q-actros?search%5Bfilter_enum_damaged%5D=0&search%5Border%5D=created_at%20%3Adesc";
    getScrapData(url)
        .then($ => {
            const trucksData = [];
            const listItems = $('.optimus-app-10uqxf9')
            listItems.each((idx, el) => {
                const truckData = {};

                truckData.id        = $(el).attr('id');
                truckData.title     = $(el).children(".optimus-app-1nvnpye").children('.optimus-app-1mgjl0z-Text').text()
                truckData.price     = $(el).children(".optimus-app-n2xmvo-Text").children('.optimus-app-epvm6').text()
                truckData.url       = $(el).children(".optimus-app-1nvnpye").children('.optimus-app-1mgjl0z-Text').children().attr('href')
                truckData.imgSrc    = $(el).children(".optimus-app-8cec5f").children('.optimus-app-194f7i3').children().attr('src')

               
                trucksData.push(truckData);
            });

            // console.log(trucksData.length);
            res.render('truuckList', {
                path: '/scrapTruckItem',
                pageTitle: 'Truck Item',
                prods: trucksData,
                totalAdvCount: trucksData.length
            });
        })
        .catch(error => {
            res.render('truuckList', {
                path: '/scrapTruckItem',
                pageTitle: 'Truck Item',
                prods: [],
            });
        })
}


const getScrapData = async (url) => {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data)
    return $;
}