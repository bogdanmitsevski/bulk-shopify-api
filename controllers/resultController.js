const { eventDataStorage } = require('../utils/eventDataStorage');
class ResultController {
    async GetResultData(req, res) {
        try {
            eventDataStorage.emit(req.body.admin_graphql_api_id, req.body);
            res.status(200).send();
        }
        catch (e) {
            console.log(e);
        }
    }
}

module.exports = new ResultController;