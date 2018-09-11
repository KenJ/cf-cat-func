const db = require('../db');

module.exports = function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    var catDb = new db();

    if(req.body){
        var document = req.body

        if(document.id){
            catDb.replaceDocument(document)
                .then((obj) => {
                    context.res = {
                        body: "Updated " + JSON.stringify(obj.id)
                    };
                    context.done();
                })
                .catch((error) => {
                    context.res = {
                        body: "Error on update " + JSON.stringify(error)
                    };
                    context.done();
                });
        }
        else{
            document.id = catDb.uniqueId();

            catDb.createDocument(document)
                .then((obj) => { 
                    context.res = {
                        body: "Completed successfully " + JSON.stringify(obj.id)
                    };
                    context.done();
                })
                .catch((error) => { 
                    context.res = {
                        body: "Completed with error" + JSON.stringify(error)
                    };
                    context.done();
                });
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