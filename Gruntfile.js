/**
 * Grunt automation.
 */
module.exports = function(grunt) {

  grunt.initConfig({

    PATHS: {
      amdInstructions: './dependencies/amd_instructions.js',
      socketioClient: './dependencies/socket.io.min.js',
      sailsio: './sails.io.js',
      dist: './dist/sails.io.js',
      distMin: './dist/sails.io.min.js',
      sourceMap: './dist/sails.io.min.js.map'
    },

    concat: {
      options: {
        separator: ';\n\n',
      },
      dev: {
        src: ['<%= PATHS.amdInstructions %>', '<%= PATHS.socketioClient %>', '<%= PATHS.sailsio %>'],
        dest: '<%= PATHS.dist %>'
      }
    },
    uglify: {
      dev: {
        options: {
          sourceMap: true,
          sourceMapName: '<%= PATHS.sourceMap %>'
        },
        files: {
          '<%= PATHS.distMin %>': ['<%= PATHS.dist %>']
        }
      }
    },
    watch: {
      files: ['<%= PATHS.sailsio %>'],
      tasks: ['concat', 'uglify']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['dev']);

  // Dev enviroment for copying over changes from src to example project.
  grunt.registerTask('dev', ['concat', 'uglify', 'watch']);


};
