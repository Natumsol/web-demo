module.exports = function(app) {
    app.get('/', function(req, res, next) {
        res.render('index', { title: 'Express' , manifest: app.get("manifest"), config: app.get("config")});
    });

};
