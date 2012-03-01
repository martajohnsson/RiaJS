// BEROENDEN
// ============================================================
// external/javascript/libs/backbone/backbone.js
// internal/javascript/views/view_start.js


// Router-klass för att kunna skicka användaren till
// rätt plats i applikationen
var router_master = Backbone.Router.extend
({
	placeholder: '#basePlaceholder', // Den enda platshållaren i html-dokumentet
	cached_views: {}, // Håller alla vyer

	// Skicka användaren till rätt plats
	// baserat på URL:en: http://url/#start
	routes: {
    	'': 				'start',
		'about':			'about'
  	},

	// Rensa vyn innan det laddas in en ny
	clearView: function() 
	{
		$(this.placeholder).empty();
	},

	// Hämtar alla sparade modeller från localstorage
	// och visar dem i gränssnittet osv
	initialize: function()
	{
		this.collection_budget_posts = new collection_budget_posts();
		this.collection_budget_posts.fetch();

		this.view_start = new view_start({el: $(this.placeholder)}, this.collection_budget_posts);
        this.cached_views.view_start = this.view_start;

		// Instansiera även en about-vy och lagra
		this.view_about = new view_about({el: $(this.placeholder)});
		this.cached_views.view_about = this.view_about;
	},

	// Rendera huvudgränssnittet för hela applikationen
	start: function()
	{
		this.clearView();
		this.cached_views.view_start.render();
	},

	// Rendera en about-info vy om applikationen
	about: function()
	{
		this.clearView();
		this.cached_views.view_about.render();
	}
});