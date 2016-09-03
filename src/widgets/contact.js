import hg from 'mercury';
import grid from '../tags/grid';
import heading from '../tags/heading';
import popover from '../widgets/popover';
import email from './email';
import phone from './phone';
const h = hg.h;

export default function(vcard, channels) {
    if (vcard && vcard.data) {
        return h('address', [
            grid.row([
                grid.col(
                   heading.h1(vcard.data.fn._data),
                ),
            ]),
            heading.h2('CV', ['visible-print-block']),
            h('ul.email.row', vcard.data.email.reduce(
                (p,i) => p.concat([
                    popover(h('div', email(i._data, i.type.some(q => q === 'gpg'))), i.type.join(' '), 'bottom', `li.col-xs-12.col-md-${12 / vcard.data.email.length}`)
                ]),
            [] )),
            h('ul.email.row', vcard.data.tel.reduce(
                (p,i) => p.concat([
                    popover(h('div', phone(i._data.split(':')[1], i.type.some(q => q === 'cell'))), i.type.join(' '), 'bottom', `li.col-xs-12.col-md-${12 / vcard.data.email.length}`)
                ]),
            [] )),
        ]);
    } 
    return h('span.loading', 'Loading');
};