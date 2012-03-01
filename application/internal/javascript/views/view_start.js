// Vy-klassen som ritar ut det huvudsakliga gränssnittet
var view_start = Backbone.View.extend
({
	// Använd den enda mallen som finns i applikationen, hämta in de lagrade modellerna
	// samt bind händelser för ändring/borttagning av modeller till metoder i den här klassen
	initialize: function(a_placeholder, a_collection)
	{
		this.template = _.template($('#start').html());
		this.collection_budget_posts = a_collection;
		this.collection_budget_posts.on('destroy', this.fillDiagram, this);
		this.collection_budget_posts.on('change', this.render, this);
	},

	// Lyssna till händelser i denna klass och kör metoder
	// baserat på musklick osv
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

	// Lägg till en budgetpost genom att hämta kategori (kategori och typ) samt
	// värde från gränssnittet
	addBudgetPost: function()
	{
		// Hämta kategorin från den text du ser i gränssnittet för <select>-elementet
		this.select_category = $('#select_category :selected').text();

		// Hämta typen (inkomst/utgift) från value-värdet för den markerade raden i <select>-elementet
		this.select_type = $('#select_category').val();

		// Hämta värdet i siffror från det andra fältet
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

			//Lägg till en ny modell till lagringen (localstorage)
			this.collection_budget_posts.add(model);

			// Spara modellen tills den tas bort/rensas etc
			model.save();
	
			// Rensa kategori och värde från synligt innehåll
			this.$('#select_category').val('');
			this.$('#input_value').val('');

			// Kalla på metoden för att skriva ut en budgetpost i gränssnittet
			this.addSingleItem(model);

			// Uppdatera det huvudsakliga gränssnittet
			this.render();
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

		// Låt cirkeldiagrammet få ett speciellt tema med färger
		this.outputDiagram.set_theme
		({
	    	marker_color: '#000000',
	    	font_color: '#000000',
	    	background_colors: ['#ffffff', '#ffffff']
	  	});
	
		// Skriv ut inkomster i en grön färg
	    this.outputDiagram.data('Inkomster', [parseInt(a_incomes)], '#00ff00');

		// Skriv ut utgifter i en röd färg
	    this.outputDiagram.data('Utgifter', [parseInt(a_outcomes)], '#ff0000');
	
		// Rita ut diagrammet
	    this.outputDiagram.draw();
	},

	// Lägg till en budgetpost till gränssnittet
	addSingleItem: function(a_post)
	{
		$('#budgetItems').append(new view_budget_post({model: a_post}).el);
	},
	
	// Fyll diagrammet med data
	fillDiagram: function()
	{
		incomes = 0;
		outcomes = 0;

		// Dölj titlarna för hur mycket pengar man har kvar osv
		if (this.collection_budget_posts.length == 0)
		{
			this.$('#budgetOutput').hide();
		}
		else
		{
			this.$('#budgetOutput').show();
		}

		// Räkna hur mycket inkomster och utgifter det finns
		this.collection_budget_posts.each(function(a_post)
		{
			post = a_post.toJSON();
		
			if (post.type == 'Inkomst')
			{
				incomes += parseInt(post.value); // Räkna totalt antal inkomster
			}
			else if (post.type == 'Utgift')
			{
				outcomes += parseInt(post.value); // Räkna totalt antal utgifter
			}
		});

		// Om det finns inkomster/utgifter, visa titlar för hur mycket pengar det finns kvar osv
		if (incomes != 0 || outcomes != 0)
		{
			$('#budgetSummaryIncomePlaceholder').show();
			$('#budgetSummaryIncome').html((parseInt(incomes) - parseInt(outcomes)) + ' kr');

			$('#budgetSummaryOutcomePlaceholder').show();
			$('#budgetSummaryOutcome').html(parseInt(outcomes) + ' kr');
		}
		// Om det inte finns inkomster/utgifter, dölj titlar för hur mycket pengar det finns kvar osv
		else
		{
			$('#budgetSummaryIncomePlaceholder').hide();
			$('#budgetSummaryIncome').html('');

			$('#budgetSummaryOutcomePlaceholder').hide();
			$('#budgetSummaryOutcome').html('');
		}

		// Kalla på metoden som ritar ut diagrammet
		this.drawDiagram(incomes, outcomes);
	}
});