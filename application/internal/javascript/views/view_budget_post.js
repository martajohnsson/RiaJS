// BEROENDEN
// ============================================================
// external/javascript/libs/backbone/backbone.js
// internal/javascript/models/model_budget_post.js
// external/javascript/libs/apprise/apprise.js


// Vy-klass för utskrift av en budgetpost
var view_budget_post = Backbone.View.extend
({
	tagName: 'tr', // Tagg som varje rad/modell kommer skrivas ut i vyn som

	// Skriv ut en rad och ge den rätt färg
	initialize: function()
	{
		this.color = '';
		this.post = this.model.toJSON(); // Anslut gentemot modellen
		
		// Ge en inkomstrad en grön färg
		if (this.post.type == 'Inkomst')
		{
			this.color = 'income';
		}
		// Ge en utgiftsrad en röd färg
		else if (this.post.type == 'Utgift')
		{
			this.color = 'outcome';
		}

		// Skriv ut en rad
		$(this.el).html
		(
			'<td class="' + this.color + '">' + this.post.type + '</td>'
			+ '<td>' + this.post.category + '</td>'
			+ '<td>' + this.post.value + ' kr</td>'
			+ '<td><button class="changeItemValue">Ändra värde</button>'
			+ '<button class="deleteItem">Ta bort</button></td>'
		);
	},

	// Hämta metoder vid händelser som musklick osv
	events: {
		'click .deleteItem': 'deleteItemQuestion',
		'click .changeItemValue': 'changeItemQuestion'
	},

	// Visa en ruta som frågar om användaren är säker på att den vill ta bort en budgetpost
	// innan den tas bort
	deleteItemQuestion: function()
	{
		var thisModel = this;
		var thisPost = this.model;

		apprise('Vill du ta bort budgetposten bestående av <b>' + this.post.category.toLowerCase() + '</b> på <b>' + this.post.value + ' kr</b>', 
		{'verify':true, 'textYes':'Ja', 'textNo':'Nej'}, function(a_removepost)
		{
			if (a_removepost == true)
			{
				thisModel.deleteItem(thisPost);
			}
		});
	},

	// Tar bort en modell och tar bort
	// dess gränssnitt
	deleteItem: function(a_post)
	{
		a_post.destroy();
		$(this.el).remove();
	},

	// Visar en ruta med värdet som ska skrivas in
	// innan värdet ändras
	changeItemQuestion: function()
	{
		var thisModel = this;

		apprise('Skriv in vad du vill ändra värdet på budgetposten bestående av <b>' 
		+ this.post.category.toLowerCase() + '</b> på <b>'  + this.post.value + ' kr</b> till. <br />Och tryck sedan på <b>Spara</b> för att spara detta.'
		+ ' Eller <b>Avbryt</b> för att ha kvar det gamla värdet!', {'input':' ', 'textOk':'Spara', 'textCancel':'Avbryt'}, function(a_changepost)
		{
			if (a_changepost != false)
			{
				thisModel.changeItemValue(a_changepost);
			}
		}	
		);
	},
	
	// Spara ett ändrat värde
	changeItemValue: function(a_value)
	{
		this.model.save({value: a_value});
	}
});