var coreTypes = {
	errors: {
		EVENT_NOT_FOUND: {
			description: 'Could not find an event called {{ eventName }}.',
			status: 404
		},
		UNKNOWN_TYPE: {
			description: 'Could not set or register a type called {{ typeName }}.',
			status: 404
		}
	},
	events: {},
	models: {}
};
var internals = {
	errors: {},
	events: {},
	models: {}
};

var normalizeType = function(type, singular) {
	type = type.toLowerCase();
	if(singular) type += 's';
	if(!internals[type]) {
		var exception = mergeObjs(coreErrors.UNKNOWN_TYPE, { params: { typeName: type } });
	}
	return type;
};

var mergeObjs = function(obj1, obj2) {
	var finalObj = {};
	for(var i in obj1) {
		finalObj[i] = obj1[i];
	}
	for(var i in obj2) {
		finalObj[i] = obj2[i];
	}
	return finalObj;
}

export default class {
	constructor(settings) {
		this.description = '';
		this.route = null;
		this.settings = settings;
	}

	// Sets all errors, models, or events
	set(type, value) {
		type = normalizeType(type);
		internals[type] = mergeObjs(coreTypes[type], value);
	}

	// Gets all errors, models, events, or a specific error, model, or event
	get(type, key) {
		type = normalizeType(type);
		if(key) {
			return internals[type][key];
		}
		return internals[type];
	}

	// Adds a new error, model, or event
	register(type, key, value) {
		type = normalizeType(type, true);
		internals[type][key] = value;
	}

	// Removes an error, model, or event
	unregister(type, key) {
		type = normalizeType(type, true);
		delete internals[type][key];
	}

	trigger(eventName, data) {
		return new Promise((resolve, reject) => {
			if(!this.events[eventName])
				return reject(this.error('EVENT_NOT_FOUND', { eventName: eventName }));

		});
	}

	error(name, params) {
		if(!this.errors[name]) {
			var errorObj = {
				description: 'Could not find an error called {{ name }}. Params = {{ params }}.',
				status: 404
			};
			return mergeObjs(errorObj, { params: { name: name, params: JSON.stringify(params) } });
		}

		return mergeObjs(this.errors[name], { params: params });
	}
};