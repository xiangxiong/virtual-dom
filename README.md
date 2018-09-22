## 1、virtual dom
定义: vitual dom, 也就是虚拟节点. 它通过JS的Object对象模拟的Dom节点,然后再通过特定的render方法将其渲染成真实的Dom节点.

## 1.1 实现的思路
- 1.用Javascript 对象结构表示DOM树的结构; 然后用这个树构建一个真正的DOM树,插入到文档当中.
- 2.当状态变更的时候，重新构造一颗新的对象树。然后用新的树和旧的树进行比较，记录两颗树的差异.
- 3.把2所记录的差异应用到步骤1所构建的真正的DOM树上,视图就更新了.

## 1.2 实现的过程

- 1.用Javascript 对象结构表示DOM树的结构; 然后用这个树构建一个真正的DOM树,插入到文档当中.

``` element.js

class Element{
    constructor(type,props,children){
        this.type = type;
        this.props = props;
        this.children = children;
    }
}

function createElement(type,props,children){
    return new Element(type,props,children);
}

function setAttr(node,key,value){
    switch(key){
        case 'value':
            if(node.tagName.toUpperCase() === 'INPUT'||
            node.tagName.toUpperCase() === 'TEXTAREA'){
                node.value = value;
            }else{
                node.setAttribute(key,value);
            }
        break;
        case 'style':
            node.style.cssText = value;
        break;
        default:
            node.setAttribute(key,value);
            break;
    }
}

// render 方法可以将vnode转换成真实dom.
function render(eleObj){
    let el = document.createElement(eleObj.type);
    for(let key in eleObj.props){
        // 设置属性的方法
        setAttr(el,key,eleObj.props[key]);
    }
    eleObj.children.forEach(child=>{
        child = (child instanceof Element)?
        render(child):document.createTextNode(child);
        el.appendChild(child);
    });
    return el;
}

function renderDom(el,target){
    target.appendChild(el);
}

export {createElement,render,renderDom};
```