import { body, param } from 'express-validator';
// {
//     "id":1,
//     "name":"No Time to Die",
//     "year":2021,
//     "length":163,
//     "description":"James Bond has left active service. His peace is short-lived when Felix Leiter, an old friend from the CIA, turns up asking for help, leading Bond onto the trail of a mysterious villain armed with dangerous new technology.",
//     "posterUrls":[
//         "https://upload.nielsapps.com/uploads/domains/localhost/notimetodie.jpg"
//     ],
//     "trailerUrls":[
        
//     ],
//     "createdAt":"2022-02-02T20:40:49.499Z",
//     "updatedAt":"2022-02-02T22:02:32.510Z",
//     "directors":[
//         {
//             "id":25
//         }
//     ],
//     "writers":[
//         {
//             "id":25
//         }
//     ],
//     "cast":[
//         {
//             "characterId":1,
//             "character":{
//                 "id":1,
//                 "firstName":"James",
//                 "lastName":"Bond",
//                 "birthday":"1943-08-10T00:00:00.000Z",
//                 "bio":"Shaken, not stirred"
//             },
//             "movieId":1,
//             "personId":25,
//             "person":{
//                 "id":25,
//                 "firstName":"Daniel",
//                 "lastName":"Craig",
//                 "avatarUrl":"https://upload.nielsapps.com/uploads/domains/localhost/iFerDZUmC5Fu26i4qI8xnUVEHc7.jpg"
//             }
//         }
//     ],
//     "genres":[
//         {
//             "id":1
//         },
//         {
//             "id":2
//         },
//         {
//             "id":13
//         }
//     ]
// }

const createAndUpdateRules = [
    body('name', 'Name is required')
        .notEmpty().withMessage('Name must not be empty')
        .isString().withMessage('Name must be a string'),
    body('year').optional()
        // .notEmpty().withMessage('Year must not be empty')
        .isNumeric().withMessage('Year must be numeric')
        .isInt().withMessage('Year must be a whole number')
        .isLength({max: 4}).withMessage('Year can not be more than 4 characters'),
    body('length').optional()
        // .notEmpty().withMessage('Length must not be empty')
        .isNumeric().withMessage('Length must be numeric')
        .isInt({ min:1, max: 7200}).withMessage('Length can not be more than 7200 minutes')
        .isLength({max: 4}).withMessage('Length can not be more than 4 characters'),
    body('description').optional()
        // .notEmpty().withMessage('Description must not be empty')
        .isString().withMessage('Description must be a string'),
    body('posterUrls').optional()
        // .notEmpty().withMessage('Must add a poster')
        .isArray().withMessage('posterUrls must be an array'),
    body('posterUrls.*')
        .isString().withMessage('posterUrls array must contain only strings'),
    body('trailerUrls').optional()
        // .notEmpty().withMessage('Must add a trailer')
        .isArray().withMessage('trailerUrls must be an array'),
    body('trailerUrls.*')
        .isString().withMessage('trailerUrls array must contain only strings'),
    body('directors').optional()
        // .notEmpty().withMessage('Directors must not be empty')
        .isArray().withMessage('Directors must be an array'),
    body('directors.*.id')
        .isNumeric().withMessage('Directors array id must contain only numerics'),
    body('writers').optional()
        // .notEmpty().withMessage('Writers must not be empty'),
        .isArray().withMessage('Writers must be an array'),
    body('writers.*.id')
        .notEmpty().withMessage('Writers array must contain id')
        .isNumeric().withMessage('Writers array id must contain only numerics'),
    body('cast').optional()
        // .notEmpty().withMessage('Cast must not be empty'),
        .isArray().withMessage('Cast must be an array'),
    body('cast.*.characterId')
        .notEmpty().withMessage('Cast array must contain characterId')
        .isNumeric().withMessage('Cast array characterId must contain only numerics'),
    body('cast.*.movieId')
        .notEmpty().withMessage('Cast array must contain movieId')
        .isNumeric().withMessage('Cast array movieId must contain only numerics'),
    body('cast.*.personId')
        .notEmpty().withMessage('Cast array must contain personId')
        .isNumeric().withMessage('Cast array personId must contain only numerics'),
    body('genres').optional()
        // .notEmpty().withMessage('Genres must not be empty'),
        .isArray().withMessage('Genres must be an array'),
    body('genres.*.id')
        .notEmpty().withMessage('Genres array must contain id')
        .isNumeric().withMessage('Genres array id must contain only numerics'),
];

// Create a single Movie
export const createMovieSchema = [
    ...createAndUpdateRules,
];

// Read a single Movie
export const getMovieSchema = [
    param('id', 'id is required')
        .notEmpty().withMessage('id must not be empty').bail()
        .isNumeric().withMessage('id must be numeric')
];

// Update a single Movie (patch validation, when not sending whole movie object)
// export const updateMovieSchema = [
//     param('id', 'id is required')
//         .notEmpty().withMessage('id must not be empty').bail()
//         .isNumeric().withMessage('id must be numeric').bail(),
//     oneOf(createAndUpdateRules, 'Must update at least one field'),
//     body('posterUrls.*')
//         .isString().withMessage('Description array must contain only strings'),
//     body('trailerUrls.*')
//         .isString().withMessage('Description array must contain only strings'),
//     body('directors.*')
//         .isNumeric().withMessage('Directors array must contain only numberics'),
//     body('writers.*')
//         .isNumeric().withMessage('Writers array must contain only numberics'),
//     body('cast.*')
//         .isNumeric().withMessage('Cast array must contain only numberics'),
//     body('genres.*')
//         .isNumeric().withMessage('Genres array must contain only numberics'),
// ];
export const updateMovieSchema = [
    param('id', 'id is required')
        .notEmpty().withMessage('id must not be empty').bail()
        .isNumeric().withMessage('id must be numeric').bail(),
    ...createAndUpdateRules,
];

// Delete a single Movie
export const deleteMovieSchema = [
    param('id', 'id is required')
        .notEmpty().withMessage('id must not be empty').bail()
        .isNumeric().withMessage('id must be numeric').bail(),
];