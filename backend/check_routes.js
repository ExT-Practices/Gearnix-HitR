const app = require('./server/app.js');
console.log(app._router.stack.map(layer => {
    if (layer.route) {
        return layer.route.path;
    } else if (layer.name === 'router') {
        return layer.regexp;
    }
    return layer.name;
}));
