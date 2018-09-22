import {createElement,render,renderDom} from './element';
import diff from './diff'
let virtualDom1 = createElement('ul',{class:'list'},[
    createElement('li',{class:'item'},['a']),
    createElement('li',{class:'item'},['b']),
    createElement('li',{class:'item'},['c'])
]);

let virtualDom2 = createElement('ul',{class:'list'},[
    createElement('li',{class:'item'},['1']),
    createElement('li',{class:'item'},['b']),
    createElement('div',{class:'item'},['3'])
]);

let patchs = diff(virtualDom1,virtualDom2);
console.log(patchs);

// let el = render(virtualDom);
// console.log(el);
// renderDom(el,window.root)
// console.log(virtualDom);



