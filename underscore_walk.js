
(function(root){
     var _ = require("./underscore");
     var _walk={
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
     };



     // CommonJS module is defined
     if (typeof exports !== 'undefined') {
	 if (typeof module !== 'undefined' && module.exports) {
	     // Export module
	     module.exports = _walk;
	 }
	 exports._walk = _walk;

     } else if (typeof define === 'function' && define.amd) {
	 // Register as a named module with AMD.
	 define('underscore.walk', function() {
		    return _walk;
		});

	 // Integrate with Underscore.js
     } else if (typeof root._ !== 'undefined') {
	 // root._.mixin(_walk);
	 root._.walk = _walk;

	 // Or define it
     } else {
	 root._ = {
	     walk: _walk
	 };
     }
 }(this || window));