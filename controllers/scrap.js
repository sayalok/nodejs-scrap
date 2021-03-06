const axios = require("axios");
const cheerio = require("cheerio");
const Advertisement  = require('../models/advertisement');

// Api
exports.addItems = (req, res, next) => {
    const pageNo = req.query.page;
    let url = "https://www.otomoto.pl/ciezarowe/uzytkowe/mercedes-benz/od-2014/q-actros?search%5Bfilter_enum_damaged%5D=0&search%5Border%5D=created_at%20%3Adesc";
    if (pageNo != undefined) {
        url = `https://www.otomoto.pl/ciezarowe/uzytkowe/mercedes-benz/od-2014/q-actros?search%5Bfilter_enum_damaged%5D=0&search%5Border%5D=created_at%20%3Adesc&page=${pageNo}`;
    }

    getScrapData(url)
        .then($ => {
            let totalPaginationItem = $('.optimus-app-wak9h6', '.pagination-list').last().text()
            const listItems = $('.optimus-app-10uqxf9')
            let itemLooping = listItems.map((idx, el) => {
                let productDetailsUrl = $(el).children(".optimus-app-1nvnpye").children('.optimus-app-1mgjl0z-Text').children().attr('href')
                return getAdvertisementDetailsBYUrl(productDetailsUrl)
                    .then(result => {
                        const adv = new Advertisement(result)
                        adv.save()
                    })
                    .catch(error => {
                        res.status(500).json({error:err})
                    })
            });

            Promise.all(itemLooping).then( result =>  {
                res.status(201).json({message: "Successfully"})
            })
            .catch(error => {
                res.status(500).json({error:err})
            })
         
        })
        .catch(error => {
            res.status(500).json({error:err})
        })
}

const getAdvertisementDetailsBYUrl = async (prodUrl) => {
    return await getScrapData(prodUrl)
        .then($ => {
           
            const truckData = {};

            let title = $('.offer-title', '.offer-summary').text();
            let price = $('.offer-price__number', '.price-wrapper').text()

            truckData.product_id    = $('#ad_id', '.offer-meta').text()
            truckData.title = title.trim()
            truckData.price = price.trim()
            truckData.url = prodUrl

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
                    registration_date = new Date(registration_date)
                    if (registration_date != 'Invalid Date') {
                        truckData.registration_date = registration_date;
                    }
                }               
            });
            return truckData;           
        })
        .catch(error => {
            return false
        })
}

exports.getAllAdvertisementApi = (req,res,next) => {   
    getAdvList()
        .then(data => {
            let i = 0;
            const result = {
                message: "Product List",
                count: data.length,
                advertisement: data.map(d => {
                    i++
                    return {
                        // id: i,
                        _id: d._id,
                        adv_id: d.product_id,
                        title: d.title,
                        price: d.price,
                        orgininal_url: d.orgininal_url,
                        milage: d.milage,
                        power: d.power,
                        production_date: d.production_date,
                        production_date: d.url,
                        registration_date: d.registration_date,
                        request: {
                            Method: "GET",
                            url: "http://localhost:3001/"+d._id
                        }
                    }
                })
            }
            res.status(200).json({result})

        })
        .catch(error => {
            res.status(500).json({error:err})
        })
}

exports.advertisement_get_byidApi = (req, res, next) => {
    let id = req.params.productId
    getSingleAdvById(id)
        .then(d => {
            if(d) {
                res.status(200).json({
                    message: "Get Single Product",
                    advertisement: {
                        _id: d._id,
                        adv_id: d.product_id,
                        title: d.title,
                        price: d.price,
                        orgininal_url: d.orgininal_url,
                        milage: d.milage,
                        power: d.power,
                        production_date: d.production_date,
                        production_date: d.url,
                        registration_date: d.registration_date,
                        request: {
                            Method: "GET",
                            url: "http://localhost:3001/"+d._id
                        }
                    }
                })
            }else{
                res.status(404).json({message: "Invalid Product Id"})
            }
        })
        .catch(err => {
            res.status(500).json({error:err})
        })
}

// web view
exports.getAllAdvertisementList = (req, res, next) => {
    getAdvList()
        .then(result => {
            console.log(result);
            res.render('advList', {
                path: '/advertisements',
                pageTitle: 'Advertisement Item',
                prods: result,
            });
        })
        .catch(error => {
            res.render('advList', {
                path: '/advertisements',
                pageTitle: 'Advertisement Item',
                prods: [],
            });
        })
};

exports.getSingleAdvertisement = (req, res, next) => {
    let id = req.params.productId
    getSingleAdvById(id)
        .then(result => {
            res.render('single-adv-details', {
                path: '/scrapTruckItem',
                pageTitle: 'Advertisement Item',
                product: result,
            });
        })
        .catch(error => {
            res.render('single-adv-details', {
                path: '/scrapTruckItem',
                pageTitle: 'Advertisement Item',
                product: [],
            });
        })
}


//helper
const getAdvList = () => {
    return Advertisement.find().exec()
};

const getSingleAdvById = (id) => {
    return  Advertisement.findById(id).exec()
}


const getScrapData = async (url) => {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data)
    return $;
}