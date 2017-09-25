
599 > $(window).width() ? $(".intro-sidebar").html("Datensätze anzeigen.") : $(".intro-sidebar").html("Hier können Sie sich verschiedene Datensätze anzeigen lassen, um interaktiv die Daten zu den Vogelkollisionen zu erkunden.");

$("#start-btn").on("click", function () {
    $("#intro").outerHeight(!0);
    $("#intro").css("top", "100%");
    $("#sidebar").css("left", "50px");
    $("#overlay").fadeOut(1E3);
});

// Construct a bounding box for this map that the user cannot
// move out of
var southWest = L.latLng(47.2703, 5.8667);
var northEast = L.latLng(55.0585, 15.0419);
var maxBounds = L.latLngBounds(southWest, northEast);

var map = L.map('map', {
    bounds: maxBounds,
    maxBounds: maxBounds,
    minZoom: 6,
    maxZoom: 18
}).setView([51.18, 9.26], 6);

var osm = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
}).addTo(map);

var satellite = L.gridLayer.googleMutant({
    type: 'hybrid', // valid values are 'roadmap', 'satellite', 'terrain' and 'hybrid'
    attribution: 'map application by <a href="https://www.nabu.de" target=_blank>NABU</a>'
});

L.Mask = L.Polygon.extend({
    options: {
        stroke: false,
        color: '#333',
        fillOpacity: 0.5,
        clickable: true,

        outerBounds: new L.LatLngBounds([-90, -360], [90, 360])
    },

    initialize: function (latLngs, options) {

        var outerBoundsLatLngs = [
            this.options.outerBounds.getSouthWest(),
            this.options.outerBounds.getNorthWest(),
            this.options.outerBounds.getNorthEast(),
            this.options.outerBounds.getSouthEast()
        ];
        L.Polygon.prototype.initialize.call(this, [outerBoundsLatLngs, latLngs], options);
    },

});

L.mask = function (latLngs, options) {
    return new L.Mask(latLngs, options);
};

