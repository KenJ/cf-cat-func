const db = require('../db');

module.exports = function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request...');

    var catDb = new db();

    var catId = req.params.id;

    catDb.queryCollection(catId)
        .then((obj) => {
            context.res = {
                body: obj
            };
            context.done();
        })
        .catch(() => {
            context.res = {
                status: HttpStatusCodes.NOTFOUND,
                body: "no cat with id " + catId
            };
            context.done();
        });


};