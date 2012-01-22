var vows = require('vows'),
  assert = require('assert'),
  search = require('../lib/search');

vows.describe('Test Google Image Search').addBatch({
  'when searching inexisting image': {
    topic: function(){
      return search('djjdqbskdjbqsjhd');
    },

    'then an error is triggered': function(err){
      assert.isNotNull(err);
    }
  },
  'when searching a normal image': {
    topic: function(){
      return search('google logo');
    },

    'then no errors are triggered': function(err, image){
      assert.isNull(err);
      assert.isNotNull(image);
    }
  }
}).export(module);
