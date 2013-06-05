require('./setup');

describe('selecttrap', function() {
  beforeEach(loadEnv('selecttrap/jquery.selecttrap.js'));

  beforeEach(function() {
    render(
      '<select name="hi">' +
      '<option value="v1">One</option>' +
      '<option value="v2">Two</option>' +
      '<option value="v3">Third item</option>'
    );
  });

  // ----

  describe('elements', function() {
    beforeEach(function() {
      $('select').selecttrap();
    });

    it(".selecttrap", function() {
      assert.equal(1, $('body > .selecttrap').length);
    });

    it(".selecttrap > select", function() {
      assert.equal(1, $('.selecttrap > select').length);
    });

    it(".selecttrap > .st-text", function() {
      assert.equal(1, $('.selecttrap > .st-text').length);
    });
  });

  // ----

  describe('respond', function() {
    beforeEach(function() {
      $('select').selecttrap();
    });

    it("initial", function() {
      assert.equal('One', $('.st-text').text());
    });

    it("changes", function() {
      $('select').val('v2').trigger('change');
      assert.equal('Two', $('.st-text').text());
    });

    it("spaces", function() {
      $('select').val('v3').trigger('change');
      assert.equal('Third item', $('.st-text').text());
    });
  });

  // ----
});

