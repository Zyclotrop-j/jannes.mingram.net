import hg from 'mercury';
import lodash from 'lodash';
const h = hg.h;

export default function(content, cover) {
    return h('div.cover-wrapper', {
        attributes: {
            role: 'main'
        }
    }, [
        h('div.cover', cover),
       ..._.toArray(content),
    ]);
};