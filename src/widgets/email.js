import hg from 'mercury';
import srOnly from '../tags/srOnly';

const h = hg.h;
export default function(email, hasGPG) {
    return h('span.email', [
        h(`i.fa.fa-${hasGPG ? 'user-secret' : 'envelope-o'}`, [srOnly('Write me an email')]),
        h('a.email.ocr.hidden-sm-down', { href: `mailto:${email}` }, email),
    ]);
};