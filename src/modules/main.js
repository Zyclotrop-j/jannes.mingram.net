import hg from 'mercury';
const h = hg.h;

export default function(content) {
    return h('main.container', {
        attributes: {
            role: 'main'
        }
    }, content);
};