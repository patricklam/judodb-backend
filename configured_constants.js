var CONSTANTS = (function() {
    var CURRENT_SESSION; 
    var CURRENT_SESSION_YEAR;
    var CURRENT_SESSION_SEQNO;
    var CURRENT_SESSION_FIRST_SIGNUP;
    var NEXT_SESSION;
});

var Cfg = (function() {
    var config_;

    Hooks.addOpenDB(initConfig_);

    function gotConfig_() {
        for (var i = 0; i < Hooks.HaveConfig.length; i++) {
            Hooks.HaveConfig[i]();
        }
    }

    function initConfig_(e) {
        var db = e.target.result;
        var trans = db.transaction(["global_config"]);
        var store = trans.objectStore("global_config");
        
        var keyRange = IDBKeyRange.lowerBound(0);
        var cursorRequest = store.openCursor(keyRange);
        
        cursorRequest.onsuccess = function(e) {
            var result = e.target.result;
            if(!!result == false) {
                config_ = new objs.GlobalConfig();
                gotConfig_();
                return;
            }
            
            config_ = result;
            gotConfig_();
            selectSession(new Date());
            // no continue, we're expecting one element only.
        };
        
        cursorRequest.onerror = function(e) {
            setError('Aucun session en cours! Veuillez modifier la configuration.');
            return;
        }
    }

    function selectSessionByDate_(selected_date) {
        var found = false;
        for (var i = 0; i < config.sessions.length; i++) {
            if (config.sessions[i].first_signup_date <= date &&
                date <= config.sessions[i].last_signup_date)
            {
                selectSessionByIndex(i);
                found = true;
            }
        }
        
        if (!found)
            setError('Aucun session en cours! Veuillez modifier la configuration.');
    }
    
    function selectSessionByIndex_(session_index) {
        CONSTANTS.CURRENT_SESSION = i; CONSTANTS.NEXT_SESSION = -1;
        
        for (var j = 0; j < config.sessions.length; j++) {
            if (config.sessions[j].seqno == 
                config.sessions[session_index].seqno + 1)
                CONSTANTS.NEXT_SESSION = j;
        }
    }

    return {
        cfg: config_,
        initConfig: initConfig_
    };
})();



