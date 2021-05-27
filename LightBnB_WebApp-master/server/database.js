const properties = require('./json/properties.json');
const users = require('./json/users.json');
const { Pool } = require('pg');
const e = require('express');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
})

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function (email) {
  return pool
    .query(
      `SELECT *
    FROM users
    WHERE users.email = $1`, [`${email}`]
    )
    .then((result) => {
      if (result.rows[0].name) {
        return result.rows[0];
      } else {
        return null;
      }
    })
    .catch((err) => { console.log("error", err.message) });
}
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function (id) {
  return pool
    .query(`
  SELECT * FROM users
  WHERE id = $1;`, [id])
    .then((result) => {
      if (result.rows[0].id) {
        return result.rows[0];
      } else {
        return null;
      }
    })
    .catch((err) => {
      console.log("error", err.message)
    });
}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function (user) {
  return pool
    .query(`
  INSERT INTO users (name, email, password)
  VALUES ('${user.name}','${user.email}', '${user.password}')
  RETURNING *;`)
    .then((result) => {
      return result.rows[0]
    })
    .catch((err) => {
      console.log("error", err.message)
    });
}
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function (guest_id, limit = 10) {
  return pool
    .query(`
  SELECT reservations.*, properties.number_of_bedrooms, properties.number_of_bathrooms, properties.parking_spaces, properties.cover_photo_url, properties.thumbnail_photo_url, properties.title
  FROM reservations JOIN users ON guest_id = users.id
  JOIN properties ON reservations.property_id = properties.id
  WHERE guest_id = $1
  LIMIT $2`, [guest_id, limit])
    .then((result) => {
      console.log(result.rows)
      return result.rows;
    })
    .catch((err) => {
      console.log("error", err.message)
    });
}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = (options, limit = 10) => {
  const queryParams = [];

  let queryString = `
  SELECT properties.*, AVG(property_reviews.rating) as average_rating
  FROM properties JOIN property_reviews ON properties.id=property_id`;

  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += ` WHERE properties.city LIKE $${queryParams.length}`
  }

  if (options.owner_id) {
    const ownerid = parseInt(options.owner_id);
    if (options.city) {
      queryParams.push(ownerid);
      queryString += ` WHERE properties.owner_id = $${queryParams.length}`
    } else {
      queryParams.push(ownerid);
      queryString += ` AND properties.owner_id = $${queryParams.length}`
    }
  }

  if (options.minimum_price_per_night) {
    const min = parseInt(options.minimum_price_per_night);
    if (options.city || options.owner_id) {
      queryParams.push(min * 100);
      queryString += ` AND properties.cost_per_night > $${queryParams.length}`
    } else {
      queryParams.push(min * 100);
      queryString += ` WHERE properties.cost_per_night > $${queryParams.length}`
    }
  }

  if (options.maximum_price_per_night) {
    const min = parseInt(options.maximum_price_per_night);
    if (options.city || options.owner_id || options.minimum_price_per_night) {
      queryParams.push(min * 100);
      queryString += ` AND properties.cost_per_night < $${queryParams.length}`
    } else {
      queryParams.push(min * 100);
      queryString += ` WHERE properties.cost_per_night < $${queryParams.length}`
    }
  }

  if (options.minimum_rating) {
    const min = parseInt(options.minimum_rating);
    queryParams.push(min);
    queryString += `
      GROUP BY properties.id
      HAVING AVG(property_reviews.rating) > $${queryParams.length}
      ORDER BY cost_per_night`
  } else {
    queryString += `
    GROUP BY properties.id
    ORDER BY cost_per_night`
  }

  queryParams.push(limit);
  queryString += `
  LIMIT $${queryParams.length};`

  console.log("this", queryString, queryParams)

  return pool.query(queryString, queryParams).then((res) => { return res.rows })
    .catch((err) => {
      console.log("error", err.message)
    });;

};
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function (property) {
  let owner_id = parseInt(property.owner_id);
  let title = property.title;
  let description = property.description;
  let thumbnail_photo_url = property.thumbnail_photo_url;
  let cover_photo_url = property.cover_photo_url;
  let cost_per_night = parseInt(property.cost_per_night*100);
  let street = property.street;
  let city = property.city;
  let province = property.province;
  let post_code = property.post_code;
  let country = property.country;
  let parking_spaces = parseInt(property.parking_spaces);
  let number_of_bathrooms = parseInt(property.number_of_bathrooms);
  let number_of_bedrooms = parseInt(property.number_of_bedrooms);


  return pool.query(
    `INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code, active)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *;`, [owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code, true]
  )
  .then((res) => {return res.rows}).catch((err) => {console.log(err.message)});
}
exports.addProperty = addProperty;
