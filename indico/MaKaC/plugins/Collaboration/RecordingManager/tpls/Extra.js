var ButtonCreateIndicoLink = new DisabledButton(Html.input("button", {disabled:true}, $T("Create Indico Link")));
var ButtonCreateCDSRecord  = new DisabledButton(Html.input("button", {disabled:true}, $T("Create CDS Record")));

var REUpdateOrphanList = function () {
    if (RE_orphans.length > 0) {
        $E('orphanList').set('');
        for (i in RE_orphans) {
            orphan = RE_orphans[i];
            $E('orphanList').append(RELOTemplate(orphan));
        }
    } else {
        $E('orphanList').set(Html.span({style:{paddingLeft: pixels(20)}}, $T("No orphans found.."))); // make this more beautiful
    }
}

ButtonCreateCDSRecord.observeClick(function(){
    if (ButtonCreateCDSRecord.isEnabled()) {
        if (typeof RMselectedTalkId != 'undefined' && RMselectedTalkId != '' &&
                (RMviewMode == 'plain_video' ||
                        typeof RMselectedLODBID != 'undefined' && RMselectedLODBID != '')) {

            RMCreateCDSRecord();
        }
    }
});

ButtonCreateCDSRecord.observeEvent('mouseover', function(event){
    if (!ButtonCreateCDSRecord.isEnabled()) {
        tooltip = IndicoUI.Widgets.Generic.errorTooltip(event.clientX, event.clientY,
                $T("Please select talk and content type"), "tooltipError");
    }
});

ButtonCreateCDSRecord.observeEvent('mouseout', function(event){
    if (!ButtonCreateCDSRecord.isEnabled()) {
        Dom.List.remove(document.body, tooltip);
    }
});

ButtonCreateIndicoLink.observeClick(function(){
    if (ButtonCreateIndicoLink.isEnabled()) {
        if (typeof RMselectedTalkId != 'undefined' && RMselectedTalkId != '' &&
                (RMviewMode == 'plain_video' ||
                        typeof RMselectedLODBID != 'undefined' && RMselectedLODBID != '')) {

            RMCreateIndicoLink();
        }
    }
});

ButtonCreateIndicoLink.observeEvent('mouseover', function(event){
    if (!ButtonCreateIndicoLink.isEnabled()) {
        tooltip = IndicoUI.Widgets.Generic.errorTooltip(event.clientX, event.clientY,
                $T("Please select talk and content type"), "tooltipError");
    }
});

ButtonCreateIndicoLink.observeEvent('mouseout', function(event){
    Dom.List.remove(document.body, tooltip);
});

IndicoUI.Effect.appear($E('RMlowerPane'), "block");

function RMbuttonModeSelect(mode) {
    RMviewMode = mode;
    if (mode == 'plain_video') {
        $E("RMbuttonWebLecture").dom.className = 'RMbuttonNotSelected';
        $E("RMbuttonPlainVideo").dom.className = 'RMbuttonSelected';
        IndicoUI.Effect.disappear($E('RMrightPaneWebLecture'));
        IndicoUI.Effect.appear($E('RMrightPanePlainVideo'), "block");

        if (typeof RMselectedTalkId != 'undefined' && RMselectedTalkId != '') {
            ButtonCreateCDSRecord.enable();
            ButtonCreateIndicoLink.enable();
        }
    }
    else if (mode == 'web_lecture') {
        $E("RMbuttonPlainVideo").dom.className = 'RMbuttonNotSelected';
        $E("RMbuttonWebLecture").dom.className = 'RMbuttonSelected';
        IndicoUI.Effect.disappear($E('RMrightPanePlainVideo'));
        IndicoUI.Effect.appear($E('RMrightPaneWebLecture'), "block");

        if (typeof RMselectedTalkId == 'undefined' || RMselectedTalkId == '' ||
            typeof RMselectedLODBID == 'undefined' || RMselectedLODBID == '') {
                ButtonCreateCDSRecord.disable();
                ButtonCreateIndicoLink.disable();
        }
    }

    RMMatchSummaryMessageUpdate();
}

function RMtalkBoxOffHover(IndicoID) {
    var DivID = 'div' + IndicoID;
    if (RMselectedTalkId != IndicoID) {
        document.getElementById(DivID).className = 'RMtalkDisplay';
    }
}

