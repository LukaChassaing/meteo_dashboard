module.exports = {
    apps: [{
      name: 'meteo-dashboard',
      script: 'npm',
      args: 'start -- --host 0.0.0.0',
      cwd: '/root/meteo-dashboard',
      watch: false
    }]
  }