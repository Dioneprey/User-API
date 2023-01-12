class HomeController{

    async index(req, res){
        res.send("API Users! - Dionatan");
    }

}

module.exports = new HomeController();