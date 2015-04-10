'use strict';
var _ = require('lodash'),
  chalk = require('chalk'),
  upath = require('upath'),
  yeoman = require('yeoman-generator'),
  yosay = require('yosay');

module.exports = yeoman.generators.Base.extend({
  initializing: function () {
    this.pkg = require('../package.json');
  },
  
  _normalizePath: function(path) {
    var normal = upath.normalize(path),
      replace = normal.replace(/"/g, ''),
      escape = _.escape(replace),
      trim = _.trim(escape);
    
    return upath.resolve(trim);
  },
  
  pathToLinux: function(path) {
    var normal = this._normalizePath(path),
      drive = normal.match(/^[a-z]:/i);
    
    if (typeof drive !== null) {
      return '/' + drive[0].charAt(0) + normal.substr(2); 
    }
    else {
      return normal;
    }
  },

  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'This will help you set up your ' + chalk.red('emad') + ' config files.'
    ));

    var prompts = [
      {
        name: 'source',
        message: 'source directory',
        default: '.',
      },
      {
        name: 'target',
        message: 'target directory',
        default: '',
      },
      {
        name: 'env',
        message: 'environment name',
        default: 'CHANGEME',
      }
    ];

    this.prompt(prompts, function (props) {
      this.props = props;
      // To access props later use this.props.someOption;

      done();
    }.bind(this));
  },

  writing: {
    projectfiles: function () {
      this.fs.copyTpl(
        this.templatePath('_emad-config.json'),
        this.destinationPath(upath.join('emad-local', 'emad-config.json')),
        {
          "source": this.pathToLinux(this.props.source),
          "target": this.pathToLinux(this.props.target),
          "env": _.kebabCase(this.props.env)
        }
      );
      this.fs.copy(
        this.templatePath('_emad-project.json'),
        this.destinationPath('emad-project.json')
      );
    }
  }
});
