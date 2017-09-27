/* This file is part of Indico.
 * Copyright (C) 2002 - 2017 European Organization for Nuclear Research (CERN).
 *
 * Indico is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License as
 * published by the Free Software Foundation; either version 3 of the
 * License, or (at your option) any later version.
 *
 * Indico is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Indico; if not, see <http://www.gnu.org/licenses/>.
 */


(function() {
    'use strict';

    $(document).ready(function() {
        setupToggle();
        setupButtons();
    });

    function setupToggle() {
        var $roles = $('#event-roles');
        $roles.on('click', '.toggle-members', function() {
            var $row = $(this).closest('tr').next('tr').find('.slide');
            $row[0].style.maxHeight = $row[0].scrollHeight + "px";
            $row.toggleClass('open close');
        });

        $roles.on('indico:htmlUpdated', function() {
            var $slide = $(this).find('.slide');
            $slide.each(function() {
                $(this)[0].style.maxHeight =  $(this)[0].scrollHeight + "px";
            });
        });
    }

    function setupButtons() {
        $('#event-roles').on('click', '.js-add-members', function(evt) {
            var $this = $(this);
            evt.stopPropagation();
            $('<div>').principalfield({
                multiChoice: true,
                onAdd: function(users) {
                    $.ajax({
                        url: $this.data('href'),
                        method: $this.data('method'),
                        data: JSON.stringify({'users': users}),
                        dataType: 'json',
                        contentType: 'application/json',
                        error: handleAjaxError,
                        complete: IndicoUI.Dialogs.Util.progress(),
                        success: function(data) {
                            updateHtml($this.data('update'), data);
                        }
                    });
                }
            }).principalfield('choose');
        });
    }
})(window);

