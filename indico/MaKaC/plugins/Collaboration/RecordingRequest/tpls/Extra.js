var RR_hideTalks = function (){
    IndicoUI.Effect.disappear($E('contributionsDiv'));
}

var RR_loadTalks = function () {
    
    var fetchContributions = function() {
        
        var talkTemplate = function(talk) {
            var checkBox = Html.input('checkbox', {name: "talkSelection", id: "talk" + talk.id + "CB"});
            checkBox.dom.value = talk.id;
            var talkId = Html.span("RRContributionId", "[" + talk.id + "] ")
            var talkName = Html.span("RRContributionName", talk.title)
            var label = Html.label({}, talkId, talkName);
            label.dom.htmlFor = "talk" + talk.id + "CB";
            
            if (talk.speakerList.length > 0) {
                var speakers = ", by "
                enumerate(talk.speakerList, function(speaker, index) {
                    if (index > 0) {
                        speakers += " and ";
                    }
                    speakers += speaker.fullName;
                });
                label.append(Html.span("RRSpeakers", speakers))
            }
            
            if (exists(talk.location)) {
                var locationText = ' (' + talk.location;
                if (exists(talk.room)) {
                    locationText += ', ' + talk.room;
                }
                locationText += ')';
                label.append(Html.span("RRSpeakers", locationText))
            }
            
            return Html.li('', checkBox, label);
        };
        
        var killProgress = IndicoUI.Dialogs.Util.progress("Fetching talks, may take a while...");
        indicoRequest('event.contributions.list',
            {
                conference: '<%= ConferenceId %>',
                poster: false,
                posterShowNoValue: false
            },
            function(result, error){
                if (!error) {
                    IndicoUI.Effect.appear($E('contributionsDiv'));
                    if (result.length > 0) {
                        for (i in result) {
                            t = result[i];
                            if (i < result.length / 2) {
                                $E('contributionList1').append(talkTemplate(t));
                            } else {
                                $E('contributionList2').append(talkTemplate(t));
                            }
                        }
                    } else {
                        $E('contributionList1').set(Html.span({style:{paddingLeft: pixels(20)}},"This event has no talks")); // make this more beautiful
                    }
                    RR_contributionsLoaded = true;
                    killProgress();
                } else {
                    killProgress();
                    IndicoUtil.errorReport(error);
                }
            }
        );
    };
    
    if (RR_contributionsLoaded) {
        IndicoUI.Effect.appear($E('contributionsDiv'));
        
    } else {
        fetchContributions();
    }
}