<% from MaKaC.webinterface.rh.conferenceBase import RHSubmitMaterialBase %>
<% from MaKaC.common import Config %>
<% import MaKaC.common.info as info %>
<% from MaKaC.rb_location import Location %>
<%!
authenticators = Config.getInstance().getAuthenticatorList()
extAuths = []
for auth in authenticators:
    if auth.lower() != "local":
        extAuths.append(auth)

rbActive = info.HelperMaKaCInfo.getMaKaCInfoInstance().getRoomBookingModuleActive()
if rbActive:
    locationList = {}
    locationNames = map(lambda l: l.friendlyName, Location.allLocations)

    for name in locationNames:
        locationList[name] = name;
else:
    locationList = None

%>
<% end %>

var Indico = {
    SystemIcons: {
        conference: "<%= iconFileName("conference") %>",
        lecture: "<%= iconFileName("lecture") %>",
        meeting: "<%= iconFileName("meeting") %>",
        arrow_previous: "<%= iconFileName("arrow_previous") %>",
        arrow_next: "<%= iconFileName("arrow_next") %>",
        dot_gray: "<%= iconFileName("dot_gray") %>",
        dot_blue: "<%= iconFileName("dot_blue") %>",
        dot_green: "<%= iconFileName("dot_green") %>",
        dot_red: "<%= iconFileName("dot_red") %>",
        dot_orange: "<%= iconFileName("dot_orange") %>",
        ui_loading: "<%= iconFileName("ui_loading") %>",
        role_participant: "<%= iconFileName("role_participant") %>",
        role_creator: "<%= iconFileName("role_creator") %>",
        role_manager: "<%= iconFileName("role_manager") %>",
        remove: "<%= iconFileName("remove") %>",
        remove_faded: "<%= iconFileName("remove_faded") %>",
        add: "<%= iconFileName("add") %>",
        add_faded: "<%= iconFileName("add_faded") %>",
        basket: "<%= iconFileName("basket") %>",
        tick: "<%= iconFileName("tick") %>",
        edit: "<%= iconFileName("edit") %>",
        edit_faded: "<%= iconFileName("edit_faded") %>",
        currentMenuItem: "<%= iconFileName("currentMenuItem") %>",
        itemExploded:"<%= iconFileName("itemExploded") %>",
        enabledSection: "<%= iconFileName("enabledSection") %>",
        disabledSection: "<%= iconFileName("disabledSection") %>",
        timezone: "<%= iconFileName("timezone") %>",
        basket: "<%= iconFileName("basket") %>",
        play: "<%= iconFileName("play") %>",
        stop: "<%= iconFileName("stop") %>",
        reload: "<%= iconFileName("reload") %>",
        play_faded: "<%= iconFileName("play_faded") %>",
        stop_faded: "<%= iconFileName("stop_faded") %>",
        info: "<%= iconFileName("info") %>",
        accept: "<%= iconFileName("accept") %>",
        reject:"<%= iconFileName("reject") %>",
        user:"<%= iconFileName("user") %>",
        room:"<%= iconFileName("room") %>",
        popupMenu: "<%= iconFileName("popupMenu")%>",
        roomwidgetArrow: "<%= iconFileName("roomwidgetArrow")%>",
        breadcrumbArrow: "<%= iconFileName("breadcrumbArrow")%>",
        star: "<%= iconFileName("star")%>",
        warning_yellow: "<%= iconFileName("warning_yellow")%>"
    },
    Urls: {
        JsonRpcService: "<%= urlHandlers.UHJsonRpcService.getURL() %>",
        SecureJsonRpcService: "<%= urlHandlers.UHSecureJsonRpcService.getURL() %>",

        ImagesBase: "<%= Config.getInstance().getImagesBaseURL() %>",
        SecureImagesBase: "<%= Config.getInstance().getImagesBaseSecureURL() %>",

        Login: "<%= urlHandlers.UHSignIn.getURL() %>",

        ConferenceDisplay: "<%= urlHandlers.UHConferenceDisplay.getURL() %>",
        ContributionDisplay: "<%= urlHandlers.UHContributionDisplay.getURL() %>",
        SessionDisplay: "<%= urlHandlers.UHSessionDisplay.getURL() %>",

        ContribToXML: "<%= urlHandlers.UHContribToXML.getURL() %>",
        ContribToPDF: "<%= urlHandlers.UHContribToPDF.getURL() %>",
        ContribToiCal: "<%= urlHandlers.UHContribToiCal.getURL() %>",

        SessionToPDF: "<%= urlHandlers.UHSessionToiCal.getURL() %>",
        ConfTimeTablePDF: "<%= urlHandlers.UHConfTimeTablePDF.getURL() %>",

        SessionModification: "<%= urlHandlers.UHSessionModification.getURL() %>",
        ContributionModification: "<%= urlHandlers.UHContributionModification.getURL() %>",
        BreakModification: "<%= urlHandlers.UHConfModifyBreak.getURL() %>",
        Reschedule: "<%= urlHandlers.UHConfModifReschedule.getURL() %>",

        UploadAction: {
            subContribution: '<%= str(urlHandlers.UHSubContribModifAddMaterials.getURL()) %>',
            contribution: '<%= str(urlHandlers.UHContribModifAddMaterials.getURL()) %>',
            session: '<%= str(urlHandlers.UHSessionModifAddMaterials.getURL()) %>',
            conference: '<%= str(urlHandlers.UHConfModifAddMaterials.getURL()) %>',
            category: '<%= str(urlHandlers.UHCategoryAddMaterial.getURL()) %>'
        }
    },

    Data: {
        MaterialTypes: { meeting : <%= RHSubmitMaterialBase._allowedMatsForMeetings %>,
        simple_event: <%= RHSubmitMaterialBase._allowedMatsForSE %>,
        conference: <%= RHSubmitMaterialBase._allowedMatsConference %>,
        category: <%= RHSubmitMaterialBase._allowedMatsCategory %>},
        WeekDays: <%= [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ] %>,
        Locations: <%= jsonEncode(locationList) %>
    },
    Settings: {
        ExtAuthenticators: <%= extAuths %>,
        RoomBookingModuleActive: <%= jsBoolean(rbActive) %>
    }
};
