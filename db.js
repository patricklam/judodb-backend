function bail() {
  setError('s.v.p. faire un reset');
}

// http://greenido.wordpress.com/2011/06/24/how-to-use-indexdb-code-and-example/

var clubDb = (function() {
    var idb_;           // Our local DB
    var idbRequest_;    // Our DB request obj

    // IndexedDB spec is still evolving - see: http://www.w3.org/TR/IndexedDB/
    // various browsers keep it
    // behind various flags and implementation varies.
    if ('webkitIndexedDB' in window) {
        window.indexedDB = window.webkitIndexedDB;
        window.IDBTransaction = window.webkitIDBTransaction;
    } else if ('mozIndexedDB' in window) {
        window.indexedDB = window.mozIndexedDB;
    }
 
    // Open our IndexedDB if the browser supports it.
    if (window.indexedDB) {
        idbRequest_ = window.indexedDB.open("clubdb", "Base des donnees judo");
        idbRequest_.onerror = idbError_;
        idbRequest_.addEventListener('success', function(e) { }, false);
    }
    
    // on errors - show us what is going wrong
    function idbError_(e) {
        addStatus('Error: ' +
		  e.message + ' (' + e.code + ')', 'error');
    }

    function idbCreate_() {
        if (!idb_) {
            if (idbRequest_) {
                // If indexedDB is still opening, just queue this up.
                idbRequest_.addEventListener('success', idb_.removeObjectStore, false); 
            }
            return;
        }
	
        var request = idb_.setVersion(DB_VERSION);
        request.onerror = idbError_;
        request.onsuccess = function(e) {
            var createStore = function(n) {
		if (!idb_.objectStoreNames.contains(n)) {
                    try {
			var objectStore = idb_.createObjectStore(n, 
								 {keyPath: 'id'}); 
                    } catch (err) {
			addStatus('Error: ' + err.toString(), 'error');
                    }
		} 
	    };

	    createStore('client');
	    createStore('groupe_paiement');
	    createStore('paiement');
	    createStore('global_config'); // singleton object
        }
    }
}
