/* eslint-env jest */

const config = require('../redis_config');

it('returns empty arrays on no config', () => {
  expect(config({})).toEqual([[], []]);
});

it('works with a single host', () => {
  expect(config({
    REDIS_HOSTS: 'redis:8000'
  })).toEqual([
    [ 'redis:8000' ],
    [{ host: 'redis', port: '8000' }]
  ]);
});

it('works with multiple hosts', () => {
  expect(config({
    REDIS_HOSTS: 'redis:8000,redis2:8000'
  })).toEqual([
    [ 'redis:8000', 'redis2:8000' ],
    [{ host: 'redis', port: '8000' },
     { host: 'redis2', port: '8000' }]
  ]);
});

it('looks up correctly from redis_url_env_vars', () => {
  expect(config({
    REDIS_URL_ENV_VARS: 'REDIS1,REDIS2',
    REDIS1: 'tcp://redis1:8000',
    REDIS2: 'tcp://redis2:8000'
  })).toEqual([
    [ 'redis1:8000', 'redis2:8000' ],
    [{ host: 'redis1', port: '8000' },
     { host: 'redis2', port: '8000' }]
  ]);
});
