/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { i18n } from '@kbn/i18n';

import { supports } from 'ui/utils/supports';
import { Schemas } from 'ui/vis/editors/default/schemas';
import { Status } from 'ui/vis/update_status';
import { truncatedColorMaps } from 'ui/vislib/components/color/truncated_colormaps';
import { convertToGeoJson } from 'ui/vis/map/convert_to_geojson';

import { createTileMapVisualization } from './tile_map_visualization';
import { visFactory } from '../../visualizations/public';
import { TileMapOptions } from './components/tile_map_options';
import { withInjectedDependencies } from '../../kbn_vislib_vis_types/public/utils/with_injected_dependencies';

export function createTileMapTypeDefinition(dependencies) {
  const CoordinateMapsVisualization = createTileMapVisualization(dependencies);
  const { uiSettings, serviceSettings } = dependencies;

  return visFactory.createBaseVisualization({
    name: 'tile_map',
    title: i18n.translate('tileMap.vis.mapTitle', {
      defaultMessage: 'Coordinate Map',
    }),
    icon: 'visMapCoordinate',
    description: i18n.translate('tileMap.vis.mapDescription', {
      defaultMessage: 'Plot latitude and longitude coordinates on a map',
    }),
    visConfig: {
      canDesaturate: !!supports.cssFilters,
      defaults: {
        colorSchema: 'Yellow to Red',
        mapType: 'Scaled Circle Markers',
        isDesaturated: true,
        addTooltip: true,
        heatClusterSize: 1.5,
        legendPosition: 'bottomright',
        mapZoom: 2,
        mapCenter: [0, 0],
        wms: uiSettings.get('visualization:tileMap:WMSdefaults'),
      },
    },
    requiresUpdateStatus: [Status.AGGS, Status.PARAMS, Status.RESIZE, Status.UI_STATE],
    requiresPartialRows: true,
    visualization: CoordinateMapsVisualization,
    responseHandler: convertToGeoJson,
    editorConfig: {
      collections: {
        colorSchemas: Object.values(truncatedColorMaps).map(({ id, label }) => ({ value: id, text: label })),
        legendPositions: [{
          value: 'bottomleft',
          text: i18n.translate('tileMap.vis.editorConfig.legendPositions.bottomLeftText', {
            defaultMessage: 'Bottom left',
          }),
        }, {
          value: 'bottomright',
          text: i18n.translate('tileMap.vis.editorConfig.legendPositions.bottomRightText', {
            defaultMessage: 'Bottom right',
          }),
        }, {
          value: 'topleft',
          text: i18n.translate('tileMap.vis.editorConfig.legendPositions.topLeftText', {
            defaultMessage: 'Top left',
          }),
        }, {
          value: 'topright',
          text: i18n.translate('tileMap.vis.editorConfig.legendPositions.topRightText', {
            defaultMessage: 'Top right',
          }),
        }],
        mapTypes: [
          {
            value: 'Scaled Circle Markers',
            text: i18n.translate('tileMap.vis.editorConfig.mapTypes.scaledCircleMarkersText', {
              defaultMessage: 'Scaled circle markers',
            }),
          },
          {
            value: 'Shaded Circle Markers',
            text: i18n.translate('tileMap.vis.editorConfig.mapTypes.shadedCircleMarkersText', {
              defaultMessage: 'Shaded circle markers',
            }),
          },
          {
            value: 'Shaded Geohash Grid',
            text: i18n.translate('tileMap.vis.editorConfig.mapTypes.shadedGeohashGridText', {
              defaultMessage: 'Shaded geohash grid',
            }),
          },
          {
            value: 'Heatmap',
            text: i18n.translate('tileMap.vis.editorConfig.mapTypes.heatmapText', {
              defaultMessage: 'Heatmap',
            }),
          },
        ],
        tmsLayers: [],
      },
      optionsTemplate: withInjectedDependencies(TileMapOptions, { serviceSettings }),
      schemas: new Schemas([
        {
          group: 'metrics',
          name: 'metric',
          title: i18n.translate('tileMap.vis.map.editorConfig.schemas.metricTitle', {
            defaultMessage: 'Value',
          }),
          min: 1,
          max: 1,
          aggFilter: ['count', 'avg', 'sum', 'min', 'max', 'cardinality', 'top_hits'],
          defaults: [
            { schema: 'metric', type: 'count' },
          ],
        },
        {
          group: 'buckets',
          name: 'segment',
          title: i18n.translate('tileMap.vis.map.editorConfig.schemas.geoCoordinatesTitle', {
            defaultMessage: 'Geo coordinates',
          }),
          aggFilter: 'geohash_grid',
          min: 1,
          max: 1,
        },
      ]),
    },
  });
}
