<% declareTemplate(newTemplateStyle=True) %>

<% if not WebcastCapable: %>
<div style="margin-bottom: 1em;">
    <% if WebcastCapableRooms: %>
    <table>
        <tr>
            <td>
                <span class="WRNoteTitle"><%=_("Note:")%></span>
            </td>
            <td>
                <span class="WRNoteText">
                    <%=_("In order to send a Webcast request, you need to select a room capable of webcasting. ")%> 
                    <span class='fakeLink' onclick='toogleWebcastCapableRooms();' id="webcastRoomsText"><%=_("See list of webcast-able rooms")%></span>
                </span>
            </td>
        </tr>
        <tr>
            <td></td>
            <td>
                <div id="webcastCapableRoomsDiv" style="display:none;">
                    <div style="padding-top:15px;padding-bottom:15px;">
                        <span class="WRNoteText"><%=_("These are the rooms capable of webcasting:")%> </span>
                        <table style="margin-left: 20px;">
                            <% for roomName in WebcastCapableRooms:%>
                                <tr>
                                    <td>
                                        <%=roomName.split(":")[0] %>
                                    </td>
                                    <td>
                                        <%=roomName.split(":")[1] %>
                                    </td>
                                </tr>
                            <% end %>
                        </table>
                        <span style="font-style: italic;">
                            <%=_("Please go to the")%> <a href="<%= urlHandlers.UHConferenceModification.getURL(Conference)%>"><%=_("General settings")%></a> <%=_("and select one of these room locations for this Indico event. ")%>
                            <%=_("But please remember, you have to book it as well!")%>
                        </span>
                    </div>
                </div>
            </td>
        </tr>
    </table>
    <% end %>
    <% else: %>
    <div>
        <span class="WRNoteTitle"><%=_("Note:")%></span>
        <span class="WRNoteText">
            <%=_("In order to send a webcastrequest you need to select a room capable of webcasting. However there are not currently marked as capable in the database.")%> 
        </span>
    </div>
    <% end %>
</div>
<% end %>
<% else: %>
<div style="margin-bottom: 1em;">
    <span class="WRNoteTitle"><%=_("Note:")%></span>
    <span class="WRNoteText">
        <%=_("If you have not done so already, please remember to book your room(s).")%>
    </span>
</div>
<% end %>


