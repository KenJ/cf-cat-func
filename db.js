var documentClient = require("documentdb").DocumentClient;
const uriFactory = require('documentdb').UriFactory;
var config = require("./config");

var client = new documentClient(config.endpoint, { "masterKey": config.primaryKey });


var HttpStatusCodes = { NOTFOUND: 404 };
var databaseId = config.database.id;
var collectionId = config.collection.id;


class db {

    uniqueId(){
        function chr4(){
            return Math.random().toString(16).slice(-4);
        }
        return chr4() + chr4() +
            '-' + chr4() +
            '-' + chr4() +
            '-' + chr4() +
            '-' + chr4() + chr4() + chr4();
    };
    
    getDatabase() {
        console.log(`Getting database:\n${databaseId}\n`);
        let databaseUrl = uriFactory.createDatabaseUri(databaseId);
        return new Promise((resolve, reject) => {
            client.readDatabase(databaseUrl, (err, result) => {
                if (err) {
                    if (err.code == HttpStatusCodes.NOTFOUND) {
                        client.createDatabase({ id: databaseId }, (err, created) => {
                            if (err) reject(err)
                            else resolve(created);
                        });
                    } else {
                        reject(err);
                    }
                } else {
                    resolve(result);
                }
            });
        });
    };



    getCollection() {
        console.log(`Getting collection:\n${collectionId}\n`);
        let collectionUrl = uriFactory.createDocumentCollectionUri(databaseId, collectionId);
        return new Promise((resolve, reject) => {
            client.readCollection(collectionUrl, (err, result) => {
                if (err) {
                    if (err.code == HttpStatusCodes.NOTFOUND) {
                        let databaseUrl = uriFactory.createDatabaseUri(databaseId);
                        client.createCollection(databaseUrl, { id: collectionId }, { offerThroughput: 400 }, (err, created) => {
                            if (err) reject(err)
                            else resolve(created);
                        });
                    } else {
                        reject(err);
                    }
                } else {
                    resolve(result);
                }
            });
        });
    };


    getFamilyDocument(document) {
        console.log(`Getting document:\n${document.id}\n`);
        let documentUrl = uriFactory.createDocumentUri(databaseId, collectionId, document.id);
        return new Promise((resolve, reject) => {
            client.readDocument(documentUrl, (err, result) => {
                if (err) {
                    if (err.code == HttpStatusCodes.NOTFOUND) {
                        let collectionUrl = uriFactory.createDocumentCollectionUri(databaseId, collectionId);
                        client.createDocument(collectionUrl, document, (err, created) => {
                            if (err) reject(err)
                            else resolve(created);
                        });
                    } else {
                        reject(err);
                    }
                } else {
                    resolve(result);
                }
            });
        });
    };



    queryCollection(id) {
        console.log(`Querying collection through index:\n${collectionId}`);
        let collectionUrl = uriFactory.createDocumentCollectionUri(databaseId, collectionId);

        // query to return all children in a family
        const querySpec = {
            query: "select * from c"
        };
        
        if(id){
            querySpec.query = "select * from c where c.id = @id";
            querySpec.parameters = [
            {
                name: "@id",
                value: id
            }
            ];
        }

        return new Promise((resolve, reject) => {
            client.queryDocuments(
                collectionUrl,
                querySpec
//                "SELECT VALUE r.children FROM c WHERE c.id = @id"
            ).toArray((err, results) => {
                if (err) reject(err)
                else {
                    for (var queryResult of results) {
                        let resultString = JSON.stringify(queryResult);
                        console.log(`\tQuery returned ${resultString}`);
                    }
                    console.log();
                    resolve(results);
                    return results;
                }
            });

        });
    };



    // replaceFamilyDocument(document) {
    //     console.log(`Replacing document:\n${document.id}\n`);
    //     let documentUrl = uriFactory.createDocumentUri(databaseId, collectionId, document.id);
    //     document.children[0].grade = 6;
    //     return new Promise((resolve, reject) => {
    //         client.replaceDocument(documentUrl, document, (err, result) => {
    //             if (err) reject(err);
    //             else {
    //                 resolve(result);
    //             }
    //         });
    //     });
    // };



    // deleteFamilyDocument(document) {
    //     console.log(`Deleting document:\n${document.id}\n`);
    //     let documentUrl = uriFactory.createDocumentUri(databaseId, collectionId, document.id);
    //     return new Promise((resolve, reject) => {
    //         client.deleteDocument(documentUrl, (err, result) => {
    //             if (err) reject(err);
    //             else {
    //                 resolve(result);
    //             }
    //         });
    //     });
    // };


    // cleanup() {
    //     console.log(`Cleaning up by deleting database ${databaseId}`);
    //     let databaseUrl = uriFactory.createDatabaseUri(databaseId);
    //     return new Promise((resolve, reject) => {
    //         client.deleteDatabase(databaseUrl, (err) => {
    //             if (err) reject(err)
    //             else resolve(null);
    //         });
    //     });
    // };

    // exit(message) {
    //     console.log(message);
    //     console.log('Press any key to exit');
    //     process.stdin.setRawMode(true);
    //     process.stdin.resume();
    //     process.stdin.on('data', process.exit.bind(process, 0));
    // };

}

module.exports = db;