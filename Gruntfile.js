module.exports = function(grunt) {
  var baseName = 'videojs.hotkeys';
  var pkg = grunt.file.readJSON('package.json');
  var version = pkg.version;

  // Project configuration.
  grunt.initConfig({
    baseName: baseName,
    pkg: pkg,
    clean: {
      build: ['build/*'],
      dist: ['dist/*']
    },
    uglify: {
      dist: {
        options: {
          banner: '/* <%= pkg.name %> v<%= pkg.version %> - <%= pkg.homepage %> */',
          mangle: true,
          compress: true,
          sourceMap: true,
          sourceMapName: 'build/<%= baseName %>.min.js.map'
        },
        files: {
          'build/<%= baseName %>.min.js': ['build/<%= baseName %>.js']
        }
      },
      minify: {
        options: {
          banner: '/* <%= pkg.name %> v<%= pkg.version %> - <%= pkg.homepage %> */\n',
          mangle: true,
          compress: true
        },
        files: {
          '<%= baseName %>.min.js': ['<%= baseName %>.js']
        }
      }
    },
    copy: {
      dist: {
        expand: true,
        files: [{
          expand: true,
          cwd: 'build/',
          src: '**',
          dest: 'dist/<%= pkg.name %>/',
          flatten: true,
          filter: 'isFile'
        }]
      },
      build: {
        src: '<%= baseName %>.js',
        dest: 'build/'
      }
    },
    zip: {
      dist: {
        router: function(filepath) {
          var path = require('path');
          return path.relative('dist', filepath);
        },
        compression: 'DEFLATE',
        src: ['dist/<%= pkg.name %>/*'],
        dest: 'dist/<%= pkg.name %>-<%= pkg.version %>.zip'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-zip');

  // Default task.
  grunt.registerTask('default', ['clean', 'buildver', 'copy:build', 'uglify:dist', 'dist', 'uglify:minify', 'cdn-link']);

  grunt.registerTask('buildver', 'Update version', function() {
    var m = grunt.file.read(baseName + '.js');
    var version = pkg.version;

    m = m.replace(/(version: ")\d\.\d(\.\d)?(")/g, '$1' + version + '$3');
    grunt.file.write(baseName + '.js', m);
  });

  grunt.registerTask('dist', 'Creates distribution files', ['copy:dist', 'zip:dist']);

  grunt.registerTask('cdn-link', 'Updates the CDN link in the Readme', function() {
    var rm = grunt.file.read('README.md');
    var version = pkg.version;

    version = version.replace(/(\d\.\d)\.\d/, '$1');

    rm = rm.replace(/(\/\/cdn\.sc\.gl\/videojs-hotkeys\/)\d\.\d(\.\d)?/g, '$1' + version);
    grunt.file.write('README.md', rm);
  });
};
