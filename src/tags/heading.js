import hg from 'mercury';
import _ from 'lodash';
const h = hg.h;
const exports = _.range(6).reduce((p,i) => _.merge(p, {
    [`h${i}`]: function(content, classes = []) {
        return h(`h${i}${classes.map(i => `.${i}`).join('')}`, content);
    },
  }), {});
export default exports;