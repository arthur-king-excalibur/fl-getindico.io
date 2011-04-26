<a name="css"></a>
<div class="groupItem">
<table class="groupTable">
    <tr>
        <td colspan="2">

            <div class="groupTitle"> ${ _("Stylesheets")}</div>

        </td>
    </tr>

    <tr>
        <td class="dataCaptionTD">
            <span class="dataCaptionFormat">${ _("Currently used stylesheet") }</span>
        </td>
        <td class="blacktext" style="width: 100%">
            % if currentCSSFileName:
                <strong style="margin-right: 30px;">${ currentCSSFileName }</strong>
                <input type="button" class="btn" onclick="window.location = '${ removeCSS }'" value="${ _("Remove stylesheet")}">
            % else:
                <em>${ _("No stylesheet has been applied") }</em>
            % endif
        </td>
    </tr>
    <tr>
        <td class="dataCaptionTD">
            <span class="dataCaptionFormat">${ _("Apply stylesheet") }</span>
        </td>
        <td class="blacktext" style="width: 100%">
            <strong><a href=${ previewURL }>${ _("Click here") }</a></strong>
            ${ _("in order to select one of the default stylesheets") }
        </td>
    </tr>
    <tr>
        <td class="dataCaptionTD">
            <span class="dataCaptionFormat">${ _("Upload your own stylesheet") }</span>
        </td>
        <td class="blacktext" style="width: 100%">
            <em class="description">
                ${ _("If you want to fully customize your conference page you can create your own stylesheet \
                and upload it. An example stylesheet can be downloaded") } <a href="${ Config().getBaseURL() }/css/confTemplates/standard.css">${_("here") }</a>.
            </em>
            <form action="${ saveCSS }" method="POST" ENCTYPE="multipart/form-data" style="margin:0;">
                <input name="file" type="file" onchange="$E('uploadCSSButton').dom.disabled = false;">
                <input id="uploadCSSButton" disabled type="submit" value="${ _("Upload stylesheet")}">
            </form>
        </td>
    </tr>




    <tr>
        <td colspan="2">

            <a name="colors"></a>

            <div class="groupTitle">${ _("Color customization")}</div>
        </td>
    </tr>

    <tr>
        <td class="dataCaptionTD">
            <span class="dataCaptionFormat">${ _("Conference header text color") }</span>
        </td>
        <td class="blacktext" style="width: 100%">
            ${ formatTitleTextColor }
        </td>
    </tr>
    <tr>
        <td class="dataCaptionTD">
            <span class="dataCaptionFormat">${ _("Conference header background color") }</span>
        </td>
        <td class="blacktext" style="width: 100%">
            ${ formatTitleBgColor }
        </td>
    </tr>




    <tr>
        <td colspan="2">
            <a name="logo"></a>

            <div class="groupTitle">${ _("Conference logo")}</div>
        </td>
    </tr>

    <tr>
        <td class="dataCaptionTD">
            <span class="dataCaptionFormat">${ _("Upload a logo") }</span>
        </td>
        <td class="blacktext" style="width: 100%">
            <form action="${ saveLogo }" method="POST" ENCTYPE="multipart/form-data">
                <input name="file" type="file" onchange="$E('uploadLogoButton').dom.disabled = false;">
                <input type="submit" id="uploadLogoButton" disabled value="${ _("Upload logo")}">
            </form>
        </td>
    </tr>
    <tr>
        <td class="dataCaptionTD">
            <span class="dataCaptionFormat">${ _("Preview")}</span>
        </td>
        <td class="blacktext" style="width: 100%">
            ${ logo }${ removeLogo }
        </td>
    </tr>

</table>
</div>
