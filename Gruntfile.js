module.exports = function(grunt){
  require('load-grunt-tasks')(grunt);
  grunt.initConfig({
    uglify: {
      options: {
        mangle: {
          except: ['angular']
        },
        preserveComments: 'some'
      },
      dist: {
        files: {
          'tnotify.min.js': 'tnotify.js'
        }
      }
    },
    cssmin: {
      options: {
        advanced: false,
        keepSpecialComments: 1
      },
      dist: {
        files: {
          'tnotify.min.css': 'tnotify.css'
        }
      }
    }
  });
  grunt.registerTask('default', ['uglify', 'cssmin']);
}