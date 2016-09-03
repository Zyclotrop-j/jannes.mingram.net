import hg from 'mercury';
import _ from 'lodash';

const h = hg.h;
const create = hg.create;


export default function(content, popover, position = "right", type = "div") {
    return h(`${type}`, h(`div.hint--${position}`, {
        attributes: {
            'aria-label': popover
        }
    }, content));
};