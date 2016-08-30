import hg from 'mercury';;
import time from './time';
import location from './location';
import srOnly from '../tags/srOnly';

const h = hg.h;
export default function(cvitem, channels) {
    return h('article.cvitem', [
        h('h3.name', cvitem.name),
        h('i.description', cvitem.description),
        !!cvitem.url ? h('a.description', {href: cvitem.url}, [h('i.fa.fa-external-link', [srOnly('More information available in external link')])]) : '',
        h('div.from.to', [
            time({
                label: cvitem.startLabel,
                datetime: cvitem.startDate,
            }, channels),
            (cvitem.endLabel !== '' && h('span', ' - ')) || '',
            time({
                label: cvitem.endLabel,
                datetime: cvitem.endDate,
            }, channels),
        ]),
        location(cvitem.location, channels),
    ]);
};