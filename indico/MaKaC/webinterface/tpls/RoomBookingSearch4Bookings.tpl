<script type="text/javascript">

    function adjustDates(s, e) {
        if (s.datepicker('getDate') > e.datepicker('getDate'))
            e.datepicker('setDate', s.datepicker('getDate'));
    }

    function initWidgets() {
        $('#roomselector').roomselector({
            allowEmpty: false,
            rooms: ${ rooms | j, n },
            selectName: 'room_id_list',
            simpleMode: true
        });

        $('#timerange').timerange();

        var s = $('#start_date'), e = $('#end_date');
        $('#start_date, #end_date').datepicker({
            onSelect: function() {
                adjustDates(s, e);
                $('SearchBookings').trigger('change');
            }
        });
        s.datepicker('setDate', '+0');
        e.datepicker('setDate', '+7');
    }

    function confirm_search() {
        if ($('#is_only_mine').is(':checked') || $('#roomIDList').val() !== null) {
            return true;
        }
        try { if ($('#is_only_my_rooms').is(':checked')) { return true; } } catch (err) {}
        new AlertPopup($T('Select room'), $T('Please select a room (or several rooms).')).open();
        return false;
    }

    // Reads out the invalid textboxes and returns false if something is invalid.
    // Returns true if form may be submited.
    function forms_are_valid(onSubmit) {
        if (onSubmit != true) {
            onSubmit = false;
        }

        // Clean up - make all textboxes white again
        var searchForm = $('#SearchBookings');
        $(':input', searchForm).removeClass('invalid');

        // Init
        var isValid = true;

        // Datepicker
        if (!is_date_valid($('#start_date').val())) {
            isValid = false;
            $('#start_date').addClass('invalid');
        }
        if (!is_date_valid($('#end_date').val())) {
            isValid = false;
            $('#end_date').addClass('invalid');
        }

        // Time period
        isValid = isValid && $('#timerange').timerange('validate');

        // Holidays warning
        if (isValid && !onSubmit) {
            var lastDateInfo = searchForm.data('lastDateInfo');
            var dateInfo = $('#start_date, #sTime, #end_date, #eTime').serialize();
            if (dateInfo != lastDateInfo) {
                searchForm.data('lastDateInfo', dateInfo);
                var holidaysWarning = indicoSource(
                    'roomBooking.getDateWarning', searchForm.serializeObject()
                );

                holidaysWarning.state.observe(function(state) {
                    if (state == SourceState.Loaded) {
                        $E('holidays-warning').set(holidaysWarning.get());
                    }
                });
            }
        }
        return isValid;
    }

    $(function() {
        initWidgets();

        $('#SearchBookings').delegate(':input', 'keyup change', function() {
            forms_are_valid();
        }).submit(function(e) {
            if (!forms_are_valid(true)) {
                new AlertPopup($T('Error'), $T('There are errors in the form. Please correct fields with red background.')).open();
                e.preventDefault();
            }
            else if(!confirm_search()) {
                e.preventDefault();
            }
            else {
                $('#start_date').val($('#start_date').val() + ' ' + $('#sTime').val());
                $('#end_date').val($('#end_date').val() + ' ' + $('#eTime').val());
            }
        });
    });
</script>

<!-- CONTEXT HELP DIVS -->
<div id="tooltipPool" style="display: none">
  <!-- Choose Button -->
  <div id="chooseButtonHelp" class="tip">
    ${ _('Directly choose the room.') }
  </div>
</div>
<!-- END OF CONTEXT HELP DIVS -->

<h2 class="page-title">
    ${ _('Search bookings') }
</h2>

