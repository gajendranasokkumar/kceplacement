const path = require('path');
// const HomeService = require('../services/homeService');
const IndexFile = path.join(__dirname, '../views/index.html');

class Home {
  async getHome(req, res) {
    res.sendFile(IndexFile);
  }
}

module.exports = new Home();
        