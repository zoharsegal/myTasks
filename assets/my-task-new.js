"use strict";



define('my-task-new/adapters/application', ['exports', 'ember-data'], function (exports, _emberData) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberData.default.JSONAPIAdapter.extend({
    host: 'api/public',
    headers: Object.freeze({
      'uuid': localStorage.getItem('uuid')
    }),
    pathForType: function pathForType(type) {
      this.set('headers', {
        'uuid': localStorage.getItem('uuid')
      });
      return type + "s";
    }
  });
});
define('my-task-new/app', ['exports', 'my-task-new/resolver', 'ember-load-initializers', 'my-task-new/config/environment'], function (exports, _resolver, _emberLoadInitializers, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var App = Ember.Application.extend({
    modulePrefix: _environment.default.modulePrefix,
    podModulePrefix: _environment.default.podModulePrefix,
    Resolver: _resolver.default
  });

  (0, _emberLoadInitializers.default)(App, _environment.default.modulePrefix);

  exports.default = App;
});
define('my-task-new/components/create-task', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend({
    modal: Ember.inject.service(),
    store: Ember.inject.service(),
    actions: {
      createTask: function createTask(taskName) {
        var _this = this;
        var task = this.get('store').createRecord('task', {
          taskName: taskName
        });
        task.save().then(function () {
          _this.get('store').findAll('userdata');
        }).catch(function () {
          alert("Error!");
        });
      },
      closeCreateTaskDialog: function closeCreateTaskDialog() {
        this.get("modal").set('isClose', true);
        this.rerender();
      }
    }
  });
});
define('my-task-new/components/index-header', ['exports', 'my-task-new/config/environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend({
    user: Ember.inject.service(),
    store: Ember.inject.service(),
    isLoggedIn: false, //need to fix it here when logg-in and logged-out
    routing: Ember.inject.service("-routing"),
    didRender: function didRender() {
      this.set('isLoggedIn', this.get('user').isLoggedIn);
    },
    init: function init() {
      var _this = this;

      this._super.apply(this, arguments);
      this.errors = [];
      var data = new FormData();
      data.append("_token", "{{ csrf_token() }");
      //this.user.setLoggedIn(true,data.userName,data.uuid);
      var uuid = localStorage.getItem('uuid');
      fetch(_environment.default.rootURL + 'api/public/user/checkLogin', {
        method: 'POST',
        headers: {
          'uuid': uuid
        },
        body: data
      }).then(function (response) {
        return response.json();
      }).then(function (data) {
        if (data.status != "OK") {
          _this.get('user').setLoggedIn(false, null, null);
        } else {
          _this.get('user').setLoggedIn(true, data.userName, data.uuid);
        }
        _this.set('isLoggedIn', _this.get('user').isLoggedIn);
      });
    },

    actions: {
      logout: function logout() {
        var _this2 = this;

        var data = new FormData();
        data.append("_token", "{{ csrf_token() }");
        fetch(_environment.default.rootURL + 'api/public/user/logout', {
          method: 'POST',
          headers: {
            'uuid': this.get('user').uuid
          },
          body: data
        }).then(function (response) {
          return response.json();
        }).then(function (data) {
          if (data.status != "OK") {
            alert(data.status);
          } else {
            _this2.get('store').unloadAll();
            _this2.get('user').setLoggedIn(false, null, null);
            _this2.set('isLoggedIn', false);
            var currentRouteName = _this2.get("routing.currentRouteName");
            Ember.getOwner(_this2).lookup('route:' + currentRouteName).refresh();
          }
        });
      }
    }
  });
});
define('my-task-new/components/share-user', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend({
    user: Ember.inject.service(),
    store: Ember.inject.service(),
    actions: {
      shareTaskWithUser: function shareTaskWithUser(taskId, userId) {
        this.get('store').findRecord('task', taskId).then(function (task) {
          var newShares = [];
          for (var i = 0; i < task.get("shares").length; i++) {
            if (task.get("shares")[i].userId == userId) {
              var isShared = task.get("shares")[i].isShared == 1 ? 0 : 1;
              newShares.push({ userId: task.get("shares")[i].userId, userName: task.get("shares")[i].userName, isShared: isShared });
            } else {
              newShares.push(task.get("shares")[i]);
            }
          }
          task.shares = newShares;

          task.save().then(function () {}).catch(function () {});
        });
      }
    }
  });
});
define('my-task-new/components/task-list', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend({
    modal: Ember.inject.service(),
    store: Ember.inject.service(),
    isCreateDialogShow: false,
    didRender: function didRender() {
      if (this.get('modal').get("isClose")) {
        this.get("modal").set('isClose', false);
        this.set('isCreateDialogShow', false);
      }
    },

    actions: {
      openCreateTaskDialog: function openCreateTaskDialog() {
        this.set('isCreateDialogShow', true);
      },
      refreshParent: function refreshParent() {
        alert("refreshed parent!");
      }
    }
  });
});
define('my-task-new/components/task-share', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend({
    modal: Ember.inject.service(),
    store: Ember.inject.service(),
    actions: {
      closeShareTaskDialog: function closeShareTaskDialog() {
        this.get("modal").set('isClose', true);
        this.rerender();
      }
    }
  });
});
define('my-task-new/components/task-shareuser', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend({});
});
define('my-task-new/components/task-single', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend({
    modal: Ember.inject.service(),
    user: Ember.inject.service(),
    store: Ember.inject.service(),
    isShareDialogShow: false,
    didRender: function didRender() {
      if (this.get('modal').get("isClose")) {
        this.get("modal").set('isClose', false);
        this.set('isShareDialogShow', false);
      }
    },

    actions: {
      markDoneOrNot: function markDoneOrNot(e) {
        var _this = this;
        this.get('store').findRecord('task', e.target.name).then(function (task) {
          var __this = _this;
          task.isDone = e.target.checked == true ? 1 : 0;
          task.save().then(function () {
            __this.get('store').findAll('userdata');
          }).catch(function () {
            alert("Error!");
          });
        });
      },
      deleteTask: function deleteTask(id) {
        var task = this.get('store').peekRecord('task', id);
        task.deleteRecord();
        task.isDeleted; // => true
        var _this = this;
        task.save().then(function () {
          _this.get('store').findAll('userdata');
        }).catch(function () {
          alert("Error!");
        });
      },
      shareTask: function shareTask(isOwner) {
        if (isOwner) {
          this.set('isShareDialogShow', true);
          this.rerender();
        }
      }
    }
  });
});
define('my-task-new/components/task-stats', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend({
    store: Ember.inject.service(),
    totalDone: 0,
    totalUnDone: 0,
    totalTasks: 0
    // didRender() {
    //   this.get('store').findAll('userdata')
    //   .then(userdata => {
    //     let tmpUserData=userdata.content[0].__data
    //     this.set('totalDone', tmpUserData.totalDone);
    //     this.set('totalUnDone', tmpUserData.totalUnDone);
    //     this.set('totalTasks', tmpUserData.totalTasks);
    //   })
    //   .catch(error => {
    //   });
    //   // console.log(userData)
    //
    // },
  });
});
define('my-task-new/components/welcome-page', ['exports', 'ember-welcome-page/components/welcome-page'], function (exports, _welcomePage) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _welcomePage.default;
    }
  });
});
define('my-task-new/controllers/login', ['exports', 'my-task-new/config/environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Controller.extend({
    user: Ember.inject.service(),
    routing: Ember.inject.service("-routing"),
    actions: {
      submitLoginForm: function submitLoginForm(userData) {
        var _this = this;

        var data = new FormData();
        data.append("email", userData.email);
        data.append("password", userData.password);
        data.append("_token", "{{ csrf_token() }");
        fetch(_environment.default.rootURL + 'api/public/user/login', {
          method: 'POST',
          headers: {
            'uuid': this.get('user').uuid
          },
          body: data
        }).then(function (response) {
          return response.json();
        }).then(function (data) {
          if (data.status != "OK") {
            alert(data.status);
          } else {
            _this.get('user').setLoggedIn(true, data.userName, data.uuid);
            var currentRouteName = _this.get("routing.currentRouteName");
            Ember.getOwner(_this).lookup('route:' + currentRouteName).refresh();
          }
        });
      }
    }

  });
});
define('my-task-new/controllers/register', ['exports', 'my-task-new/config/environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Controller.extend({
    user: Ember.inject.service(),
    actions: {
      submitRegisterForm: function submitRegisterForm(email, password, userName) {
        var _this = this;

        var data = new FormData();
        data.append("email", email);
        data.append("password", password);
        data.append("userName", userName);
        data.append("_token", "{{ csrf_token() }");

        fetch(_environment.default.rootURL + 'api/public/user/register', {
          method: 'POST',
          headers: {
            'uuid': this.user.uuid
          },
          body: data
        }).then(function (response) {
          return response.json();
        }).then(function (data) {
          if (data.status != "OK") {
            alert(data.status);
          } else {
            _this.get('user').setLoggedIn(true, data.userName, data.uuid);
            Ember.getOwner(_this).lookup('route:register').refresh();
          }
        });
      }
    }

  });
});
define('my-task-new/helpers/app-version', ['exports', 'my-task-new/config/environment', 'ember-cli-app-version/utils/regexp'], function (exports, _environment, _regexp) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.appVersion = appVersion;
  function appVersion(_) {
    var hash = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var version = _environment.default.APP.version;
    // e.g. 1.0.0-alpha.1+4jds75hf

    // Allow use of 'hideSha' and 'hideVersion' For backwards compatibility
    var versionOnly = hash.versionOnly || hash.hideSha;
    var shaOnly = hash.shaOnly || hash.hideVersion;

    var match = null;

    if (versionOnly) {
      if (hash.showExtended) {
        match = version.match(_regexp.versionExtendedRegExp); // 1.0.0-alpha.1
      }
      // Fallback to just version
      if (!match) {
        match = version.match(_regexp.versionRegExp); // 1.0.0
      }
    }

    if (shaOnly) {
      match = version.match(_regexp.shaRegExp); // 4jds75hf
    }

    return match ? match[0] : version;
  }

  exports.default = Ember.Helper.helper(appVersion);
});
define('my-task-new/helpers/pluralize', ['exports', 'ember-inflector/lib/helpers/pluralize'], function (exports, _pluralize) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _pluralize.default;
});
define('my-task-new/helpers/singularize', ['exports', 'ember-inflector/lib/helpers/singularize'], function (exports, _singularize) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _singularize.default;
});
define('my-task-new/helpers/sum', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.sum = sum;
  function sum(params) {
    return params.reduce(function (a, b) {
      return a + b;
    });
  }
  exports.default = Ember.Helper.helper(sum);
});
define('my-task-new/initializers/app-version', ['exports', 'ember-cli-app-version/initializer-factory', 'my-task-new/config/environment'], function (exports, _initializerFactory, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var name = void 0,
      version = void 0;
  if (_environment.default.APP) {
    name = _environment.default.APP.name;
    version = _environment.default.APP.version;
  }

  exports.default = {
    name: 'App Version',
    initialize: (0, _initializerFactory.default)(name, version)
  };
});
define('my-task-new/initializers/container-debug-adapter', ['exports', 'ember-resolver/resolvers/classic/container-debug-adapter'], function (exports, _containerDebugAdapter) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'container-debug-adapter',

    initialize: function initialize() {
      var app = arguments[1] || arguments[0];

      app.register('container-debug-adapter:main', _containerDebugAdapter.default);
      app.inject('container-debug-adapter:main', 'namespace', 'application:main');
    }
  };
});
define('my-task-new/initializers/data-adapter', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'data-adapter',
    before: 'store',
    initialize: function initialize() {}
  };
});
define('my-task-new/initializers/ember-data', ['exports', 'ember-data/setup-container', 'ember-data'], function (exports, _setupContainer) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'ember-data',
    initialize: _setupContainer.default
  };
});
define('my-task-new/initializers/export-application-global', ['exports', 'my-task-new/config/environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.initialize = initialize;
  function initialize() {
    var application = arguments[1] || arguments[0];
    if (_environment.default.exportApplicationGlobal !== false) {
      var theGlobal;
      if (typeof window !== 'undefined') {
        theGlobal = window;
      } else if (typeof global !== 'undefined') {
        theGlobal = global;
      } else if (typeof self !== 'undefined') {
        theGlobal = self;
      } else {
        // no reasonable global, just bail
        return;
      }

      var value = _environment.default.exportApplicationGlobal;
      var globalName;

      if (typeof value === 'string') {
        globalName = value;
      } else {
        globalName = Ember.String.classify(_environment.default.modulePrefix);
      }

      if (!theGlobal[globalName]) {
        theGlobal[globalName] = application;

        application.reopen({
          willDestroy: function willDestroy() {
            this._super.apply(this, arguments);
            delete theGlobal[globalName];
          }
        });
      }
    }
  }

  exports.default = {
    name: 'export-application-global',

    initialize: initialize
  };
});
define('my-task-new/initializers/injectStore', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'injectStore',
    before: 'store',
    initialize: function initialize() {}
  };
});
define('my-task-new/initializers/store', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'store',
    after: 'ember-data',
    initialize: function initialize() {}
  };
});
define('my-task-new/initializers/transforms', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'transforms',
    before: 'store',
    initialize: function initialize() {}
  };
});
define("my-task-new/instance-initializers/ember-data", ["exports", "ember-data/initialize-store-service"], function (exports, _initializeStoreService) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: "ember-data",
    initialize: _initializeStoreService.default
  };
});
define('my-task-new/models/task', ['exports', 'ember-data'], function (exports, _emberData) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberData.default.Model.extend({
    isDone: _emberData.default.attr('boolean'),
    isShared: _emberData.default.attr('boolean'),
    isOwner: _emberData.default.attr('boolean'),
    taskName: _emberData.default.attr('string'),
    doneCount: _emberData.default.attr('number'),
    notDoneCount: _emberData.default.attr('number'),
    shares: _emberData.default.attr()
  });
});
define('my-task-new/models/userdata', ['exports', 'ember-data'], function (exports, _emberData) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberData.default.Model.extend({
    totalDone: _emberData.default.attr('number'),
    totalUnDone: _emberData.default.attr('number'),
    totalTasks: _emberData.default.attr('number')
  });
});
define('my-task-new/resolver', ['exports', 'ember-resolver'], function (exports, _emberResolver) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberResolver.default;
});
define('my-task-new/router', ['exports', 'my-task-new/config/environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var Router = Ember.Router.extend({
    location: _environment.default.locationType,
    rootURL: _environment.default.rootURL
  });

  Router.map(function () {
    this.route('login', { path: '/login' });
    this.route('logout', { path: '/logout' });
    this.route('register', { path: '/register' });
    this.route('task', { path: '/tasks' });
  });

  exports.default = Router;
});
define('my-task-new/routes/application', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({});
});
define('my-task-new/routes/login', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({
    beforeModel: function beforeModel() /* transition */{
      if (localStorage.getItem('uuid')) {
        this.transitionTo('index');
      }
    }
  });
});
define('my-task-new/routes/register', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({
    beforeModel: function beforeModel() /* transition */{
      if (localStorage.getItem('uuid')) {
        this.transitionTo('index');
      }
    }
  });
});
define('my-task-new/routes/task', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({
    beforeModel: function beforeModel() {
      if (!localStorage.getItem('uuid')) {
        this.transitionTo('login');
      }
    },
    model: function model() {
      return Ember.RSVP.hash({
        tasks: this.store.findAll('task'),
        userdata: this.store.findAll('userdata')
      });
    },
    setupController: function setupController(controller, model) {
      this._super.apply(this, arguments);
      Ember.set(controller, 'tasks', model.tasks);
      Ember.set(controller, 'userdata', model.userdata);
    },

    actions: {
      refreshCurrentRoute: function refreshCurrentRoute() {
        this.refresh();
      }
    }
  });
});
define('my-task-new/services/ajax', ['exports', 'ember-ajax/services/ajax'], function (exports, _ajax) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _ajax.default;
    }
  });
});
define('my-task-new/services/modal', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Service.extend({
    isClose: false
  });
});
define("my-task-new/services/user", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Service.extend({
    isLoggedIn: false,
    userName: "",
    uuid: "",
    setLoggedIn: function setLoggedIn(val, userName, uuid) {
      if (val) {
        localStorage.setItem("uuid", uuid);
      } else {
        localStorage.removeItem("uuid");
      }
      this.isLoggedIn = val;
      this.userName = userName;
      this.uuid = uuid;
    },
    getLoggedIn: function getLoggedIn() {
      return this.isLoggedIn;
    }
  });
});
define("my-task-new/templates/application", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "K3H6zyXC", "block": "{\"symbols\":[],\"statements\":[[6,\"div\"],[9,\"class\",\"bodyContent\"],[7],[0,\"\\n  \"],[1,[18,\"index-header\"],false],[0,\"\\n  \"],[1,[18,\"outlet\"],false],[0,\"\\n\"],[8]],\"hasEval\":false}", "meta": { "moduleName": "my-task-new/templates/application.hbs" } });
});
define("my-task-new/templates/components/create-task", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "FBdTD4Ao", "block": "{\"symbols\":[],\"statements\":[[6,\"div\"],[9,\"class\",\"modalOutDialog\"],[7],[0,\"\\n\"],[8],[0,\"\\n\"],[6,\"div\"],[9,\"class\",\"modalInDialog\"],[7],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"modelHeader\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"modalTitle\"],[7],[0,\"יצירת משימה\"],[8],[0,\"\\n    \"],[6,\"div\"],[10,\"onclick\",[25,\"action\",[[19,0,[]],\"closeCreateTaskDialog\"],null],null],[9,\"class\",\"modelHeaderCloseDiv\"],[7],[0,\"\\n      \"],[6,\"span\"],[9,\"class\",\"fa fa-times modelHeaderClose\"],[7],[8],[0,\"\\n    \"],[8],[0,\"\\n  \"],[8],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"modelContent\"],[7],[0,\"\\n    \"],[6,\"form\"],[9,\"class\",\"form\"],[3,\"action\",[[19,0,[]],\"createTask\",[20,[\"taskName\"]]],[[\"on\"],[\"submit\"]]],[7],[0,\"\\n      \"],[6,\"div\"],[9,\"class\",\"container\"],[7],[0,\"\\n        \"],[6,\"label\"],[9,\"for\",\"taskName\"],[7],[6,\"b\"],[7],[0,\"שם משימה:\"],[8],[8],[0,\"\\n         \"],[1,[25,\"input\",null,[[\"type\",\"name\",\"required\",\"value\"],[\"text\",[20,[\"taskName\"]],true,[20,[\"taskName\"]]]]],false],[0,\"\\n\\n        \"],[1,[25,\"input\",null,[[\"type\",\"name\",\"value\"],[\"hidden\",[20,[\"_token\"]],\"e(csrf_token())\"]]],false],[0,\"\\n\\n        \"],[6,\"button\"],[9,\"type\",\"submit\"],[9,\"class\",\"btnMenu\"],[7],[0,\"צור\"],[8],[0,\"\\n      \"],[8],[0,\"\\n\\n    \"],[8],[0,\"\\n  \"],[8],[0,\"\\n\"],[8]],\"hasEval\":false}", "meta": { "moduleName": "my-task-new/templates/components/create-task.hbs" } });
});
define("my-task-new/templates/components/index-header", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "4Bw5qU4u", "block": "{\"symbols\":[],\"statements\":[[6,\"div\"],[9,\"class\",\"header\"],[7],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"appButtons\"],[7],[0,\"\\n\\n\"],[4,\"if\",[[20,[\"isLoggedIn\"]]],null,{\"statements\":[[0,\"      \"],[6,\"a\"],[9,\"class\",\"btnMenu\"],[10,\"onclick\",[25,\"action\",[[19,0,[]],\"logout\"],null],null],[7],[0,\"התנתק\"],[8],[0,\"\\n      \"],[4,\"link-to\",[\"task\"],[[\"class\"],[\"btnMenu\"]],{\"statements\":[[0,\"המשימות שלי\"]],\"parameters\":[]},null],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"      \"],[4,\"link-to\",[\"login\"],[[\"class\"],[\"btnMenu\"]],{\"statements\":[[0,\"התחבר\"]],\"parameters\":[]},null],[0,\"\\n      \"],[4,\"link-to\",[\"register\"],[[\"class\"],[\"btnMenu\"]],{\"statements\":[[0,\"הרשם\"]],\"parameters\":[]},null],[0,\"\\n\"]],\"parameters\":[]}],[0,\"  \"],[8],[0,\"\\n\\n  \"],[6,\"div\"],[9,\"class\",\"appTitle\"],[7],[0,\"\\n\"],[4,\"link-to\",[\"index\"],[[\"class\"],[\"appTitleLink\"]],{\"statements\":[[0,\"      משימות\\n\"]],\"parameters\":[]},null],[0,\"  \"],[8],[0,\"\\n\\n\"],[8],[0,\"\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "my-task-new/templates/components/index-header.hbs" } });
});
define("my-task-new/templates/components/share-user", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "8caMmPmV", "block": "{\"symbols\":[],\"statements\":[[6,\"label\"],[9,\"class\",\"checkbox\"],[7],[0,\"\\n     \"],[1,[25,\"input\",null,[[\"type\",\"name\",\"required\",\"checked\",\"change\"],[\"checkbox\",[20,[\"userId\"]],true,[20,[\"isShared\"]],[25,\"action\",[[19,0,[]],\"shareTaskWithUser\",[20,[\"taskId\"]],[20,[\"userId\"]]],null]]]],false],[0,\"\\n     \"],[6,\"span\"],[9,\"class\",\"taskName\"],[7],[1,[18,\"userName\"],false],[8],[0,\"\\n\"],[8],[0,\"\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "my-task-new/templates/components/share-user.hbs" } });
});
define("my-task-new/templates/components/task-list", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "wZ5sQToH", "block": "{\"symbols\":[\"task\",\"index\"],\"statements\":[[4,\"if\",[[20,[\"isCreateDialogShow\"]]],null,{\"statements\":[[0,\"  \"],[1,[18,\"create-task\"],false],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"\\n\"],[6,\"div\"],[9,\"class\",\"subToolBar\"],[7],[0,\"\\n  \"],[6,\"a\"],[9,\"class\",\"btnMenu btnMargin10\"],[10,\"onclick\",[25,\"action\",[[19,0,[]],\"openCreateTaskDialog\"],null],null],[7],[6,\"span\"],[9,\"class\",\"fa fa-plus btnCreateTask\"],[7],[8],[8],[0,\"\\n\"],[8],[0,\"\\n\"],[6,\"div\"],[9,\"class\",\"tasksContainer\"],[7],[0,\"\\n  \"],[6,\"ul\"],[9,\"class\",\"taskList\"],[7],[0,\"\\n\"],[4,\"each\",[[20,[\"tasks\"]]],null,{\"statements\":[[0,\"        \"],[6,\"li\"],[9,\"class\",\"liMixed\"],[7],[0,\"\\n          \"],[1,[25,\"task-single\",null,[[\"id\",\"isDone\",\"isShared\",\"isOwner\",\"orderNum\",\"taskName\",\"sharesList\",\"class\"],[[19,1,[\"id\"]],[19,1,[\"isDone\"]],[19,1,[\"isShared\"]],[19,1,[\"isOwner\"]],[19,2,[]],[19,1,[\"taskName\"]],[19,1,[\"shares\"]],\"divLi\"]]],false],[0,\"\\n        \"],[8],[0,\"\\n\"]],\"parameters\":[1,2]},null],[0,\"    \"],[8],[0,\"\\n\"],[8],[0,\"\\n\\n\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "my-task-new/templates/components/task-list.hbs" } });
});
define("my-task-new/templates/components/task-share", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "/GOn8IKU", "block": "{\"symbols\":[\"share\"],\"statements\":[[6,\"div\"],[9,\"class\",\"modalOutDialog\"],[7],[0,\"\\n\"],[8],[0,\"\\n\"],[6,\"div\"],[9,\"class\",\"modalInDialog\"],[7],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"modelHeader\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"modalTitle\"],[7],[0,\"שיתוף משימה עם\"],[8],[0,\"\\n    \"],[6,\"div\"],[10,\"onclick\",[25,\"action\",[[19,0,[]],\"closeShareTaskDialog\"],null],null],[9,\"class\",\"modelHeaderCloseDiv\"],[7],[0,\"\\n      \"],[6,\"span\"],[9,\"class\",\"fa fa-times modelHeaderClose\"],[7],[8],[0,\"\\n    \"],[8],[0,\"\\n  \"],[8],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"modelContent\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"tasksShareContainer\"],[7],[0,\"\\n      \"],[6,\"ul\"],[9,\"class\",\"ulShares\"],[7],[0,\"\\n\"],[4,\"each\",[[20,[\"sharesList\"]]],null,{\"statements\":[[0,\"            \"],[6,\"li\"],[9,\"class\",\"liFixed\"],[7],[0,\"\\n              \"],[1,[25,\"share-user\",null,[[\"userId\",\"userName\",\"isShared\",\"taskId\",\"class\"],[[19,1,[\"userId\"]],[19,1,[\"userName\"]],[19,1,[\"isShared\"]],[20,[\"taskId\"]],\"divLi\"]]],false],[0,\"\\n            \"],[8],[0,\"\\n\"]],\"parameters\":[1]},null],[0,\"        \"],[8],[0,\"\\n    \"],[8],[0,\"\\n  \"],[8],[0,\"\\n\"],[8]],\"hasEval\":false}", "meta": { "moduleName": "my-task-new/templates/components/task-share.hbs" } });
});
define("my-task-new/templates/components/task-shareuser", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "AvhubzWm", "block": "{\"symbols\":[\"&default\"],\"statements\":[[6,\"label\"],[10,\"for\",[18,\"id\"],null],[7],[0,\"\\n\"],[6,\"input\"],[13,\"@name\",[18,\"id\"]],[13,\"@id\",[18,\"id\"]],[14,\"@type\",\"checkbox\"],[13,\"@checked\",[18,\"isShared\"]],[3,\"on\",[\"input\",[19,0,[\"markUserShare\"]]]],[7],[8],[11,1],[0,\"\\n\"],[1,[18,\"isShared\"],false],[0,\"\\n\"],[8],[0,\"\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "my-task-new/templates/components/task-shareuser.hbs" } });
});
define("my-task-new/templates/components/task-single", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "XUm16V1k", "block": "{\"symbols\":[],\"statements\":[[6,\"label\"],[10,\"class\",[26,[\"checkbox \",[25,\"if\",[[20,[\"isDone\"]],\"is-done\"],null]]]],[7],[0,\"\\n\\n     \"],[1,[25,\"input\",null,[[\"type\",\"name\",\"required\",\"checked\",\"change\"],[\"checkbox\",[20,[\"id\"]],true,[20,[\"isDone\"]],[25,\"action\",[[19,0,[]],\"markDoneOrNot\"],null]]]],false],[0,\"\\n     \"],[6,\"span\"],[9,\"class\",\"taskName\"],[7],[6,\"b\"],[7],[1,[25,\"sum\",[[20,[\"orderNum\"]],1],null],false],[8],[0,\".\"],[1,[18,\"taskName\"],false],[8],[0,\"\\n\"],[8],[0,\"\\n\\n\"],[6,\"div\"],[9,\"class\",\"actionList\"],[7],[0,\"\\n  \"],[6,\"span\"],[10,\"onclick\",[25,\"action\",[[19,0,[]],\"shareTask\",[20,[\"isOwner\"]]],null],null],[10,\"class\",[26,[\"fa fa-share-alt shareTask \",[25,\"if\",[[20,[\"isShared\"]],\"is-shared\"],null]]]],[7],[0,\"\\n  \"],[8],[0,\"\\n\\n\"],[4,\"if\",[[20,[\"isOwner\"]]],null,{\"statements\":[[0,\"  \"],[6,\"span\"],[10,\"onclick\",[25,\"action\",[[19,0,[]],\"deleteTask\",[20,[\"id\"]]],null],null],[9,\"class\",\"fa fa-times deleteTask\"],[7],[0,\"\\n  \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"\\n\"],[8],[0,\"\\n\\n\"],[4,\"if\",[[20,[\"isShareDialogShow\"]]],null,{\"statements\":[[0,\"  \"],[1,[25,\"task-share\",null,[[\"taskId\",\"sharesList\",\"class\"],[[20,[\"id\"]],[20,[\"sharesList\"]],\"posFixed\"]]],false],[0,\"\\n\"]],\"parameters\":[]},null]],\"hasEval\":false}", "meta": { "moduleName": "my-task-new/templates/components/task-single.hbs" } });
});
define("my-task-new/templates/components/task-stats", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "3ATpE7jZ", "block": "{\"symbols\":[],\"statements\":[[6,\"div\"],[9,\"class\",\"totalSumOuter\"],[7],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"totalSum\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"totalsum__element\"],[7],[0,\"לסיום:\"],[6,\"b\"],[7],[1,[20,[\"userdata\",\"lastObject\",\"totalUnDone\"]],false],[8],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"totalsum__element\"],[7],[0,\"הושלמו:\"],[6,\"b\"],[7],[1,[20,[\"userdata\",\"lastObject\",\"totalDone\"]],false],[8],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"totalsum__element\"],[7],[0,\"סה\\\"כ:\"],[6,\"b\"],[7],[1,[20,[\"userdata\",\"lastObject\",\"totalTasks\"]],false],[8],[8],[0,\"\\n  \"],[8],[0,\"\\n\"],[8]],\"hasEval\":false}", "meta": { "moduleName": "my-task-new/templates/components/task-stats.hbs" } });
});
define("my-task-new/templates/index", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "k+gWpISZ", "block": "{\"symbols\":[],\"statements\":[[6,\"div\"],[9,\"class\",\"indexDiv\"],[7],[0,\"\\n  \"],[6,\"h2\"],[7],[0,\"ברוכים הבאים למערכת ניהול משימות!\"],[8],[0,\"\\n  \"],[6,\"p\"],[9,\"class\",\"subTitle\"],[7],[0,\"מקווים שתהנו.\"],[8],[0,\"\\n\"],[8]],\"hasEval\":false}", "meta": { "moduleName": "my-task-new/templates/index.hbs" } });
});
define("my-task-new/templates/login", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "mDv2XU4r", "block": "{\"symbols\":[],\"statements\":[[6,\"form\"],[9,\"class\",\"form\"],[3,\"action\",[[19,0,[]],\"submitLoginForm\",[20,[\"user\"]]],[[\"on\"],[\"submit\"]]],[7],[0,\"\\n\\n  \"],[6,\"div\"],[9,\"class\",\"container\"],[7],[0,\"\\n    \"],[6,\"label\"],[9,\"for\",\"email\"],[7],[6,\"b\"],[7],[0,\"אי מייל:\"],[8],[8],[0,\"\\n      \"],[1,[25,\"input\",null,[[\"type\",\"name\",\"required\",\"value\"],[\"email\",[20,[\"email\"]],true,[20,[\"user\",\"email\"]]]]],false],[0,\"\\n\\n    \"],[6,\"label\"],[9,\"for\",\"psw\"],[7],[6,\"b\"],[7],[0,\"סיסמה:\"],[8],[8],[0,\"\\n      \"],[1,[25,\"input\",null,[[\"type\",\"name\",\"required\",\"value\"],[\"password\",[20,[\"password\"]],true,[20,[\"user\",\"password\"]]]]],false],[0,\"\\n\\n    \"],[1,[25,\"input\",null,[[\"type\",\"name\",\"value\"],[\"hidden\",[20,[\"_token\"]],\"e(csrf_token())\"]]],false],[0,\"\\n\\n    \"],[6,\"button\"],[9,\"type\",\"submit\"],[9,\"class\",\"btnMenu\"],[7],[0,\"התחבר\"],[8],[0,\"\\n  \"],[8],[0,\"\\n\\n\"],[8]],\"hasEval\":false}", "meta": { "moduleName": "my-task-new/templates/login.hbs" } });
});
define("my-task-new/templates/register", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "T1Fa6vG7", "block": "{\"symbols\":[],\"statements\":[[6,\"form\"],[9,\"class\",\"form\"],[3,\"action\",[[19,0,[]],\"submitRegisterForm\",[20,[\"email\"]],[20,[\"password\"]],[20,[\"userName\"]]],[[\"on\"],[\"submit\"]]],[7],[0,\"\\n\\n  \"],[6,\"div\"],[9,\"class\",\"container\"],[7],[0,\"\\n    \"],[6,\"label\"],[9,\"for\",\"email\"],[7],[6,\"b\"],[7],[0,\"אי מייל:\"],[8],[8],[0,\"\\n      \"],[1,[25,\"input\",null,[[\"type\",\"name\",\"required\",\"value\"],[\"email\",[20,[\"email\"]],true,[20,[\"email\"]]]]],false],[0,\"\\n\\n    \"],[6,\"label\"],[9,\"for\",\"psw\"],[7],[6,\"b\"],[7],[0,\"סיסמה:\"],[8],[8],[0,\"\\n      \"],[1,[25,\"input\",null,[[\"type\",\"name\",\"required\",\"value\"],[\"password\",[20,[\"password\"]],true,[20,[\"password\"]]]]],false],[0,\"\\n\\n    \"],[6,\"label\"],[9,\"for\",\"psw\"],[7],[6,\"b\"],[7],[0,\"שם משתמש:\"],[8],[8],[0,\"\\n      \"],[1,[25,\"input\",null,[[\"type\",\"name\",\"required\",\"value\"],[\"text\",[20,[\"userName\"]],true,[20,[\"userName\"]]]]],false],[0,\"\\n\\n    \"],[1,[25,\"input\",null,[[\"type\",\"name\",\"value\"],[\"hidden\",[20,[\"_token\"]],\"e(csrf_token())\"]]],false],[0,\"\\n\\n    \"],[6,\"button\"],[9,\"type\",\"submit\"],[9,\"class\",\"btnMenu\"],[7],[0,\"הרשם\"],[8],[0,\"\\n  \"],[8],[0,\"\\n\\n\"],[8],[0,\"\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "my-task-new/templates/register.hbs" } });
});
define("my-task-new/templates/task", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "KxYukfS5", "block": "{\"symbols\":[],\"statements\":[[1,[25,\"task-list\",null,[[\"tasks\"],[[20,[\"tasks\"]]]]],false],[0,\"\\n\"],[1,[25,\"task-stats\",null,[[\"userdata\"],[[20,[\"userdata\"]]]]],false],[0,\"\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "my-task-new/templates/task.hbs" } });
});


define('my-task-new/config/environment', [], function() {
  var prefix = 'my-task-new';
try {
  var metaName = prefix + '/config/environment';
  var rawConfig = document.querySelector('meta[name="' + metaName + '"]').getAttribute('content');
  var config = JSON.parse(unescape(rawConfig));

  var exports = { 'default': config };

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

});

if (!runningTests) {
  require("my-task-new/app")["default"].create({"name":"my-task-new","version":"0.0.0+51e8a418"});
}
//# sourceMappingURL=my-task-new.map