var tk25 = [{ "lat": 47.3992, "lng": 12.8318 }, { "lat": 47.4991, "lng": 12.8318 }, { "lat": 47.4991, "lng": 12.6651 }, { "lat": 47.5991, "lng": 12.6651 }, { "lat": 47.5991, "lng": 12.4985 }, { "lat": 47.5991, "lng": 12.3319 }, { "lat": 47.5991, "lng": 12.1652 }, { "lat": 47.5991, "lng": 11.9986 }, { "lat": 47.5991, "lng": 11.8319 }, { "lat": 47.5991, "lng": 11.6653 }, { "lat": 47.4991, "lng": 11.6653 }, { "lat": 47.4991, "lng": 11.4986 }, { "lat": 47.3992, "lng": 11.4986 }, { "lat": 47.3991, "lng": 11.332 }, { "lat": 47.3991, "lng": 11.1653 }, { "lat": 47.3991, "lng": 10.9987 }, { "lat": 47.3991, "lng": 10.8321 }, { "lat": 47.4991, "lng": 10.8321 }, { "lat": 47.4991, "lng": 10.6654 }, { "lat": 47.4991, "lng": 10.4988 }, { "lat": 47.3991, "lng": 10.4988 }, { "lat": 47.2992, "lng": 10.4988 }, { "lat": 47.2992, "lng": 10.3321 }, { "lat": 47.1992, "lng": 10.3321 }, { "lat": 47.1992, "lng": 10.1655 }, { "lat": 47.2992, "lng": 10.1655 }, { "lat": 47.2992, "lng": 9.9988 }, { "lat": 47.3991, "lng": 9.9988 }, { "lat": 47.4991, "lng": 9.9988 }, { "lat": 47.4991, "lng": 9.8322 }, { "lat": 47.4991, "lng": 9.6655 }, { "lat": 47.4991, "lng": 9.4989 }, { "lat": 47.5991, "lng": 9.4989 }, { "lat": 47.5991, "lng": 9.3323 }, { "lat": 47.5991, "lng": 9.1656 }, { "lat": 47.5991, "lng": 8.999 }, { "lat": 47.5991, "lng": 8.8323 }, { "lat": 47.5991, "lng": 8.6657 }, { "lat": 47.4991, "lng": 8.6657 }, { "lat": 47.4991, "lng": 8.499 }, { "lat": 47.4991, "lng": 8.3324 }, { "lat": 47.4991, "lng": 8.1658 }, { "lat": 47.4991, "lng": 7.9991 }, { "lat": 47.4991, "lng": 7.8325 }, { "lat": 47.4991, "lng": 7.6658 }, { "lat": 47.4991, "lng": 7.4992 }, { "lat": 47.5991, "lng": 7.4992 }, { "lat": 47.6991, "lng": 7.4992 }, { "lat": 47.7991, "lng": 7.4992 }, { "lat": 47.8991, "lng": 7.4992 }, { "lat": 47.9991, "lng": 7.4992 }, { "lat": 48.0991, "lng": 7.4992 }, { "lat": 48.199, "lng": 7.4992 }, { "lat": 48.299, "lng": 7.4992 }, { "lat": 48.299, "lng": 7.6658 }, { "lat": 48.399, "lng": 7.6658 }, { "lat": 48.499, "lng": 7.6658 }, { "lat": 48.599, "lng": 7.6658 }, { "lat": 48.699, "lng": 7.6658 }, { "lat": 48.699, "lng": 7.8325 }, { "lat": 48.799, "lng": 7.8325 }, { "lat": 48.799, "lng": 7.9991 }, { "lat": 48.899, "lng": 7.9991 }, { "lat": 48.999, "lng": 7.9991 }, { "lat": 48.999, "lng": 7.8325 }, { "lat": 48.999, "lng": 7.6658 }, { "lat": 48.999, "lng": 7.4992 }, { "lat": 49.0989, "lng": 7.4992 }, { "lat": 49.0989, "lng": 7.3325 }, { "lat": 49.0989, "lng": 7.1659 }, { "lat": 49.0989, "lng": 6.9992 }, { "lat": 49.0989, "lng": 6.8326 }, { "lat": 49.0989, "lng": 6.666 }, { "lat": 49.1989, "lng": 6.666 }, { "lat": 49.1989, "lng": 6.4993 }, { "lat": 49.2989, "lng": 6.4993 }, { "lat": 49.3989, "lng": 6.4993 }, { "lat": 49.3989, "lng": 6.3327 }, { "lat": 49.4989, "lng": 6.3327 }, { "lat": 49.5989, "lng": 6.3327 }, { "lat": 49.6989, "lng": 6.3327 }, { "lat": 49.7989, "lng": 6.3327 }, { "lat": 49.7989, "lng": 6.166 }, { "lat": 49.8989, "lng": 6.166 }, { "lat": 49.8989, "lng": 5.9994 }, { "lat": 49.9988, "lng": 5.9994 }, { "lat": 50.0988, "lng": 5.9994 }, { "lat": 50.1988, "lng": 5.9994 }, { "lat": 50.1988, "lng": 6.166 }, { "lat": 50.2988, "lng": 6.166 }, { "lat": 50.3988, "lng": 6.166 }, { "lat": 50.3988, "lng": 6.3327 }, { "lat": 50.4988, "lng": 6.3327 }, { "lat": 50.4988, "lng": 6.166 }, { "lat": 50.5988, "lng": 6.166 }, { "lat": 50.6988, "lng": 6.166 }, { "lat": 50.6988, "lng": 5.9994 }, { "lat": 50.7988, "lng": 5.9994 }, { "lat": 50.8987, "lng": 5.9994 }, { "lat": 50.8987, "lng": 5.8327 }, { "lat": 50.9987, "lng": 5.8327 }, { "lat": 51.0987, "lng": 5.8327 }, { "lat": 51.0987, "lng": 5.9994 }, { "lat": 51.1987, "lng": 5.9994 }, { "lat": 51.2987, "lng": 5.9994 }, { "lat": 51.2987, "lng": 6.166 }, { "lat": 51.3987, "lng": 6.166 }, { "lat": 51.4987, "lng": 6.166 }, { "lat": 51.4987, "lng": 5.9994 }, { "lat": 51.5987, "lng": 5.9994 }, { "lat": 51.6987, "lng": 5.9994 }, { "lat": 51.6987, "lng": 5.8327 }, { "lat": 51.7986, "lng": 5.8327 }, { "lat": 51.8986, "lng": 5.8327 }, { "lat": 51.8986, "lng": 5.9994 }, { "lat": 51.8986, "lng": 6.166 }, { "lat": 51.8986, "lng": 6.3327 }, { "lat": 51.8986, "lng": 6.4993 }, { "lat": 51.8986, "lng": 6.6659 }, { "lat": 51.9986, "lng": 6.6659 }, { "lat": 52.0986, "lng": 6.6659 }, { "lat": 52.0986, "lng": 6.8326 }, { "lat": 52.1986, "lng": 6.8326 }, { "lat": 52.1986, "lng": 6.9992 }, { "lat": 52.2986, "lng": 6.9992 }, { "lat": 52.3986, "lng": 6.9992 }, { "lat": 52.3986, "lng": 6.8326 }, { "lat": 52.3986, "lng": 6.6659 }, { "lat": 52.4986, "lng": 6.6659 }, { "lat": 52.5986, "lng": 6.6659 }, { "lat": 52.6985, "lng": 6.6659 }, { "lat": 52.6985, "lng": 6.8326 }, { "lat": 52.6985, "lng": 6.9992 }, { "lat": 52.7985, "lng": 6.9992 }, { "lat": 52.8985, "lng": 6.9992 }, { "lat": 52.8985, "lng": 7.1659 }, { "lat": 52.9985, "lng": 7.1659 }, { "lat": 53.0985, "lng": 7.1659 }, { "lat": 53.1985, "lng": 7.1659 }, { "lat": 53.2985, "lng": 7.1659 }, { "lat": 53.2985, "lng": 6.9992 }, { "lat": 53.3985, "lng": 6.9992 }, { "lat": 53.4985, "lng": 6.9992 }, { "lat": 53.4985, "lng": 6.8326 }, { "lat": 53.4985, "lng": 6.6659 }, { "lat": 53.5984, "lng": 6.6659 }, { "lat": 53.6984, "lng": 6.6659 }, { "lat": 53.6984, "lng": 6.8326 }, { "lat": 53.6984, "lng": 6.9992 }, { "lat": 53.7984, "lng": 6.9992 }, { "lat": 53.7984, "lng": 7.1659 }, { "lat": 53.7984, "lng": 7.3325 }, { "lat": 53.7984, "lng": 7.4991 }, { "lat": 53.7984, "lng": 7.6658 }, { "lat": 53.7984, "lng": 7.8324 }, { "lat": 53.7984, "lng": 7.9991 }, { "lat": 53.7984, "lng": 8.1657 }, { "lat": 53.6984, "lng": 8.1657 }, { "lat": 53.6984, "lng": 8.3324 }, { "lat": 53.7984, "lng": 8.3324 }, { "lat": 53.8984, "lng": 8.3324 }, { "lat": 53.9984, "lng": 8.3324 }, { "lat": 53.9984, "lng": 8.499 }, { "lat": 53.9984, "lng": 8.6656 }, { "lat": 54.0984, "lng": 8.6656 }, { "lat": 54.1984, "lng": 8.6656 }, { "lat": 54.1984, "lng": 8.499 }, { "lat": 54.2984, "lng": 8.499 }, { "lat": 54.3984, "lng": 8.499 }, { "lat": 54.3984, "lng": 8.3323 }, { "lat": 54.4983, "lng": 8.3323 }, { "lat": 54.5983, "lng": 8.3323 }, { "lat": 54.5983, "lng": 8.1657 }, { "lat": 54.6983, "lng": 8.1657 }, { "lat": 54.7983, "lng": 8.1657 }, { "lat": 54.8983, "lng": 8.1657 }, { "lat": 54.9983, "lng": 8.1657 }, { "lat": 54.9983, "lng": 8.3323 }, { "lat": 55.0983, "lng": 8.3323 }, { "lat": 55.0983, "lng": 8.499 }, { "lat": 54.9983, "lng": 8.499 }, { "lat": 54.9983, "lng": 8.6656 }, { "lat": 54.9983, "lng": 8.8323 }, { "lat": 54.9983, "lng": 8.9989 }, { "lat": 54.8983, "lng": 8.9989 }, { "lat": 54.8983, "lng": 9.1655 }, { "lat": 54.8983, "lng": 9.3322 }, { "lat": 54.8983, "lng": 9.4988 }, { "lat": 54.8983, "lng": 9.6655 }, { "lat": 54.8983, "lng": 9.8321 }, { "lat": 54.7983, "lng": 9.8321 }, { "lat": 54.7983, "lng": 9.9987 }, { "lat": 54.6983, "lng": 9.9987 }, { "lat": 54.6983, "lng": 10.1654 }, { "lat": 54.5983, "lng": 10.1654 }, { "lat": 54.4984, "lng": 10.1654 }, { "lat": 54.4984, "lng": 10.332 }, { "lat": 54.4984, "lng": 10.4987 }, { "lat": 54.3984, "lng": 10.4987 }, { "lat": 54.3984, "lng": 10.6653 }, { "lat": 54.3984, "lng": 10.832 }, { "lat": 54.3984, "lng": 10.9986 }, { "lat": 54.4984, "lng": 10.9986 }, { "lat": 54.5984, "lng": 10.9986 }, { "lat": 54.5984, "lng": 11.1652 }, { "lat": 54.5984, "lng": 11.3319 }, { "lat": 54.4984, "lng": 11.3319 }, { "lat": 54.3984, "lng": 11.3319 }, { "lat": 54.3984, "lng": 11.1652 }, { "lat": 54.2984, "lng": 11.1652 }, { "lat": 54.1984, "lng": 11.1652 }, { "lat": 54.0984, "lng": 11.1652 }, { "lat": 54.0984, "lng": 11.3319 }, { "lat": 54.0984, "lng": 11.4985 }, { "lat": 54.1984, "lng": 11.4985 }, { "lat": 54.1984, "lng": 11.6652 }, { "lat": 54.1984, "lng": 11.8318 }, { "lat": 54.1984, "lng": 11.9984 }, { "lat": 54.1984, "lng": 12.1651 }, { "lat": 54.2984, "lng": 12.1651 }, { "lat": 54.2984, "lng": 12.3317 }, { "lat": 54.3984, "lng": 12.3317 }, { "lat": 54.4984, "lng": 12.3317 }, { "lat": 54.4984, "lng": 12.4984 }, { "lat": 54.4984, "lng": 12.665 }, { "lat": 54.4984, "lng": 12.8316 }, { "lat": 54.4984, "lng": 12.9983 }, { "lat": 54.5984, "lng": 12.9983 }, { "lat": 54.5984, "lng": 13.1649 }, { "lat": 54.6984, "lng": 13.1649 }, { "lat": 54.6984, "lng": 13.3316 }, { "lat": 54.6984, "lng": 13.4982 }, { "lat": 54.5984, "lng": 13.4982 }, { "lat": 54.5984, "lng": 13.6648 }, { "lat": 54.4984, "lng": 13.6648 }, { "lat": 54.3984, "lng": 13.6648 }, { "lat": 54.3984, "lng": 13.8315 }, { "lat": 54.2984, "lng": 13.8315 }, { "lat": 54.2984, "lng": 13.9981 }, { "lat": 54.1984, "lng": 13.9981 }, { "lat": 54.0984, "lng": 13.9981 }, { "lat": 54.0984, "lng": 14.1648 }, { "lat": 53.9984, "lng": 14.1648 }, { "lat": 53.9984, "lng": 14.3314 }, { "lat": 53.8985, "lng": 14.3314 }, { "lat": 53.7985, "lng": 14.3314 }, { "lat": 53.6985, "lng": 14.3314 }, { "lat": 53.5985, "lng": 14.3314 }, { "lat": 53.4985, "lng": 14.3314 }, { "lat": 53.4985, "lng": 14.4981 }, { "lat": 53.3985, "lng": 14.4981 }, { "lat": 53.2985, "lng": 14.4981 }, { "lat": 53.1985, "lng": 14.4981 }, { "lat": 53.0985, "lng": 14.4981 }, { "lat": 52.9986, "lng": 14.4981 }, { "lat": 52.9986, "lng": 14.3314 }, { "lat": 52.8986, "lng": 14.3314 }, { "lat": 52.7986, "lng": 14.3315 }, { "lat": 52.7986, "lng": 14.4981 }, { "lat": 52.6986, "lng": 14.4981 }, { "lat": 52.6986, "lng": 14.6647 }, { "lat": 52.5986, "lng": 14.6647 }, { "lat": 52.4986, "lng": 14.6647 }, { "lat": 52.3986, "lng": 14.6647 }, { "lat": 52.2986, "lng": 14.6647 }, { "lat": 52.2986, "lng": 14.8314 }, { "lat": 52.1987, "lng": 14.8314 }, { "lat": 52.0987, "lng": 14.8314 }, { "lat": 51.9987, "lng": 14.8314 }, { "lat": 51.8987, "lng": 14.8314 }, { "lat": 51.8987, "lng": 14.6648 }, { "lat": 51.7987, "lng": 14.6648 }, { "lat": 51.7987, "lng": 14.8314 }, { "lat": 51.6987, "lng": 14.8314 }, { "lat": 51.5987, "lng": 14.8314 }, { "lat": 51.4987, "lng": 14.8314 }, { "lat": 51.4987, "lng": 14.9981 }, { "lat": 51.3987, "lng": 14.9981 }, { "lat": 51.3987, "lng": 15.1647 }, { "lat": 51.2988, "lng": 15.1647 }, { "lat": 51.1988, "lng": 15.1647 }, { "lat": 51.0988, "lng": 15.1647 }, { "lat": 51.0988, "lng": 14.9981 }, { "lat": 50.9988, "lng": 14.9981 }, { "lat": 50.8988, "lng": 14.9981 }, { "lat": 50.8988, "lng": 14.8314 }, { "lat": 50.7988, "lng": 14.8314 }, { "lat": 50.7988, "lng": 14.6648 }, { "lat": 50.7988, "lng": 14.4981 }, { "lat": 50.7988, "lng": 14.3315 }, { "lat": 50.7988, "lng": 14.1649 }, { "lat": 50.7988, "lng": 13.9982 }, { "lat": 50.6988, "lng": 13.9982 }, { "lat": 50.6988, "lng": 13.8316 }, { "lat": 50.6988, "lng": 13.6649 }, { "lat": 50.5988, "lng": 13.6649 }, { "lat": 50.5988, "lng": 13.4983 }, { "lat": 50.5988, "lng": 13.3317 }, { "lat": 50.4988, "lng": 13.3317 }, { "lat": 50.4988, "lng": 13.165 }, { "lat": 50.3988, "lng": 13.165 }, { "lat": 50.3988, "lng": 12.9984 }, { "lat": 50.3988, "lng": 12.8317 }, { "lat": 50.3988, "lng": 12.6651 }, { "lat": 50.2988, "lng": 12.6651 }, { "lat": 50.2988, "lng": 12.4984 }, { "lat": 50.1988, "lng": 12.4984 }, { "lat": 50.1988, "lng": 12.3318 }, { "lat": 50.0989, "lng": 12.3318 }, { "lat": 50.0989, "lng": 12.4984 }, { "lat": 49.9989, "lng": 12.4985 }, { "lat": 49.9989, "lng": 12.6651 }, { "lat": 49.8989, "lng": 12.6651 }, { "lat": 49.7989, "lng": 12.6651 }, { "lat": 49.7989, "lng": 12.4985 }, { "lat": 49.6989, "lng": 12.4985 }, { "lat": 49.6989, "lng": 12.6651 }, { "lat": 49.5989, "lng": 12.6651 }, { "lat": 49.4989, "lng": 12.6651 }, { "lat": 49.4989, "lng": 12.8317 }, { "lat": 49.3989, "lng": 12.8317 }, { "lat": 49.3989, "lng": 12.9984 }, { "lat": 49.299, "lng": 12.9984 }, { "lat": 49.299, "lng": 13.165 }, { "lat": 49.199, "lng": 13.165 }, { "lat": 49.199, "lng": 13.3317 }, { "lat": 49.099, "lng": 13.3317 }, { "lat": 49.099, "lng": 13.4983 }, { "lat": 48.999, "lng": 13.4983 }, { "lat": 48.999, "lng": 13.665 }, { "lat": 48.899, "lng": 13.665 }, { "lat": 48.899, "lng": 13.8316 }, { "lat": 48.799, "lng": 13.8316 }, { "lat": 48.699, "lng": 13.8316 }, { "lat": 48.599, "lng": 13.8316 }, { "lat": 48.499, "lng": 13.8316 }, { "lat": 48.499, "lng": 13.665 }, { "lat": 48.499, "lng": 13.4983 }, { "lat": 48.3991, "lng": 13.4983 }, { "lat": 48.2991, "lng": 13.4983 }, { "lat": 48.2991, "lng": 13.3317 }, { "lat": 48.2991, "lng": 13.1651 }, { "lat": 48.1991, "lng": 13.1651 }, { "lat": 48.1991, "lng": 12.9984 }, { "lat": 48.1991, "lng": 12.8318 }, { "lat": 48.0991, "lng": 12.8318 }, { "lat": 47.9991, "lng": 12.8318 }, { "lat": 47.9991, "lng": 12.9984 }, { "lat": 47.8991, "lng": 12.9984 }, { "lat": 47.7991, "lng": 12.9984 }, { "lat": 47.6991, "lng": 12.9984 }, { "lat": 47.6991, "lng": 13.1651 }, { "lat": 47.5991, "lng": 13.1651 }, { "lat": 47.4992, "lng": 13.1651 }, { "lat": 47.3992, "lng": 13.1651 }, { "lat": 47.3992, "lng": 12.9984 }, { "lat": 47.3992, "lng": 12.8318 }, { "lat": 54.0984, "lng": 7.8324 }, { "lat": 54.1984, "lng": 7.8324 }, { "lat": 54.1984, "lng": 7.9991 }, { "lat": 54.0984, "lng": 7.9991 }, { "lat": 54.0984, "lng": 7.8324 }]

