define(
[
  'lodash',
  'ko',
  'models/baseModel',
  'util/socket',
  'util/shotHandler',
  'models/shot'
],
function(_, ko, BaseModel, socket, ShotHandler, Shot) {

  var ViewModel = function () {

    this.me = new Shot({me: true});
    this.shots = [];

    BaseModel.apply(this, arguments);
  };

  _.extend(ViewModel.prototype, BaseModel.prototype, {

    initialize: function () {
      var self = this;

      this.shotHandler = new ShotHandler({
        shots: this.shots,
        me: this.me
      });

    }

  });

  ko.applyBindings(new ViewModel());

});
