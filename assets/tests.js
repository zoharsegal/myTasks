'use strict';

define('my-task-new/tests/app.lint-test', [], function () {
  'use strict';

  QUnit.module('ESLint | app');

  QUnit.test('adapters/application.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'adapters/application.js should pass ESLint\n\n');
  });

  QUnit.test('app.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'app.js should pass ESLint\n\n');
  });

  QUnit.test('components/create-task.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/create-task.js should pass ESLint\n\n');
  });

  QUnit.test('components/index-header.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/index-header.js should pass ESLint\n\n');
  });

  QUnit.test('components/share-user.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/share-user.js should pass ESLint\n\n');
  });

  QUnit.test('components/task-list.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/task-list.js should pass ESLint\n\n');
  });

  QUnit.test('components/task-share.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/task-share.js should pass ESLint\n\n');
  });

  QUnit.test('components/task-shareuser.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/task-shareuser.js should pass ESLint\n\n');
  });

  QUnit.test('components/task-single.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/task-single.js should pass ESLint\n\n');
  });

  QUnit.test('components/task-stats.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/task-stats.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/login.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/login.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/register.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/register.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/sum.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/sum.js should pass ESLint\n\n');
  });

  QUnit.test('models/task.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/task.js should pass ESLint\n\n');
  });

  QUnit.test('models/userdata.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/userdata.js should pass ESLint\n\n');
  });

  QUnit.test('resolver.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'resolver.js should pass ESLint\n\n');
  });

  QUnit.test('router.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'router.js should pass ESLint\n\n');
  });

  QUnit.test('routes/application.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/application.js should pass ESLint\n\n');
  });

  QUnit.test('routes/login.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/login.js should pass ESLint\n\n');
  });

  QUnit.test('routes/register.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/register.js should pass ESLint\n\n');
  });

  QUnit.test('routes/task.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/task.js should pass ESLint\n\n');
  });

  QUnit.test('services/modal.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'services/modal.js should pass ESLint\n\n');
  });

  QUnit.test('services/user.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'services/user.js should pass ESLint\n\n');
  });
});
define('my-task-new/tests/helpers/destroy-app', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = destroyApp;
  function destroyApp(application) {
    Ember.run(application, 'destroy');
  }
});
define('my-task-new/tests/helpers/module-for-acceptance', ['exports', 'qunit', 'my-task-new/tests/helpers/start-app', 'my-task-new/tests/helpers/destroy-app'], function (exports, _qunit, _startApp, _destroyApp) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (name) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    (0, _qunit.module)(name, {
      beforeEach: function beforeEach() {
        this.application = (0, _startApp.default)();

        if (options.beforeEach) {
          return options.beforeEach.apply(this, arguments);
        }
      },
      afterEach: function afterEach() {
        var _this = this;

        var afterEach = options.afterEach && options.afterEach.apply(this, arguments);
        return Ember.RSVP.resolve(afterEach).then(function () {
          return (0, _destroyApp.default)(_this.application);
        });
      }
    });
  };
});
define('my-task-new/tests/helpers/start-app', ['exports', 'my-task-new/app', 'my-task-new/config/environment'], function (exports, _app, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = startApp;
  function startApp(attrs) {
    var attributes = Ember.merge({}, _environment.default.APP);
    attributes.autoboot = true;
    attributes = Ember.merge(attributes, attrs); // use defaults, but you can override;

    return Ember.run(function () {
      var application = _app.default.create(attributes);
      application.setupForTesting();
      application.injectTestHelpers();
      return application;
    });
  }
});
define('my-task-new/tests/test-helper', ['my-task-new/app', 'my-task-new/config/environment', '@ember/test-helpers', 'ember-qunit'], function (_app, _environment, _testHelpers, _emberQunit) {
  'use strict';

  (0, _testHelpers.setApplication)(_app.default.create(_environment.default.APP));

  (0, _emberQunit.start)();
});
define('my-task-new/tests/tests.lint-test', [], function () {
  'use strict';

  QUnit.module('ESLint | tests');

  QUnit.test('helpers/destroy-app.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/destroy-app.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/module-for-acceptance.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/module-for-acceptance.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/start-app.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/start-app.js should pass ESLint\n\n');
  });

  QUnit.test('test-helper.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'test-helper.js should pass ESLint\n\n');
  });
});
require('my-task-new/tests/test-helper');
EmberENV.TESTS_FILE_LOADED = true;
//# sourceMappingURL=tests.map
