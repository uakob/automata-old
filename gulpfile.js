// TODO доделать до нормального вида и нормально разбить на задачи
// основываться на том что бить их надо по принципу
// 'что отдельно может быть нужно прогонять, то и задача'

'use strict';

// var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
var fs = require('fs');
var gulp = require('gulp');
// var sequence = require('gulp-sequence');
var mocha = require('gulp-mocha');
var istanbul = require('gulp-istanbul');

// var gutil = require('gulp-util');
var util = require('util');

util.promisify(gulp.task);

// var sourcemap = require('gulp-sourcemaps');
var babel = require('gulp-babel');

// var lint = require('gulp-jshint');

const path = {
  scripts: ['./src/app.js', './src/echo.js'],
  test: 'test',
  source: 'src',
  build: 'app',
};

const codeReporters = {
  reporters: ['html', 'lcov', 'json', 'clover'],
  reportOpts: {
    html: {
      dir: './coverage/sources/html/',
    },
    lcov: {
      dir: './coverage/sources/lcov/',
    },
    json: {
      dir: './coverage/sources/json/',
    },
    clover: {
      dir: './coverage/sources/clover/',
    },
  },
};

const testReporters = {
  reporters: ['html', 'lcov', 'json', 'clover'],
  reportOpts: {
    html: {
      dir: './coverage/tests/html/',
    },
    lcov: {
      dir: './coverage/tests/lcov/',
    },
    json: {
      dir: './coverage/tests/json/',
    },
    clover: {
      dir: './coverage/tests/clover/',
    },
  },
};

const files = {
  server : 'server.js',
  app : 'app.js',
  bus : 'bus.js',
  conf : 'conf.js',
  db : 'db.js',
  echo : 'echo.js',
  log : 'log.js',
  machina : 'machina.js',
  client : 'client.js',
  // test : 'test.js',
  pool : 'pool.js',
  // io : 'io.js',
};

var server = 'server.js';
var app = 'app.js';
var bus = 'bus.js';
var conf = 'conf.js';
var db = 'db.js';
var echo = 'echo.js';
var log = 'log.js';
var machina = 'machina.js';
var client = 'client.js';
var test = 'test.js';
var pool = 'pool.js';
var io = 'io.js';

// gulp.task('files', gulp.parallel());

gulp.task('server', () => {
  return new Promise((resolve, reject) => {
    return gulp.src(`./${path.source}/${server}`)
    // .pipe(babel())
    .pipe(gulp.dest(path.build))
    .on('end', resolve)
    .on('error', reject);
  });
});

// gulp.task('test_server', gulp.series('server'));

gulp.task('pool', () => {
  return new Promise((resolve, reject) => {
    return gulp.src(`./${path.source}/${pool}`)
      // .pipe(babel())
      .pipe(gulp.dest(path.build))
      .on('end', resolve)
      .on('error', reject);
    });
});

gulp.task('db', () => {
  return new Promise((resolve, reject) => {
    return gulp.src(`./${path.source}/${db}`)
      .pipe(babel())
      .pipe(gulp.dest(path.build))
      .on('end', resolve)
      .on('error', reject);
    });
});

gulp.task('machina', () => {
  return new Promise((resolve, reject) => {
    return gulp.src(`./${path.source}/${machina}`)
      .pipe(babel())
      .pipe(gulp.dest(path.build))
      .on('end', resolve)
      .on('error', reject);
    });
});

gulp.task('client', () => {
  return new Promise((resolve, reject) => {
    return gulp.src(`./${path.source}/${client}`)
      .pipe(babel())
      .pipe(gulp.dest(path.build))
      .on('end', resolve)
      .on('error', reject);
    });
});

gulp.task('app', () => {
  return new Promise((resolve, reject) => {
    return gulp.src(`./${path.source}/${app}`)
      .pipe(babel())
      .pipe(gulp.dest(path.build))
      .on('end', resolve)
      .on('error', reject);
    });
});

gulp.task('bus', () => {
  return new Promise((resolve, reject) => {
    return gulp.src(`./${path.source}/${bus}`)
      .pipe(babel())
      .pipe(gulp.dest(path.build))
      .on('end', resolve)
      .on('error', reject);
    });
});

gulp.task('conf', () => {
  return new Promise((resolve, reject) => {
    return gulp.src(`./${path.source}/${conf}`)
      .pipe(gulp.dest(path.build))
      .on('end', resolve)
      .on('error', reject);
    });
});

gulp.task('log_dir', () => {
  return new Promise((resolve, reject) => {
    fs.mkdir('./app/log', '666', (error) => {
      if (!error) {
        resolve();
      } else {
        if (error.code == 'EEXIST') {
          resolve();
        } else {
          reject(error);
        }
      }
    })
  });
});

gulp.task('log_mod', () => {
  return new Promise((resolve, reject) => {
    return gulp.src(`./${path.source}/${log}`)
    .pipe(gulp.dest(path.build))
    .on('end', resolve)
    .on('error', reject);
  });
});

gulp.task('log', gulp.series('log_dir', 'log_mod', () => {
  return Promise.resolve();
}));