function RMtalkBoxOnHover(IndicoID) {
    var DivID = 'div' + IndicoID;
    if (RMselectedTalkId != IndicoID) {
        document.getElementById(DivID).className = 'RMtalkHover';
    }
}

function RMtalkSelect(IndicoID) {
    var DivID = 'div' + IndicoID;
    // reset last selected talk div to default color before setting new background
    if (typeof RMselectedTalkId != 'undefined' && RMselectedTalkId != '') {
        document.getElementById('div' + RMselectedTalkId).className = 'RMtalkDisplay';
    }
    RMselectedTalkId = IndicoID;
    document.getElementById('div' + RMselectedTalkId).className = 'RMtalkSelected';

    if (typeof RMselectedTalkId != 'undefined' && RMselectedTalkId != '' &&
            (RMviewMode == 'plain_video' ||
                    typeof RMselectedLODBID != 'undefined' && RMselectedLODBID != '')) {
        ButtonCreateCDSRecord.enable();
        ButtonCreateIndicoLink.enable();
    }

    RMMatchSummaryMessageUpdate();
}

function RMCDSDoneOnHover(IndicoID) {
    divID = 'divCDS' + IndicoID;

    document.getElementById(divID).className = 'RMcolumnStatusCDSDoneHover';

}

function RMCDSDoneOffHover(IndicoID) {
    divID = 'divCDS' + IndicoID;

    document.getElementById(divID).className = 'RMcolumnStatusCDSDone';

}

function RMCDSDoneClick(url) {
    window.open(url);
}

function RMLOBoxOffHover(DBID) {
    var DivID = 'lo' + DBID;
    if (RMselectedLODBID != DBID) {
        document.getElementById(DivID).className = 'RMLODisplay';
    }
}

function RMLOBoxOnHover(DBID) {
    var DivID = 'lo' + DBID;
    if (RMselectedLODBID != DBID) {
        document.getElementById(DivID).className = 'RMLOHover';
    }
}

function RMLOSelect(DBID) {
    var DivID = 'lo' + DBID;
    // reset last selected LO div to default color before setting new background
    if (typeof RMselectedLODBID != 'undefined' && RMselectedLODBID != '') {
        document.getElementById('lo' + RMselectedLODBID).className = 'RMLODisplay';
    }
    RMselectedLODBID = DBID;
    document.getElementById('lo' + RMselectedLODBID).className = 'RMLOSelected';

    if (typeof RMselectedTalkId != 'undefined' && RMselectedTalkId != '' &&
            (RMviewMode == 'plain_video' ||
                    typeof RMselectedLODBID != 'undefined' && RMselectedLODBID != '')) {
        ButtonCreateCDSRecord.enable();
        ButtonCreateIndicoLink.enable();
    }

    RMMatchSummaryMessageUpdate();
}

//Set RMLanguageFlagPrimary to true/false depending on whether box is checked
//Also set RMLanguageValuePrimary equal to the language code
function RMLanguageTogglePrimary(language) {
    if ($E('RMLanguagePrimary').dom.checked == true) {
        RMLanguageFlagPrimary  = true;
        RMLanguageValuePrimary = language;
    }
    else {
        RMLanguageFlagPrimary = false;
    }

    RMMatchSummaryMessageUpdate();
}

// Set RMLanguageFlagSecondary to true/false depending on whether box is checked
// Also set RMLanguageValueSecondary equal to the language code
function RMLanguageToggleSecondary(language) {
    if ($E('RMLanguageSecondary').dom.checked == true) {
        RMLanguageFlagSecondary  = true;
        RMLanguageValueSecondary = language;
    }
    else {
        RMLanguageFlagSecondary = false;
    }

    RMMatchSummaryMessageUpdate();
}

// Set RMLanguageFlagOther to true/false depending on whether box is checked
// If box is unchecked, also reset the drop-down list
function RMLanguageToggleOther() {
    if ($E('RMLanguageOther').dom.checked == true) {
        RMLanguageFlagOther = true;
    }
    else {
        RMLanguageFlagOther = false;
        $E('RMLanguageOtherSelect').dom.selectedIndex = 0;
    }

    RMMatchSummaryMessageUpdate();
}

