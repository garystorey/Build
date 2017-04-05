// requires prototypes.js base.js
/*global jQuery ept */
( function( $, window, document, ept ){

  'use strict';
  var url = ept.supportURL;

  var removeItems = [
    'ctl00_PlaceHolderMain_SiteAdministration_RptControls_TranslationStatusListLink','ctl00_PlaceHolderMain_Customization_RptControls_AreaChromeSettings',
    'ctl00_PlaceHolderMain_Customization_RptControls_DesignEditor','ctl00_PlaceHolderMain_Customization_RptControls_Theme','ctl00_PlaceHolderMain_Galleries_RptControls_Themes',
    'ctl00_PlaceHolderMain_Customization_RptControls_AreaTemplateSettings','ctl00_PlaceHolderMain_Customization_RptControls_DesignImport','ctl00_PlaceHolderMain_Customization_RptControls_DeviceChannelSettings',
    'ctl00_PlaceHolderMain_Galleries_RptControls_CmsMasterPageCatalog','ctl00_PlaceHolderMain_UsersAndPermissions_RptControls_SiteAppPrincipals', 'ctl00_PlaceHolderMain_Galleries_RptControls_Designs',
    'ctl00_PlaceHolderMain_SiteAdministration_RptControls_RegionalSettings','ctl00_PlaceHolderMain_SiteAdministration_RptControls_AreaCacheSettings','ctl00_PlaceHolderMain_SiteAdministration_RptControls_VariationsNominateSiteLink',
    'ctl00_PlaceHolderMain_SearchAdministration_RptControls_MetadataPropertiesSite','ctl00_PlaceHolderMain_SearchAdministration_RptControls_SiteSearchSettings','ctl00_PlaceHolderMain_SearchAdministration_RptControls_SrchVis',
    'ctl00_PlaceHolderMain_SearchAdministration_RptControls_SearchConfigurationImportSPWeb','ctl00_PlaceHolderMain_SearchAdministration_RptControls_SearchConfigurationExportSPWeb',
    'ctl00_PlaceHolderMain_SearchAdministration_RptControls_SearchConfigurationImportSPSite','ctl00_PlaceHolderMain_SearchAdministration_RptControls_SearchConfigurationExportSPSite',
    'ctl00_PlaceHolderMain_SiteCollectionAdmin_RptControls_SiteNavigationSettings','ctl00_PlaceHolderMain_SiteCollectionAdmin_RptControls_SEOSettings',
    'ctl00_PlaceHolderMain_SiteCollectionAdmin_RptControls_AuditSettings','ctl00_PlaceHolderMain_SiteCollectionAdmin_RptControls_Portal',
    'ctl00_PlaceHolderMain_SiteCollectionAdmin_RptControls_PolicyTemplate','ctl00_PlaceHolderMain_SiteCollectionAdmin_RptControls_SiteCollectionAppPrincipals',
    'ctl00_PlaceHolderMain_SiteCollectionAdmin_RptControls_SiteCacheProfiles','ctl00_PlaceHolderMain_SiteCollectionAdmin_RptControls_ObjectCacheSettings',
    'ctl00_PlaceHolderMain_SiteCollectionAdmin_RptControls_HubUrlLinks','ctl00_PlaceHolderMain_SiteCollectionAdmin_RptControls_SiteCacheSettings',
    'ctl00_PlaceHolderMain_SiteCollectionAdmin_RptControls_VariationSettings','ctl00_PlaceHolderMain_SiteCollectionAdmin_RptControls_VariationLabels',
    'ctl00_PlaceHolderMain_SiteCollectionAdmin_RptControls_TranslatableColumnsPage','ctl00_PlaceHolderMain_SiteCollectionAdmin_RptControls_PublishedLinks',
    'ctl00_PlaceHolderMain_SiteCollectionAdmin_RptControls_ManageSiteHelpRendering','ctl00_PlaceHolderMain_SiteCollectionAdmin_RptControls_HtmlFieldSecurity',
    'ctl00_PlaceHolderMain_SiteCollectionAdmin_RptControls_HealthCheck','ctl00_PlaceHolderMain_SiteCollectionAdmin_RptControls_Upgrade',
    'ctl00_PlaceHolderMain_SiteCollectionAdmin_RptControls_ManageResultTypes','ctl00_PlaceHolderMain_SiteCollectionAdmin_RptControls_MetadataPropertiesSiteColl',
    'ctl00_PlaceHolderMain_SiteAdministration_RptControls_CatalogSources','ctl00_PlaceHolderMain_SiteCollectionAdmin_RptControls_SearchConfigurationImportSPSite',
    'ctl00_PlaceHolderMain_SiteCollectionAdmin_RptControls_SearchConfigurationExportSPSite'
  ];

  var linkItems = [
    'ctl00_PlaceHolderMain_Galleries_RptControls_ManageField', 'ctl00_PlaceHolderMain_Galleries_RptControls_ManageCType',
    'ctl00_PlaceHolderMain_SiteAdministration_RptControls_TermStoreManagement','ctl00_PlaceHolderMain_ReportServerSettingsLinks_RptControls_ReportServerSchedules',
    'ctl00_PlaceHolderMain_ReportServerSettingsLinks_RptControls_ReportServerSiteLevelSettings',
    'ctl00_PlaceHolderMain_SearchAdministration_RptControls_ManageResultSourcesSite','ctl00_PlaceHolderMain_SearchAdministration_RptControls_ManageResultTypes',
    'ctl00_PlaceHolderMain_SiteCollectionAdmin_RptControls_DeletedItems','ctl00_PlaceHolderMain_SearchAdministration_RptControls_ManageQueryRulesSite2',
    'ctl00_PlaceHolderMain_SearchAdministration_RptControls_NoCrawlSettingsPage','ctl00_PlaceHolderMain_SiteCollectionAdmin_RptControls_SharePointDesignerSettings'
  ];

  var linkItemsTitle = [
    'SiteColumns','SiteContentTypes','TermStoreManagement','ManageSharedSchedules','ReportingServicesSiteSettings','SearchResultSources',
    'SearchResultTypes','RecycleBin','QueryRules','SearchableColumns','SPDesignerSettings'
  ];


  var removeAF = function ( item ) {
    $('#'+item).parent('.ms-linksection-listItem').remove();
  };
  var addEPTLink = function ( item, txt ) { $( '#' + item).parent( '.ms-linksection-listItem' ).append( '*  <a style="font-size:10px;" href="'+ url + txt +'">( Work with EPT )</a>'); };


  ept.private.daf = function() {
    var currurl = ept.url.href+'';
    if ( currurl.has( '_layouts/15/settings.aspx' ) && !ept.isTrue( ept.url.qs.eptenable ) ) {
      removeItems.forEach(removeAF);
      for (var i=0, l = linkItems.length; i<l; i++) {
        addEPTLink( linkItems[i], linkItemsTitle[i] );
      }

      $('.ms-siteSettings-root .ms-linksection-textCell').css('width','350px');
    }

    if ( currurl.has('_layouts/15/prjsetng.aspx') && !ept.isTrue(ept.url.qs.eptenable) ) {
      $('#ctl00_PlaceHolderMain_logoSection_ctl03_tablerow3').css('visibility','hidden');
      $('#ctl00_PlaceHolderMain_logoSection_ctl03_tablerow1').css('visibility','hidden');
    }

  }; //End DAF

ept.onload('ept.private.daf');



})(jQuery, window, document, ept);
