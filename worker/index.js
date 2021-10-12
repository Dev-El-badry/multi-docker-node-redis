const redis = require('redis');
const keys = require('./keys');

const redisClient = redis.createClient({
	host: keys.redis_host,
	port: keys.redis_port,
	retry_strategy: () => 1000
});
const sub = redisClient.duplicate();

function fib(index) {
	if(index <2) return 1;
	return fib(index - 1) + fib(index - 2);
}

sub.on("message", function(channel, message) {
	redisClient.hset("values", message, fib(parseInt(message)));
});
sub.subscribe("insert");