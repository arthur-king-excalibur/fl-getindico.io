

<div id="UIMiniSearchBox" class="confSearchBox">
<form class="UIForm" method="GET" action="%(searchAction)s" id="searchBoxForm" style="margin: 0; padding: 0;">
    <input class="searchButton" type="submit" value="<%= _('Search') %>" />
	<input type="text" id="searchText" name="p" class="searchField" />
	<input type="hidden" name="confId" value="%(targetId)s"/>
    <input type="hidden" name="collections" value="Contributions"/>
</form>
</div>
