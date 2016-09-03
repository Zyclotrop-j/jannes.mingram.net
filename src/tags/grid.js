import hg from 'mercury';
const h = hg.h;
export default {
  row: function(content, horizontal = {}, vertical = {}) {
    return h(`div.row${
                Object.entries(horizontal).map(i => `.flex-items-${i[0]}-${i[1]}`).join('')
            }${
                Object.entries(vertical).map(i => `.flex-${i[0]}-${i[1]}`).join('')
            }`, content);
  },
  col: function(content, sizes = { xs: 12 }, offset = {}, pushandpull = [{},{}]) {
    return h(`div${[
        ...Object.entries(sizes).map(i => `.col-${i[0]}${i[1] && `-${i[1]}`}`),
        ...Object.entries(offset).map(i => `.offset-${i[0]}-${i[1]}`).join(''),
        ...Object.entries(pushandpull[0] || {}).map(i => `.push-${i[0]}-${i[1]}`),
        ...Object.entries(pushandpull[1] || {}).map(i => `.pull-${i[0]}-${i[1]}`),
    ].join('')}`, content); 
  },
};