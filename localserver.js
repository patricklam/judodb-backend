function createManagedStore() {
  try {
    var localServer = google.gears.factory.create('beta.localserver');
  } catch (ex) {
    setError('Could not create local server: ' + ex.message);
    return;
  }
  var store = localServer.createStore(STORE_NAME);
    // disable local store for now.
  // store.capture(
  //   ['clients.html', 'editclient.html', 'editclient_utils.js', 
  //    'base.js', 'constants.js', 'cookie.js', 'datastore.js', 'gears_init.js',
  //    'localserver.js', 'md5.js', 'utils.js', 'xhr.js', 'styles.css' ], 
  //   function captureCallback(url, success, captureId) {});
}
