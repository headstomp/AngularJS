(function () {
    
    'use strict';
    
    (function () {
        
        window.WhereFactory = (function () {
            function WhereFactory() { 
                // TODO: initialization
            };
            WhereFactory.prototype.compoundAll = function (whereSet) {
                return { '$type': 'ProjectPlasma.Data.AllCompoundWhere, ProjectPlasma.Data', WhereSet: whereSet };
            };
            WhereFactory.prototype.compoundAny = function (whereSet) {
                return { '$type': 'ProjectPlasma.Data.AnyCompoundWhere, ProjectPlasma.Data', WhereSet: whereSet };
            };
            WhereFactory.prototype.not = function (where) {
                return { '$type': 'ProjectPlasma.Data.NotWhere, ProjectPlasma.Data', Where: where };
            };
            WhereFactory.prototype.propertyEqualTo = function (name, value) {
                return { '$type': 'ProjectPlasma.Data.EqualToPropertyWhere, ProjectPlasma.Data', Name: name, Value: value };
            };
            WhereFactory.prototype.propertyGreaterThanEqualTo = function (name, value) {
                return { '$type': 'ProjectPlasma.Data.GreaterThanEqualToPropertyWhere, ProjectPlasma.Data', Name: name, Value: value };
            };
            WhereFactory.prototype.propertyGreaterThan = function (name, value) {
                return { '$type': 'ProjectPlasma.Data.GreaterThanPropertyWhere, ProjectPlasma.Data', Name: name, Value: value };
            };
            WhereFactory.prototype.propertyLessThanEqualTo = function (name, value) {
                return { '$type': 'ProjectPlasma.Data.LessThanEqualToPropertyWhere, ProjectPlasma.Data', Name: name, Value: value };
            };
            WhereFactory.prototype.propertyLessThan = function (name, value) {
                return { '$type': 'ProjectPlasma.Data.LessThanPropertyWhere, ProjectPlasma.Data', Name: name, Value: value };
            };
            return WhereFactory;
        })();
        
        window.OrderFactory = (function () {
            function OrderFactory() { 
                // TODO: initialization
            };
            OrderFactory.prototype.property = function (name, direction) {
                return { '$type': 'ProjectPlasma.Data.PropertyOrder, ProjectPlasma.Data', Name: name, Direction: direction };
            };
            OrderFactory.prototype.compound = function (orderSet) {
                return { '$type': 'ProjectPlasma.Data.CompoundOrder, ProjectPlasma.Data', OrderSet: orderSet };
            };
            return OrderFactory;
        })();
        
        window.LimitFactory = (function () {
            function LimitFactory() { 
                // TODO: initialization
            };
            LimitFactory.prototype.page = function (index, count) {
                return { '$type': 'ProjectPlasma.Data.PageLimit, ProjectPlasma.Data', Index: index, Count: count };
            };
            return LimitFactory;
        })();
        
        window.ApiFilterBuilder = (function () {
            function ApiFilterBuilder() { 
                this.apiFilter = new ApiFilter();
            };
            ApiFilterBuilder.prototype.where = function(callback) {
                var whereFactory = new WhereFactory();
                var where = callback(whereFactory);
                this.apiFilter.setWhere(where);
                return this;
            };
            ApiFilterBuilder.prototype.order = function(callback) {
                var orderFactory = new OrderFactory();
                var order = callback(orderFactory);
                this.apiFilter.setOrder(order);
                return this;
            };
            ApiFilterBuilder.prototype.limit = function(callback) {
                var limitFactory = new LimitFactory();
                var limit = callback(limitFactory);
                this.apiFilter.setLimit(limit);
                return this;
            };
            ApiFilterBuilder.prototype.getApiFilter = function() {
                return this.apiFilter;
            };
            return ApiFilterBuilder;
        })();
        
        window.ApiFilter = (function () {
            function ApiFilter() {
                this.where = {};
                this.order = {};
                this.limit = {};
            };
            ApiFilter.prototype.setWhere = function(where) {
                this.where = where;
            };
            ApiFilter.prototype.setOrder = function(order) {
                this.order = order;
            };
            ApiFilter.prototype.setLimit = function(limit) {
                this.limit = limit;
            };
            return ApiFilter;
        })();
            
    })();    

    angular
        .module('app.core')
        .service('apiFilterBuilderService', function () {
            return {
                createApiFilterBuilder: function () {
                    return new ApiFilterBuilder();
                },
            };
        });
})();
