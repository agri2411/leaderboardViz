function f(elem){
    
    a_metadata = [
        {
            "colName": "Seller",
            "colType": "String",
            "colIndex": 0
        },
        {
            "colName": "# Assigned",
            "colType": "Numeric",
            "colIndex": 1
        },
        {
            "colName": "# Sold",
            "colType": "Numeric",
            "colIndex": 2
        },
        {
            "colName": "# Inventory",
            "colType": "Numeric",
            "colIndex": 3
        },
        {
            "colName": "Avg ACV $",
            "colType": "Numeric",
            "colIndex": 4
        },
        {
            "colName": "Avg Sale Price $",
            "colType": "Numeric",
            "colIndex": 5
        },
        {
            "colName": "Avg Seller Fee $",
            "colType": "Numeric",
            "colIndex": 6
        },
        {
            "colName": "Avg Member Revenue $",
            "colType": "Numeric",
            "colIndex": 7
        },
        {
            "colName": "PU W/in 1 Day %",
            "colType": "Numeric",
            "colIndex": 8
        }
    ];
    
    elem.metadata = a_metadata;
    
    var dataE = [];
    var dataH = [];
    var result = elem.resultset;
                $.each(result, function(index, value){
            		dataE.push([
					    value[0],value[1],value[2],value[3],
                        value[4],value[5],value[6],value[7],
                        value[8]
					  ]);
    			});
    var resultHeader = elem.metadata;
                $.each(resultHeader, function(index, value){
                	dataH.push([
					    resultHeader[index].colName
					  ]);
    			});          
     var cols= {columns:dataH};
     var data =$.extend(dataE,cols);
    

processData(data);		

function calculateRanks(columnName, data) {
    var len = data.length,
        i,
        val = undefined,
        prevval = undefined,
        rank,
        rankkey = columnName + '_rank',
        indexkey = columnName + '_index';
    for (i = 0; i < len; i++) {
      val = data[i][columnName];
      if (val != prevval) rank = i + 1;
      data[i][rankkey] = rank;
      data[i][indexkey] = i;
      prevval = val;
    }
  }
  
function processData(csvData)
{
        $('.leaderboardContent').remove();
        $('.leaderboardContentBelow').remove();
		var dataLines = csvData;
        var topN=19;
        var SelClasses2=[];
        var SelClasses = ["selected-1", 
            "selected-2",
             "selected-3",
              "selected-4"];
        
        coloumn_data=dataLines.columns;
    	var leaderboardColumns=coloumn_data.length;
        
		var containerElement=document.createElement('div');
		$(containerElement).addClass('leaderboardContent').css('width',leaderboardColumns*180).appendTo($('#leaderBoardContainer'));
		
		for(var i=0;i<=leaderboardColumns-2;i++)
		{
            column_headers=dataLines.columns;
            
            row_data=dataLines.filter(data => !data.columns);
			var leaderboardColumn=document.createElement('div');
            
			$(leaderboardColumn)
            .addClass('leaderboard-column')
            .appendTo($(containerElement));
			var leaderboardColumnHeader=document.createElement('div');
            
			$(leaderboardColumnHeader).addClass('leaderboard-column-header')
            .html(column_headers[i+1]).appendTo($(leaderboardColumn));
            
			var dataArray=[];
            
			for(var j=0;j<row_data.length;j++)
			{
				dataArray.push({key:row_data[j][0],value:row_data[j][i+1]});
			}
			var sortedArray=dataArray.sort(function(a, b) {
    			return b.value - a.value;
            });
            
            calculateRanks(column_headers, row_data);
            
			Object.keys(sortedArray).forEach(function (key) 
			{ 
				var leaderboard_cell=document.createElement('div');
                var leaderboard_metrics=document.createElement('div');
    			var title=document.createElement('div');
				var rank=document.createElement('div');
				var value=document.createElement('div');

                $(title).addClass('title').html(sortedArray[key].key).appendTo($(leaderboard_cell));
				$(leaderboard_metrics).addClass('metrics').appendTo($(leaderboard_cell));
                $(value).addClass('value').html(addCommas(sortedArray[key].value)).appendTo($(leaderboard_metrics));
                $(rank).addClass('rank').html(ordinal(parseInt(key)+1)).appendTo($(leaderboard_metrics));
				
                if(parseInt(key)>topN)
					$(leaderboard_cell)
                    .addClass('leaderboard-cell cell-out-of-range')
                    .appendTo($(leaderboardColumn));
				else
					$(leaderboard_cell).addClass('leaderboard-cell')
                    .appendTo($(leaderboardColumn));
			 });
		}
        
        var containerElement=document.createElement('div');
    	$(containerElement).addClass('leaderboardContentBelow')
        .css('width',leaderboardColumns*180)
        .html('Below the top 20')
        .appendTo($('#leaderBoardContainer'));
        
		function ranking(num)
		{
			switch (num % 100){
				case 11:
				case 12:
				case 13:
				return num + "th";
			}
			switch (num % 10){
				case 1: return num + "st";
				case 2: return num + "nd";
				case 3: return num + "rd";
			}
			return num + "th";
        }
        function ordinal(_num) {
          var sfx = ["th", "st", "nd", "rd"],
              rem = _num % 100;
          return _num + (sfx[(rem - 20) % 10] || sfx[rem] || sfx[0]);
        };
		$('.leaderboard-cell').mouseover(function(){
    		var cellData=$(".title",this).text();
    		$(".leaderboard-cell").filter(function(){
                if ($(".title",this).text()==cellData) 
                    $(this).addClass('hovered');
            	});		
		});
		$('.leaderboard-cell').mouseout(function(){
			$('.selected').each(function(){$('.rank',this).show();});
			$(".leaderboard-cell").each(function(){
				$(this).removeClass('hovered');
			});
		});
		$('.leaderboard-cell').on('click',function(){
    		$(".leaderboard-cell").each(function(){
    		    $(this).removeClass('selected');
    		});
			var cellData=$(".title",this).text();
			$(".leaderboard-cell").filter(function(){
				if ($(".title",this).text()==cellData) 
				 $(this).addClass('selected');
			});
            
        });

  
  
}

} 
