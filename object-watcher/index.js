/*
    object: object
        any object to listen to,
    options: {
        name: string
            identifier of the object,
        properties: array
            undefined properties to listen,
        propertiesOnly: boolean
            do not listen to currently defined properties,
        ownPropertyOnly: boolean
            only listen to object's own properties (not the properties
            inherited from his prototype),
        debug: boolean
            call debugger instead of console.log,
        getter: function(name)
            called when getting the poperty 'name',
        setter: function(name, value)
            called when setting the poperty 'name',
        recursive: boolean
            recursively apply the listener to child objects
    }
*/
function objectListener(object, options) {
    if(!object || typeof object !== 'object') { return; }
    if(!options) { options = {}; }

    var name, value, i, len,
        data = {},

        getter = options.getter || function(name) {
            if(options.debug) { debugger; }
            else { console.log('GET', options.name + '.' + name); }
        },

        setter = options.setter || function(name, value) {
            if(options.debug) { debugger; }
            else { console.log('SET', options.name + '.' + name, value); }
        },

        bind = function(name) {
            if(object.__lookupGetter__(name)) { return; }
            var value = data[name] = object[name];

            object.__defineGetter__(name, function() {
                getter(name);
                return data[name];
            });

            object.__defineSetter__(name, function(value) {
                setter(name, value);
                data[name] = value;
                recurse(name, value);
            });

            recurse(name, value);
        },

        recurse = function(name, value) {
            if(options.recursive) {
                var newOptions = {}, optionName;
                for(optionName in options) {
                    if(options.hasOwnProperty(optionName)) {
                        newOptions[optionName] = options[optionName];
                    }
                }
                newOptions.name = (options.name || '#') + '.' + name;
                objectListener(value, newOptions);
            }
        };

    if(!options.propertiesOnly) {
        for(name in object) {
            if(!options.ownPropertyOnly || object.hasOwnProprty(name)) {
                bind(name);
            }
        }
    }

    if(options.properties) {
        for(i = 0, len = options.properties.length; i < len; i += 1) {
            bind(options.properties[i]);
        }
    }
}

var test = {a: 1, b: 2, c: 3};
objectListener(test, {
    properties: ['foo', 'a'],
    name: 'test',
    recursive: true
});

test.a = 'az';
test.a = 'plop';
test.foo = 'bar';
test.foo += 'baz';
test.b = {};
test.b.foo = true;
/*
    SET test.a az
    SET test.a plop
    SET test.foo bar
    GET test.foo
    SET test.foo barbaz
    SET test.b Object
    GET test.b
    SET test.b.foo true
*/
