const keys = require('./keys');

const express = require('express');
const cors = require('cors');
const redis = require('redis');
const knex = require('knex');

const app = express();
app.use(express.json());
app.use(cors());

//postgres setup
// const {Pool} = require('pg');
// const pgClient = new Pool({
// 	host: keys.pgHost,
// 	user: keys.pgUser,
// 	database: keys.pgDatabase,
// 	password: keys.pgPassword,
// 	port: keys.pgPort
// });

const db = knex({
	client: 'pg',
	connection: {
		host: keys.pgHost,
		port: keys.pgPort,
		user: keys.pgUser,
		password: keys.pgPassword,
		database: keys.pgDatabase
	}
});

db.on('error', () => consol.log('PG lost connection'));

// pgClient
// 	.query("CREATE TABLE IF NOT EXISTS values (number INT)")
// 	.catch(err => console.log(err));
 	
db.schema.hasTable('values')
	.then((exists) => {
		if(!exists) {
			return db.schema.createTable('values', function(table) {
				table.increments();
				table.integer('number');
			}).catch(err => console.log(err));
		}
	})

const redisClient = redis.createClient({
	host: keys.redisHost,
	port: keys.redisPort,
	retry_strategy: () => 1000
});
const publisher = redisClient.duplicate();

app.get('/values/all', async (req, res) => {
	const values =  await db.select('number').from('values');
	res.status(200).send(values);
	
});

app.get('/values/current', async (req, res) => {
	redisClient.hgetall('values', (err, values) => {
		res.status(200).send(values);
	});
});

app.post('/values', async(req, res) => {
	const index = req.body.index;

	if(index > 40 ) {
		res.status(422).send('index too high');
	}
	// redisClient.flushall();
	redisClient.hset('values', index, 'nothing yet!');
	publisher.publish("insert", index);
	await db('values').insert({number: index});

	res.send({
		working: true
	});
});

app.listen(4000, () => {
	console.log('server running at: http://localhost:4000');
});