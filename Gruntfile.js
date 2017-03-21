/**
 * Grunt automation.
 *
 * This is used by the NPM prepublish script in order to update `dist/`,
 * which is then published as a separate package (sails.io.js-dist) by the
 * postpublish script.
 *
 * (See `package.json`.)
 *
 *
 * > To test this process without actually publishing anything, use `npm run prepublish`.
 */
module.exports = function(grunt) {

  var packageJson  = require('./package.json');
  var sioClientPackageJson = require('./node_modules/socket.io-client/package.json');

  grunt.initConfig({

    PATHS: {
      eslintEnable: './dependencies/eslint-enable.txt',
      eslintDisable: './dependencies/eslint-disable.txt',
      amdInstructions: './dependencies/amd_instructions.js',
      socketioClient: './dependencies/socket.io.min.js',
      header: './.tmp/header.txt',
      socketioClientVersion: './dependencies/socket.io-client.version-info.txt',
      sailsio: './sails.io.js',
      dist: './dist/sails.io.js',
      distPackageJson: './dist/package.json',
    },

    replace: {
      main: {
        src: '<%= PATHS.sailsio %>',
        dest: '<%= PATHS.sailsio %>',
        replacements: [{
          from: /(var\s+SDK_INFO\s+=\s+{\s*?version:\s+['"])\d+\.\d+\.\d+(['"])/m,
          to: '$1' + packageJson.version + '$2'
        }]
      },
      sioClient: {
        src: '<%= PATHS.socketioClientVersion %>',
        dest: '<%= PATHS.socketioClientVersion %>',
        replacements: [{
          from: /version .*/,
          to: 'version ' + sioClientPackageJson.version
        }]
      },
      distPackageJson: {
        src: '<%= PATHS.distPackageJson %>',
        dest: '<%= PATHS.distPackageJson %>',
        replacements: [{
          from: /"version":\s+"\d+\.\d+\.\d+"/m,
          to: '"version": "' + packageJson.version + '"'
        }]
      },
      dist: {
        src: '<%= PATHS.dist %>',
        dest: '<%= PATHS.dist %>',
        // Add sails.io.js version string in the fireworks
        // at the top of the sails.io.js distributable:
        replacements: [{
          from: /(\/\*\*\s*\n\s*\*\s*sails\.io\.js)/m,
          to: '$1\n \* v' + packageJson.version
        }]
      }
    },

    concat: {
      header: {
        src: [
          '<%= PATHS.eslintDisable %>',
          '<%= PATHS.amdInstructions %>',
          '<%= PATHS.socketioClientVersion %>',
          '<%= PATHS.socketioClient %>',
        ],
        dest: '<%= PATHS.header %>'
      },
      main: {
        options: {
          separator: ';\n\n',
        },
        src: [
          '<%= PATHS.header %>',
          '<%= PATHS.sailsio %>',
          '<%= PATHS.eslintEnable %>',
        ],
        dest: '<%= PATHS.dist %>'
      }
    },

    clean: {
      main: ['<%= PATHS.header %>', '<%= PATHS.socketioClient %>']
    },

    uglify: {
      main: {
        src: ['./node_modules/socket.io-client/dist/socket.io.js'],
        dest: '<%= PATHS.socketioClient %>'
      }
    },

    watch: {
      files: ['<%= PATHS.sailsio %>', './package.json'],
      tasks: ['publish']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-text-replace');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.registerTask('default', ['publish']);

  // Publish task for copying version numbers and creating dist/sails.io.js
  grunt.registerTask('publish', [
    'replace:main',
    'replace:sioClient',
    'uglify',
    'concat:header',
    'concat:main',
    'replace:distPackageJson',
    'replace:dist',
    'clean'
  ]);

  // Dev task for watching files during development
  grunt.registerTask('dev', ['publish', 'watch']);

};
