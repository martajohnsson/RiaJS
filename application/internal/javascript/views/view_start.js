// BEROENDEN
// ============================================================
// external/javascript/libs/backbone/backbone.js
// internal/javascript/views/view_budget_post.js
// internal/javascript/collections/collection_budget_posts.js
// internal/javascript/models/model_budget_post.js

// NOTE: Egentligen skulle denna fil vara uppdelad i tre klasser (fÃ¶r formulÃ¤r, diagram och tabell)
// men pÃ¥grund av tidsbrist sÃ¥ skippas det fÃ¶r den hÃ¤r gÃ¥ngen. Filerna (tomma!) ligger dock i
// katalogen unused


// Vy-klassen som ritar ut det huvudsakliga grÃ¤nssnittet
var view_start = Backbone.View.extend
({
	// AnvÃ¤nd den enda mallen som finns i applikationen, hÃ¤mta in de lagrade modellerna
	// samt bind hÃ¤ndelser fÃ¶r Ã¤ndring/borttagning av modeller till metoder i den hÃ¤r klassen
	initialize: function(a_placeholder, a_collection)
	{
		this.template = _.template($('#start').html());
		this.collection_budget_posts = a_collection;
		this.collection_budget_posts.on('destroy', this.fillDiagram, this);
		this.collection_budget_posts.on('change', this.render, this);
	},

	// Lyssna till hÃ¤ndelser i denna klass och kÃ¶r metoder
	// baserat pÃ¥ musklick osv
	events: {
    	'click #send_post': 'addBudgetPost',
  	},

	// Rendera mallen, skriv ut budgetposterna och fyll diagrammet med data
	render: function()
	{
		$(this.el).html(this.template);
		this.collection_budget_posts.each(this.addSingleItem);
		this.fillDiagram();
	},

	// LÃ¤gg till en budgetpost genom att hÃ¤mta kategori (kategori och typ) samt
	// vÃ¤rde frÃ¥n grÃ¤nssnittet
	addBudgetPost: function()
	{
		// HÃ¤mta kategorin frÃ¥n den text du ser i grÃ¤nssnittet fÃ¶r <select>-elementet
		this.select_category = $('#select_category :selected').text();

		// HÃ¤mta typen (inkomst/utgift) frÃ¥n value-vÃ¤rdet fÃ¶r den markerade raden i <select>-elementet
		this.select_type = $('#select_category').val();

		// HÃ¤mta vÃ¤rdet i siffror frÃ¥n det andra fÃ¤ltet
		this.input_value = $('#input_value').val();

		if (this.select_category != '' && this.input_value != '')
		{	
			// Skapa en ny modell med all data som ska finnas i den
			var model = new model_budget_post
			({
				category: this.select_category,
				type: this.select_type,
				value: this.input_value
			});
            
            if ( model.isValid() ) {
    			//LÃ¤gg till en ny modell till lagringen (localstorage)
    			this.collection_budget_posts.add(model);
    
    			// Spara modellen tills den tas bort/rensas etc
    			model.save();
    			
                // Rensa kategori och vÃ¤rde frÃ¥n synligt innehÃ¥ll
                this.$('#select_category').val('');
                this.$('#input_value').val('');
            } else {
                apprise('Du måste ange en summa som är större än 0!');
                model.destroy();
            }
		}
		else
		{
			apprise('Du måste fylla i samtliga fält!');
		}
	},
	
	// Skriv ut diagrammet
	drawDiagram: function(a_incomes, a_outcomes)
	{
		// Skriv ut inkomster och utgifter i ett cirkeldiagram
		this.outputDiagram = new Bluff.Pie('income_outcome_graph', '600x300');

		// LÃ¥t cirkeldiagrammet fÃ¥ ett speciellt tema med fÃ¤rger
		this.outputDiagram.set_theme
		({
	    	marker_color: '#000000',
	    	font_color: '#000000',
	    	background_colors: ['#ffffff', '#ffffff']
	  	});
	
		// Skriv ut inkomster i en grÃ¶n fÃ¤rg
	    this.outputDiagram.data('Inkomster', [parseInt(a_incomes)], '#00ff00');

		// Skriv ut utgifter i en rÃ¶d fÃ¤rg
	    this.outputDiagram.data('Utgifter', [parseInt(a_outcomes)], '#ff0000');
	
		// Rita ut diagrammet
	    this.outputDiagram.draw();
	},

	// LÃ¤gg till en budgetpost till grÃ¤nssnittet
	addSingleItem: function(a_post)
	{
		$('#budgetItems').append(new view_budget_post({model: a_post}).el);
	},
	
	// Fyll diagrammet med data
	fillDiagram: function()
	{
		incomes = 0;
		outcomes = 0;

		// DÃ¶lj titlarna fÃ¶r hur mycket pengar man har kvar osv
		if (this.collection_budget_posts.length == 0)
		{
			this.$('#budgetOutput').hide();
		}
		else
		{
			this.$('#budgetOutput').show();
		}

		// RÃ¤kna hur mycket inkomster och utgifter det finns
		this.collection_budget_posts.each(function(a_post)
		{
			post = a_post.toJSON();
		
			if (post.type == 'Inkomst')
			{
				incomes += parseInt(post.value); // RÃ¤kna totalt antal inkomster
			}
			else if (post.type == 'Utgift')
			{
				outcomes += parseInt(post.value); // RÃ¤kna totalt antal utgifter
			}
		});

		// Om det finns inkomster/utgifter, visa titlar fÃ¶r hur mycket pengar det finns kvar osv
		if (incomes != 0 || outcomes != 0)
		{
			$('#budgetSummaryIncomePlaceholder').show();
			$('#budgetSummaryIncome').html((parseInt(incomes) - parseInt(outcomes)) + ' kr');

			$('#budgetSummaryOutcomePlaceholder').show();
			$('#budgetSummaryOutcome').html(parseInt(outcomes) + ' kr');
		}
		// Om det inte finns inkomster/utgifter, dÃ¶lj titlar fÃ¶r hur mycket pengar det finns kvar osv
		else
		{
			$('#budgetSummaryIncomePlaceholder').hide();
			$('#budgetSummaryIncome').html('');

			$('#budgetSummaryOutcomePlaceholder').hide();
			$('#budgetSummaryOutcome').html('');
		}

		// Kalla pÃ¥ metoden som ritar ut diagrammet
		this.drawDiagram(incomes, outcomes);
	}
});