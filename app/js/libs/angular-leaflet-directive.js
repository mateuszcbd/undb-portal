﻿var leafletDirective = angular.module("leaflet-directive", []);

leafletDirective.directive("leaflet", ["$http", "$log", "$q", function ($http, $log, $q) {
    return {
        restrict: "EC",
        replace: true,
        transclude: true,
        scope: {
            center: "=center",
            tilelayer: "=tilelayer",
            markers: "=markers",
            path: "=path",
            maxZoom: "@maxzoom",
            bounds: "=bounds",
            layers: "=layers"
        },
        template: '<div style="height:400px" class="angular-leaflet-map"></div>',
        link: function (scope, element, attrs, ctrl) {
            var $el = element[0],
                map = new L.Map($el);

            var maxZoom = 12;
            if (scope.maxZoom) {
                maxZoom = scope.maxZoom;
            }

            var point = new L.LatLng(0, 0);
            map.setView(point, 1);
            map.locate({ maxZoom: maxZoom });

            // Set tile layer
            var tilelayer = scope.tilelayer || 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
            L.tileLayer(tilelayer, { maxZoom: maxZoom }).addTo(map);

            // Manage map bounds
            if (attrs.bounds) {
                scope.bounds = map.getBounds();
                map.on('moveend', function (s) {
                    scope.$apply(function (s) {
                        s.bounds = map.getBounds();
                    });
                });
            }

            // Manage map center events
            if (attrs.center) {

                if (scope.center && scope.center.autoDiscover === true) {
                    map.locate({ setView: true });
                }

                // Listen for map drags
                var dragging_map = false;
                map.on("dragstart", function (e) {
                    dragging_map = true;
                });

                map.on("drag", function (e) {
                	scope.$apply(function(s) {
                		s.center = angular.extend(s.center||{}, {
                			lat : map.getCenter().lat,
                			lng : map.getCenter().lng
                		});
                    });
                });

                map.on("dragend", function (e) {
                    dragging_map = false;
                });

                scope.$watch("center.lng", function (newValue, oldValue) {
                	if (dragging_map || ((newValue || null) === null))
                		return;
                    map.setView(new L.LatLng(map.getCenter().lat, newValue), map.getZoom());
                });

                scope.$watch("center.lat", function (newValue, oldValue) {
                	if (dragging_map || ((newValue || null) === null))
                		return;
                    map.setView(new L.LatLng(newValue, map.getCenter().lng), map.getZoom());
                });

                // Manage zoom events
                var zooming_map = false;
                map.on("zoomstart", function (e) {
                    zooming_map = true;
                });

                // Listen for zoom on DOM
                scope.$watch("center.zoom", function (newValue, oldValue) {
                    if (zooming_map || !newValue) return;
                    if (!scope.$$phase) {
                        map.setZoom(newValue);
                        //                        scope.$apply(function (s) {
                        //                            s.bounds = map.getBounds();
                        //                        });
                    }
                });

                map.on("zoomend", function (e) {
                    if (!scope.$$phase) {
                    	scope.$apply(function(s) {
                    		s.center = angular.extend(s.center||{}, {
                    			zoom : map.getZoom()
                    		});
                        });
                        zooming_map = false;
                    }
                });
            }

            if (attrs.markers !== undefined) {
                var markers_dict = [];

                var createAndLinkMarker = function (mkey, scope) {
                    var markerData = scope.markers[mkey];
                    var marker = new L.marker(
                        scope.markers[mkey],
                        {
                            draggable: markerData.draggable ? true : false
                        }
                    );

                    if (markerData.message) {
                        scope.$watch("markers." + mkey + ".message", function (newValue) {
                            marker.bindPopup(markerData.message);
                        });

                        scope.$watch("markers." + mkey + ".focus", function (newValue) {
                            if (newValue) {
                                marker.openPopup();
                            }
                        });
                    }

                    scope.$watch("markers." + mkey + ".draggable", function (newValue, oldValue) {
                        if (newValue === false) {
                            marker.dragging.disable();
                        } else if (newValue === true) {
                            marker.dragging.enable();
                        }
                    });

                    var dragging_marker = false;
                    marker.on("dragstart", function (e) {
                        dragging_marker = true;
                    });

                    marker.on("drag", function (e) {
                        scope.$apply(function (s) {
                            markerData.lat = marker.getLatLng().lat;
                            markerData.lng = marker.getLatLng().lng;
                        });
                    });

                    marker.on("dragend", function (e) {
                        dragging_marker = false;
                        if (markerData.message) {
                            marker.openPopup();
                        }
                    });

                    scope.$watch('markers.' + mkey, function () {
                        marker.setLatLng(scope.markers[mkey]);
                    }, true);

                    scope.$watch("markers" + mkey + ".lng", function (newValue, oldValue) {
                        if (dragging_marker || !newValue) return;
                        marker.setLatLng(new L.LatLng(marker.getLatLng().lat, newValue));
                    });

                    scope.$watch("markers" + mkey + ".lat", function (newValue, oldValue) {
                        if (dragging_marker || !newValue) return;
                        marker.setLatLng(new L.LatLng(newValue, marker.getLatLng().lng));
                    });
                    return marker;
                }; // end of create and link marker

                scope.$watch("markers", function (newMarkerList) {
                    // find deleted markers
                    for (var delkey in markers_dict) {
                        if (!scope.markers[delkey]) {
                            map.removeLayer(markers_dict[delkey]);
                            delete markers_dict[delkey];
                        }
                    }
                    // add new markers
                    for (var mkey in scope.markers) {
                        if (markers_dict[mkey] === undefined) {
                            var marker = createAndLinkMarker(mkey, scope);
                            map.addLayer(marker);
                            markers_dict[mkey] = marker;
                        }
                    } // for mkey in markers
                }, true); // watch markers
            } // if attrs.markers

            if (attrs.path) {
                var polyline = new L.Polyline([], { weight: 10, opacity: 1 });
                map.addLayer(polyline);
                scope.$watch("path.latlngs", function (latlngs) {
                    for (var idx = 0, length = latlngs.length; idx < length; idx++) {
                        if (latlngs[idx] === undefined || latlngs[idx].lat === undefined || latlngs[idx].lng === undefined) {
                            $log.warn("Bad path point inn the $scope.path array ");
                            latlngs.splice(idx, 1);
                        }
                    }
                    polyline.setLatLngs(latlngs);
                }, true);

                scope.$watch("path.weight", function (weight) {
                    polyline.setStyle({
                        weight: weight
                    });
                }, true);

                scope.$watch("path.color", function (color) {
                    polyline.setStyle({
                        color: color
                    });
                }, true);
            } // end of attrs.path


            var mLayers = [];

			scope.$watch("layers", function(newLayers){
            	var oLayers = newLayers || [];

            	angular.forEach(mLayers, function(oldLayer, key) {
            		map.removeLayer(oldLayer)
            	});

            	mLayers = [];

            	angular.forEach(oLayers, function(newLayer, key) {
            		mLayers.push(newLayer);
            		map.addLayer(newLayer);
            	});
            });

        } // end of link function
    };
}]);
