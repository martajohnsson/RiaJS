// Vy-klass för utskrift av about-info från 
// en vald mall (template)
var view_about = Backbone.View.extend
({
	initialize: function()
	{
		this.template = _.template($('#about').html());
	},

	render: function()
	{
		$(this.el).html(this.template);
	}
});