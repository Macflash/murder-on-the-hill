(this["webpackJsonpmureder-on-the-hill"]=this["webpackJsonpmureder-on-the-hill"]||[]).push([[0],{10:function(e,t,n){e.exports=n(17)},15:function(e,t,n){},16:function(e,t,n){},17:function(e,t,n){"use strict";n.r(t);var o=n(0),r=n.n(o),i=n(9),a=n.n(i),c=(n(15),n(6)),l=n(1),s=n(7),u=n(4),d=n(5);n(16);function h(e,t){var n=e.x,o=e.y;switch(t){case"TOP":return{x:n,y:o-1};case"BOTTOM":return{x:n,y:o+1};case"RIGHT":return{x:n+1,y:o};case"LEFT":return{x:n-1,y:o}}}var f=function(){function e(t){Object(u.a)(this,e),this.info=t,this.x=0,this.y=0,this.initialDoors=void 0,this.rotation=0;var n=t.doors;this.initialDoors=new Set(n)}return Object(d.a)(e,[{key:"canPlace",value:function(e,t){var n=this,o=!0;return e.forEach((function(e){n.doors.has(e)||(o=!1)})),t.forEach((function(e){n.doors.has(e)&&(o=!1)})),o}},{key:"copy",value:function(t){var n=new e(this.info);return t?n.rotate(t):n.rotate(this.rotation),n}},{key:"rotate",value:function(e){return this.rotation=e%4,this}},{key:"hasNeighbor",value:function(e,t){return e.hasCoord(h(this.coord,t))}},{key:"coord",get:function(){return{x:this.x,y:this.y}}},{key:"doors",get:function(){var e=this,t=new Set;return this.initialDoors.forEach((function(n){t.add(function(e,t){var n=["TOP","RIGHT","BOTTOM","LEFT"],o=n.indexOf(e);return n[(o+t)%n.length]}(n,e.rotation))})),t}}]),e}(),y=function(e){var t=e.tile,n=e.floor;return r.a.createElement("div",{style:{position:"absolute",height:P,width:P,top:t.y*P+.5*(window.innerHeight-P)-L,left:t.x*P+.5*(window.innerWidth-P)-I,display:"flex",justifyContent:"center",alignItems:"center",color:"white",backgroundColor:"#663333"}},t.info.name,["TOP","RIGHT","BOTTOM","LEFT"].map((function(e){return r.a.createElement(v,{tile:t,floor:n,direction:e,hasDoor:t.doors.has(e),opened:t.hasNeighbor(n,e)})})))};function T(e){var t=0,n=0,o=0,r=0,i=10,a=10;switch(e){case"TOP":n="auto",i=void 0;break;case"BOTTOM":t="auto",i=void 0;break;case"RIGHT":o="auto",a=void 0;break;case"LEFT":r="auto",a=void 0}return{top:t,bottom:n,left:o,right:r,width:i,height:a}}var v=function(e){var t=e.direction,n=e.opened,o=e.hasDoor,i=e.tile,a=e.floor,c="TOP"==t||"BOTTOM"==t,l=r.a.createElement("div",{style:{flex:"auto",backgroundColor:"black",height:c?"100%":void 0,width:c?void 0:"100%"}});return r.a.createElement("div",{style:Object(s.a)(Object(s.a)({},T(t)),{},{position:"absolute",display:"flex",flexDirection:c?"row":"column",justifyContent:"center",alignItems:"center",overflow:"hidden"})},l,o?r.a.createElement("div",{style:{cursor:n?void 0:"pointer",height:48,width:48,backgroundColor:n?"":"grey"},onClick:n?void 0:function(){a.fillCoord(h(i.coord,t)),M()}}):null,l)},w=new f({name:"Fourway",doors:["TOP","LEFT","RIGHT","BOTTOM"]}),k=new f({name:"TeeWay",doors:["TOP","LEFT","RIGHT"]}),O=new f({name:"Straight",doors:["TOP","BOTTOM"]}),g=new f({name:"LTurn",doors:["TOP","RIGHT"]}),m=new f({name:"RTurn",doors:["TOP","LEFT"]}),p=new f({name:"DeadEnd",doors:["TOP"]});function E(e){return[e,e.copy(1),e.copy(2),e.copy(3)]}function b(e){return[e,e.copy(1)]}var x=[].concat(Object(l.a)(b(w)),Object(l.a)(b(O)),Object(l.a)(E(k)),Object(l.a)(E(g)),Object(l.a)(E(m)),Object(l.a)(E(p))),C=new(function(){function e(t){Object(u.a)(this,e),this.name=t,this.grid=new Map}return Object(d.a)(e,[{key:"index",value:function(e,t){return"".concat(e,", ").concat(t)}},{key:"getCoord",value:function(e){return this.getTile(e.x,e.y)}},{key:"getTile",value:function(e,t){return this.grid.get(this.index(e,t))}},{key:"hasCoord",value:function(e){return this.hasTile(e.x,e.y)}},{key:"hasTile",value:function(e,t){return this.grid.has(this.index(e,t))}},{key:"setCoord",value:function(e,t){this.setTile(e,t.x,t.y)}},{key:"setTile",value:function(e,t,n){if(this.hasTile(t,n))throw alert("Already had a tile there!"),"already had a tile!";e.x=t,e.y=n,this.grid.set(this.index(t,n),e)}},{key:"getValidSpotsForTiles",value:function(){}},{key:"fillCoord",value:function(e){this.fillTile(e.x,e.y)}},{key:"fillTile",value:function(e,t){var n=this,o=(["TOP","RIGHT","BOTTOM","LEFT"].map((function(o){return n.getCoord(h({x:e,y:t},o))})),new Set),r=new Set;["TOP","RIGHT","BOTTOM","LEFT"].forEach((function(i){var a=n.getCoord(h({x:e,y:t},i));a&&(a.doors.has(function(e){switch(e){case"TOP":return"BOTTOM";case"BOTTOM":return"TOP";case"RIGHT":return"LEFT";case"LEFT":return"RIGHT"}}(i))?o.add(i):r.add(i))})),console.log("fill tile needs these doors:",o,"and these walls:",r);var i=x.filter((function(e){return e.canPlace(o,r)}));if(console.log("These tiles could fit here!",i),!i)throw"wow we should really fix that!";var a=i[Math.floor(Math.random()*i.length)].copy();console.log("adding new tile!",a),this.setTile(a,e,t)}},{key:"tiles",get:function(){return Array.from(this.grid,(function(e){var t=Object(c.a)(e,2);t[0];return t[1]}))}}]),e}())("Main Floor");C.setTile(w.copy(),0,0);var P=200,I=0,L=0,M=function(){};var j=!1,F=!1,R=!1,B=!1;document.addEventListener("keydown",(function(e){console.log(e.key),"a"!=e.key&&"ArrowLeft"!=e.key||(j=!0,R=!1),"d"!=e.key&&"ArrowRight"!=e.key||(R=!0,j=!1),"w"!=e.key&&"ArrowUp"!=e.key||(F=!0,B=!1),"s"!=e.key&&"ArrowDown"!=e.key||(B=!0,F=!1)})),document.addEventListener("keyup",(function(e){console.log(e.key),"a"!=e.key&&"ArrowLeft"!=e.key||(j=!1),"d"!=e.key&&"ArrowRight"!=e.key||(R=!1),"w"!=e.key&&"ArrowUp"!=e.key||(F=!1),"s"!=e.key&&"ArrowDown"!=e.key||(B=!1)}));!function e(){j&&(I-=2),R&&(I+=2),F&&(L-=2),B&&(L+=2),M(),requestAnimationFrame((function(){return e()}))}();var H=function(){var e=r.a.useState(0),t=Object(c.a)(e,2)[1],n=r.a.useCallback((function(){t(Math.random())}),[t]);return r.a.useEffect((function(){M=n}),[n]),r.a.createElement("div",{className:"App",style:{overflow:"hidden"}},r.a.createElement("div",{style:{zIndex:100,bottom:0,padding:20,position:"absolute",left:0,right:0}},r.a.createElement("button",{onClick:function(){L-=100,n()}},"UP!"),r.a.createElement("button",{onClick:function(){L+=100,n()}},"DOWN!"),r.a.createElement("button",{onClick:function(){I-=100,n()}},"LEFT!"),r.a.createElement("button",{onClick:function(){I+=100,n()}},"RIGHT!"),r.a.createElement("button",{onClick:function(){I=0,L=0,n()}},"CENTER!")),r.a.createElement("div",{style:{position:"absolute",zIndex:50,height:25,width:10,backgroundColor:"red",left:"calc(50% - 10px)",right:"calc(50% + 10px)",top:"calc(50% - 25px)",bottom:"calc(50% + 25px)",padding:5}}),r.a.createElement("div",{id:"gamefloor"},C.tiles.map((function(e,t){return r.a.createElement(y,{floor:C,tile:e,key:t})}))))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));a.a.render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(H,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[10,1,2]]]);
//# sourceMappingURL=main.0b329b7d.chunk.js.map