// If drop-down list is clicked, either it was reset to index = 0, in which case uncheck the Other box,
// or a language was selected, in which case set RMLanguageValueOther appropriately and check the Other box
function RMLanguageSelectOther(language) {
    if ($E('RMLanguageOtherSelect').dom.selectedIndex == 0) {
        $E('RMLanguageOther').dom.checked = false;
        RMLanguageFlagOther = false;
    }
    else {
        $E('RMLanguageOther').dom.checked = true;
        RMLanguageFlagOther = true;
        RMLanguageValueOther = language;
    }

    RMMatchSummaryMessageUpdate();
}

// Populate the RMMatchSummaryMessage text box with basic info like the talk ID, LOID
function RMMatchSummaryMessageUpdate() {
    var message_list = [];

    if (typeof RMselectedTalkId != 'undefined' && RMselectedTalkId != '') {
        message_list.push(Html.span({}, "talk: ", Html.span({style:{fontWeight: "bold"}}, RMselectedTalkId)));
    }
    if (typeof RMviewMode != 'undefined' && RMviewMode == 'plain_video') {
        if (typeof RMvideoFormat != 'undefined' && RMvideoFormat != '') {
            message_list.push(Html.span({}, ", format: ", Html.span({style:{fontWeight: "bold"}}, RMvideoFormat)));
        }
    }
    else if (typeof RMviewMode != 'undefined' && RMviewMode =='web_lecture') {
        if (typeof RMselectedLODBID != 'undefined' && RMselectedLODBID != '') {
            message_list.push(Html.span({}, ", web lecture: ", Html.span({style:{fontWeight: "bold"}}, RMLOList[RMselectedLODBID]["LOID"])));
        }
    }

    languageCodes = RMGetLanguageCodesList();

    var len = languageCodes.length;
    if (len > 0) {
        message_list.push(Html.span({}, ", languages: "))
        message_list.push(RMLanguagesString(languageCodes));
    }

    $E('RMMatchSummaryMessage').set(message_list);
}

//Build a list of language codes based on variables set
function RMGetLanguageCodesList() {

    languageCodes = [];

    if (RMLanguageFlagPrimary == true) {
        languageCodes.push(RMLanguageValuePrimary);
    }
    if (RMLanguageFlagSecondary == true) {
        languageCodes.push(RMLanguageValueSecondary);
    }
    if (RMLanguageFlagOther == true) {
        languageCodes.push(RMLanguageValueOther);
    }

    return languageCodes;
}

// Build a string listing language codes
function RMLanguagesString(languageCodes) {

    var messages = [];
    var len = languageCodes.length;

    if (len > 0) {
        for(var i=0; i < len; i++) {
            languageCodes[i];
            messages.push(Html.span({style:{fontWeight: "bold"}}, languageCodes[i]))
            if (i < len - 1) {
                messages.push(Html.span({}, ", "));
            }

        }
    }

    return messages;
}

function RMStatusMessage(message) {
    $E('RMStatusMessageID').set(message);
}

function RMchooseVideoFormat(format_string) {
    RMvideoFormat = format_string;

    if (typeof RMselectedTalkId != 'undefined' && RMselectedTalkId != '' &&
            (RMviewMode == 'plain_video' ||
                    typeof RMselectedLODBID != 'undefined' && RMselectedLODBID != '')) {
        ButtonCreateCDSRecord.enable();
        ButtonCreateIndicoLink.enable();
    }

    RMMatchSummaryMessageUpdate();
}

function RMLink() {
    //RMselectedTalk
    //RMselectedLO

    var killProgress = IndicoUI.Dialogs.Util.progress($T("doing something"));

    indicoRequest('collaboration.pluginService',
            {
                plugin: 'RecordingManager',
                service: 'RMLink',
                conference: '<%= ConferenceId %>',
                IndicoID: RMselectedTalkId,
                LOID: RMselectedLODBID
            },
        function(result, error){
            if (!error) {
// I don't have anything here yet. This is where we could do something with the result if we want. Don't know what that would be.
                killProgress(); // turn off the progress indicator
            } else {
                killProgress(); // turn off the progress indicator
                IndicoUtil.errorReport(error);
            }
        }
    );
}