<form method="post" action="${ roomBookingBookingListURL }" id="SearchBookings">
    <h2 class="group-title">
        <i class="icon-location"></i>
        ${ _('Taking place in') }
    </h2>

    <div id="roomselector"></div>

    <h2 class="group-title">
        <i class="icon-time"></i>
        ${ _('Timespan') }
    </h2>

    <div class="toolbar thin">
        <div class="group with-datepicker">
            <span class="i-button label heavy">
                ${ _('Start Date') }
            </span>
            <span class="datepicker thin">
                <input type="text" name="start_date" id="start_date"/>
            </span>
        </div>

        <div class="group with-datepicker">
            <span class="i-button label heavy">
                ${ _('End Date') }
            </span>
            <span class="datepicker thin">
                <input type="text" name="end_date" id="end_date"/>
            </span>
        </div>
    </div>

    <div id="timerange"></div>

    <h3 class="group-title">
        <i class="icon-info"></i>
        ${ _('Booking details') }
    </h3>

    <div id="BookingDetails">
        <div class="toolbar thin">
            <div class="group">
                <span class="i-button label">
                    ${ _('Booked for') }
                </span>
                <input size="30" type="text" id="booked_for_name" name="booked_for_name"
                    placeholder="${ _('Type name...') }" />
            </div>
        </div>
        <div class="toolbar thin">
            <div class="group">
                <span class="i-button label">
                    ${ _('Reason') }
                </span>
                <input size="30" type="text" id="reason" name="reason"
                    placeholder="${ _('Type reason...') }"/>
            </div>
        </div>

        <div class="toolbar thin table">
            <div class="group i-selection">
                <span class="i-button label">
                    ${ _('Booked') }
                </span>
                <input type="radio" id="any_booker" name="is_only_mine" value="false" checked/>
                <label for="any_booker" class="i-button"
                    title="${ _('Shows all bookings') }">
                    ${ _('Anyone') }
                </label>
                <input type="radio" id="only_mine" name="is_only_mine" value="true"/>
                <label for="only_mine" class="i-button"
                    title="${ _('Filters your bookings') }">
                    ${ _('Me') }
                </label>
            </div>
        </div>

        % if isResponsibleForRooms:
        <div class="toolbar thin table">
            <div class="group i-selection">
                <span class="i-button label">
                    ${ _('Rooms') }
                </span>
                <input type="radio" id="any_room" name="is_only_my_rooms" value="false" checked/>
                <label for="any_room" class="i-button"
                    title="${ _('Shows all the rooms') }">
                    ${ _('Any room') }
                </label>
                <input type="radio" id="only_my_rooms" name="is_only_my_rooms" value="true"/>
                <label for="only_my_rooms" class="i-button"
                    title="${ _('Filters bookings of rooms you are taking care of') }">
                    ${ _('My rooms') }
                </label>
            </div>
        </div>
        % endif

        <div class="toolbar thin table">
            <div class="group i-selection">
                <span class="i-button label">
                    ${ _('Type') }
                </span>
                <input type="checkbox" id="is_only_bookings" name="is_only_bookings"/>
                <label for="is_only_bookings" class="i-button"
                    title="${ _('Filters confirmed bookings') }">
                    ${ _('Bookings') }
                </label>
                <input type="checkbox" id="is_only_pre_bookings" name="is_only_pre_bookings"/>
                <label for="is_only_pre_bookings" class="i-button"
                    title="${ _('Filters pre-bookings') }">
                    ${ _('Pre-Bookings') }
                </label>
            </div>
        </div>

        <div class="toolbar thin table">
            <div class="group i-selection">
                <span class="i-button label">
                    ${ _('State') }
                </span>
                <input type="checkbox" id="is_rejected" name="is_rejected"/>
                <label for="is_rejected" class="i-button"
                    title="${ _('Filters rejected bookings') }">
                    ${ _('Rejected') }
                </label>
                <input type="checkbox" id="is_cancelled" name="is_cancelled"/>
                <label for="is_cancelled" class="i-button"
                    title="${ _('Filters cancelled bookings') }">
                    ${ _('Cancelled') }
                </label>
                <input type="checkbox" id="is_archival" name="is_archival"/>
                <label for="is_archival" class="i-button"
                    title="${ _('Filters archived bookings') }">
                    ${ _('Archived') }
                </label>
            </div>
        </div>

        <div class="toolbar thin table">
            <div class="group i-selection">
                <span class="i-button label">
                    ${ _('Services') }
                </span>
                <input type="checkbox" id="uses_video_conference" name="uses_video_conference"/>
                <label for="uses_video_conference" class="i-button"
                    title="${ _('Filters bookings which will use videoconference systems') }">
                    ${ _('Videoconference') }
                </label>
            </div>
        </div>

        <div class="toolbar thin table">
            <div class="group i-selection">
                <span class="i-button label">
                    ${ _('Assistance') }
                </span>
                <input type="checkbox" id="needs_video_conference_setup" name="needs_video_conference_setup"/>
                <label for="needs_video_conference_setup" class="i-button"
                    title="${ _('Filters bookings which requested assistance for the startup of the videoconference session') }">
                    ${ _('Videoconference') }
                </label>
                <input type="checkbox" id="needs_general_assistance" name="needs_general_assistance"/>
                <label for="needs_general_assistance" class="i-button"
                    title="${ _('Filters bookings which requested assistance for the startup of the meeting') }">
                    ${ _('Startup') }
                </label>
            </div>
        </div>
    </div>

    <h2 class="group-title"></h2>
    <input id="submitBtn1" type="submit" class="i-button highlight" value="${ _('Search') }">
</form>
