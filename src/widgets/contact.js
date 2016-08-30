import hg from 'mercury';
import email from './email';
import phone from './phone';
const h = hg.h;

export default function(vcard, channels) {
    console.log(vcard);
    if (vcard && vcard.data) {
        return h('address', [
            h('h3', vcard.data.fn._data),
            h('dl.email', vcard.data.email.reduce(
                (p,i) => p.concat([
                    h('dt', email(i._data, i.type.some(q => q === 'gpg'))),
                    ...i.type.map(j =>  h(`dd.${j}`, j))
                ]),
            [] )),
            h('dl.tel', vcard.data.tel.reduce(
                (p,i) => p.concat([
                    h('dt', phone(i._data.split(':')[1], i.type.some(q => q === 'cell'))),
                    ...i.type.map(j =>  h(`dd.${j}`, j))
                ]),
            [] )),
        ]);
    } 
    return h('span.loading', 'Loading');
};