L.mask(tk25).addTo(map);

function setBrutvogelartenAColor(d) {
    return d > 4 ? '#91191e' :
        d > 3 ? '#ef2e21' :
            d > 1 ? '#f3b710' :
                d > 0 ? '#eaee26' :
                    '#FFFFFF';
}

function BrutvogelartenAStyle(feature) {
    return {
        fillColor: setBrutvogelartenAColor(feature.properties.Anzahl_A),
        weight: 1,
        opacity: 0.7,
        color: 'white',
        fillOpacity: 0.7
    };
}

function setBrutvogelartenBColor(d) {
    return d > 5 ? '#91191e' :
        d > 2 ? '#ef2e21' :
            d > 1 ? '#f3b710' :
                d > 0 ? '#eaee26' :
                    '#FFFFFF';
}


function BrutvogelartenBStyle(feature) {
    return {
        fillColor: setBrutvogelartenBColor(feature.properties.Anzahl_B),
        weight: 1,
        opacity: 0.7,
        color: 'white',
        fillOpacity: 0.7
    };
}

function setBrutvogelartenCColor(d) {
    return d > 24 ? '#91191e' :
        d > 19 ? '#ef2e21' :
            d > 15 ? '#f3b710' :
                d > 0 ? '#eaee26' :
                    '#FFFFFF';
}


