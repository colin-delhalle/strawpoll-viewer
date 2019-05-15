const Path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: {
        background: './src/background.ts',
        'display/iziToast/display': './src/display/iziToast/display.ts'
    },
    output: {
        path: Path.resolve(__dirname, 'extension'),
        filename: '[name].js'
    },

    // Enable sourcemaps for debugging webpack's output.
    devtool: 'source-map',

    resolve: {
        // Add '.ts' as resolvable extensions.
        extensions: ['.ts', '.js', '.json']
    },

    module: {
        rules: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
            { test: /\.tsx?$/, loader: 'awesome-typescript-loader' },

            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            { enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' }
        ]
    },

    plugins: [
        new CopyPlugin([{ from: './node_modules/izitoast/dist/css/iziToast.min.css', to: './display/iziToast' }])
    ]
};
