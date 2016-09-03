import hg from 'mercury';
import _ from 'lodash';
const h = hg.h;
export default function(content) {
    return h('ul.nav.navbar-nav', {attributes: {
           
        }}, [
        ..._.toArray(content),
    ]);
};