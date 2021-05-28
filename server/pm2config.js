module.exports = {
    apps : [{
      name: 'usertoken',
      script: 'app.js',
      watch: true,
      env: {
        SSL : false,
        DEBUG : false
      }
    }]
  };
  