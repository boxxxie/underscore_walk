var _ = require("./underscore");

_.mixin({
	    walk:{
		identity:function(o){
		    return o;
		},
		demo:function(node){
		    console.log(node);
		    return node;
		},

		//the transformer needs to take in 1 args
		//it needs to return the transformed obj. noop = return first arg;
		//refer to tests
		walk:function(o,pretran,posttran){
		    function isObject(obj){return typeof o == 'object';}
		    //transforms data in a js object via a walk function
		    o = pretran(o);
		    var ret = o;
		    if(isObject(o)){
			for(var prop in o){
			    if(o.hasOwnProperty(prop)){
				var val = o[prop];
				var transformedVal = posttran(walk(val,pretran,posttran));
				var walked = {};
				walked[prop] = transformedVal;
				_.extend(ret,walked);
			    }
			} 
		    }  
		    return ret;
		},
		pre:function(o,trans){
		    return walk(o,trans,identity);
		},
		pre_f:function(trans){
		    return function(o){
			return walk(o,trans,identity);
		    };
		},
		pre_demo:function(node){
		    pre_walk(node,demo);
		},
		post:function(o,trans){
		    return walk(o,identity,trans);
		},
		post_f:function(trans){
		    return function (o){
			return walk(o,identity,trans);
		    };
		},
		post_demo:function(node){
		    post_walk(node,demo);
		}
	    }
	});
