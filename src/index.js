import {createElement,render,renderDom} from './element.js'
import diff from './diff';
import patch from './patch';

let virtualDom1 = createElement('ul',{class:'list'},[
  createElement('li',{class:'item'},['a']),
  createElement('li',{class:'item'},['b']),
  createElement('li',{class:'item'},['c'])
]);

let virtualDom2 = createElement('ul',{class:'listgroup'},[
  createElement('li',{class:'item'},['1']),
  createElement('li',{class:'item'},['b']),
  createElement('DIV',{class:'item'},['3'])
]);

let el = render(virtualDom1);
renderDom(el,window.root);
let patchs = diff(virtualDom1,virtualDom2);

// 给元素打补丁，重新更新视图.
patch(el,patchs);

console.log(patchs);

// 将虚拟dom 转换成了 真实dom 渲染到了页面上.
// let el = render(virtualDom);
// renderDom(el,window.root);
//
// console.log(el);
// console.log(virtualDom);

// DOM diff 比较两个虚拟dom的区别，比较两个对象的区别
// dom diff 作用根据两个虚拟对象创建出不同的补丁,描述改变的内容. 将这个补丁用来更新到dom
