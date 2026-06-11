import { useRef, useCallback, useState, useMemo } from 'react';
import Map, { Source, Layer, Popup } from 'react-map-gl/mapbox';
import type { MapMouseEvent, MapRef } from 'react-map-gl/mapbox';
import type { FeatureCollection } from 'geojson';
import { ChevronsUpDown, Search } from 'lucide-react';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import geojsonData from '../../assets/cebu_health_accessibility.geojson';
import facilitiesData from '../../assets/cebu_health_facilities.geojson';
import barangaySummary from '../../assets/barangay_summary.json';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
const MAPBOX_STYLE = import.meta.env.VITE_MAPBOX_STYLE ?? 'mapbox://styles/mapbox/standard';
const MAPBOX_TOKEN_MISSING = !MAPBOX_TOKEN;

if (MAPBOX_TOKEN_MISSING) {
  console.warn(
    'Missing Mapbox token: add VITE_MAPBOX_TOKEN to a local .env file and restart the Vite dev server.'
  );
}

interface BarangayProps {
  adm4_name: string;
  population: number;
  facilities: number;
  facilities_per_10k: number;
  access_rank: number;
  access_category: string;
}

interface BarangaySummary {
  id: number;
  name: string;
  rank: number;
  category: string;
  population: number;
  facilities: number;
  facilities_per_10k: number;
  centroid: [number, number];
}

const SUMMARY = barangaySummary as BarangaySummary[];

interface PopupInfo {
  longitude: number;
  latitude: number;
  properties: BarangayProps;
}

const CATEGORY_STYLES: Record<string, string> = {
  'Very Low Access': 'border-red-500/30 text-red-400',
  'Low Access': 'border-orange-500/30 text-orange-400',
  'Moderate Access': 'border-yellow-500/30 text-yellow-400',
  'High Access': 'border-lime-500/30 text-lime-400',
  'Very High Access': 'border-green-500/30 text-green-400',
};

// Flat choropleth — color driven by access_rank percentile (0-100), with
// hover/click highlight colors via feature-state.
const fillLayer: any = {
  id: 'barangay-fill',
  type: 'fill' as const,
  slot: 'middle',
  paint: {
    'fill-color': [
      'case',
      ['boolean', ['feature-state', 'clicked'], false],
      '#f0abfc', // selected: pink/violet highlight
      ['boolean', ['feature-state', 'hover'], false],
      '#22d3ee', // hovered: cyan highlight
      [
        'interpolate',
        ['linear'],
        ['get', 'access_rank'],
        0,   '#dc2626',
        25,  '#f97316',
        50,  '#facc15',
        75,  '#84cc16',
        100, '#22c55e',
      ],
    ],
    // Semi-transparent so the basemap (roads, labels, terrain) shows through.
    'fill-opacity': 0.45,
  },
};

const strokeLayer: any = {
  id: 'barangay-stroke',
  type: 'line' as const,
  slot: 'middle',
  paint: {
    'line-color': [
      'case',
      ['boolean', ['feature-state', 'clicked'], false],
      '#f0abfc',
      [
        'case',
        ['boolean', ['feature-state', 'hover'], false],
        '#22d3ee',
        'rgba(255,255,255,0.45)',
      ],
    ],
    'line-width': [
      'case',
      ['boolean', ['feature-state', 'clicked'], false],
      3,
      [
        'case',
        ['boolean', ['feature-state', 'hover'], false],
        2.5,
        1,
      ],
    ],
  },
};

// Cool hues so markers stay readable on the warm red-to-green choropleth.
const FACILITY_COLORS: Record<string, string> = {
  Hospital: '#3b82f6',
  Clinic: '#a855f7',
  'Health Center': '#f8fafc',
  'Birthing Center': '#f472b6',
};

const FACILITY_TYPES = Object.keys(FACILITY_COLORS);

