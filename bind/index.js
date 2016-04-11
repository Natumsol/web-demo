function bind(func, context) {
    return function(){
        func.apply(context, Array.prototype.slice.call(arguments, 1));
    }
}

var context = {
    name: 'liujia'
}

var name = 'global';

var test = function() {
    console.log(this.name);
}

test();
bind(test, context)();