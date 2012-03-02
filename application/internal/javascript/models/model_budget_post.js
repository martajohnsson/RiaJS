// BEROENDEN
// ============================================================
// external/javascript/libs/backbone/backbone.js


// Model-klass för hantering av en budgetpost
var model_budget_post = Backbone.Model.extend({
    validate: function(attrs) {
        if (attrs.value < 0 || isNaN(parseFloat(attrs.value))) {
          return "must be a number and bigger than 0";
        }
    }
});