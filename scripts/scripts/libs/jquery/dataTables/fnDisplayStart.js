$.fn.dataTableExt.oApi.fnDisplayStart = function ( oSettings, iStart, bRedraw )
{
	if ( typeof bRedraw == 'undefined' )
	{
		bRedraw = true;
	}

	oSettings._iDisplayStart = iStart;
	oSettings.oApi._fnCalculateEnd( oSettings );

	if ( bRedraw )
	{
		oSettings.oApi._fnDraw( oSettings );
	}
};