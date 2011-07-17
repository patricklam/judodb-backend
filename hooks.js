var Hooks = (function() {
    var OpenDBHook_ = new Array();
    var AfterDBHook_ = new Array();
    var HaveConfig_ = new Array();

    var addOpenDB_ = function(f) { OpenDBHook_.unshift(f); };
    var addAfterDB_ = function(f) { AfterDBHook_.unshift(f); };
    var addHaveConfig_ = function(f) { HaveConfig_.unshift(f); };

    addOpenDB_(function(e) {
        for (var i = 0; i < AfterDBHook_.length; i++) {
            AfterDBHook_[i](e);
        }
    });

    return {
        addOpenDB: addOpenDB_,
        addAfterDB: addAfterDB_,
        addHaveConfig: addHaveConfig_,
        OpenDBs: OpenDBHook_,
        AfterDBs: AfterDBHook_,
        HaveConfig: HaveConfig_
    };
})();
