import commonjs from '@rollup/plugin-commonjs';
import noderesolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';

const iife = {
    input: 'src/index.js',
    output: {
        format: 'iife',
        file: `dist/main-${process.env.npm_package_version}.iife.min.js`,
        name: 'bertin'
    },
    plugins: [
        commonjs(),
        noderesolve(),
        babel({ babelHelpers: 'bundled' }),
        terser()
    ]
};

const esm = {
    input: 'src/index.js',
    output: {
        format: 'es',
        file: `dist/main-${process.env.npm_package_version}.esm.min.js`
    },
    plugins: [
        commonjs(),
        noderesolve(),
        babel({ babelHelpers: 'bundled' }),
        terser()
    ]
};

const conf = process.env.BABEL_ENV === 'esm' ? esm : iife;
export default conf;

// // import de nos plugins
// import commonjs from '@rollup/plugin-commonjs';
// import noderesolve from '@rollup/plugin-node-resolve';
// import babel from '@rollup/plugin-babel';
// import { terser } from 'rollup-plugin-terser';
//
// export default {
//     input: 'src/index.js', // notre fichier source au format ESM
//     output: {
//         format: 'iife',
//         file: 'dist/bertin.min.js',
//         // les modules iife doivent être nommés afin de pouvoir y faire référence depuis d'autres modules
//         name: 'bertin'
//     },
//     plugins: [
//         commonjs(), // prise en charge de require
//         noderesolve(), // prise en charge des modules depuis node_modules
//         babel({ babelHelpers: 'bundled' }), // transpilation
//         terser() // minification
//     ]
// };
