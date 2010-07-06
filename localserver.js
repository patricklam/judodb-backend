function createManagedStore() {
  try {
    var localServer = google.gears.factory.create('beta.localserver');
  } catch (ex) {
    setError('Could not create local server: ' + ex.message);
    return;
  }
  //var mstore = localServer.createManagedStore('anjoudb');
  //mstore.manifestUrl = 'manifest.json';
  //mstore.checkForUpdate();
}