const facilityCircleLayer: any = {
  id: 'facility-circles',
  type: 'circle' as const,
  slot: 'top',
  paint: {
    'circle-color': [
      'match',
      ['get', 'type'],
      'Hospital', FACILITY_COLORS.Hospital,
      'Clinic', FACILITY_COLORS.Clinic,
      'Health Center', FACILITY_COLORS['Health Center'],
      'Birthing Center', FACILITY_COLORS['Birthing Center'],
      '#94a3b8',
    ],
    'circle-radius': [
      'interpolate', ['linear'], ['zoom'],
      8, 3,
      11, 5,
      14, 8,
    ],
    'circle-stroke-color': [
      'match',
      ['get', 'type'],
      'Health Center', '#0f172a', // white dots need a dark ring
      '#ffffff',
    ],
    'circle-stroke-width': 1,
    'circle-opacity': 0.9,
  },
};

const facilityLabelLayer: any = {
  id: 'facility-labels',
  type: 'symbol' as const,
  slot: 'top',
  minzoom: 10.5, // labels only once zoomed in enough to read them
  layout: {
    'text-field': [
      'case',
      ['==', ['get', 'name'], ''],
      ['get', 'type'],
      ['concat', ['get', 'name'], '\n', ['get', 'type']],
    ],
    'text-size': 11,
    'text-anchor': 'top' as const,
    'text-offset': [0, 0.8],
    'text-optional': true,
  },
  paint: {
    'text-color': '#ffffff',
    'text-halo-color': 'rgba(0,0,0,0.7)',
    'text-halo-width': 1.2,
  },
};

