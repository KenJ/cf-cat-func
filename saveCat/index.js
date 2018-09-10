const db = require('../db');

module.exports = function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    var catDb = new db();

    if(req.body){
        var document = req.body

        if(!document.id){
            document.id = catDb.uniqueId();
        }

        catDb.getFamilyDocument(document)
            .then((obj) => { 
                context.res = {
                    body: "Completed successfully " + JSON.stringify(obj.id)
                }
                context.done();
            })
            .catch((error) => { 
                context.res = {
                    body: "Completed with error" + JSON.stringify(error)
                }
                context.done();
            });
    }
    else{
        context.res = {
            status: 400,
            body: "Please pass a request body"
        }
        context.done();
    }

};