const MVLoaderBase = require('mvloader/src/mvloaderbase');

class MVLBlankSemis extends MVLoaderBase{
    static exportConfig = {
        ext: {
            classes: {
                semis: {},
                controllers: {},
                handlers: {},
            },
            configs: {
                controllers: {},
                handlers: {
                    DBHandler: {
                        sequelize: {},
                        models: {
                            // MVLExampleModel: require('./models/mvlblankexample'),
                        }
                    }
                },
                semis: {},
            }
        },
        db: {},
    };

    constructor(...config) {
        super(...config);
    }

}

module.exports = MVLBlankSemis;