require('./setup');

describe('selecttrap', function() {
  beforeEach(loadEnv('selecttrap/jquery.selecttrap.js'));

  beforeEach(function() {
    render(
      '<select name="hi">' +
      '<option value="v1">One</option>' +
      '<option value="v2">Two</option>' +
      '<option value="v3">Third item</option>' +
      '<option>Fourth item</option>'
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

  describe('options.class', function() {
    beforeEach(function() {
      $('select').selecttrap({ 'class': 'mini' });
    });

    it('should work', function() {
      assert.isTrue($('.selecttrap').is('.mini'));
    });
  });

  // ----

  describe('implicit values', function() {
    beforeEach(function() {
      $('select').selecttrap();
    });

    it('should work', function() {
      $('select').val('Fourth item').trigger('change');
      assert.equal('Fourth item', $('select').val());
      assert.equal('Fourth item', $('.st-text').text());
    });
  });

  // ----

  describe('multiple', function() {
    beforeEach(function() {
      render(
        '<select name="hi">' +
        '<option value="v1">One</option>' +
        '<option value="v2">Two</option>' +
        '</select>' +
        '<select name="hello">' +
        '<option value="w1">One</option>' +
        '<option value="w2">Two</option>' +
        '</select>'
      );
    });

    it('should work', function() {
      $('select').selecttrap();

      assert(2, $('body .selecttrap').length);
    });
  });

});

