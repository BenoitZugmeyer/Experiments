
function _super(instance) {
  return new Proxy(instance, {
    get: function (target, name) {
      var current = target['__super_' + name] || target;
      
      while (!current.hasOwnProperty(name)) {
        current = Object.getPrototypeOf(current);
      }
      
      var parent = Object.getPrototypeOf(current);
      target['__super_' + name] = parent;
      var method = parent[name];
      
      return function () {
        var result = method && method.apply(target, arguments);
        target['__super_' + name] = null;
        return result;
      };
    }
  });
}


function Class() {}
Class.extend = function (definition) {
  var constructor = definition.constructor || function AnonymousClass() {};
  constructor.prototype = Object.create(this.prototype);
  Object.getOwnPropertyNames(definition).forEach(function (property) {
    Object.defineProperty(
      constructor.prototype,
      property,
      Object.getOwnPropertyDescriptor(definition, property)
    );
  });
  constructor.extend = Class.extend;
  return constructor;
};

Class.prototype = Object.create(Object.prototype, {
  super: {
    get: function () {
      return _super(this);
    }
  }
});

function Foo() {}

Class.extend({
  constructor: Foo,
  log: function (i) {
    console.log('foo', i);
    if (i) {
      this.log();
    }
    //this.other();
  },
  other: function () {
    console.log('other');
  }
});

function Bar() {}
Foo.extend({
  constructor: Bar,
  log: function (i) {
    this.super.log(i);
    console.log('bar', i);
  }
});

function Baz() {}

Bar.extend({
  constructor: Baz,
  log: function () {
    this.super.log('1');
    console.log('baz');
  },
  other: function () {
    this.super.other();
    console.log('other bar');
  }
});

var i = new Baz();

console.log('---');

console.log(i instanceof Baz, i instanceof Foo);
i.log();
console.log('-');
i.log();