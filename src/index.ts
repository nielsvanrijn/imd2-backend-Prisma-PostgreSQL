import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import * as bodyParser from 'body-parser';

import { createUser, deleteUser, getUser, getUsers, loginUser, logout, refeshToken, revokeUserRefeshToken, updateUser } from './controllers/UserController';
import { validate } from './middlewares/ValidateMiddleware';
import { createUserSchema, deleteUserSchema, loginUserSchema, revokeUserRefeshTokenSchema, updateUserSchema } from './middlewares/UserValidation';
import { isAdmin, isAuth } from './middlewares/AuthValidation';
import { createMovie, deleteMovie, getMovie, getMovies, getMoviesWithSortAndFilter, test, updateMovie } from './controllers/MovieController';
import { createMovieSchema, deleteMovieSchema, getMovieSchema, updateMovieSchema } from './middlewares/MovieValidation';
import { createPersonSchema, deletePersonSchema, getPersonSchema, updatePersonSchema } from './middlewares/PersonValidation';
import { createPerson, deletePerson, getPerson, getPersons, updatePerson } from './controllers/PersonController';
import { createCharacterSchema, deleteCharacterSchema, getCharacterSchema, updateCharacterSchema } from './middlewares/CharacterValidation';
import { createCharacter, deleteCharacter, getCharacter, getCharacters, updateCharacter } from './controllers/CharacterController';
import { getGenres } from './controllers/GenreController';
import { getCountries } from './controllers/CountyController';
import { webauthnLoginFinalize, webauthnLoginInitialize, webauthnRegisterFinalize, webauthnRegisterInitialize } from './controllers/WebauthnController';
import { loginFinalizeSchema, loginInitializeSchema, registerFinalizeSchema, registerInitializeSchema } from './middlewares/WebauthnValidation';

const app = express();
app.use(helmet());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({origin: true, credentials: true}));

// disable cors when live && remove withcredentials true from angular

// WebauthN
app.post('/webauthn/register_initialize', validate(registerInitializeSchema), webauthnRegisterInitialize);
app.post('/webauthn/register_finalize', validate(registerFinalizeSchema), webauthnRegisterFinalize);
app.post('/webauthn/login_initialize', validate(loginInitializeSchema), webauthnLoginInitialize);
app.post('/webauthn/login_finalize', validate(loginFinalizeSchema), webauthnLoginFinalize);

// Genres & Countries
app.get('/genres', validate(isAuth), getGenres);
app.get('/countries', validate(isAuth), getCountries);

// Auth
app.post('/register', validate(createUserSchema), createUser);
app.post('/login', validate(loginUserSchema), loginUser);
app.post('/refesh_token', refeshToken);
app.post('/revoke', validate(revokeUserRefeshTokenSchema), validate(isAdmin), revokeUserRefeshToken);
app.post('/logout', logout);

// User(s)
app.use('/user', validate(isAuth));
app.get('/user', getUser);
app.get('/users', validate(isAuth), validate(isAdmin), getUsers);
app.patch('/user', validate(updateUserSchema), updateUser); //TODO: Make "real" patch (partial objec not supported)
app.delete('/user/:id', validate(deleteUserSchema), validate(isAdmin), deleteUser);

// Movie(s)
app.use('/movie', validate(isAuth));
// create
app.post('/movie', validate(createMovieSchema), createMovie);
// read
app.get('/movies', validate(isAuth), getMovies);
app.post('/movies', validate(isAuth), getMoviesWithSortAndFilter);
app.get('/movie/:id', validate(getMovieSchema), getMovie);
// update
app.patch('/movie/:id', updateMovieSchema, validate(), updateMovie);
// delete
app.delete('/movie/:id', validate(deleteMovieSchema), deleteMovie);

app.get('/test', validate(isAuth), test);

// Persons(s)
app.use('/person', validate(isAuth));
// create
app.post('/person', validate(createPersonSchema), createPerson);
// read
app.get('/persons', validate(isAuth), getPersons);
app.get('/person/:id', validate(getPersonSchema), getPerson);
// // update
app.patch('/person/:id', updatePersonSchema, validate(), updatePerson);
// // delete
app.delete('/person/:id', validate(deletePersonSchema), deletePerson);

// Character(s)
app.use('/character', validate(isAuth));
// create
app.post('/character', validate(createCharacterSchema), createCharacter);
// read
app.get('/characters', validate(isAuth), getCharacters);
app.get('/character/:id', validate(getCharacterSchema), getCharacter);
// update
app.patch('/character/:id', updateCharacterSchema, validate(), updateCharacter);
// // delete
app.delete('/character/:id', validate(deleteCharacterSchema), deleteCharacter);

app.listen(process.env.PORT, () => console.log(`🚀 Server ready` + !process.env.PRODUCTION ? `.` : `at: http://localhost:${process.env.PORT}`));