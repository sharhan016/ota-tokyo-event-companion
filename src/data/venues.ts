import { Location } from '../types';

export const locations: Location[] = [
  // FOOD COURT (Food 10)
  { 
    id: 'food', 
    x: 20, 
    y: 75, 
    label: 'Food 10 Zone', 
    type: 'food', 
    details: 'Kokoro Ramen, IKOI Tokyo, Kaori by Chiran, Izanagi, Katana, Matsuri, Japcul Foods' 
  },
  { 
    id: 'cafe', 
    x: 88, 
    y: 30, 
    label: 'Maid Cafe', 
    type: 'cafe', 
    details: 'Authentic Akihabara Experience & Cheki Photos' 
  },
  
  // SPONSORS (Grass Area)
  { 
    id: 'grass', 
    x: 75, 
    y: 20, 
    label: 'Sponsor Zone', 
    type: 'booth', 
    details: 'Toyota, Rakuten, Yakult, Nissin, JAL, Findy, Mercari' 
  },
  
  // EVENTS
  { 
    id: 'stage', 
    x: 40, 
    y: 50, 
    label: 'Main Stage', 
    type: 'event', 
    details: 'Live: Diana Garnet (Naruto Singer), Cosplay Championship' 
  },
  { 
    id: 'hall2', 
    x: 85, 
    y: 60, 
    label: 'Hall 2 Workshops', 
    type: 'workshop', 
    details: 'Tatami Crafting, Manga Workshop (Cosmics), Wacom, Pilot' 
  },
  
  // LOGISTICS
  { 
    id: 'merch', 
    x: 25, 
    y: 25, 
    label: 'Merch Arch', 
    type: 'shop', 
    details: 'Anime Creator, Rhino Cult, Orange Kiwi' 
  },
  { 
    id: 'entrance', 
    x: 50, 
    y: 95, 
    label: 'Entrance', 
    type: 'info', 
    details: 'Gate 9 (Princess Golf)' 
  }
];
