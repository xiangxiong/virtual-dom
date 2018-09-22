import {createElement,render,renderDom} from './element';

let virtualDom = createElement('ul',{class:'list'},[
    createElement('li',{class:'item'},['a']),
    createElement('li',{class:'item'},['b']),
    createElement('li',{class:'item'},['c'])
]);


let el = render(virtualDom);

console.log(el);

renderDom(el,window.root)

console.log(virtualDom);