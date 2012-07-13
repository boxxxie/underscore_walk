var _ = require("./underscore");
require("./underscore_extended");
require("./underscore_walk");

function test(name){
    return function(fun){
	if(!fun()){
	    console.log("Test " + name + " : Failed");
	}
	else{console.log("Test " + name + " : Passed");}
    };
};

test("numbers to strings")
(function(){
     function t(node){
	 if(_.isNumber(node)){return node+"";}
	 return node;
     }
     var testTree = {n:'root',c:[{n:1},{n:2,c:[{n:3}]}]};
     var answer =   {n:'root',c:[{n:'1'},{n:'2',c:[{n:'3'}]}]};
     var pre = _.prewalk(t,_.clone(testTree));
     var post = _.postwalk(t,_.clone(testTree));
     return (_.isEqual(answer,post) && _.isEqual(pre,answer));
 });

test("numbers to arrays")
(function(){
     function t(node){
	 if(_.isNumber(node.n)){return _.extend(node,{n:[node.n]});}
	 return node;
     }
     var testTree = {n:'root',c:[{n:1},{n:2,c:[{n:3}]}]};
     var answer =   {n:'root',c:[{n:[1]},{n:[2],c:[{n:[3]}]}]};
     //	 walk.pre_walk_demo(testTree);
     var pre = _.prewalk(t,testTree);
     // log(pre);
     var post = _.postwalk(t,testTree);
     // log(answer);
     return (_.isEqual(answer,post) && _.isEqual(pre,answer));
 });

test("numbers to arrays, and [1] to ['1']")
(function(){
     function t(node){
	 if(_.isNumber(node.n)){return _.extend(node,{n:[node.n]});}
	 if(_.isEqual([1],node)){return ['1'];}
	 return node;
     }
     var testTree = {n:'root',c:[{n:1},{n:2,c:[{n:3}]}]};
     var answer =   {n:'root',c:[{n:['1']},{n:[2],c:[{n:[3]}]}]};
     var w_answer =   {n:'root',c:[{n:[1]},{n:[2],c:[{n:[3]}]}]};
     var pre = _.prewalk(t,_.clone(testTree));
     var post = _.postwalk(t,_.clone(testTree));
     return (_.isEqual(answer,post) && _.isEqual(pre,answer) && !_.isEqual(w_answer,answer));
 });

test("merge child with parent")
(function(){
     function t(node){
	 if(node.ts){
	     return node.ts.map(function(item){
				    return {fs1:node.fs1,ft1:item.ft1};
				});
	 }
	 return node;
     }
     function t2(node){
	 if(node.ss){return _.extend(node, {ss:_.flatten(node.ss)});}
	 return node;
     };
     var testTree = {fc1:1,
		     gs:[{gf1:2,
			  ss:[{fs1:3,
			       ts:[{ft1:4},
				   {ft1:5}]
			      }]
			 }]
		    };
     var answer =  {fc1:1,
		    gs:[{gf1:2,
			 ss:[{fs1:3,ft1:4},{fs1:3,ft1:5}]
			}]
		   };
     var pre = _.prewalk(t2,_.prewalk(t,_.clone(testTree)));
     var post = _.postwalk(t2,_.postwalk(t,_.clone(testTree)));
     return (_.isEqual(answer,post) && _.isEqual(pre,answer));
 });

/*
test("general merge child with parent")
(function(){
     function extendFromParentToChild(parent){
	 return function(child){
	     return _.combine(child,parent);
	 };
     };
     function t(node){
	 if(node && node.ts){
	     var parentWithoutChild = _.removeKeys(node,'ts');
	     var transform = _.map(node.ts, extendFromParentToChild(parentWithoutChild));
	     return transform;
	 }
	 return node;
     }
     function t2(node){
	 if(node && node.ss){
	     node.ss = _.flatten(node.ss);
	     return node;
	 }
	 return node;
     };
     var testTree = {fc1:1,
		     gs:[{gf1:2,
			  ss:[{fs1:3,
			       ts:[{ft1:4},
				   {ft1:5}]
			      }]
			 }]
		    };
     var answer =  {fc1:1,
		    gs:[{gf1:2,
			 ss:[{fs1:3,ft1:4},{fs1:3,ft1:5}]
			}]
		   };

     var pre =
	 _.compose(
	     _.curry(_.prewalk(t2)),
	     _.curry(_.prewalk(t)))(_.clone(testTree));
     var post =
	 _.compose(
	     _.curry(_.postwalk(t2)),
	     _.curry(_.postwalk(t)))(_.clone(testTree));
     return (_.isEqual(answer,post) && _.isEqual(pre,answer));
 });
*/

console.log("tests finished");