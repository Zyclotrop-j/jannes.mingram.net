import hg from 'mercury';;
import time from './time';
import grid from '../tags/grid';
import location from './location';
import srOnly from '../tags/srOnly';

const h = hg.h;
export default function(cvitem, channels) {
    return h('article.cvitem', 
        grid.row([grid.col([
            grid.row([
                grid.col(h('h4.name', cvitem.name)),
                grid.col(h('i.description', cvitem.description)),
                !!cvitem.url ? grid.col(h('a.description', {href: cvitem.url}, [h('i.fa.fa-external-link', [srOnly('More information available in external link')])])) : '',
                grid.col(location(cvitem.location, channels)),
            ])
        ], {xs: 12, md: 6}, {}, [{md: 3}, {}]), grid.col([
            grid.row(grid.col(h('div.from.to', [
                    time({
                        label: cvitem.startLabel,
                        datetime: cvitem.startDate,
                    }, channels),
                    (cvitem.endLabel !== '' && h('span', ' - ')) || '',
                    time({
                        label: cvitem.endLabel,
                        datetime: cvitem.endDate,
                    }, channels),
                ]))),
        ], {xs : 12, md: 3}, {}, [{}, {md: 6}])]),
    
    );
};