<div id="WRForm">

    <% if IsSingleBooking: %>
    <div style="margin-bottom: 1em;">
        <div id="sendWebcastRequestTop" class="sendWebcastRequestDiv" style="display:none;">
            <button onclick="send('WebcastRequest')"><%=_("Send request")%></button>
        </div>
        <div id="modifyWebcastRequestTop" class="modifyWebcastRequestDiv" style="display:none;">
            <button onclick="send('WebcastRequest')"><%=_("Modify request")%></button>
        </div>
        <div id="withdrawWebcastRequestTop" class="withdrawWebcastRequestDiv" style="display:none;">
            <button onclick="withdraw('WebcastRequest')"><%=_("Withdraw request")%></button>
        </div>
    </div>
    <% end %>
    
    
    
    <!-- DRAW BOX AROUND SECTION 1: SELECT CONTRIBUTIONS -->
    <div class="WRFormSection" id="contributionselectionDiv">
        <!-- WHICH CONTRIBUTIONS SHOULD BE WEBCASTED -->
        <div class="WRFormSubsection">
            <span class="WRQuestion">Which talks would you like to have webcasted?</span>
            <table>
                <tr>
                    <td>
                        <input type="radio" name="talks" value="all" id="allTalksRB" onclick="WR_hideTalks()" checked />
                    </td>
                    <td>
                        <% if NTalks == NWebcastCapableContributions: %>
                        <label for="allTalksRB" id="allTalksRBLabel" >All talks</label>
                        <% end %>
                        <% else: %>
                        <label for="allTalksRB" id="allTalksRBLabel"><%=_("All webcast-able talks.")%></label>
                    </td>
                </tr>
                <tr>
                    <td></td>
                    <td>
                        <span class="WRNoteTitle"><%=_("Note:")%></span>
                        <span class="WRNoteText">
                            <%=_("Some of your talks")%> (<%= str(NTalks - NWebcastCapableContributions) + _(" out of ") + str(NTalks) %>) <%=_(" are not in a room capable of webcasting and thus cannot be webcasted.")%>
                        </span>
                        <span class='fakeLink' onclick='toogleWebcastCapableRooms();' id="webcastRoomsText"><%=_("See list of webcast-able rooms")%></span>
                        <div id="webcastCapableRoomsDiv" style="display:none;">
                            <div style="padding-top:15px;padding-bottom:15px;">
                                <span class="WRNoteText"><%=_("These are the rooms capable of webcasting:")%> </span>
                                <table style="margin-left: 20px;">
                                    <% for roomName in WebcastCapableRooms:%>
                                        <tr>
                                            <td>
                                                <%=roomName.split(":")[0] %>
                                            </td>
                                            <td>
                                                <%=roomName.split(":")[1] %>
                                            </td>
                                        </tr>
                                    <% end %>
                                </table>
                                <span style="font-style: italic;">
                                    <%=_("Please go to the")%> <a href="<%= urlHandlers.UHConfModifSchedule.getURL(Conference)%>"><%=_("Timetable")%></a> <%=_("and select one of these room locations for your contributions. ")%>
                                    <%=_("But please remember, you have to book the rooms as well!")%>
                                </span>
                            </div>
                        </div>
                        <% end %>
                    </td>
                
                </tr>
                <tr>
                    <td>
                        <input type="radio" name="talks" value="choose" id="chooseTalksRB" onclick="WR_loadTalks()" />
                    </td>
                    <td>
                        <% if NTalks == NWebcastCapableContributions: %>
                        <label for="chooseTalksRB" id="chooseTalksRBLabel"><%=_("Choose talks.")%></label>
                        <% end %>
                        <% else:%>
                        <label for="chooseTalksRB" id="chooseTalksRBLabel"><%=_("Choose among webcast-able talks.")%></label>
                        <% end %>    
                    </td>
                </tr>                    
            </table>
        </div>
        
        <% displayText = ('none', 'block')[DisplayTalks] %>
        <div id="contributionsDiv" class="WRFormSubsection" style="display: <%= displayText %>;">
            <span class="WRQuestion"><%=_("Please choose among the webcast-able contributions below:")%></span>
            
            <% if HasTalks: %>
            <span class="fakeLink" style="margin-left: 20px;margin-right:5px;" onclick="WRSelectAllContributions()">Select all</span>
            <span style="color: #AAAAAA">|</span>
            <span class="fakeLink" style="margin-left: 5px;" onclick="WRUnselectAllContributions()">Select none</span>
            <% end %>
            
            <div class="WRContributionListDiv">
                <table>
                    <tr id="contributionsRow">
                        <% if DisplayTalks: %>
                            <% if HasTalks: %>
                                <% for tl in TalkLists: %>
                                <td class="WRContributionsColumn">
                                    <ul class="WROptionList">
                                    <% for talk, checked in tl: %>
                                        <li>
                                            <% checkedText = ('', 'checked')[checked] %>
                                            <input type="checkbox" name="talkSelection" value="<%= talk.getId() %>" id="talk<%=talk.getId()%>CB" <%=checkedText%> /> 
                                            <label for="talk<%=talk.getId()%>CB">
                                                <span class="WRContributionId">[<%= talk.getId() %>]</span>
                                                <span class="WRContributionName"><%= talk.getTitle() %></span>
                                                <% if talk.getSpeakerList() : %>
                                                <span class="WRSpeakers">, by <%= " and ".join([person.getFullName() for person in talk.getSpeakerList()]) %></span>
                                                <% end %>
                                            </label>
                                        </li>
                                    <% end %>
                                    </ul>
                                </td>
                                <% end %>
                            <% end %>
                            <% else: %>
                                <td class="WRContributionsColumn" style="padding-left: 20px;">
                                <%=_("This event has currently no talks.")%>
                                </td>
                            <% end %>
                        <% end %>
                        
                    </tr>
                </table>
            </div>
            <% if HasTalks: %>
            <script type="text/javascript">
                var WRSelectAllContributions = function() {
                    each($N('talkSelection'), function(checkbox) {
                        checkbox.dom.checked = true;
                    });
                }
                var WRUnselectAllContributions = function() {
                    each($N('talkSelection'), function(checkbox) {
                        checkbox.dom.checked = false;
                    });
                }
            </script>
            <% end %>
        </div>
        <div class="WRFormSubsection">
            <span class="WRQuestion"><%=_("Please write here additional comments about talk selection:")%></span>
            <div><input size="60" type="text" name="talkSelectionComments"><span id="talkSelectionCommentsTT"/></div>
        </div>
    </div>
    
    
    <div class="WRFormSection">
        <div class="WRFormSubsection">
        <span class="WRQuestion"><%=_("Have all the speakers given permission to have their talks webcasted?")%></span>
        <br/>
        <input type="radio" name="permission" id="permissionYesRB" value="Yes" >
        <label for="permissionYesRB" id="permissionYesRBLabel">Yes</label>
        <input type="radio" name="permission" id="permissionNoRB"value="No" >
        <label for="permissionNoRB" id="permissionNoRBLabel">No</label>
        <span style="margin-left: 2em;"><%=_("Here is the ")%><a href="<%= ConsentFormURL %>"><%=_("Webcast Consent Form")%></a> <%=_("to be signed by each speaker.")%></span>
        </div>
    </div>
    
    <!-- DRAW BOX AROUND SECTION 2: TECHNICAL DETAILS FOR WEBCAST -->
    <div class="WRFormSection">
        <!-- SLIDES? CHALKBOARD? -->
        <div class="WRFormSubsection">
            <span class="WRQuestion"><%=_("Will slides and/or chalkboards be used?")%></span>
            <br />
            <select name="lectureOptions" id="lectureOptions">
                <option value="chooseOne">-- Choose one --</option>
                <% for value, text in LectureOptions:%>
                <option value="<%=value%>"><%=text%></option>
                <% end %>
            </select>
        </div>
        
        <!-- WHAT TYPE OF TALK IS IT -->
        <div class="WRFormSubsection">
            <span class="WRQuestion"><%=_("What type of event is it?")%></span>
            <br />
            <select name="lectureStyle" id="lectureStyle">
                <option value="chooseOne">-- Choose one --</option>
                <% for value, text in TypesOfEvents:%>
                <option value="<%=value%>"><%=text%></option>
                <% end %>
            </select>
        </div>
    
        <!-- HOW URGENTLY IS POSTING NEEDED -->
        <div class="WRFormSubsection">
            <span class="WRQuestion"><%=_("All webcasts are recorded. How soon do you need your recording posted online afterwards?")%></span>
            <br />
            <select name="postingUrgency" id="postingUrgency">
                <% for value, text in PostingUrgency: %>
                <% selectedText = ("", "selected")[value == "never"] %>
                <option value="<%=value%>" <%=selectedText %>><%=text%></option>
                <% end %>
            </select>
        </div>
    
       <!-- HOW MANY WEBCAST VIEWERS -->
        <div class="WRFormSubsection">
            <span class="WRQuestion"><%=_("How many people do you expect to view the realtime webcast?")%></span>
            <br />
            <input type="text" size="20" name="numWebcastViewers" value="" />
        </div>
    
        <!-- HOW MANY REMOTE VIEWERS -->
        <div class="WRFormSubsection">
            <span class="WRQuestion"><%=_("How many people do you expect to view the online recordings afterward?")%></span>
            <br />
            <input type="text" size="20" name="numRecordingViewers" value="" />
        </div>
    
        <!-- HOW MANY ATTENDEES -->
        <div class="WRFormSubsection">
            <span class="WRQuestion"><%=_("How many people do you expect to attend the event in person?")%></span>
            <br />
            <input type="text" size="20" name="numAttendees" value="" />
        </div>
    
    </div>
    
    <!-- DRAW BOX AROUND SECTION 3: METADATA AND SURVEY INFO -->
    <div class="WRFormSection">
        <!-- PURPOSE OF WEBCAST -->
        <div class="WRFormSubsection">
            <span class="WRQuestion"><%=_("Why do you need this event webcasted? (check all that apply)")%></span>
            <ul class="WROptionList">
                <% for value, text in WebcastPurpose: %>
                <li>
                    <input type="checkbox" name="webcastPurpose" value="<%=value%>" id="<%=value%>CB">
                    <label for="<%=value%>CB"><%=text%></label>
                </li>
                <% end %>
            </ul>
        </div>
        <!-- EXPECTED AUDIENCE -->
        <div class="WRFormSubsection">
            <span class="WRQuestion"><%=_("Who is the intended audience? (check all that apply)")%></span>
            <ul class="WROptionList">
                <% for value, text in IntendedAudience: %>
                <li>
                    <input type="checkbox" name="intendedAudience" value="<%=value%>" id="<%=value%>CB">
                    <label for="<%=value%>CB"><%=text%></label>
                </li>
                <% end %>
            </ul>
        </div>
        <!-- SUBJECT MATTER -->
        <div class="WRFormSubsection">
            <span class="WRQuestion"><%=_("What is the subject matter? (check all that apply)")%></span>
            <ul class="WROptionList">
                <% for value, text in SubjectMatter: %>
                <li>
                    <input type="checkbox" name="subjectMatter" value="<%=value%>" id="<%=value%>CB">
                    <label for="<%=value%>CB"><%=text%></label>
                </li>
                <% end %>
            </ul>
        </div>
    </div>
    
    <!-- SECTION 4: Extra comments -->
    <div class="WRFormSection">
        <div class="WRFormSubsection">
            <span class="WRQuestion"><%=_("Please write here any other comments or instructions you may have:")%></span>
            <textarea rows="10" cols="60" name="otherComments" style="display:block;"></textarea>
        </div>
    </div>
    
    
    <% if IsSingleBooking: %>
    <div style="margin-top: 1em;">
        <div id="sendWebcastRequestBottom" class="sendWebcastRequestDiv" style="display:none;">
            <button onclick="send('WebcastRequest')"><%=_("Send request")%></button>
        </div>
        <div id="modifyWebcastRequestBottom" class="modifyWebcastRequestDiv" style="display:none;">
            <button onclick="send('WebcastRequest')"><%=_("Modify request")%></button>
        </div>
        <div id="withdrawWebcastRequestBottom" class="withdrawWebcastRequestDiv" style="display:none;">
            <button onclick="withdraw('WebcastRequest')"><%=_("Withdraw request")%></button>
        </div>
    </div>
    <% end %>
</div>

<script type="text/javascript">
    var WRWebcastCapable = <%= jsBoolean(WebcastCapable) %>;
    var WR_contributionsLoaded = <%= jsBoolean(DisplayTalks) %>;
</script>

<% if (not WebcastCapable and WebcastCapableRooms) or (NWebcastCapableContributions > 0 and NTalks > NWebcastCapableContributions): %>
<script type="text/javascript">
    var webcastSwitch = false;
    var toogleWebcastCapableRooms = function () {
        IndicoUI.Effect.toggleAppearance($E('webcastCapableRoomsDiv'));
        if (webcastSwitch) { 
            $E("webcastRoomsText").dom.innerHTML = $T("See list of webcast-able rooms.");
        } else {
            $E("webcastRoomsText").dom.innerHTML = $T("Hide list of webcast-able rooms.");
        }
        webcastSwitch = !webcastSwitch;
    }
</script>
<% end %>

