-- Create national_parks table
CREATE TABLE IF NOT EXISTS national_parks (
  id SERIAL PRIMARY KEY,
  national_park_name TEXT NOT NULL,
  state TEXT NOT NULL,
  park_code TEXT NOT NULL,
  main_entrance_name TEXT,
  latitude_deg DECIMAL(10, 8) NOT NULL,
  longitude_deg DECIMAL(11, 8) NOT NULL,
  visitor_center BOOLEAN DEFAULT false,
  primary_entrance_visitor_center TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on park_code for faster lookups
CREATE INDEX IF NOT EXISTS idx_national_parks_park_code ON national_parks(park_code);

-- Create index on state for filtering
CREATE INDEX IF NOT EXISTS idx_national_parks_state ON national_parks(state);

-- Insert national parks data
INSERT INTO national_parks (national_park_name, state, park_code, main_entrance_name, latitude_deg, longitude_deg, visitor_center, primary_entrance_visitor_center) VALUES
('Acadia National Park', 'Maine', 'acad', 'Hulls Cove Visitor Center', 44.409094, -68.247264, true, NULL),
('National Park of American Samoa', 'American Samoa', 'npsa', 'National Park of American Samoa — Visitor Center (Pago Pago)', -14.27427, -170.696948, true, NULL),
('Arches National Park', 'Utah', 'arch', 'Arches National Park Visitor Center entrance', 38.616376, -109.620284, true, NULL),
('Badlands National Park', 'South Dakota', 'badl', 'Ben Reifel Visitor Center – Badlands National Park', 43.749258, -101.941841, false, NULL),
('Big Bend National Park', 'Texas', 'bibe', 'Panther Junction Visitor Center', 29.328222, -103.206256, true, NULL),
('Biscayne National Park', 'Florida', 'bisc', 'Biscayne National Park - Dante Fascell Visitor Center', 25.464362, -80.335082, true, NULL),
('Black Canyon of the Gunnison National Park', 'Colorado', 'blca', 'South Rim Visitor Center — Black Canyon of the Gunnison National Park', 38.554872, -107.686528, true, NULL),
('Bryce Canyon National Park', 'Utah', 'brca', 'Bryce Canyon National Park Visitor Center', 37.640617, -112.169723, true, NULL),
('Canyonlands National Park', 'Utah', 'cany', 'Island in the Sky Visitor Center — Canyonlands National Park', 38.46002, -109.821156, true, NULL),
('Capitol Reef National Park', 'Utah', 'care', 'Capitol Reef National Park Visitor Center (Fruita)', 38.291271, -111.261709, true, NULL),
('Carlsbad Caverns National Park', 'New Mexico', 'cave', 'Carlsbad Caverns National Park Visitor Center', 32.175145, -104.444153, true, NULL),
('Channel Islands National Park', 'California', 'chis', 'The Robert J. Lagomarsino Visitor Center', 34.248149, -119.266865, true, NULL),
('Congaree National Park', 'South Carolina', 'cong', 'Harry Hampton Visitor Center — Congaree National Park', 33.829626, -80.8228, true, NULL),
('Crater Lake National Park', 'Oregon', 'crla', 'Steel Visitor Center Entrance (Crater Lake)', 42.89684, -122.134087, true, NULL),
('Cuyahoga Valley National Park', 'Ohio', 'cuva', 'Boston Mill Visitor Center', 41.262473, -81.560269, true, NULL),
('Death Valley National Park', 'California Nevada', 'deva', 'Furnace Creek Visitor Center', 36.461434, -116.866928, true, NULL),
('Denali National Park and Preserve', 'Alaska', 'dena', 'Denali Visitor Center', 63.731352, -148.917712, true, NULL),
('Dry Tortugas National Park', 'Florida', 'drto', 'Fort Jefferson Visitor Center', 24.627802, -82.872613, true, NULL),
('Everglades National Park', 'Florida', 'ever', 'Ernest F. Coe Visitor Center', 25.395226, -80.583764, true, NULL),
('Gates of the Arctic National Park and Preserve', 'Alaska', 'gaar', 'Gates of the Arctic Visitor Center (Bettles Ranger Station)', 66.917904, -151.514126, true, NULL),
('Gateway Arch National Park', 'Missouri', 'jeff', 'Gateway Arch Visitor Center', 38.625054, -90.186804, true, NULL),
('Glacier National Park', 'Montana', 'glac', 'Apgar Visitor Center', 48.523147, -113.987939, true, 'Apgar Visitor Center'),
('Glacier National Park', 'Montana', 'glac', 'Saint Mary Visitor Center', 48.747285, -113.438695, true, NULL),
('Glacier National Park', 'Montana', 'glac', 'Polebridge Ranger Station', 48.783375, -114.280656, true, NULL),
('Glacier Bay National Park and Preserve', 'Alaska', 'glba', 'Glacier Bay National Park Visitor Center (Bartlett Cove)', 58.454527, -135.882414, true, NULL),
('Grand Canyon National Park', 'Arizona', 'grca', 'Grand Canyon Visitor Center (South Rim)', 36.058937, -112.109228, true, 'South Rim Visitor Center'),
('Grand Canyon National Park', 'Arizona', 'grca', 'North Rim Visitor Center', 36.198544, -112.052357, true, NULL),
('Grand Teton National Park', 'Wyoming', 'grte', 'Craig Thomas Discovery and Visitor Center', 43.653533, -110.717911, true, NULL),
('Great Basin National Park', 'Nevada', 'grba', 'Great Basin National Park Visitor Center', 39.01477, -114.126277, true, NULL),
('Great Sand Dunes National Park and Preserve', 'Colorado', 'grsa', 'Great Sand Dunes National Park & Preserve – Main Visitor Center', 37.732839, -105.512353, true, NULL),
('Great Smoky Mountains National Park', 'Tennessee, North Carolina', 'grsm', 'Sugarlands Visitor Center', 35.685637, -83.536946, true, NULL),
('Guadalupe Mountains National Park', 'Texas', 'gumo', 'Pine Springs Visitor Center', 31.894324, -104.821461, true, NULL),
('Haleakalā National Park', 'Hawaii', 'hale', 'Haleakalā Visitor Center', 20.715006, -156.249878, true, NULL),
('Hawaiʻi Volcanoes National Park', 'Hawaii', 'havo', 'Kīlauea Visitor Center', 19.42944, -155.257221, true, NULL),
('Hot Springs National Park', 'Arkansas', 'hosp', 'Fordyce Bathhouse Visitor Center and Museum', 34.513747, -93.053726, true, NULL),
('Indiana Dunes National Park', 'Indiana', 'indu', 'Indiana Dunes Visitor Center', 41.633575, -87.054401, true, NULL),
('Isle Royale National Park', 'Michigan', 'isro', 'Isle Royale National Park Visitor Center', 47.122924, -88.564061, true, NULL),
('Joshua Tree National Park', 'California', 'jotr', 'Joshua Tree Visitor Center', 34.134982, -116.056838, true, NULL),
('Katmai National Park and Preserve', 'Alaska', 'katm', 'King Salmon Visitor Center', 58.68269, -156.668744, true, NULL),
('Kenai Fjords National Park', 'Alaska', 'kefj', 'Kenai Fjords National Park Visitor Center', 60.116158, -149.440166, true, NULL),
('Kings Canyon National Park', 'California', 'kica', 'Kings Canyon Visitor Center', 36.740111, -118.963406, true, NULL),
('Kobuk Valley National Park', 'Alaska', 'kova', 'Northwest Arctic Heritage Center', 66.892489, -162.604815, true, NULL),
('Lake Clark National Park and Preserve', 'Alaska', 'lacl', 'Port Alsworth Visitor Center', 60.197349, -154.322971, true, NULL),
('Lassen Volcanic National Park', 'California', 'lavo', 'Kohm Yah-mah-nee Visitor Center', 40.437346, -121.533414, true, NULL),
('Mammoth Cave National Park', 'Kentucky', 'maca', 'Mammoth Cave Visitor Center', 37.187498, -86.101196, true, NULL),
('Mesa Verde National Park', 'Colorado', 'meve', 'Mesa Verde Visitor & Research Center', 37.336295, -108.407977, true, NULL),
('Mount Rainier National Park', 'Washington', 'mora', 'Henry M. Jackson Memorial Visitor Center', 46.786564, -121.735165, true, NULL),
('New River Gorge National Park and Preserve', 'West Virginia', 'neri', 'Canyon Rim Visitor Center Entrance (New River Gorge)', 38.070393, -81.075939, true, NULL),
('North Cascades National Park', 'Washington', 'noca', 'North Cascades Visitor Center', 48.666497, -121.266934, true, NULL),
('Olympic National Park', 'Washington', 'olym', 'Olympic National Park Visitor Center', 48.099502, -123.426162, true, NULL),
('Petrified Forest National Park', 'Arizona', 'pefo', 'Painted Desert Visitor Center', 35.065571, -109.78195, true, NULL),
('Pinnacles National Park', 'California', 'pinn', 'East Entrance (Pinnacles)', 36.493551, -121.146497, true, NULL),
('Redwood National and State Parks', 'California', 'redw', 'Thomas H. Kuchel Visitor Center', 41.286646, -124.090509, true, NULL),
('Rocky Mountain National Park', 'Colorado', 'romo', 'Beaver Meadows Visitor Center', 40.366347, -105.560801, true, 'Beaver Meadows Visitor Center'),
('Rocky Mountain National Park', 'Colorado', 'romo', 'Fall River Visitor Center', 40.401998, -105.586484, true, NULL),
('Rocky Mountain National Park', 'Colorado', 'romo', 'Kawuneeche Visitor Center', 40.266701, -105.832839, true, NULL),
('Saguaro National Park', 'Arizona', 'sagu', 'Rincon Mountain Visitor Center', 32.1801, -110.73634, true, NULL),
('Sequoia National Park', 'California', 'seki', 'Foothills Visitor Center', 36.491257, -118.825499, true, NULL),
('Shenandoah National Park', 'Virginia', 'shen', 'Dickey Ridge Visitor Center', 38.871425, -78.204515, true, NULL),
('Theodore Roosevelt National Park', 'North Dakota', 'thro', 'South Unit Visitor Center', 46.916462, -103.525836, true, NULL),
('Virgin Islands National Park', 'U.S. Virgin Islands', 'viis', 'Cruz Bay Visitor Center', 18.332863, -64.793831, true, NULL),
('Voyageurs National Park', 'Minnesota', 'voya', 'Rainy Lake Visitor Center', 48.584431, -93.161384, true, NULL),
('White Sands National Park', 'New Mexico', 'whsa', 'White Sands Visitor Center', 32.779744, -106.172697, true, NULL),
('Wind Cave National Park', 'South Dakota', 'wica', 'Wind Cave National Park Visitor Center', 43.556448, -103.478574, true, NULL),
('Wrangell–St. Elias National Park and Preserve', 'Alaska', 'wrst', 'Wrangell–St. Elias Visitor Center', 62.02061, -145.364037, true, NULL),
('Yellowstone National Park', 'Wyoming, Montana, Idaho', 'yell', 'East Entrance', 44.4888, -110.0039, false, NULL),
('Yellowstone National Park', 'Wyoming, Montana, Idaho', 'yell', 'North Entrance', 45.029568, -110.705574, false, NULL),
('Yellowstone National Park', 'Wyoming, Montana, Idaho', 'yell', 'Northeast Entrance', 45.004411, -110.010378, false, NULL),
('Yellowstone National Park', 'Wyoming, Montana, Idaho', 'yell', 'West Entrance', 44.658394, -111.098944, false, 'West Entrance'),
('Yellowstone National Park', 'Wyoming, Montana, Idaho', 'yell', 'South Entrance', 44.136073, -110.66704, false, NULL),
('Yosemite National Park', 'California', 'yose', 'Yosemite Valley Visitor Center', 37.748493, -119.587429, true, 'Yosemite Valley Visitor Center'),
('Yosemite National Park', 'California', 'yose', 'Wawona Visitor Center', 37.537034, -119.655424, true, NULL),
('Yosemite National Park', 'California', 'yose', 'Tuolumne Meadows Visitor Center', 37.87181, -119.374082, true, NULL),
('Zion National Park', 'Utah', 'zion', 'Zion Canyon Visitor Center', 37.200136, -112.987168, true, 'Zion Canyon Visitor Center'),
('Zion National Park', 'Utah', 'zion', 'Kolob Canyons Visitor Center', 37.453568, -113.225496, true, NULL);

-- Enable Row Level Security (RLS)
ALTER TABLE national_parks ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access to national_parks"
  ON national_parks
  FOR SELECT
  USING (true);