// Do the AJAX thing to create the CDS record
function RMCreateCDSRecord() {

    languageCodes = RMGetLanguageCodesList();

    speakers_string = "";
    if (RMTalkList[RMselectedTalkId]["speakers"] == "") {
        speakers_string = "no speaker given";
    }
    else {
        speakers_string = RMTalkList[RMselectedTalkId]["speakers"];
    }

    if (RMviewMode == 'plain_video') {
        var confirmText = Html.div({},
                Html.span({}, $T("This will create a" + " ")),
                Html.span({style:{fontStyle: "italic"}}, RMviewMode),
                Html.span({}, " " + $T("CDS record for the following") + " "),
                Html.span({style:{fontStyle: "italic"}}, RMTalkList[RMselectedTalkId]["type"] + ":"),
                Html.br(),
                Html.br(),
                Html.span({style:{fontWeight: "bold"}}, RMTalkList[RMselectedTalkId]["title"]),
                Html.span({}, " (" + speakers_string + ")"),
                Html.br(),
                Html.br(),
                Html.span({}, $T("time scheduled") + ": "),
                Html.span({style:{fontWeight: "bold"}}, RMTalkList[RMselectedTalkId]["date_nice"]),
                Html.br(),
                Html.span({}, $T("IndicoID") + ": "),
                Html.span({style:{fontWeight: "bold"}}, RMselectedTalkId),
                Html.br(),
                Html.span({}, $T("video format") + ": "),
                Html.span({style:{fontWeight: "bold"}}, RMvideoFormat),
                Html.br(),
                Html.span({}, $T("spoken language(s)") + ": "),
                Html.span({style:{fontWeight: "bold"}}, RMLanguagesString(languageCodes)),
                Html.br(),
                Html.br(),
                Html.span({}, $T("To proceed, click OK (you will not be able to undo)."))
        );
    }
    else if (RMviewMode =='web_lecture') {
        var confirmText = Html.div({},
            Html.div({style:{textAlign:"center", fontWeight:"bold"}}, $T("Create CDS record for web lecture")),
            Html.div({}, $T("IndicoID: " + RMselectedTalkId)),
            Html.div({}, $T("Lecture Object ID: " + RMselectedLODBID))
        );
    }

    var confirmHandler = function(confirm) {

        if (confirm) {

            var killProgress = IndicoUI.Dialogs.Util.progress($T("Creating CDS record..."));

            indicoRequest('collaboration.pluginService',
                    {
                        plugin: 'RecordingManager',
                        service: 'RMCreateCDSRecord',
                        conference: '<%= ConferenceId %>',
                        IndicoID: RMselectedTalkId,
                        LOID: RMselectedLODBID,
                        videoFormat: RMvideoFormat,
                        contentType: RMviewMode,
                        languages: languageCodes
                    },
                function(result, error){
                        $E('RMMatchSummaryMessage').set(Html.span({}, result));

                        if (!error) {

                        // I don't have anything here yet. This is where we could do something with the result if we want. Don't know what that would be.
                        killProgress(); // turn off the progress indicator

                    } else {
                        killProgress(); // turn off the progress indicator
                        IndicoUtil.errorReport(error);
                    }
                }
            );



        }
    };

    var confirmPopup = new ConfirmPopup($T("Please review your choice"), confirmText, confirmHandler);
    confirmPopup.open();

}

function RMCreateIndicoLink() {

    var killProgress = IndicoUI.Dialogs.Util.progress($T("Creating Indico link..."));

    indicoRequest('collaboration.pluginService',
            {
                plugin: 'RecordingManager',
                service: 'RMCreateIndicoLink',
                conference: '<%= ConferenceId %>',
                IndicoID: RMselectedTalkId,
                LOID: RMselectedLODBID,
                CDSID: RMTalkList[RMselectedTalkId]
            },
        function(result, error){
            if (!error) {
// I don't have anything here yet. This is where we could do something with the result if we want. Don't know what that would be.
                killProgress(); // turn off the progress indicator

            } else {
                killProgress(); // turn off the progress indicator
                IndicoUtil.errorReport(error);
            }
        }
    );
}
