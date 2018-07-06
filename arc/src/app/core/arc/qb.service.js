(function () {
    angular.module('app.core').service('$qb', function () {
        var _qb = {
            query: function (where, order, limit) {
                return {
                    $type: 'Gfsa.Arc.Api.ArcService.Query, Gfsa.Arc.Api',
                    Where: where || _qb.where.empty(),
                    Order: order || _qb.order.empty(),
                    Limit: limit || _qb.limit.empty(),
                };
            },
            as: {
                boolean: function (value) {
                    return {
                        $type: "Gfsa.Arc.Api.ArcService.BooleanBox, Gfsa.Arc.Api",
                        Value: value,
                    };
                },
                byte: function (value) {
                    return {
                        $type: "Gfsa.Arc.Api.ArcService.ByteBox, Gfsa.Arc.Api",
                        Value: value,
                    };
                },
                char: function (value) {
                    return {
                        $type: "Gfsa.Arc.Api.ArcService.CharBox, Gfsa.Arc.Api",
                        Value: value,
                    };
                },
                dateTime: function (value) {
                    return {
                        $type: "Gfsa.Arc.Api.ArcService.DateTimeBox, Gfsa.Arc.Api",
                        Value: value,
                    };
                },
                decimal: function (value) {
                    return {
                        $type: "Gfsa.Arc.Api.ArcService.DecimalBox, Gfsa.Arc.Api",
                        Value: value,
                    };
                },
                double: function (value) {
                    return {
                        $type: "Gfsa.Arc.Api.ArcService.DoubleBox, Gfsa.Arc.Api",
                        Value: value,
                    };
                },
                guid: function (value) {
                    return {
                        $type: "Gfsa.Arc.Api.ArcService.GuidBox, Gfsa.Arc.Api",
                        Value: value,
                    };
                },
                int16: function (value) {
                    return {
                        $type: "Gfsa.Arc.Api.ArcService.Int16Box, Gfsa.Arc.Api",
                        Value: value,
                    };
                },
                int32: function (value) {
                    return {
                        $type: "Gfsa.Arc.Api.ArcService.Int32Box, Gfsa.Arc.Api",
                        Value: value,
                    };
                },
                int64: function (value) {
                    return {
                        $type: "Gfsa.Arc.Api.ArcService.Int64Box, Gfsa.Arc.Api",
                        Value: value,
                    };
                },
                single: function (value) {
                    return {
                        $type: "Gfsa.Arc.Api.ArcService.SingleBox, Gfsa.Arc.Api",
                        Value: value,
                    };
                },
                string: function (value) {
                    return {
                        $type: "Gfsa.Arc.Api.ArcService.StringBox, Gfsa.Arc.Api",
                        Value: value,
                    };
                },
                timeSpan: function (value) {
                    return {
                        $type: "Gfsa.Arc.Api.ArcService.TimeSpanBox, Gfsa.Arc.Api",
                        Value: value,
                    };
                },
            },
            where: {
                empty: function () {
                    return {
                        $type: "Gfsa.Arc.Api.ArcService.IgnoreWhere, Gfsa.Arc.Api",
                    };
                },
                contains: function (name, value) {
                    return {
                        $type: "Gfsa.Arc.Api.ArcService.ContainsPropertyWhere, Gfsa.Arc.Api",
                        Name: name,
                        Value: value,
                    };
                },
                equalTo: function (name, value) {
                    return {
                        $type: "Gfsa.Arc.Api.ArcService.EqualToPropertyWhere, Gfsa.Arc.Api",
                        Name: name,
                        Value: value,
                    };
                },
                greaterThanEqualTo: function (name, value) {
                    return {
                        $type: "Gfsa.Arc.Api.ArcService.GreaterThanEqualToPropertyWhere, Gfsa.Arc.Api",
                        Name: name,
                        Value: value,
                    };
                },
                greaterThan: function (name, value) {
                    return {
                        $type: "Gfsa.Arc.Api.ArcService.GreaterThanPropertyWhere, Gfsa.Arc.Api",
                        Name: name,
                        Value: value,
                    };
                },
                lessThanEqualTo: function (name, value) {
                    return {
                        $type: "Gfsa.Arc.Api.ArcService.LessThanEqualToPropertyWhere, Gfsa.Arc.Api",
                        Name: name,
                        Value: value,
                    };
                },
                lessThan: function (name, value) {
                    return {
                        $type: "Gfsa.Arc.Api.ArcService.LessThanPropertyWhere, Gfsa.Arc.Api",
                        Name: name,
                        Value: value,
                    };
                },
                all: function (whereSet) {
                    return {
                        $type: "Gfsa.Arc.Api.ArcService.AllCompoundWhere, Gfsa.Arc.Api",
                        WhereSet: whereSet,
                    };
                },
                any: function (whereSet) {
                    return {
                        $type: "Gfsa.Arc.Api.ArcService.AnyCompoundWhere, Gfsa.Arc.Api",
                        WhereSet: whereSet,
                    };
                },
                not: function (where) {
                    return {
                        $type: "Gfsa.Arc.Api.ArcService.NotWhere, Gfsa.Arc.Api",
                        Where: where,
                    };
                },
            },
            order: {
                empty: function () {
                    return {
                        $type: 'Gfsa.Arc.Api.ArcService.IgnoreOrder, Gfsa.Arc.Api',
                    };
                },
                by: function (name, direction) {
                    return {
                        $type: 'Gfsa.Arc.Api.ArcService.PropertyOrder, Gfsa.Arc.Api',
                        Name: name,
                        Direction: direction,
                    };
                },
                byEach: function (orderSet) {
                    return {
                        $type: 'Gfsa.Arc.Api.ArcService.CompoundOrder, Gfsa.Arc.Api',
                        OrderSet: orderSet,
                    };
                },
            },
            limit: {
                empty: function () {
                    return {
                        $type: 'Gfsa.Arc.Api.ArcService.IgnoreLimit, Gfsa.Arc.Api',
                    };
                },
                page: function (index, count) {
                    return {
                        $type: 'Gfsa.Arc.Api.ArcService.PageLimit, Gfsa.Arc.Api',
                        Index: index,
                        Count: count,
                    };
                },
            },
        };
        return _qb;
    });
})();
