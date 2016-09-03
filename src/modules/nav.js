import hg from 'mercury';
const h = hg.h;

export default function(content) {
    return h('nav.navbar', {
        attributes: {
            role: 'navigation'
        }
    }, content);
};