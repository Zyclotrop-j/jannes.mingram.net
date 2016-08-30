import hg from 'mercury';
const h = hg.h;
export default function(text) {
    return h('span.sr-only', text);
};