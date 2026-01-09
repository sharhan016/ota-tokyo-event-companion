import { Location } from '../types';

export const locations: Location[] = [
  // FOOD COURT (Food 10)
  { 
    id: 'food', 
    x: 26, 
    y: 55, 
    label: 'Food 10 Zone', 
    type: 'food', 
    details: 'Kokoro Ramen, IKOI Tokyo, Kaori by Chiran, Izanagi, Katana, Matsuri, Japcul Foods' 
  },
  { 
    id: 'cafe', 
    x: 21, 
    y: 72, 
    label: 'Maid Cafe', 
    type: 'cafe', 
    details: 'Authentic Akihabara Experience & Cheki Photos' 
  },
  
  // SPONSORS (Grass Area)
  { 
    id: 'grass', 
    x: 63, 
    y: 34, 
    label: 'Sponsor Zone', 
    type: 'booth', 
    details: 'Toyota, Rakuten, Yakult, Nissin, JAL, Findy, Mercari' 
  },
  
  // EVENTS
  { 
    id: 'stage', 
    x: 50, 
    y: 62, 
    label: 'Main Stage', 
    type: 'event', 
    details: 'Live: Diana Garnet (Naruto Singer), Cosplay Championship' 
  },
  { 
    id: 'hall2', 
    x: 59, 
    y: 56, 
    label: 'Hall 2 Workshops', 
    type: 'workshop', 
    details: 'Tatami Crafting, Manga Workshop (Cosmics), Wacom, Pilot' 
  },
  
  // LOGISTICS
  { 
    id: 'merch', 
    x: 42, 
    y: 42, 
    label: 'Merch Arch', 
    type: 'shop', 
    details: 'Anime Creator, Rhino Cult, Orange Kiwi' 
  },
  { 
    id: 'entrance', 
    x: 13, 
    y: 54, 
    label: 'Entrance', 
    type: 'info', 
    details: 'Gate 9 (Princess Golf)' 
  }
];