function BrutvogelartenCStyle(feature) {
    return {
        fillColor: setBrutvogelartenCColor(feature.properties.Anzahl_C),
        weight: 1,
        opacity: 0.7,
        color: 'white',
        fillOpacity: 0.7
    };
}

function seBrutvogelArtenABCColor(d) {
    return d > 31 ? '#91191e' :
        d > 24 ? '#ef2e21' :
            d > 17 ? '#f3b710' :
                d > 0 ? '#eaee26' :
                    '#FFFFFF';
}


function BrutvogelartenABCStyle(feature) {
    return {
        fillColor: seBrutvogelArtenABCColor(feature.properties.Anzahl_ABC),
        weight: 1,
        opacity: 0.7,
        color: 'white',
        fillOpacity: 0.7
    };
}

var stylesBrutvogelarten = {
    "BrutvogelartenA": BrutvogelartenAStyle,
    "BrutvogelartenB": BrutvogelartenBStyle,
    "BrutvogelartenC": BrutvogelartenCStyle,
    "BrutvogelartenABC": BrutvogelartenABCStyle
};


var sensitivitaetskarte;
// load GeoJSON from an external file
$.getJSON("data/Sensitivitaetskarte_wgs84.geojson", function (data) {
    // Radio buttons to let the user choose the ethny to use for colors.
    sensitivitaetskarte = L.geoJson(data, {
        //style: BrutvogelartenAStyle
    })
});


