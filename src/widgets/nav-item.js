import hg from 'mercury';
import _ from 'lodash';
const h = hg.h;
export default function(content, active) {
    return h(active ? 'li.nav-item.active' : 'li.nav-item', {attributes: {
          
        }}, [
        ..._.toArray(content),,
    ]);
};