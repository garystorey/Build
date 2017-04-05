module.exports = function () {

    var config = {
        input: {
            js: {
                core: './js/core/*.js',
                mp: './js/masterpage/*.js',
                tiles: ['./js/core/prototypes.js', './js/core/base.js', './js/core/tile.js', './js/masterpage/tiles.js'],
                plugins: './js/plugins/*.js'
            },
            css: {
                desktop: {
                    filename: './scss/style.scss',
                    monitor: ['./scss/shared/**.scss', './scss/desktop/**.scss']
                },

                tiles: {
                    filename: './scss/tiles.scss',
                    monitor: ['./scss/shared/**.scss']
                }
            }
        },
        output: {
            js: {
                core: {
                    destination: './dest/js',
                    filename: 'ept.core.js'
                },
                mp: {
                    destination: './dest/js',
                    filename: 'ept.masterpage.js'
                },
                build: {
                    destination: './',
                    filename: 'gulpfile.js'
                },
                tiles: {
                    destination: './dest/js',
                    filename: 'ept.tiles.js'
                }
            },
            css: {
                desktop: {
                    destination: './dest/css',
                    filename: 'style.css'
                },
                tiles: {
                    destination: './dest/css',
                    filename: 'tiles.css'
                }
            }
        }
    };
    return config;
}
