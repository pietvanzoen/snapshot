
/**
 * @module  shotHandler
 * @description  The shotHandler module.
 * @author  Piet
 */
define(
[
  'lodash',
  'ko',
  'util/socket!',
  'models/shot',
  'util/snapshot'
],
function (_, ko, socket, Shot, snapshot) {

  /**
  * Module variables
  */
  var ShotHandler = function (options) {

    this.shots = options.shots;
    this.me = options.me;

    this.initialize();
  };

  /**
  * Module methods
  */
  _.extend(ShotHandler.prototype, {

    initialize: function () {
      var self = this;

      _.bindAll(this, 'update', 'send', 'remove');

      // update me on name change
      this.me().name.subscribe(this.send);

      setTimeout(function () {
        self.send();
      }, 1000);

      socket.on('getSnapshot', this.send);

      socket.on('updateSnapshot', this.update);

      socket.on('removeSnapshot', this.remove);
    },

    send: function () {
      var dataUri = snapshot.drawImage();
      if (dataUri) {
        this.me().img(dataUri);
        var data = this.me().toJSON(['name', 'img', 'id']);
        socket.emit('newSnapshot', data);
      }
    },

    update: function (pkg) {
      var shots = ko.toJS(this.shots());
      var shotIndex = _.findIndex(shots, { id: pkg.id });
      if (shotIndex === -1) {
        this.shots.push(new Shot(pkg));
      } else {
        this.shots()[shotIndex].update(pkg);
      }
    },

    remove: function (id) {
      this.shots.remove(function (shot) {
        return shot.id() === id;
      });
    }

  });

  return ShotHandler;

});