gulp.task('echo', () => {
  return new Promise((resolve, reject) => {
    return gulp.src(`./${path.source}/${echo}`)
    .pipe(gulp.dest(path.build))
    .on('end', resolve)
    .on('error', reject);
  });
});

gulp.task('io', () => {
  return new Promise((resolve, reject) => {
    return gulp.src(`./${path.source}/${io}`)
      .pipe(gulp.dest(path.build))
      .on('end', resolve)
      .on('error', reject);
    });
});

gulp.task('cover', () => {
  return new Promise((resolve, reject) => {
    return gulp.src(`./${path.build}/${app}`)
      .pipe(istanbul({ includeUntested: true }))
      .pipe(istanbul.hookRequire());
    });
});

gulp.task('report', () => {
  return new Promise((resolve, reject) => {
    return gulp.src(`./${path.build}/${app}`)
      .pipe(istanbul.writeReports(codeReporters));
    });
});

// gulp.task('report', ['cover'], () => {
gulp.task('tests', () => {
  return new Promise((resolve, reject) => {
    return gulp.src(`${path.test}/${app}`)
      .pipe(mocha({ reporter: 'tap' }))
      .pipe(istanbul.writeReports(testReporters));
      //.pipe(mocha({ reporter: 'nyan' }))
    });
});

gulp.task('run', () => {
  var node = spawn('node', [`./${path.build}/${app}`]);
  node.stdout.pipe(process.stdout);
  node.stderr.pipe(process.stderr);
});

gulp.task('checkFoldersBefore', () => {
  return new Promise((resolve, reject) => {
    fs.access(path.source, fs.constants.F_OK | fs.constants.R_OK, (error) => {
      if (!error) {
        resolve();
      } else {
        reject(error);
      }
    });
  });
});

gulp.task('checkFoldersAfter', () => {
  return new Promise((resolve, reject) => {
    fs.access(path.build, fs.constants.F_OK | fs.constants.R_OK, (error) => {
      if (!error) {
        resolve();
      } else {
        reject(error);
      }
    });
  });
})

gulp.task('checkSource', () => {
  return new Promise((resolve, reject) => {
    for (let file in files) {
      let fileName = `./${path.source}/${files[file]}`;
      fs.access(fileName, fs.constants.F_OK | fs.constants.R_OK, (error) => {
        if (error) {
          reject(error);
        }
      });
    }
    resolve();
  });
});

gulp.task('checkBuild', () => {
  return new Promise((resolve, reject) => {
    for (let file in files) {
      // console.log(`file is ${file}`);
      let fileName = `./${path.build}/${files[file]}`;
      fs.access(fileName, fs.constants.F_OK | fs.constants.R_OK, (error) => {
        if (error) {
          reject(error);
        }
      });
    }
    resolve();
  });
  // console.log('all is ok');
});

const env_vars = [
  'BROKER_HOST',
  'BROKER_PORT',
  'ECHO_HOST',
  'ECHO_PORT',
  'APP_PORT_SOCKET',
  'APP_PORT_HTTP',
  'REDIS_HOST',
  'REDIS_PORT',
  'REDIS_DB',
  'MONGODB_HOST',
  'MONGODB_PORT',
  'MONGODB_DB',
  'MONGODB_DSN',
  'LOGSTASH_HOST',
  'LOGSTASH_PORT',
  'LOGSTASH_PREFIX',
]

gulp.task('checkENV', () => {
  return new Promise((resolve, reject) => {
    if (!(process.env.ENV || process.env.ENVIRONMENT)) {
      reject('ENV variable is not set');
    }
    for (let env_var of env_vars) {
      if (!process.env[env_var]) {
          reject(`${env_var} variable is not set`);
      }

      if(process.env[env_var] == undefined) {
          reject(`${env_var} variable is undefined`);
      }
    }
    resolve();
  });
});

gulp.task('ok', () => {
  return new Promise((resolve, reject) => {
    console.log('ALL IS OK');
  });
});

gulp.task('check', gulp.series('checkENV', 'checkFoldersBefore', 'checkSource', 'ok', () => {
  return new Promise((resolve, reject) => {
    // console.log("HTTP Server Started");
    resolve();
  });
}));

gulp.task('app_folder', () => {
  return new Promise((resolve, reject) => {
    fs.mkdir('./app', '777', (error) => {
      if (!error) {
        resolve();
      } else {
        if (error.code == 'EEXIST') {
          resolve();
        } else {
          reject(error);
        }
      }
    });
  });
});

gulp.task('build', gulp.parallel(
            'machina',
            'conf',
            'bus',
            'server',
            'db',
            'log',
            'client',
            'app',
            'echo',
            'pool',
            'io',
          ));

gulp.task('coverage', gulp.series('cover', 'report', () => {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}));

gulp.task('test', gulp.series('tests', 'coverage', () => {
  return new Promise((resolve, reject) => {
    resolve();
  });
}));

gulp.task('default', gulp.series('checkFoldersBefore', 'checkSource', 'app_folder', 'build', 'checkBuild', 'checkFoldersAfter', 'checkENV'));
