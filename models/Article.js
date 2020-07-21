'use strict';

const Model = require('./Model');
const Hospital = require('./Hospital');

class Article extends Model {
  constructor(doc) {
    super(Article.DATABASE_NAME, doc, Article.MODEL_SCHEMA);
    this.doc.type = Article.TYPE;
  }

  getArticleType() {
    return this.getDocValue('articleType');
  }

  getQty() {
    return this.getDocValue('qty', 0);
  }

  setIcon() {
    console.log(this.getArticleType());
    switch (this.getArticleType()) {
      case Article.ARTICLE_TYPES.PRESCRIPTION_DRUG:
        this.setDocValue('icon', 'local_pharmacy');
        break;
      case Article.ARTICLE_TYPES.SUPPLY:
        this.setDocValue('icon', 'healing');
        break;
      case Article.ARTICLE_TYPES.EQUIPMENT:
        this.setDocValue('icon', 'biotech');
        break;
      default:
        this.setDocValue('icon', 'local_pharmacy');
    }
  }

  static getAllById(articleIds, callback) {

    return Article.fetch(articleIds, (error, articles) => {
      if (error) {
        return callback(error);
      }

      // Filter out any undefined values
      articles = articles.filter(item => !!item);

      const hospitalIds = articles.map(article => article.hospitalId);
      const uniqueHospitalIds = [ ...new Set(hospitalIds) ];

      return Hospital.fetch(uniqueHospitalIds, (error, hospitals) => {
        if (error) {
          return callback(error);
        }

        const filteredHospitals = hospitals.filter(item => !!item);

        articles = articles.map(article => {
          let hospital = filteredHospitals.find(hospital => hospital._id === article.hospitalId);

          if (hospital) {
            article.hospitalName = hospital.name;
          }

          return article;

        });

        return callback(null, articles);

      });

    });

  }

}

Article.DATABASE_NAME = 'articles';
Article.TYPE = 'article';
Article.MODEL_SCHEMA = {
  type: Article.TYPE,
  //la catégorie peut être médicament, fourniture, équipement
  articleType: '',
  name: '',
  description: '',
  expirationDate: '',
  hospitalId: '',
  condition: '',
  offerType: '',
  qty: null,
  price: null
};

Article.ARTICLE_TYPES = Object.freeze({
  PRESCRIPTION_DRUG: 'médicament',
  SUPPLY: 'fourniture',
  EQUIPMENT: 'équipement'
});

Article.OFFER_TYPES = Object.freeze({
  FOR_SALE: 'vente',
  TO_GIFT: 'don'
});

Article.CONDITIONS = Object.freeze({
  NEW: 'nouveau',
  VERY_GOOD: 'très bon état',
  GOOD: 'bon',
  FAIR: 'acceptable',
  POOR: 'mauvais'
});

module.exports = Article;

