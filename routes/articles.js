'use strict';

const _ = require('lodash');
const utils = require('../utils');

const express = require('express');
const articles = express.Router();

// Models
const Article = require('../models/Article');
const Hospital = require('../models/Hospital');
const Order = require('../models/Order');

articles.route('/')
    /* GET all articles. */
    .get((req, res) => {
      const filter = req.query.filter;
      return Article.getAll((error, articles) => {
        if (error) {
          return res.status(error.statusCode).json(error);
        }

        if (filter) {
          articles = articles.filter(article => article.articleType === filter);
        }

        const hospitalIds = articles.map(article => article.hospitalId);
        const uniqueHospitalIds = [ ...new Set(hospitalIds) ];

        return Hospital.fetch(uniqueHospitalIds, (error, hospitals) => {
          if (error) {
            return res.status(error.statusCode).json(error);
          }
          articles = articles.map(article => {
            let hospital = hospitals.find(hospital => hospital._id === article.hospitalId);

            article.hospitalName = hospital.name;

            return article;

          })

          return res.status(200).json(articles);

        });
      });
    });

articles.route('/')
    /* POST article. */
    .post((req, res) => {
      const postedArticle = req.body;

      if (!postedArticle) {
        return res.status(400).json({
          reason: `Document d'article prévu dans POST body, obtenu: ${postedArticle}`,
          statusCode: 400
        });
      }

      const newArticle = new Article(postedArticle);

      return newArticle.save((error, savedArticle) => {
        if (error) {
          return res.status(error.statusCode).json(error);
        }

        return res.status(200).json(savedArticle.doc);
      });

    });

articles.route('/:articleId')
    /* GET article by id. */
    .get((req, res) => {
      const articleId = req.params.articleId;

      return Article.get(articleId, (error, article) => {
        if (error) {
          return res.status(error.statusCode).json(error);
        }

        return Hospital.get(article.getHospitalId(), (error, hospital) => {
          if (error) {
            return res.status(error.statusCode).json(error);
          }

          article.setDocValue('hospitalName', hospital.getName());

          return res.status(200).json(article.doc);

        });

      });

    })
    /* PUT article by id. */
    .put((req, res) => {
      const articleId = req.params.articleId;
      const updatedArticle = req.body;

      if (!updatedArticle) {
        return res.status(400).json({
          reason: `Document d'article prévu dans PUT body, obtenu: ${updatedArticle}`,
          statusCode: 400
        });
      }

      return Article.get(articleId, (error, article) => {
        if (error) {
          return res.status(error.statusCode).json(error);
        }

        article.doc = _.mergeWith(article.doc, updatedArticle, utils.mergeArrays);

        return article.save((error, savedArticle) => {
          if (error) {
            return res.status(error.statusCode).json(error);
          }

          return res.status(200).json(savedArticle.doc);
        });

      });

    })
    /* DELETE article by id. */
    .delete((req, res) => {
      const articleId = req.params.articleId;

      return Hospital.get(articleId, (error, article) => {
        if (error) {
          return res.status(error.statusCode).json(error);
        }

        return article.delete((error, response) => {
          if (error) {
            return res.status(error.statusCode).json(error);
          }

          return res.status(200).json(response.deleted_doc._id);
        });

      });
    });



module.exports = articles;
