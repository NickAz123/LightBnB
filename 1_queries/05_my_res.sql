SELECT properties.*, reservations.*, AVG(rating) as avg_rating 
FROM properties JOIN reservations ON property_id = properties.id
JOIN property_reviews ON properties.id = property_reviews.property_id
WHERE reservations.guest_id = 1 AND end_date < now()::date
GROUP BY properties.id, reservations.id
ORDER BY start_date
LIMIT 10;