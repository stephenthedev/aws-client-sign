'use strict';
let should = require('should'); // jshint ignore:line
// Globalize CryptoJS dependency
global.CryptoJS = require('crypto-js');

// Since it the module exposes a global, just read and eval to expose the module here:
let AWSSigner = eval(require('fs').readFileSync(__dirname + '/aws-client-sign.js', 'utf8'));
let instance;

describe('AWSSigner', function () {
  beforeEach(() => {
    instance = new AWSSigner('testHost', 'region', 'service', 'key', 'secret', 'token');
  });

  it('#constructor', () => {
    AWSSigner.should.be.a.Function; // jshint ignore:line
    (instance instanceof AWSSigner).should.be.true; // jshint ignore:line
    instance._host.should.equal('testHost');
    instance._region.should.equal('region');
    instance._service.should.equal('service');
    instance._accessKeyId.should.equal('key');
    instance._secretAccessKey.should.equal('secret');
    instance._token.should.equal('token');
  });

  it('#signRoute', () => {
    instance.signRoute.should.be.a.Function; // jshint ignore:line
    let result = instance.signRoute('get', 'api/models', '', '', new Date('1/1/2015'));
    result.should.be.an.Object; // jshint ignore:line
    result['x-amz-date'].should.equal('20150101T050000Z');
    result['x-amz-security-token'].should.equal('token');
    result['host'].should.equal('testHost');
    result['Authorization'].should.equal('AWS4-HMAC-SHA256 Credential=key/20150101/region/service/aws4_request, SignedHeaders=content-type;host;x-amz-date;x-amz-security-token, Signature=d2bae319d1beb4d1e5224db31f2217ccde0b0482e1dc833c03f8ba0cca474974');
  });
});
