define(
[
  'util/socket!',
  'lodash',
  'ko',
  'models/baseModel',
  'util/shotHandler',
  'models/shot',
  'util/snapshot'
],
function(socket, _, ko, BaseModel, ShotHandler, Shot, snapshot) {

  var ViewModel = function () {

    this.me = new Shot({me: true, id: socket.id});
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
