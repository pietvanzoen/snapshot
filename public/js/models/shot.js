
/**
 * @module  shot
 * @description  The shot model.
 * @author  Piet
 */
define(
[
  'lodash',
  'models/baseModel',
  'util/socket',
],
function (_, BaseModel, socket) {

  /**
  * Model variables
  */
  var Shot = function (options) {
    options = options || {};

    this.id = options.id || '';
    this.name = options.name || '';
    this.img = options.img || '';
    this.me = options.me || false;

    BaseModel.apply(this, arguments);
  };

  /**
  * Model methods
  */
  _.extend(Shot.prototype, BaseModel.prototype, {

    initialize: function () {
      var self = this;

      if (this.me() && localStorage.name) {
        this.name(localStorage.name);
      }

      if (this.me()) {
        this.name.subscribe(function (newName) {
          localStorage.name = newName;
        });
      }



    },

    update: function (pkg) {
      if (pkg.img) { this.img(pkg.img); }
      if (pkg.name) { this.name(pkg.name); }
    }

  });

  return Shot;

});