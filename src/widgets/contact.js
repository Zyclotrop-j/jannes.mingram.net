import hg from 'mercury';
import grid from '../tags/grid';
import heading from '../tags/heading';
import popover from '../widgets/popover';
import email from './email';
import phone from './phone';
const h = hg.h;

export default function(vcard, state) {
    if (vcard && vcard.data) {
        const typeTranslator = type => {
            const isEmail = type.indexOf('internet')  > -1;
            const isPhone = type.indexOf('cell')  > -1 || type.indexOf('voice')  > -1;
            if (type.indexOf('home') > -1) {
                return `Private ${isEmail ? 'email' : ''}${isPhone ? 'phone' : ''}`;
            } else if (type.indexOf('work') > -1) {
                return `Business ${isEmail ? 'email' : ''}${isPhone ? 'phone' : ''}`;
            } else if (type.indexOf('gpg') > -1) {
                return `Private email; supports PGP`;
            }
            return type.join(' ');
        };
        const windowIsTooSmall = state.windowSize === "sm" || state.windowSize === "xs";
        return h('address', [
            grid.row([
                grid.col(
                    heading.h2('Full Name', ['visible-print-block'])
                ),
                grid.col(
                   heading.h3(vcard.data.fn._data, ['statement', 'signature', 'u-accent']),
                ),
            ]),
            h('ul.email.row',[
                ...vcard.data.email.reduce(
                    (p,i) => p.concat([
                        popover(h('div', email(i._data, i.type.some(q => q === 'gpg'))), windowIsTooSmall ? `${typeTranslator(i.type)}: ${i._data}` : typeTranslator(i.type), 'bottom', `li.col-xs.col-md-${12 / vcard.data.email.length}`)
                    ]),
                [] ),
                ...vcard.data.tel.reduce(
                    (p,i) => p.concat([
                        popover(h('div', phone(i._data.split(':')[1], i.type.some(q => q === 'cell'))), windowIsTooSmall ? `${typeTranslator(i.type)}: ${i._data.substring(4)}` : typeTranslator(i.type), 'bottom', `li.col-xs.col-md-${12 / vcard.data.email.length}`)
                    ]),
                [] ),
            ])
        ]);
    } 
    return h('span.loading', 'Loading');
};