export const MapView = () => {
  const mapRef = useRef<MapRef>(null);
  const hoveredId = useRef<string | number | null>(null);
  const clickedId = useRef<string | number | null>(null);
  const [popup, setPopup] = useState<PopupInfo | null>(null);
  const [pinnedPopup, setPinnedPopup] = useState<PopupInfo | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeTypes, setActiveTypes] = useState<string[]>(FACILITY_TYPES);

  const underserved = useMemo(
    () => [...SUMMARY].sort((a, b) => a.rank - b.rank).slice(0, 15),
    []
  );

  const facilityFilter = useMemo(
    () => ['in', ['get', 'type'], ['literal', activeTypes]] as any,
    [activeTypes]
  );

  const toggleType = (type: string) => {
    setActiveTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const clearClicked = useCallback(() => {
    const map = mapRef.current?.getMap();
    if (map && clickedId.current !== null) {
      map.setFeatureState(
        { source: 'barangays', id: clickedId.current },
        { clicked: false }
      );
    }
    clickedId.current = null;
  }, []);

  // Shared by the search box and the ranking table: fly to a barangay,
  // highlight it, and pin its detail popup.
  const selectBarangay = useCallback((b: BarangaySummary) => {
    const map = mapRef.current?.getMap();
    if (!map) return;

    clearClicked();
    clickedId.current = b.id;
    map.setFeatureState({ source: 'barangays', id: b.id }, { clicked: true });

    setPinnedPopup({
      longitude: b.centroid[0],
      latitude: b.centroid[1],
      properties: {
        adm4_name: b.name,
        population: b.population,
        facilities: b.facilities,
        facilities_per_10k: b.facilities_per_10k,
        access_rank: b.rank,
        access_category: b.category,
      },
    });
    setPopup(null);

    map.flyTo({ center: b.centroid, zoom: 11, duration: 1800 });
    document.querySelector('#map')?.scrollIntoView({ behavior: 'smooth' });
  }, [clearClicked]);

  const onMouseMove = useCallback((e: MapMouseEvent) => {
    const map = mapRef.current?.getMap();
    if (!map || !e.features?.length) return;

    if (hoveredId.current !== null) {
      map.setFeatureState(
        { source: 'barangays', id: hoveredId.current },
        { hover: false }
      );
    }

    const feature = e.features[0];
    hoveredId.current = feature.id ?? null;

    if (hoveredId.current !== null) {
      map.setFeatureState(
        { source: 'barangays', id: hoveredId.current },
        { hover: true }
      );
    }

    // Only show hover popup if nothing is clicked
    if (clickedId.current === null) {
      setPopup({
        longitude: e.lngLat.lng,
        latitude: e.lngLat.lat,
        properties: feature.properties as BarangayProps,
      });
    }
  }, []);

  const onMouseLeave = useCallback(() => {
    const map = mapRef.current?.getMap();
    if (map && hoveredId.current !== null) {
      map.setFeatureState(
        { source: 'barangays', id: hoveredId.current },
        { hover: false }
      );
    }
    hoveredId.current = null;
    if (clickedId.current === null) setPopup(null);
  }, []);

  const onClick = useCallback((e: MapMouseEvent) => {
    const map = mapRef.current?.getMap();
    if (!map) return;

    clearClicked();

    if (!e.features?.length) {
      setPinnedPopup(null);
      setPopup(null);
      return;
    }

    const feature = e.features[0];
    clickedId.current = feature.id ?? null;

    if (clickedId.current !== null) {
      map.setFeatureState(
        { source: 'barangays', id: clickedId.current },
        { clicked: true }
      );
    }

    setPinnedPopup({
      longitude: e.lngLat.lng,
      latitude: e.lngLat.lat,
      properties: feature.properties as BarangayProps,
    });
    setPopup(null);
  }, [clearClicked]);

  const onLoad = useCallback(() => {
    const map = mapRef.current?.getMap();
    if (!map) return;

    // Mapbox Standard ships its own 3D buildings and landmarks;
    // configure the basemap instead of adding a custom building layer.
    map.setConfigProperty('basemap', 'lightPreset', 'dusk');
    map.setConfigProperty('basemap', 'show3dObjects', true);
  }, []);

  const activePopup = pinnedPopup ?? popup;

  return (
    <section id="map" className="bg-[#060c18] py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-cyan-400">
            Live coverage map
          </p>
          <h2 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Cebu healthcare accessibility.
          </h2>
          <p className="mt-4 text-lg text-slate-400">
            Barangays colored by accessibility percentile, with healthcare facility markers. Click any area to pin details.
          </p>
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-x-6 gap-y-3">
          <Popover open={searchOpen} onOpenChange={setSearchOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={searchOpen}
                className="w-64 justify-between text-slate-400"
              >
                <span className="flex items-center gap-2">
                  <Search className="size-3.5" />
                  Search barangay…
                </span>
                <ChevronsUpDown className="size-3.5 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-0" align="start">
              <Command>
                <CommandInput placeholder="Type a barangay name…" />
                <CommandList>
                  <CommandEmpty>No barangay found.</CommandEmpty>
                  <CommandGroup>
                    {SUMMARY.map((b) => (
                      <CommandItem
                        key={b.id}
                        value={`${b.name}-${b.id}`}
                        keywords={[b.name]}
                        onSelect={() => {
                          setSearchOpen(false);
                          selectBarangay(b);
                        }}
                      >
                        <span className="truncate">{b.name}</span>
                        <span className="ml-auto font-mono text-xs text-muted-foreground">
                          {Math.round(b.rank)}
                        </span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500">Lower access</span>
            <div
              className="h-2 w-40 rounded-full"
              style={{ background: 'linear-gradient(to right, #dc2626, #facc15, #22c55e)' }}
            />
            <span className="text-xs text-slate-500">Higher access</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {FACILITY_TYPES.map((label) => {
              const active = activeTypes.includes(label);
              return (
                <Badge
                  key={label}
                  asChild
                  variant="outline"
                  className={
                    active
                      ? 'cursor-pointer gap-1.5 border-white/15 text-slate-300'
                      : 'cursor-pointer gap-1.5 border-white/5 text-slate-600 opacity-50'
                  }
                >
                  <button type="button" onClick={() => toggleType(label)} aria-pressed={active}>
                    <span
                      className="inline-block h-2.5 w-2.5 rounded-full border border-white/40"
                      style={{ backgroundColor: active ? FACILITY_COLORS[label] : 'transparent' }}
                    />
                    {label}
                  </button>
                </Badge>
              );
            })}
          </div>
        </div>

        <div
          className="overflow-hidden rounded-3xl border border-white/8"
          style={{ height: '560px' }}
        >
            <Map
              ref={mapRef}
              initialViewState={{
                longitude: 124.0,
                latitude: 10.35,
                zoom: 8.5,
                pitch: 60,
                bearing: -10,
              }}
              style={{ width: '100%', height: '100%' }}
              mapStyle={MAPBOX_STYLE}
              mapboxAccessToken={MAPBOX_TOKEN}
              interactiveLayerIds={['barangay-fill']}
              onMouseMove={onMouseMove}
              onMouseLeave={onMouseLeave}
              onClick={onClick}
              onLoad={onLoad}
            >
            <Source
              id="barangays"
              type="geojson"
              data={geojsonData as FeatureCollection}
              generateId
            >
              <Layer {...fillLayer} />
              <Layer {...strokeLayer} />
            </Source>

            <Source id="facilities" type="geojson" data={facilitiesData as FeatureCollection}>
              <Layer {...facilityCircleLayer} filter={facilityFilter} />
              <Layer {...facilityLabelLayer} filter={facilityFilter} />
            </Source>

            {activePopup && (
              <Popup
                longitude={activePopup.longitude}
                latitude={activePopup.latitude}
                closeButton={pinnedPopup !== null}
                closeOnClick={false}
                anchor="bottom"
                offset={12}
                onClose={() => {
                  clearClicked();
                  setPinnedPopup(null);
                }}
              >
                <Card size="sm" className="min-w-44 rounded-xl bg-[#0a1628] shadow-xl ring-white/10">
                  <CardContent>
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold text-white">
                        {activePopup.properties.adm4_name}
                      </p>
                      {pinnedPopup && (
                        <Badge className="bg-fuchsia-500/15 text-[10px] font-semibold uppercase tracking-widest text-fuchsia-300">
                          Selected
                        </Badge>
                      )}
                    </div>
                    <div className="mt-2 space-y-1 text-xs text-slate-400">
                      <p>
                        Access rank:{' '}
                        <span className="font-mono text-cyan-400">
                          {Math.round(activePopup.properties.access_rank)}/100
                        </span>
                      </p>
                      <p>
                        Population:{' '}
                        <span className="font-mono text-white">
                          {(activePopup.properties.population ?? 0).toLocaleString()}
                        </span>
                      </p>
                      <p>
                        Facilities:{' '}
                        <span className="font-mono text-white">
                          {activePopup.properties.facilities ?? 0}
                        </span>
                      </p>
                      <p>
                        Per 10k:{' '}
                        <span className="font-mono text-white">
                          {activePopup.properties.facilities_per_10k > 0
                            ? activePopup.properties.facilities_per_10k.toFixed(2)
                            : '0'}
                        </span>
                      </p>
                      <div className="flex items-center gap-1.5">
                        Category:{' '}
                        <Badge
                          variant="outline"
                          className={CATEGORY_STYLES[activePopup.properties.access_category] ?? 'border-white/15 text-slate-400'}
                        >
                          {activePopup.properties.access_category}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Popup>
            )}
          </Map>
        </div>

        <Card className="mt-8 rounded-3xl bg-[#0a1628]/60 ring-white/8">
          <CardHeader>
            <CardTitle className="text-white">Most underserved barangays</CardTitle>
            <CardDescription>
              Lowest accessibility percentile across {SUMMARY.length.toLocaleString()} barangays — click a row to locate it on the map.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-h-80 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/8 hover:bg-transparent">
                    <TableHead className="w-10 text-slate-500">#</TableHead>
                    <TableHead className="text-slate-500">Barangay</TableHead>
                    <TableHead className="text-right text-slate-500">Access rank</TableHead>
                    <TableHead className="text-slate-500">Category</TableHead>
                    <TableHead className="text-right text-slate-500">Population</TableHead>
                    <TableHead className="text-right text-slate-500">Facilities</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {underserved.map((b, i) => (
                    <TableRow
                      key={b.id}
                      className="cursor-pointer border-white/5 hover:bg-white/5"
                      onClick={() => selectBarangay(b)}
                    >
                      <TableCell className="font-mono text-slate-500">{i + 1}</TableCell>
                      <TableCell className="font-medium text-white">{b.name}</TableCell>
                      <TableCell className="text-right font-mono text-cyan-400">
                        {b.rank.toFixed(1)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={CATEGORY_STYLES[b.category] ?? 'border-white/15 text-slate-400'}
                        >
                          {b.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-mono text-slate-300">
                        {b.population.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right font-mono text-slate-300">
                        {b.facilities}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
