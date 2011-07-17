function bail() {
  setError('s.v.p. faire un reset');
}

// http://greenido.wordpress.com/2011/06/24/how-to-use-indexdb-code-and-example/

var DB = (function() {
    var db_ = null;           // Our local DB
    var idbRequest_;    // Our DB request obj

    // IndexedDB spec is still evolving - see: http://www.w3.org/TR/IndexedDB/
    // various browsers keep it
    // behind various flags and implementation varies.
    if ('webkitIndexedDB' in window) {
        db_ = window.webkitIndexedDB;
        window.IDBTransaction = window.webkitIDBTransaction;
        window.IDBKeyRange = window.webkitIDBKeyRange;
    } else if ('mozIndexedDB' in window) {
        db_ = window.mozIndexedDB;
    }

    if (db_ == null) {
        addError("IndexedDB non disponible: veuillez changer de fureteur.");
        return null;
    }
 
    // on errors - show us what is going wrong
    function dbError_(e) {
        addStatus('Error: ' +
                  e.message + ' (' + e.code + ')', 'error');
    }

    idbRequest_ = db_.open("clubdb", "Base des donnees judo");
    idbRequest_.onerror = dbError_;
    Hooks.addOpenDB(createIfNeeded_);
    idbRequest_.onsuccess = function(e) {
        for (var i = 0; i < Hooks.OpenDBs.length; i++) {
            Hooks.OpenDBs[i](e);
        }
    }
    function createIfNeeded_(e) {
        db_ = e.target.result;
        if (db_.version != DB_VERSION) {
            addStatus("creating DB; old version was "+db_.version+"...");
            var setVrequest = db_.setVersion(DB_VERSION);
            setVrequest.onfailure = dbError_;
            setVrequest.onsuccess = function(e) {
                function createStore(n) {
                    if (!db_.objectStoreNames.contains(n)) {
                        try {
                            var objectStore = db_.createObjectStore(n, 
                                                                    {keyPath: 'id'}); 
                        } catch (err) {
                            addStatus('Error: ' + err.toString(), 'error');
                        }
                    }
                }
                createStore('client');
                createStore('groupe_paiement');
                createStore('paiement');
                createStore('global_config'); // singleton object
            }
        }
    }

    return {
        db: db_,
        dbError: dbError_
    }
})();

var objs = (function () {
    function SharedObject_() {
        this.id = -1;
        this.server_id = -1;
        this.version = -1;
        this.server_version = -1;
        this.deleted = false;
    }

    function Client_() {
        this.shared = new SharedObject_;

        this.nom = ""; this.prenom = "";
        this.sexe = ""; this.ddn = new Date();
        this.courriel = "";

        this.adresse = ""; this.ville = ""; this.code_postal = "";
        this.tel = "";

        this.affiliation = ""; this.affiliationVerifie = false;
        this.carte_anjou = "";

        this.poids = ""; this.notes = "";

        this.nom_recu_impot = "";
        this.nom_contact_urgence = ""; this.tel_contact_urgence = "";

        this.nom_stripped = ""; this.prenom_stripped = "";

        this.grades = new Array(); // of [Grade]
        this.inscriptions = new Array(); // of [Inscription]
        this.paiements = new Array();
    }


    function Grade_() {
        this.grade = GRADES[0];
        this.date_grade = new Date();
    }

    function Inscription_() {
        this.date_inscription = new Date();
        this.saisons = "";
        this.inscription_sans_affiliation = false;
        this.cours = ""; this.sessions = "";
        this.frais_passeport = false; this.frais_non_anjou = false;
        this.judogi = "";
        this.escompte = 0.0;
        this.escompte_special = 0.0;
        this.cas_special_note = "";
        this.horaire_special = "";
        this.frais = 0.0;
    }

    function GroupePaiement_() {
        this.shared = new SharedObject;
        this.clients = new Array(); // of [Client]
        this.paiements = new Array(); // of [Paiement]
    }

    function Paiement_() {
        this.shared = new SharedObject;
        this.mode = ""; // comptant vs cheque
        this.chqno = "";
        this.date_cheque = new Date();
        this.montant = 0.0;
    }

    function GlobalConfig_() {
        this.version = -1;
        this.server_version = -1;
        this.schema_version = -1;
        this.nom_club = ""; this.numero_club = "";
        this.age_masters = -1;

        this.frais_passeport_judoqc = 0.0;
        this.frais_nonresident_anjou = 0.0;
        this.date_versement = new Array(); // of Date
        this.sessions = new Array();
        this.categories = new Array();
        this.escomptes = new Array();
    }

    function Session_() {
        this.id = -1; this.seqno = -1;

        this.name = ""; this.year = ""; this.abbrev = "";
        this.first_class_date = new Date(); 
        this.first_signup_date = new Date();
        this.last_class_date = new Date();
        this.last_signup_date = new Date();

        this.cours = new Array(); // of Cours
        this.cs = new CategorieSession();
    }

    function Cours_() {
        this.id = -1; this.seqno = -1;
        this.name = ""; this.short_desc = "";
        this.entraineur = "";
    }

    function Categorie_() {
        this.id = -1; 
        this.name = ""; this.abbrev = "";
        this.years_ago = 0;
        this.noire = false;
    }

    function CategorieSession_() {
        this.categorie_id = -1;
        this.frais_1_session = 0.0;
        this.frais_2_session = 0.0;
        this.frais_judo_qc = 0.0;
    }

    function Escompte_() {
        this.id = -1; this.seqno = -1;
        this.name = "";
        this.percent = 0.0;
    }

    return {
        Client: Client_,
        Grade: Grade_,
        Inscription: Inscription_,
        GroupePaiement: GroupePaiement_,
        Paiement: Paiement_,
        GlobalConfig: GlobalConfig_,
        Session: Session_,
        Cours: Cours_,
        Categorie: Categorie_,
        CategorieSession: CategorieSession_,
        Escompte: Escompte_
    };
})();
