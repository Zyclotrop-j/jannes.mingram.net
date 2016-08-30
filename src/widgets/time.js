import hg from 'mercury';
const h = hg.h;
export default function(datetime, channels) {
    return h('time.time', {attributes: {
            'datetime': datetime.datetime
        }}, [
        h('span.label', datetime.label),
    ]);
};