$("input[name=brutvogelarten]").change(function () {

    //Uncheck other checkboxes
    $("input[name=brutvogelarten]").not(this).prop('checked', false);
    //Removed other legends
    $('.brutvogelarten.layer-legend').not(this).removeClass('active');

    //Deal with actual checkbox
    var id = $(this).attr("id");
    if ($(this).is(":checked")) {
        sensitivitaetskarte.removeFrom(map);
        sensitivitaetskarte.setStyle(stylesBrutvogelarten[id]);
        sensitivitaetskarte.addTo(map);
    } else {
        sensitivitaetskarte.removeFrom(map);
    }
});

var iba;
// load GeoJSON from an external file
$.getJSON("data/iba.geojson", function (data) {
    // Radio buttons to let the user choose the ethny to use for colors.
    iba = L.geoJson(data, {
        style: {
            "color": "#15534C",
            "weight": "1.5"
        }
    })
});

$("input[name=iba]").change(function () {
    //Deal with actual checkbox
    //var id = $(this).attr("id");
    if ($(this).is(":checked")) {
        iba.addTo(map);
    } else {
        iba.removeFrom(map);
    }
});

$("input[name=baselayer]").change(function () {
    //Uncheck other checkboxes
    $("input[name=baselayer]").not(this).prop('checked', false);
    //Deal with actual checkbox
    var id = $(this).attr("id");
    console.log(id);
    if (id == "osm"){ 
        if ($(this).is(":checked")) {
        satellite.removeFrom(map);    
        osm.addTo(map);
    } else {
        osm.removeFrom(map);
    } 
}
    else if ( id == "satellite"){
        if ($(this).is(":checked")) {
        osm.removeFrom(map);    
        satellite.addTo(map);
    } else {
        satellite.removeFrom(map);
    } 

    }
});

