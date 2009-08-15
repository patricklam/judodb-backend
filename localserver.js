function createManagedStore() {
  try {
    var localServer = google.gears.factory.create('beta.localserver');
  } catch (ex) {
    setError('Could not create local server: ' + ex.message);
    return;
  }
  var store = localServer.createManagedStore(STORE_NAME);
  store.manifestUrl = 'manifest.json';
  store.checkForUpdate();
}
