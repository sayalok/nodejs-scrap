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

exports.getSingleDetails = (req, res, next) => {
    const prodUrl = req.body.product_base_url;
    getScrapData(prodUrl)
        .then($ => {
           
            const truckData = {};

            let title = $('.offer-title', '.offer-summary').text();
            let price = $('.offer-price__number', '.price-wrapper').text()


            truckData.id    = $('#ad_id', '.offer-meta').text()
            truckData.title = title.trim()
            truckData.price = price.trim()

            let offerParam = $('.offer-params__item', '.offer-params__list')
            offerParam.each((idx, el) => {
                let label = $(el).children(".offer-params__label").text();
                if (label === 'Przebieg') {
                    let milage = $(el).children(".offer-params__value").text()
                    truckData.milage = milage.trim();
                }else if(label === 'Moc') {
                    let power = $(el).children(".offer-params__value").text()
                    truckData.power = power.trim();
                }else if(label === 'Rok produkcji') {
                    let production_date = $(el).children(".offer-params__value").text()
                    truckData.production_date = production_date.trim();
                }else if(label === 'Pierwsza rejestracja') {
                    let registration_date = $(el).children(".offer-params__value").text()
                    truckData.registration_date = registration_date.trim();
                }               
            });

            // let imgSrcList = $('.slick-active')
            // console.log(imgSrcList.html());
            // imgSrcList.each((index,element) => {
            //     // console.log($(element).children(".slick-slide").children())
            //     console.log(element);
            // })

            res.render('single-truck-details', {
                path: '/scrapTruckItem',
                pageTitle: 'Single Truck Item',
                product: truckData,
            });
        })
        .catch(error => {
            res.render('single-truck-details', {
                path: '/scrapTruckItem',
                pageTitle: 'Truck Item',
                product: [],
            });
        })
};

exports.scrapeTruckItem = () => {

}


const getScrapData = async (url) => {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data)
    return $;
}