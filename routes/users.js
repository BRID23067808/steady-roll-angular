'use strict';

const _ = require('lodash');
const express = require('express');
const middleware = require('../middleware');
const users = express.Router();
const utils = require('../utils');
const bcrypt = require('bcryptjs');

// Models
const User = require('../models/User');
const Hospital = require('../models/Hospital');

const DUMMY_PWD = 'dummy_password';

users.use(middleware.isAuthenticated);

users.route('/')
    /* GET all users. */
    .get((req, res) => {
      return User.getAll((error, users) => {
        if (error) {
          return res.status(error.statusCode).json(error);
        }

        const hospitalIds = users.map(user => user.hospitalId).filter(item => !!item);
        const uniqueHospitalIds = [ ...new Set(hospitalIds) ];

        return Hospital.fetch(uniqueHospitalIds, (error, hospitals) => {
          if (error) {
            return res.status(error.statusCode).json(error);
          }

          // Filter out any undefined values
          hospitals = hospitals.filter(item => !!item);

          users = users.map(user => {
            let hospital = hospitals.find(hospital => hospital._id === user.hospitalId);

            if (hospital) {
              user.hospitalName = hospital.name;
            }

            return user;

          })

          return res.status(200).json(users);

        });
      });
    })
    /* POST user. */
    .post((req, res) => {
      const postedUser = req.body;

      if (!postedUser) {
        return res.status(400).json({
          reason: `Document d'utilisateur prévu dans POST body, obtenu: ${postedUser}`,
          statusCode: 400
        });
      }

      return User.get(postedUser.email, (error, user) => {
        if (error && error.statusCode !== 404) {
          return res.status(error.statusCode).json(error);
        }

        if (user) {
          return res.status(409).send({message: 'L\'utilisateur existe déjà!'});
        }

        const newUserObj = {
          _id: postedUser.email,
          type: User.TYPE,
          email: postedUser.email,
          name: postedUser.name,
          password: bcrypt.hashSync(postedUser.password, 8),
          role: postedUser.role,
          phone: postedUser.phone,
          hospitalId: postedUser.hospitalId,
          active: postedUser.active || false
        };

        const newUser = new User(newUserObj);

        return newUser.save((error, savedUser) => {
          if (error) {
            return res.status(error.statusCode).json(error);
          }

          return res.status(200).json(savedUser.doc);
        });
      });
    });

  users.route('/:userId')
    /* GET user by id. */
    .get((req, res) => {
      const userId = req.params.userId;

      return User.get(userId, (error, user) => {
        if (error) {
          return res.status(error.statusCode).json(error);
        }

        user.doc.password = DUMMY_PWD;

        return res.status(200).json(user.doc);

      });

    })
    /* PUT user by id. */
    .put((req, res) => {
      const userId = req.params.userId;
      const updatedUser = req.body;

      if (!updatedUser) {
        return res.status(400).json({
          reason: `Document d'utilisateur prévu dans PUT body, obtenu: ${updatedUser}`,
          statusCode: 400
        });
      }

      return User.get(userId, (error, user) => {
        if (error) {
          return res.status(error.statusCode).json(error);
        }

        delete updatedUser._rev;

        if (updatedUser.password === DUMMY_PWD) {
          // Password did not change, skip password update.
          delete updatedUser.password;
        } else {
          // Password changed, let's hash it.
          updatedUser.password = bcrypt.hashSync(updatedUser.password, 8);
        }

        user.doc = _.mergeWith(user.doc, updatedUser, utils.mergeArrays);

        return user.save((error, savedUser) => {
          if (error) {
            return res.status(error.statusCode).json(error);
          }

          return res.status(200).json(savedUser.doc);
        });

      });

    })
    /* DELETE user by id. */
    .delete((req, res) => {
      const userId = req.params.userId;

      return User.get(userId, (error, user) => {
        if (error) {
          return res.status(error.statusCode).json(error);
        }

        return user.delete((error, response) => {
          if (error) {
            return res.status(error.statusCode).json(error);
          }

          return res.status(200).json(response.deleted_doc._id);
        });

      });
    });

    users.route('/:userId/activate')
    /* Activate user by id. */
    .put((req, res) => {
      const userId = req.params.userId;

      return User.get(userId, (error, user) => {
        if (error) {
          return res.status(error.statusCode).json(error);
        }

        user.setActive();

        return user.save((error, savedUser) => {
          if (error) {
            return res.status(error.statusCode).json(error);
          }

          return res.status(200).json(savedUser.doc);
        });

      });

    });

module.exports = users;
