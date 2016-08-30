import hg from 'mercury';
import srOnly from '../tags/srOnly';

const h = hg.h;
export default function(location, channels) {
    return h('div.location', {attributes: {
            'data-coord': location.coord
        }}, [
        h('i.fa.fa-map-marker', {attributes: {
            'data-coord': location.coord, //ToDo: Link to gmaps
        }}, [srOnly('Find on google maps')]),
        h(`${location.url ? 'a' : 'span'}.name`, {
            href: `//${location.url}`
        }, location.name),
    ]);
};