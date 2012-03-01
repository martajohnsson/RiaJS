// BEROENDEN
// ============================================================
// external/javascript/libs/backbone/backbone.js
// external/javascript/libs/backbone/backbone.localStorage.js


// Collection-klass för sparandet/uppdaterandet/inläggningen av modeller
// till lagringen iform av localstorage
var collection_budget_posts = Backbone.Collection.extend
({
	localStorage: new Store("budgetitems")
});