import { transform as _transform } from 'buble';

export const _poly = { assign: Object.assign };

const opts = {
  objectAssign: '_poly.assign',
  transforms: {
    dangerousForOf: true,
    dangerousTaggedTemplateString: true,
  },
};

export const transform = (code: string) => _transform(code, opts).code;
