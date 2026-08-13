<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\PropertyType;
use App\Models\Location;
use App\Models\Amenity;
use App\Models\Agent;
use App\Models\Property;
use App\Models\PropertyImage;
use App\Models\PropertyFloorPlan;
use App\Models\Enquiry;
use App\Models\Appointment;
use App\Models\BlogCategory;
use App\Models\Blog;
use App\Models\Testimonial;
use App\Models\Faq;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Seed Users
        $admin = User::create([
            'name' => 'System Admin',
            'email' => 'admin@realestate.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'phone' => '+91 98765 43210',
            'avatar' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
            'status' => 'active',
        ]);

        $agentUser1 = User::create([
            'name' => 'Rajesh Verma',
            'email' => 'agent@realestate.com',
            'password' => Hash::make('password'),
            'role' => 'agent',
            'phone' => '+91 98980 12345',
            'avatar' => 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400',
            'status' => 'active',
        ]);

        $agentUser2 = User::create([
            'name' => 'Ananya Sharma',
            'email' => 'agent2@realestate.com',
            'password' => Hash::make('password'),
            'role' => 'agent',
            'phone' => '+91 98799 87654',
            'avatar' => 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
            'status' => 'active',
        ]);

        $agentUser3 = User::create([
            'name' => 'Vikramaditya Singh',
            'email' => 'agent3@realestate.com',
            'password' => Hash::make('password'),
            'role' => 'agent',
            'phone' => '+91 99099 11223',
            'avatar' => 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400',
            'status' => 'active',
        ]);

        $buyer = User::create([
            'name' => 'Divyesh Lunagariya',
            'email' => 'user@realestate.com',
            'password' => Hash::make('password'),
            'role' => 'user',
            'phone' => '+91 90123 45678',
            'avatar' => 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=400',
            'status' => 'active',
        ]);

        // 2. Seed Agents
        $agent1 = Agent::create([
            'user_id' => $agentUser1->id,
            'name' => 'Rajesh Verma',
            'slug' => 'rajesh-verma',
            'email' => 'agent@realestate.com',
            'phone' => '+91 98980 12345',
            'agency_name' => 'DVS Premier Estates',
            'experience_years' => 12,
            'rating' => 4.95,
            'avatar' => 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400',
            'bio' => 'Specialized in ultra-luxury high-rises and signature waterfront penthouses with over $150M in career transactions across prime metros.',
            'social_links' => [
                'linkedin' => 'https://linkedin.com',
                'twitter' => 'https://twitter.com',
                'instagram' => 'https://instagram.com',
            ],
        ]);

        $agent2 = Agent::create([
            'user_id' => $agentUser2->id,
            'name' => 'Ananya Sharma',
            'slug' => 'ananya-sharma',
            'email' => 'agent2@realestate.com',
            'phone' => '+91 98799 87654',
            'agency_name' => 'Horizon Luxury Living',
            'experience_years' => 8,
            'rating' => 4.88,
            'avatar' => 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
            'bio' => 'Passionate about architectural design, sustainable smart homes, and bespoke advisory for discerning home buyers.',
            'social_links' => [
                'linkedin' => 'https://linkedin.com',
                'instagram' => 'https://instagram.com',
            ],
        ]);

        $agent3 = Agent::create([
            'user_id' => $agentUser3->id,
            'name' => 'Vikramaditya Singh',
            'slug' => 'vikramaditya-singh',
            'email' => 'agent3@realestate.com',
            'phone' => '+91 99099 11223',
            'agency_name' => 'Imperial Realty Group',
            'experience_years' => 15,
            'rating' => 4.98,
            'avatar' => 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400',
            'bio' => 'Veteran advisor specializing in commercial headquarters, private estates, and high-yielding investment properties.',
            'social_links' => [
                'linkedin' => 'https://linkedin.com',
            ],
        ]);

        // 3. Seed Property Types
        $typeApartment = PropertyType::create([
            'name' => 'Apartment & Flat',
            'slug' => 'apartment',
            'icon' => 'Building2',
            'description' => 'Modern high-rise apartments with panoramic city skyline views and lifestyle amenities.',
        ]);

        $typeVilla = PropertyType::create([
            'name' => 'Luxury Villa',
            'slug' => 'villa',
            'icon' => 'Home',
            'description' => 'Exclusive standalone villas featuring private pools, lush gardens, and maximum privacy.',
        ]);

        $typePenthouse = PropertyType::create([
            'name' => 'Sky Penthouse',
            'slug' => 'penthouse',
            'icon' => 'Crown',
            'description' => 'Top-floor sky residences with private terraces, infinity pools, and 360-degree vistas.',
        ]);

        $typeDuplex = PropertyType::create([
            'name' => 'Duplex House',
            'slug' => 'duplex',
            'icon' => 'Layers',
            'description' => 'Two-story luxury homes combining spacious layouts with elegant vertical design.',
        ]);

        $typeCommercial = PropertyType::create([
            'name' => 'Commercial Space',
            'slug' => 'commercial',
            'icon' => 'Briefcase',
            'description' => 'Grade-A office floors and premium retail spaces in prime financial hubs.',
        ]);

        // 4. Seed Locations
        $locAhmedabad = Location::create([
            'name' => 'Ahmedabad',
            'slug' => 'ahmedabad',
            'city' => 'Ahmedabad',
            'state' => 'Gujarat',
            'country' => 'India',
            'image' => 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800',
            'is_popular' => true,
        ]);

        $locMumbai = Location::create([
            'name' => 'Mumbai',
            'slug' => 'mumbai',
            'city' => 'Mumbai',
            'state' => 'Maharashtra',
            'country' => 'India',
            'image' => 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&q=80&w=800',
            'is_popular' => true,
        ]);

        $locBangalore = Location::create([
            'name' => 'Bangalore',
            'slug' => 'bangalore',
            'city' => 'Bangalore',
            'state' => 'Karnataka',
            'country' => 'India',
            'image' => 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800',
            'is_popular' => true,
        ]);

        $locGoa = Location::create([
            'name' => 'Goa',
            'slug' => 'goa',
            'city' => 'Goa',
            'state' => 'Goa',
            'country' => 'India',
            'image' => 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800',
            'is_popular' => true,
        ]);

        $locDelhi = Location::create([
            'name' => 'Gurgaon (NCR)',
            'slug' => 'gurgaon',
            'city' => 'Gurgaon',
            'state' => 'Haryana',
            'country' => 'India',
            'image' => 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=800',
            'is_popular' => true,
        ]);

        Location::create([
            'name' => 'Pune',
            'slug' => 'pune',
            'city' => 'Pune',
            'state' => 'Maharashtra',
            'country' => 'India',
            'image' => 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800',
            'is_popular' => false,
        ]);

        Location::create([
            'name' => 'Hyderabad',
            'slug' => 'hyderabad',
            'city' => 'Hyderabad',
            'state' => 'Telangana',
            'country' => 'India',
            'image' => 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&q=80&w=800',
            'is_popular' => false,
        ]);

        Location::create([
            'name' => 'Surat',
            'slug' => 'surat',
            'city' => 'Surat',
            'state' => 'Gujarat',
            'country' => 'India',
            'image' => 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800',
            'is_popular' => false,
        ]);

        Location::create([
            'name' => 'Jaipur',
            'slug' => 'jaipur',
            'city' => 'Jaipur',
            'state' => 'Rajasthan',
            'country' => 'India',
            'image' => 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800',
            'is_popular' => false,
        ]);

        // 5. Seed Amenities
        $amenityPool = Amenity::create(['name' => 'Infinity Pool', 'slug' => 'infinity-pool', 'category' => 'Luxury', 'icon' => 'Waves']);
        $amenityGym = Amenity::create(['name' => 'Fitness Center', 'slug' => 'fitness-center', 'category' => 'Health', 'icon' => 'Dumbbell']);
        $amenitySecurity = Amenity::create(['name' => '24/7 Smart Security', 'slug' => '24-7-security', 'category' => 'Security', 'icon' => 'ShieldCheck']);
        $amenityParking = Amenity::create(['name' => 'Covered EV Parking', 'slug' => 'ev-parking', 'category' => 'Eco', 'icon' => 'Car']);
        $amenityGarden = Amenity::create(['name' => 'Private Zen Garden', 'slug' => 'zen-garden', 'category' => 'General', 'icon' => 'Trees']);
        $amenitySolar = Amenity::create(['name' => 'Solar Power System', 'slug' => 'solar-power', 'category' => 'Eco', 'icon' => 'Sun']);
        $amenityClubhouse = Amenity::create(['name' => 'Private Clubhouse', 'slug' => 'clubhouse', 'category' => 'Luxury', 'icon' => 'GlassWater']);
        $amenityElevator = Amenity::create(['name' => 'Private Keycard Elevator', 'slug' => 'private-elevator', 'category' => 'Luxury', 'icon' => 'ArrowUpDown']);

        $allAmenities = [$amenityPool->id, $amenityGym->id, $amenitySecurity->id, $amenityParking->id, $amenityGarden->id, $amenitySolar->id, $amenityClubhouse->id, $amenityElevator->id];

        // 6. Seed Properties
        $propertiesData = [
            [
                'title' => 'The Glass Pavilion - 4 BHK Sky Villa in Sindhu Bhavan',
                'slug' => 'glass-pavilion-4-bhk-sky-villa-ahmedabad',
                'description' => 'Experience unmatched elegance in this double-height ceiling sky villa situated on Sindhu Bhavan Road, Ahmedabad. Features floor-to-ceiling glass walls, Italian marble flooring, automated mood lighting, and a private plunge pool overlooking the city skyline.',
                'property_type_id' => $typePenthouse->id,
                'location_id' => $locAhmedabad->id,
                'agent_id' => $agent1->id,
                'price' => 47500000.00, // 4.75 Cr
                'purpose' => 'buy',
                'bedrooms' => 4,
                'bathrooms' => 5,
                'area_sqft' => 4200,
                'furnished_status' => 'furnished',
                'property_status' => 'available',
                'is_featured' => true,
                'is_published' => true,
                'address' => 'Sindhu Bhavan Road, Bodakdev, Ahmedabad',
                'latitude' => 23.0396,
                'longitude' => 72.5065,
                'year_built' => 2024,
                'video_url' => 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                'views_count' => 1240,
                'images' => [
                    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200',
                    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200',
                    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=1200',
                    'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&q=80&w=1200',
                ],
            ],
            [
                'title' => 'Grand Horizon 3 BHK Sea-View Residence in Bandra West',
                'slug' => 'grand-horizon-3-bhk-sea-view-bandra-mumbai',
                'description' => 'Perched high above Carter Road, Bandra West, this luxurious 3-bedroom apartment offers uninterrupted views of the Arabian Sea. Designed by international interior architects with Poggenpohl kitchen systems and smart home integration.',
                'property_type_id' => $typeApartment->id,
                'location_id' => $locMumbai->id,
                'agent_id' => $agent2->id,
                'price' => 85000000.00, // 8.5 Cr
                'purpose' => 'buy',
                'bedrooms' => 3,
                'bathrooms' => 3,
                'area_sqft' => 2350,
                'furnished_status' => 'furnished',
                'property_status' => 'available',
                'is_featured' => true,
                'is_published' => true,
                'address' => 'Carter Road, Bandra West, Mumbai',
                'latitude' => 19.0596,
                'longitude' => 72.8295,
                'year_built' => 2023,
                'video_url' => 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                'views_count' => 3100,
                'images' => [
                    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200',
                    'https://images.unsplash.com/photo-1600573472591-ee6c563aaec9?auto=format&fit=crop&q=80&w=1200',
                    'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&q=80&w=1200',
                ],
            ],
            [
                'title' => 'Portuguese Estate Modern Beach Villa with Private Pool',
                'slug' => 'portuguese-estate-beach-villa-candolim-goa',
                'description' => 'A masterpiece in Candolim, Goa combining classic Portuguese architecture with ultra-modern Scandinavian interiors. Set on 1/2 acre of landscaped palms with an infinity heated pool, gazebo lounge, and 24-hour private security.',
                'property_type_id' => $typeVilla->id,
                'location_id' => $locGoa->id,
                'agent_id' => $agent3->id,
                'price' => 62000000.00, // 6.2 Cr
                'purpose' => 'buy',
                'bedrooms' => 5,
                'bathrooms' => 6,
                'area_sqft' => 5800,
                'furnished_status' => 'furnished',
                'property_status' => 'available',
                'is_featured' => true,
                'is_published' => true,
                'address' => 'Main Beach Road, Candolim, Goa',
                'latitude' => 15.5177,
                'longitude' => 73.7626,
                'year_built' => 2024,
                'video_url' => 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                'views_count' => 1890,
                'images' => [
                    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=1200',
                    'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&q=80&w=1200',
                    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=1200',
                ],
            ],
            [
                'title' => 'The Imperial Residence - Luxury 3 BHK Flat in Satellite',
                'slug' => 'imperial-residence-3-bhk-flat-satellite-ahmedabad',
                'description' => 'Modern 3 BHK apartment in the heart of Satellite, Ahmedabad. Walking distance to premier schools, shopping avenues, and metro transit. Features double balcony, modular German kitchen, and reserved basement parking.',
                'property_type_id' => $typeApartment->id,
                'location_id' => $locAhmedabad->id,
                'agent_id' => $agent1->id,
                'price' => 18500000.00, // 1.85 Cr
                'purpose' => 'buy',
                'bedrooms' => 3,
                'bathrooms' => 3,
                'area_sqft' => 2100,
                'furnished_status' => 'semi-furnished',
                'property_status' => 'available',
                'is_featured' => false,
                'is_published' => true,
                'address' => 'Near Star Bazaar, Satellite, Ahmedabad',
                'latitude' => 23.0258,
                'longitude' => 72.5186,
                'year_built' => 2022,
                'views_count' => 950,
                'images' => [
                    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=1200',
                    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=1200',
                ],
            ],
            [
                'title' => 'Skyline Commercial Tower - Grade-A Corporate Office',
                'slug' => 'skyline-commercial-office-bkc-mumbai',
                'description' => 'Prime 3,500 sq ft office floor in Bandra Kurla Complex (BKC), Mumbai. LEED Gold certified building with centralized HVAC, high-speed fiber connectivity, EV charging bays, and executive boardroom access.',
                'property_type_id' => $typeCommercial->id,
                'location_id' => $locMumbai->id,
                'agent_id' => $agent3->id,
                'price' => 250000.00, // 2.5 Lakh / month rent
                'purpose' => 'rent',
                'bedrooms' => 0,
                'bathrooms' => 4,
                'area_sqft' => 3500,
                'furnished_status' => 'furnished',
                'property_status' => 'available',
                'is_featured' => true,
                'is_published' => true,
                'address' => 'G Block, BKC, Mumbai',
                'latitude' => 19.0657,
                'longitude' => 72.8687,
                'year_built' => 2023,
                'views_count' => 1540,
                'images' => [
                    'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200',
                    'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=1200',
                ],
            ],
            [
                'title' => 'Botanica Woods - 4 BHK Eco Luxury Villa in Whitefield',
                'slug' => 'botanica-woods-4-bhk-eco-villa-whitefield-bangalore',
                'description' => 'A serene sanctuary in Whitefield, Bangalore. Zero-emission villa with private solar grid, rainwater harvesting, private deck overlooking lake gardens, and smart voice automation.',
                'property_type_id' => $typeVilla->id,
                'location_id' => $locBangalore->id,
                'agent_id' => $agent2->id,
                'price' => 38000000.00, // 3.8 Cr
                'purpose' => 'buy',
                'bedrooms' => 4,
                'bathrooms' => 4,
                'area_sqft' => 3600,
                'furnished_status' => 'furnished',
                'property_status' => 'available',
                'is_featured' => false,
                'is_published' => true,
                'address' => 'EPIP Zone, Whitefield, Bangalore',
                'latitude' => 12.9698,
                'longitude' => 77.7500,
                'year_built' => 2024,
                'views_count' => 880,
                'images' => [
                    'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80&w=1200',
                    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=80&w=1200',
                ],
            ],
            [
                'title' => 'The Ambassador Penthouse on Golf Course Road',
                'slug' => 'ambassador-penthouse-golf-course-road-gurgaon',
                'description' => 'Top-floor 5 BHK duplex penthouse overlooking DLF Golf Course, Gurgaon. Private glass lift, temperature-controlled indoor pool, sauna room, and 4 dedicated basement parking slots.',
                'property_type_id' => $typePenthouse->id,
                'location_id' => $locDelhi->id,
                'agent_id' => $agent1->id,
                'price' => 120000000.00, // 12 Cr
                'purpose' => 'buy',
                'bedrooms' => 5,
                'bathrooms' => 6,
                'area_sqft' => 6500,
                'furnished_status' => 'furnished',
                'property_status' => 'available',
                'is_featured' => true,
                'is_published' => true,
                'address' => 'Golf Course Road, Sector 54, Gurgaon',
                'latitude' => 28.4393,
                'longitude' => 77.1042,
                'year_built' => 2024,
                'views_count' => 2400,
                'images' => [
                    'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=1200',
                    'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&q=80&w=1200',
                ],
            ],
            [
                'title' => 'Orchard View Luxury 2 BHK Apartment for Rent in Bodakdev',
                'slug' => 'orchard-view-2-bhk-apartment-rent-bodakdev-ahmedabad',
                'description' => 'Fully furnished luxury 2 BHK apartment in prime Bodakdev, Ahmedabad. Includes high-end sofa set, OLED smart TV, king beds, refrigerator, washing machine, and 24/7 power backup.',
                'property_type_id' => $typeApartment->id,
                'location_id' => $locAhmedabad->id,
                'agent_id' => $agent2->id,
                'price' => 45000.00, // 45k / month rent
                'purpose' => 'rent',
                'bedrooms' => 2,
                'bathrooms' => 2,
                'area_sqft' => 1350,
                'furnished_status' => 'furnished',
                'property_status' => 'available',
                'is_featured' => false,
                'is_published' => true,
                'address' => 'Judges Bungalow Road, Bodakdev, Ahmedabad',
                'latitude' => 23.0375,
                'longitude' => 72.5120,
                'year_built' => 2023,
                'views_count' => 610,
                'images' => [
                    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1200',
                    'https://images.unsplash.com/photo-1502672016976-1b80f8d1eb1f?auto=format&fit=crop&q=80&w=1200',
                ],
            ],
        ];

        foreach ($propertiesData as $pData) {
            $images = $pData['images'];
            unset($pData['images']);

            $property = Property::create($pData);

            // Attach images
            foreach ($images as $index => $imgUrl) {
                PropertyImage::create([
                    'property_id' => $property->id,
                    'image_path' => $imgUrl,
                    'is_primary' => $index === 0,
                    'display_order' => $index,
                ]);
            }

            // Attach Floor plan
            PropertyFloorPlan::create([
                'property_id' => $property->id,
                'image_path' => 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80&w=800',
                'title' => 'Architectural Floor Layout',
                'floor_name' => 'Level 1 Plan',
            ]);

            // Attach Amenities
            $property->amenities()->sync(array_slice($allAmenities, 0, rand(4, 8)));
        }

        // 7. Seed Sample Enquiries & Appointments
        Enquiry::create([
            'user_id' => $buyer->id,
            'property_id' => 1,
            'agent_id' => $agent1->id,
            'name' => 'Divyesh Lunagariya',
            'email' => 'user@realestate.com',
            'phone' => '+91 90123 45678',
            'message' => 'I would like to schedule a private viewing for The Glass Pavilion sky villa this weekend.',
            'status' => 'new',
        ]);

        Appointment::create([
            'user_id' => $buyer->id,
            'property_id' => 1,
            'agent_id' => $agent1->id,
            'name' => 'Divyesh Lunagariya',
            'email' => 'user@realestate.com',
            'phone' => '+91 90123 45678',
            'date' => now()->addDays(3)->format('Y-m-d'),
            'time_slot' => '11:00 AM',
            'status' => 'confirmed',
            'notes' => 'Client requested VIP coffee setup.',
        ]);

        // 8. Seed Blog Categories & Blogs
        $catMarket = BlogCategory::create(['name' => 'Market Insights', 'slug' => 'market-insights']);
        $catGuide = BlogCategory::create(['name' => 'Buyer Guides', 'slug' => 'buyer-guides']);
        $catArchitecture = BlogCategory::create(['name' => 'Architecture & Design', 'slug' => 'architecture-design']);

        Blog::create([
            'blog_category_id' => $catMarket->id,
            'title' => 'Real Estate Trends 2026: Why High-End Penthouses are Outperforming Metro Markets',
            'slug' => 'real-estate-trends-2026-penthouses-market',
            'excerpt' => 'An in-depth analysis of capital appreciation, luxury buyer sentiment, and rental yield trajectories in tier-1 Indian metros.',
            'content' => 'The luxury residential real estate market across India has witnessed unprecedented demand in 2026. High-net-worth individuals and NRI investors are increasingly prioritizing spacious sky villas and sustainable smart residences over traditional landed properties...',
            'image' => 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200',
            'author_name' => 'DVS Research Desk',
            'is_published' => true,
            'published_at' => now(),
        ]);

        Blog::create([
            'blog_category_id' => $catGuide->id,
            'title' => 'The Ultimate Checklist for Purchasing a Luxury Property in Ahmedabad',
            'slug' => 'ultimate-checklist-purchasing-luxury-property-ahmedabad',
            'excerpt' => 'Navigating title verification, RERA compliance, structural audits, and neighborhood valuation for prime locations like Sindhu Bhavan and Bodakdev.',
            'content' => 'Buying a luxury home requires strategic diligence beyond aesthetic appreciation. Key factors include RERA registration check, legal title history, builder reputation, maintenance index, and proximity to major commercial corridors...',
            'image' => 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200',
            'author_name' => 'Rajesh Verma',
            'is_published' => true,
            'published_at' => now()->subDays(5),
        ]);

        // 9. Seed Testimonials & FAQs
        Testimonial::create([
            'name' => 'Vikram & Meera Merchant',
            'role' => 'Sky Villa Owner',
            'company' => 'Tech Ventures India',
            'content' => 'DVS Realty delivered an unbelievable home-buying experience. From curating exclusive off-market penthouses in Ahmedabad to seamless closing support, their team is top tier.',
            'avatar' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
            'rating' => 5,
            'is_featured' => true,
        ]);

        Testimonial::create([
            'name' => 'Siddharth Roy',
            'role' => 'NRI Investor',
            'company' => 'Roy Financial Group',
            'content' => 'As an overseas investor in Mumbai real estate, trust and transparency are paramount. The team handled everything end-to-end with high professionalism.',
            'avatar' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
            'rating' => 5,
            'is_featured' => true,
        ]);

        Faq::create([
            'question' => 'How do I schedule a private property walkthrough?',
            'answer' => 'You can click on the "Schedule Visit" button on any property page, select your preferred date and time slot, and our designated senior agent will confirm your appointment within 1 hour.',
            'category' => 'Buying',
            'display_order' => 1,
        ]);

        Faq::create([
            'question' => 'Are all listed properties verified for clear legal title and RERA approval?',
            'answer' => 'Yes, 100% of our featured residences undergo strict legal title verification and RERA compliance checks before being listed on DVS Premier Realty.',
            'category' => 'Legal',
            'display_order' => 2,
        ]);
    }
}
