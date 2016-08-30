import hg from 'mercury';
import srOnly from '../tags/srOnly';

const h = hg.h;
export default function(phone, hasMobile) {
    return h('span.phone', [
        h(`i.fa.fa-${hasMobile ? 'mobile' : 'phone'}`, [srOnly('Call me')]),
        h('a.phone', { href: `tel:${phone}` }, phone),
    ]);
};