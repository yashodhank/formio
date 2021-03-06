'use strict';

var async = require('async');

/**
 * Update 2.0.0
 *
 * @param db
 * @param config
 * @param tools
 * @param done
 */
module.exports = function(db, config, tools, done) {
  var applications = db.collection('applications');
  var forms = db.collection('forms');
  var roles = db.collection('roles');

  /**
   * Update the applications collection.
   *
   * Steps:
   *   1. Rename the application collection to projects.
   */
  var updateApplications = function(cb) {
    applications.rename('projects', function(err) {
      if (err) {
        return cb(err);
      }

      cb();
    });
  };

  /**
   * Update the forms collection.
   *
   * Steps:
   *   1. Drop the index for app
   *   2. Rename the app property for every document.
   *   3. Add an index for project
   */
  var updateForms = function(cb) {
    // Forms update step 1.
    var dropIndex = function(next) {
      forms.dropIndex('app_1', function(err) {
        if (err) {
          return next(err);
        }

        next();
      });
    };

    // Forms update step 2.
    var rename = function(next) {
      forms.update({}, {$rename: {'app': 'project'}}, {multi: 1}, function(err) {
        if (err) {
          return next(err);
        }

        next();
      });
    };

    // Forms update step 3.
    var createIndex = function(next) {
      forms.createIndex({project: 1}, function(err) {
        if (err) {
          return next(err);
        }

        next();
      });
    };

    async.series([
      dropIndex,
      rename,
      createIndex
    ], function(err) {
      if (err) {
        return cb(err);
      }

      cb();
    });
  };

  /**
   * Update the roles collection.
   *
   * Steps:
   *   1. Drop the index for app
   *   2. Rename the app property for every document.
   *   3. Add an index for project
   */
  var updateRoles = function(cb) {
    // Roles update step 1.
    var dropIndex = function(next) {
      roles.dropIndex('app_1', function(err) {
        if (err) {
          return next(err);
        }

        next();
      });
    };

    // Roles update step 2.
    var rename = function(next) {
      roles.update({}, {$rename: {'app': 'project'}}, {multi: 1}, function(err) {
        if (err) {
          return next(err);
        }

        next();
      });
    };

    // Roles update step 3.
    var createIndex = function(next) {
      roles.createIndex({project: 1}, function(err) {
        if (err) {
          return next(err);
        }

        next();
      });
    };

    async.series([
      dropIndex,
      rename,
      createIndex
    ], function(err) {
      if (err) {
        return cb(err);
      }

      cb();
    });
  };

  async.series([
    updateApplications,
    updateForms,
    updateRoles
  ], function(err) {
    if (err) {
      return done(err);
    }

    done();
  });
};
