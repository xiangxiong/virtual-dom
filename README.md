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

- 2.当状态变更的时候，重新构造一颗新的对象树。然后用新的树和旧的树进行比较，记录两颗树的差异.

``` diff.js
// DOM DIFF  比较两个虚拟DOM区别 比较两个对象的区别.
// dom diff 作用: 根据两个虚拟对象创建出补丁,描述改变的内容.将这个补丁用来更新dom.
// dom diff 优化策略.同级比较，不会跨级比较.
// 差异计算: 先序深度优先遍历.
/****
 *  
 *  规则: 
 *  当节点类型相同时,去看一下属性是否相同. 产生一个属性的补丁包{type:'ATTRS',attrs:{class:'list-group'}}
 *  新的dom节点不存在{type:'REMOVE',index:xxx}
 *  节点类型不相同 直接采用替换模式 {type:'REPALCE',newNode:newNode}
 *  文本的变化. {type:"TEXT",text:1}
 */
 function diff(oldTree,newTree){
    let patches = {};
    let index = 0;
    // 递归树 比较后的结果放到补丁包中.
    walk(oldTree,newTree,index,patches);
    return patches;
}

function diffAttr(oldAttrs,newAttrs){
    let patch = {};

    // 判断老的属性和新的属性的关系.
    for(let key in oldAttrs){
        if(oldAttrs[key] !== newAttrs[key]){
            // 有可能是undefined
            patch[key] = newAttrs[key];
        }
    }

    for(let key in newAttrs){
        // 老节点没有新节点的属性.
        if(!oldAttrs.hasOwnProperty(key)){
            patch[key] = newAttrs[key];
        }
    }
    return patch;
}

const ATTRS = 'ATTRS';
const TEXT = 'TEXT';
let Index = 0;
let REMOVE = 'REMOVE';
const REPALCE = 'REPALCE';

function diffChildren(oldChildren,newChildren,index,patches){
    // 比较老的第一个和新的第一个.
    oldChildren.forEach((child,idx)=>{
        // 索引
        // index 每次传递给walk是，index是递增的.
        walk(child,newChildren[idx],++Index,patches)
    });
}

function isString(node){
    return Object.prototype.toString.call(node) === '[object String]';
}

function walk(oldNode,newNode,index,patches){
    let currentPatch = []; // 每个元素都有一个补丁对象.
    if(!newNode){
        currentPatch.push({type:REMOVE,index})
    }
    else if(isString(oldNode)&&isString(newNode)){
        if(oldNode!==newNode){
            currentPatch.push({type:TEXT,text:newNode})
        }
    }
    else if(oldNode.type === newNode.type){
        // 比较属性是否有更改.
       let attrs = diffAttr(oldNode.props,newNode.props);
       if(Object.keys(attrs).length>0){
            currentPatch.push({type:ATTRS,attrs});
       }
        //  如果有儿子，遍历儿子.
        diffChildren(oldNode.children,newNode.children,index,patches);
    }
    else{
        // 说明节点被替换了.
        currentPatch.push({type:REPALCE,newNode});
    }

    if(currentPatch.length>0){
        // 当前元素确实有补丁. 
        // 将元素和补丁对应起来， 放到大的补丁包中.
        patches[index] = currentPatch;
        console.log(patches);
    }
}

export default diff;



``` 