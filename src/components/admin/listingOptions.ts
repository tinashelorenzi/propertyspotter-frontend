// Option lists mirroring the choices declared on listings.models.PropertyListing.

export const PROPERTY_TYPES = [
  ['house', 'House'],
  ['apartment', 'Apartment'],
  ['townhouse', 'Townhouse'],
  ['duplex', 'Duplex'],
  ['penthouse', 'Penthouse'],
  ['studio', 'Studio'],
  ['cottage', 'Cottage'],
  ['farm', 'Farm'],
  ['commercial', 'Commercial'],
  ['other', 'Other'],
] as const;

export const PROVINCES = [
  ['gauteng', 'Gauteng'],
  ['western_cape', 'Western Cape'],
  ['eastern_cape', 'Eastern Cape'],
  ['kwazulu_natal', 'KwaZulu-Natal'],
  ['free_state', 'Free State'],
  ['mpumalanga', 'Mpumalanga'],
  ['limpopo', 'Limpopo'],
  ['north_west', 'North West'],
  ['northern_cape', 'Northern Cape'],
] as const;

export const LISTING_STATUSES = [
  ['draft', 'Draft — not visible'],
  ['pending', 'Pending approval'],
  ['approved', 'Approved — live on site'],
  ['rejected', 'Rejected'],
  ['archived', 'Archived'],
] as const;
