(function () {
    'use strict';

    /**
     * Main module of the Fuse
     */
    angular
        .module('fuse', [

            // Core
            'app.core',

            // Navigation
            'app.navigation',

            // Toolbar
            'app.toolbar',

            // Main
            'app.main',

            // Reports
            'app.report',
            'app.designlist',
            'app.design',
            'app.publishedlist',

            // Home Page
            'app.home',


            // Importers
            'app.importer',
            'app.importerlist',
            'app.importerdetail',

            // Forms
            'app.forms',
            'app.formslist',
            'app.formsdetail',
            'app.formentry',

            // Tags
            'app.tag',
            'app.taglist',
            'app.tagdetail',
            'app.tagnew',

            // Export
            'app.export',
            'app.exportexcise',
            'app.navsessionhome',
            'app.pavillion',


            //Settings
            'app.profile',
            'app.translation',
            'app.comments',

            //Testing
            'app.testing',
            'app.arcReport',
            'app.demoTable',





        ]);
})();
