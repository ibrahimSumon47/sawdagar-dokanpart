import nextTypescript from 'eslint-config-next/typescript';

export default [...nextTypescript, { ignores: ['generated/**', 'native/**', 'python/**', 'java/**'] }];
