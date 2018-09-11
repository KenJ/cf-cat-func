const db = require('../db');

module.exports = function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    var catDb = new db();

    if(req.body){
        var document = req.body;

        if(document.id){
            catDb.deleteDocument(document)
                .then((obj) => {
                    context.res = {
                        body: "Updated " + JSON.stringify(obj.id)
                    };
                    context.done();
                })
                .catch((error) => {
                    context.res = {
                        status: error.code,
                        body: "Error on update " + JSON.stringify(error)
                    };
                    context.done();
                });
        }
        else{
            context.res = {
                status: 400,
                body: "Please pass an Id"
            };
            context.done();
        }
    }
    else{
        context.res = {
            status: 400,
            body: "Please pass a request body"
        }
        context.done();
    }

};