$(".iba.layer-legend").change(function () {
    $(this).next().toggleClass("active");
    $(this).next().slideToggle("slow")
});

$(".brutvogelarten.layer-legend").change(function () {
    $(".brutvogelarten.layer-legend").not(this).next(".active").slideToggle("slow");
    $(".brutvogelarten.layer-legend").not(this).next().removeClass("active");

    $(this).next().toggleClass("active");
    $(this).next().slideToggle("slow")
});

$(".brutvogelarten.layer-legend").each(function () {
    var b = $(this).find("input[name=brutvogelarten]").attr("id");
    var a = [];
    switch (b) {
        case "BrutvogelartenA":
            a = [
                [0, "#ffffff"],
                [0, "#eaee26"],
                [1, "#f3b710"],
                [3, "#ef2e21"],
                [4, "#91191e"]
            ];
            break;
        case "BrutvogelartenB":
            a = [
                [0, "#ffffff"],
                [0, "#eaee26"],
                [1, "#f3b710"],
                [2, "#ef2e21"],
                [5, "#91191e"]
            ];
            break;
        case "BrutvogelartenC":
            a = [
                [0, "#ffffff"],
                [0, "#eaee26"],
                [15, "#f3b710"],
                [19, "#ef2e21"],
                [24, "#91191e"]
            ];
            break;
        case "BrutvogelartenABC":
            a = [
                [0, "#ffffff"],
                [0, "#eaee26"],
                [17, "#f3b710"],
                [24, "#ef2e21"],
                [31, "#91191e"]
            ];
            break;
        default:
            console.log("Sorry, we haven't found a legend style for " + b + ".");
    }
    var d = 100 / a.length;
    var e = '<div class="legend-colors">';
    for (var c = 0; c < a.length; c++) e += '<span style="width:' + d + "%; background-color:" + a[c][1] + ';" ></span>';
    for (c = 0; c < a.length; c++) {
        var f = "";
        f = 0 == c ? a[c + 1][0] : c == a.length - 1 ? "> " + a[c][0] : "> " + a[c][0] + " - " + a[c + 1][0];
        e += '<span style="width:' + d + '%;">' + f + "</span>"
    }
    e += "</div";
    $(this).next().append(e)
});